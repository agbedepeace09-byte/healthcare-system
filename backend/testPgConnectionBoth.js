require('dotenv').config();
const { Client } = require('pg');

const urls = [
  { name: 'DATABASE_URL', url: process.env.DATABASE_URL },
  { name: 'DIRECT_URL', url: process.env.DIRECT_URL },
];

(async () => {
  for (const { name, url } of urls) {
    console.log(`Testing ${name}:`, !!url);
    if (!url) continue;
    const client = new Client({ connectionString: url });
    try {
      await client.connect();
      console.log(`${name} connected successfully`);
      await client.end();
    } catch (err) {
      console.error(`${name} error:`, err.message);
    }
  }
})();
