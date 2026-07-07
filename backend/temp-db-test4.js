const { Client } = require('pg');
const tests = [
  {
    name: 'project host direct 5432',
    conn: 'postgresql://healthcare-system:healthcare2026project@udlckxxjvfdntbpovkkl.supabase.co:5432/postgres?sslmode=require',
  },
  {
    name: 'project host direct 6543',
    conn: 'postgresql://healthcare-system:healthcare2026project@udlckxxjvfdntbpovkkl.supabase.co:6543/postgres?sslmode=require',
  },
  {
    name: 'project host with SNI 5432',
    conn: 'postgresql://healthcare-system:healthcare2026project@udlckxxjvfdntbpovkkl.supabase.co:5432/postgres?sslmode=require',
    servername: 'udlckxxjvfdntbpovkkl.supabase.co',
  },
  {
    name: 'project host with SNI 6543',
    conn: 'postgresql://healthcare-system:healthcare2026project@udlckxxjvfdntbpovkkl.supabase.co:6543/postgres?sslmode=require',
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
