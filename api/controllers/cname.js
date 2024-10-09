const axios = require('axios');

async function addARecord(domain, host, ipAddress, ttl = 300) {
  const data = JSON.stringify({
    host: host,
    type: "A",
    answer: ipAddress,
    ttl: ttl
  });

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `https://api.name.com/v4/domains/${domain}/records`,
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': 'Basic ', 
    },
    data: data
  };

  try {
    const response = await axios.request(config);
    console.log(`Successfully added A record for ${host}.${domain}`);
    console.log('API Response:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error(`Failed to add A record for ${host}.${domain}`);
    if (error.response) {
      console.error('Error response:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
    throw error;
  }
}

// Example usage
const domain = 'amaanis.live';

module.exports = {
  addARecord,
  domain
};