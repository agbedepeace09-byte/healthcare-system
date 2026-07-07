require('dotenv').config();
const { Client } = require('pg');
const connectionString = process.env.DATABASE_URL;
console.log('Using DATABASE_URL set:', !!connectionString);
const client = new Client({ connectionString });
client.connect()
  .then(() => {
    console.log('PG connected');
    return client.end();
  })
  .catch((err) => {
    console.error('PG connection error:', err.message);
    process.exit(1);
  });
