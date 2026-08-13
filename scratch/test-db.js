const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_FDw9WUauR1dE@ep-round-star-az1c3ata.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    await client.connect();
    console.log('Connected successfully!');
    
    // Check tables
    const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'");
    console.log('Tables:', res.rows.map(r => r.table_name));

    // Try a simple select to test queries
    const tickets = await client.query("SELECT * FROM tickets LIMIT 1");
    console.log('Select tickets OK');
    
  } catch (err) {
    console.error('Error during test:', err);
  } finally {
    await client.end();
  }
}

run();
