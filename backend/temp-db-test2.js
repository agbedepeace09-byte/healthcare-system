const dns = require('dns');
const { Client } = require('pg');
const hosts = [
  'aws-1-eu-central-1.pooler.supabase.com',
  'udlckxxjvfdntbpovkkl.supabase.co',
  'db.udlckxxjvfdntbpovkkl.supabase.co',
  'postgres.udlckxxjvfdntbpovkkl.supabase.co',
  'postgres.udlckxxjvfdntbpovkkl.db.supabase.co',
  'postgres.udlckxxjvfdntbpovkkl.aws-1-eu-central-1.pooler.supabase.com',
];
(async () => {
  for (const host of hosts) {
    console.log('---');
    console.log('DNS check:', host);
    try {
      const addrs = await dns.promises.lookup(host, { all: true });
      console.log('addresses:', addrs.map(a => a.address));
    } catch (err) {
      console.error('dns err:', err.code || '', err.message);
    }
  }
  const tests = [
    { name: 'with host only', host: 'aws-1-eu-central-1.pooler.supabase.com', port: 5432 },
    { name: 'with tenant sni host', host: 'aws-1-eu-central-1.pooler.supabase.com', port: 5432, servername: 'udlckxxjvfdntbpovkkl.supabase.co' },
    { name: 'with db host', host: 'db.udlckxxjvfdntbpovkkl.supabase.co', port: 5432 },
    { name: 'with postgres host', host: 'postgres.udlckxxjvfdntbpovkkl.supabase.co', port: 5432 },
  ];
  for (const test of tests) {
    console.log('---');
    console.log('TEST:', test.name);
    const conn = `postgresql://healthcare-system:healthcare2026project@${test.host}:${test.port}/postgres`;
    console.log('conn:', conn.replace(/:[^:@]*@/, ':********@'));
    const client = new Client({
      connectionString: conn,
      ssl: {
        rejectUnauthorized: false,
        servername: test.servername || test.host,
      },
      connectionTimeoutMillis: 5000,
    });
    try {
      await client.connect();
      const res = await client.query('SELECT 1 as ok');
      console.log('OK', res.rows[0]);
      await client.end();
    } catch (err) {
      console.error('ERR', err.code || '', err.message);
    }
  }
})();
