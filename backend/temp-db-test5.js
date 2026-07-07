const { Client } = require('pg');
const host = 'aws-1-eu-central-1.pooler.supabase.com';
const port = 5432;
const user = 'healthcare-system';
const password = 'healthcare2026project';
const database = 'postgres';
const tests = [
  {
    name: 'direct pg config, ssl rejectUnauthorized false',
    config: {
      host,
      port,
      user,
      password,
      database,
      ssl: { rejectUnauthorized: false, servername: host },
      connectionTimeoutMillis: 20000,
    },
  },
  {
    name: 'direct pg config, ssl true',
    config: {
      host,
      port,
      user,
      password,
      database,
      ssl: true,
      connectionTimeoutMillis: 20000,
    },
  },
];
(async () => {
  for (const test of tests) {
    console.log('---');
    console.log('TEST:', test.name);
    try {
      const client = new Client(test.config);
      await client.connect();
      const res = await client.query('SELECT 1 as ok');
      console.log('OK', res.rows[0]);
      await client.end();
    } catch (err) {
      console.error('ERR', err.code || '', err.message);
    }
  }
})();
