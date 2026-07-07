const { Client } = require('pg');
const tests = [
  {
    name: 'pgbouncer host sslmode=require',
    conn: 'postgresql://healthcare-system:healthcare2026project@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?sslmode=require&application_name=healthcare-app',
  },
  {
    name: 'direct host sslmode=require',
    conn: 'postgresql://healthcare-system:healthcare2026project@aws-1-eu-central-1.pooler.supabase.com:5432/postgres?sslmode=require&application_name=healthcare-app',
  },
  {
    name: 'pgbouncer host sslmode=require with sni',
    conn: 'postgresql://healthcare-system:healthcare2026project@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?sslmode=require&application_name=healthcare-app',
    servername: 'udlckxxjvfdntbpovkkl.supabase.co',
  },
  {
    name: 'direct host sslmode=require with sni',
    conn: 'postgresql://healthcare-system:healthcare2026project@aws-1-eu-central-1.pooler.supabase.com:5432/postgres?sslmode=require&application_name=healthcare-app',
    servername: 'udlckxxjvfdntbpovkkl.supabase.co',
  }
];
(async () => {
  for (const test of tests) {
    console.log('---');
    console.log('TEST:', test.name);
    console.log('conn:', test.conn.replace(/:[^:@]*@/, ':********@'));
    try {
      const url = new URL(test.conn);
      const client = new Client({
        connectionString: test.conn,
        ssl: {
          rejectUnauthorized: false,
          servername: test.servername || url.hostname,
        },
        connectionTimeoutMillis: 5000,
      });
      await client.connect();
      const res = await client.query('SELECT 1 as ok');
      console.log('OK', res.rows[0]);
      await client.end();
    } catch (err) {
      console.error('ERR', err.code || '', err.message);
    }
  }
})();
