const AWS = require("aws-sdk");
const fs = require("fs").promises;
const path = require("path");
const { exec } = require("child_process");
const { addCnameRecord } = require("./cname");

const execShellCommand = (cmd) => {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.warn(error);
      }
      resolve(stdout ? stdout : stderr);
    });
  });
};

const getAccessKey = () => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(require("os").homedir(), ".majsAuth");
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error("Error reading the file:", err);
        reject(err);
      } else {
        resolve(data.trim());
      }
    });
  });
};

const getSecretKey = async () => {
  const accessKey = await getAccessKey();
  const fetch = (await import("node-fetch")).default;
  const response = await fetch(
    "https://jnjcn0fgrd.execute-api.ap-south-1.amazonaws.com/authenticate",
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
  const accessKey = await getAccessKey();
  const secretKey = await getSecretKey();
  const bucketName = "majs-storage-engine";

  AWS.config.update({
    accessKeyId: "our aws access key",
    secretAccessKey: "our aws secret key",
    region: "ap-south-1",
  });

  const s3 = new AWS.S3();

  // Download .maintf from S3
  const params = {
    Bucket: bucketName,
    Key: "main.tf",
  };

  try {
    const data = await s3.getObject(params).promise();
    await fs.writeFile("main.tf", data.Body);
    console.log("main.tf downloaded successfully");
  } catch (err) {
    console.error("Error downloading main.tf:", err);
    res.status(500).send("Error downloading main.tf file");
    return;
  }

  const s3Arn = "arn:aws:s3:::majs-storage-engine";

  console.log("Initializing Terraform");
  let output = await execShellCommand("terraform init");
  console.log(output);

  console.log("Applying Terraform configuration");
  output = await execShellCommand(
    `terraform apply -auto-approve -var="access_key=${accessKey}" -var="secret_key=${secretKey}" -var="s3_arn=${s3Arn}"`,
  );
  console.log(output);

  console.log("Getting Terraform output");
  output = await JSON.parse(await execShellCommand("terraform output -json"));
  const targetData = output.instace_public_dns.value;

  console.log("Adding CNAME record");
  addCnameRecord(apiKey, apiSecret, domain, targetData);

  res.send(`http://${projectName}.majs.live`);
}

module.exports = {
  deployApp,
  getAccessKey,
  getSecretKey,
};
