require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const { Client } = require('pg');

const urls = [
  { name: 'DIRECT_URL', url: process.env.DIRECT_URL },
  { name: 'DATABASE_URL', url: process.env.DATABASE_URL },
];

const tryConnect = async (connectionString, sslOption) => {
  const client = new Client({ connectionString, ssl: sslOption });
  try {
    await client.connect();
    console.log(`SUCCESS ssl=${JSON.stringify(sslOption)}.`);
    await client.end();
  } catch (err) {
    console.error(`FAIL ssl=${JSON.stringify(sslOption)}:`, err.message);
  }
};

(async () => {
  for (const { name, url } of urls) {
    console.log(`\nTesting ${name}:`, !!url ? url.replace(/:[^:]+@/, ':*****@') : 'missing');
    if (!url) continue;
    await tryConnect(url, false);
    await tryConnect(url, { rejectUnauthorized: false });
    await tryConnect(url, { rejectUnauthorized: true });
  }
})();
