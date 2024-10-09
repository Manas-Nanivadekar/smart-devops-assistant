const AWS = require("aws-sdk");
const fs = require('fs').promises;
const { readFileSync } = require('fs');
const path = require("path");
const { domain, addARecord } = require("./cname");
const { Client } = require('ssh2');

const getAccessKey = () => {
  console.log('reached getaccesskey');
  return new Promise((resolve, reject) => {
    const filePath = path.join(require("os").homedir(), ".majsAuth");
    console.log('File path:', filePath);
    fs.readFile(filePath, "utf8")
      .then(data => {
        console.log('File content:', data);
        if (data && data.trim()) {
          resolve(data.trim());
        } else {
          reject(new Error('File is empty or contains only whitespace'));
        }
      })
      .catch(err => {
        console.error("Error reading the file:", err);
        reject(err);
      });
  });
};

const getSecretKey = async () => {
  const accessKey = await getAccessKey();
  const fetch = (await import("node-fetch")).default;
  const response = await fetch(
  "https://rgoaes1ar0.execute-api.ap-south-1.amazonaws.com/authenticate",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ accessKey }),
    },
  );

  const data = await response.json();
  if (data.success) {
    const secretKey = data.secretKey;
    return secretKey;
  } else {
    console.error("Authentication failed:", data.message);
    return null;
  }
};

async function deployApp(req, res) {
  console.log('started')
  try {
    const { accessKey, secretKey } = await getCredentials();
    const bucketName = "majs-terraform-engine";
    const region = "ap-south-1";
    const ec2InstanceId = "i-06e84f7451601c7a8";

    console.log('reached1')
    configureAWS(accessKey, secretKey, region);
    
    // Get EC2 instance details (replace with your actual instance ID)
    const ec2Instance = await getEC2InstanceDetails(ec2InstanceId);
    console.log('reached2')
    
    // SSH into EC2 instance
    const sshClient = await sshIntoEC2(ec2Instance.publicDnsName);
    
    console.log('reached4')
    // Download and run Terraform config on EC2
    const terraformOutput = await runTerraformOnEC2(sshClient, bucketName, accessKey, secretKey);
    
    // Close SSH connection
    sshClient.end();

    // Check if terraformOutput is defined and not empty
    if (!terraformOutput) {
      throw new Error("Terraform output is empty or undefined");
    }

    // Parse Terraform output to get the new instance details
    const outputLines = terraformOutput.split('\n');

    const publicIpLine = outputLines.find(line => line.includes('instance_public_ip'));

    const publicIp = extractInnerValue(publicIpLine ? publicIpLine.split('=')[1].trim() : null);

    const targetIp = publicIp;

    if (!targetIp) {
      throw new Error("Failed to retrieve instance public DNS or IP");
    }

    console.log("Target data:", targetIp);

    console.log("Adding CNAME record");
    const subdomain = "netflix1";
    await addARecord(domain, subdomain, targetIp);
    res.send(`http://${subdomain}.${domain}`);
  } catch (error) {
    console.error("Deployment failed:", error);
    res.status(500).send("Deployment failed: " + error.message);
  }
}

async function getCredentials() {
  const accessKey = await getAccessKey();
  const secretKey = await getSecretKey();
  return { accessKey, secretKey };
}

function configureAWS(accessKey, secretKey,region) {
  console.log(accessKey, secretKey,region);
  AWS.config.update({
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
    region: region,
  });
}

async function getEC2InstanceDetails(instanceId) {
  const ec2 = new AWS.EC2();
  const params = {
    InstanceIds: [instanceId]
  };
  
  try {
    const data = await ec2.describeInstances(params).promise();
    const instance = data.Reservations[0].Instances[0];
    return {
      publicDnsName: instance.PublicDnsName,
      publicIpAddress: instance.PublicIpAddress
    };
  } catch (err) {
    throw new Error("Error getting EC2 instance details: " + err.message);
  }
}

function sshIntoEC2(instanceIp) {
  return new Promise((resolve, reject) => {
    const pemFilePath = path.join(__dirname, 'majs.pem');
    const privateKey = readFileSync(pemFilePath, 'utf8');
    
    const conn = new Client();
    conn.on('ready', () => {
      console.log('SSH connection established');
      resolve(conn);
    }).on('error', (err) => {
      console.error('SSH connection error:', err);
      reject(err);
    }).connect({
      host: instanceIp,
      port: 22,
      username: 'ubuntu', 
      privateKey: privateKey,
      debug: console.log 
    });
  });
}

async function runTerraformOnEC2(sshClient, bucketName, accessKey, secretKey) {
  const commands = [
    'sudo apt update',
    'sudo apt install -y software-properties-common unzip',
    
    // Check and install AWS CLI if not present
    `if ! command -v aws &> /dev/null; then
        echo "AWS CLI not found. Installing..."
        curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
        unzip awscliv2.zip
        sudo ./aws/install
        rm awscliv2.zip
        rm -rf aws
    else
        echo "AWS CLI is already installed."
    fi`,
    
    // Check and install Terraform if not present
    `if ! command -v terraform &> /dev/null; then
        echo "Terraform not found. Installing..."
        curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo apt-key add -
        sudo apt-add-repository "deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs) main"
        sudo apt update
        sudo apt install -y terraform
    else
        echo "Terraform is already installed."
    fi`,
    
    // Configure AWS CLI using environment variables
    `export AWS_ACCESS_KEY_ID=${accessKey}`,
    `export AWS_SECRET_ACCESS_KEY=${secretKey}`,
    `export AWS_DEFAULT_REGION=ap-south-1`,
    
    // Verify AWS CLI configuration
    'aws sts get-caller-identity',
    
    // Continue with S3 and Terraform commands
    `aws s3 cp s3://${bucketName}/main.tf .`,
    'terraform init',
    `terraform apply -auto-approve -var="access_key=${accessKey}" -var="secret_key=${secretKey}"`
];

  let terraformOutput = '';
  for (const command of commands) {
    const output = await executeCommandOnEC2(sshClient, command);
    if (command.includes('terraform apply')) {
      terraformOutput = output;
    }
  }
  
  if (!terraformOutput) {
    throw new Error("Terraform apply command did not produce any output");
  }
  
  return terraformOutput;
}

function executeCommandOnEC2(sshClient, command) {
  return new Promise((resolve, reject) => {
    sshClient.exec(command, (err, stream) => {
      if (err) reject(err);
      let output = '';
      stream.on('close', (code, signal) => {
        console.log(`Command: ${command}\nOutput: ${output}`);
        resolve(output);
      }).on('data', (data) => {
        output += data;
      }).stderr.on('data', (data) => {
        console.error(`STDERR: ${data}`);
      });
    });
  });
}

function extractInnerValue(str) {
  return str.replace(/^"(.*)"$/, '$1');
}

module.exports = {
  deployApp,
  getAccessKey,
  getSecretKey,
};
