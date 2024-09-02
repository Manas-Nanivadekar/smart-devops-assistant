const https = require("https");

function addCnameRecord(
  apiKey,
  apiSecret,
  domain,
  subdomain,
  target,
  ttl = 6000
) {
  // API endpoint to add the CNAME record
  const url = new URL(`https://api.godaddy.com/v1/domains/${domain}/records`);

  // Headers for the request
  const headers = {
    Authorization: `sso-key ${apiKey}:${apiSecret}`,
    "Content-Type": "application/json",
  };

  // JSON payload for the new CNAME record
  const data = JSON.stringify([
    { data: target, name: subdomain, ttl: ttl, type: "CNAME" },
  ]);

  // Request options
  const options = {
    hostname: url.hostname,
    path: url.pathname,
    method: "PATCH",
    headers: headers,
  };

  // Make the request to add the CNAME record
  const req = https.request(options, (res) => {
    res.setEncoding("utf8");
    let responseBody = "";

    res.on("data", (chunk) => {
      responseBody += chunk;
    });

    res.on("end", () => {
      if (res.statusCode === 200) {
        console.log(
          `Successfully added CNAME record for ${subdomain}.${domain}`
        );
      } else {
        console.error(
          `Failed to add CNAME record: ${res.statusCode} - ${responseBody}`
        );
      }
    });
  });

  req.on("error", (err) => {
    console.error(err);
  });

  req.write(data);
  req.end();
}

// Example usage
const apiKey = "fYLX6UjMP71o_DAoWs5j3qihQRuLM1Xp2W7";
const apiSecret = "NWrMscb12TtMaZcZwoFaMq";
const domain = "majs.live";
const target = "YOUR_TARGET_DOMAIN";
const project_name = "studentreg";

module.exports={
  addCnameRecord,
  apiKey,
  apiSecret,
  domain,
}