const { Client } = require("pg");
const tests = [
  {
    name: 'DIRECT host',
    conn: 'postgresql://healthcare-system:healthcare2026project@aws-1-eu-central-1.pooler.supabase.com:5432/postgres',
  },
  {
    name: 'PGBOUNCER host',
    conn: 'postgresql://healthcare-system:healthcare2026project@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1',
  },
  {
    name: 'DIRECT host with tenant SNI',
    conn: 'postgresql://healthcare-system:healthcare2026project@aws-1-eu-central-1.pooler.supabase.com:5432/postgres',
    servername: 'udlckxxjvfdntbpovkkl.supabase.co',
  },
  {
    name: 'PGBOUNCER host with tenant SNI',
    conn: 'postgresql://healthcare-system:healthcare2026project@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1',
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
