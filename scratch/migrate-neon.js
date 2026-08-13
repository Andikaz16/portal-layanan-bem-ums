const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = 'postgresql://neondb_owner:npg_FDw9WUauR1dE@ep-round-star-az1c3ata.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    console.log('Connecting to Neon...');
    await client.connect();
    console.log('Connected!');

    const schemaPath = path.join(__dirname, '../docs/database-schema.sql');
    console.log('Reading schema from:', schemaPath);
    const sql = fs.readFileSync(schemaPath, 'utf8');

    console.log('Executing schema SQL...');
    await client.query(sql);
    console.log('Database schema migrated successfully!');

    // Verify tables
    const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'");
    console.log('Tables now in DB:', res.rows.map(r => r.table_name));

  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await client.end();
  }
}

run();
