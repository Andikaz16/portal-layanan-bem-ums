const db = require('../server/src/config/database');

async function migrate() {
  try {
    console.log('Altering ticket_attachments table...');
    await db.query('ALTER TABLE ticket_attachments ALTER COLUMN file_url TYPE TEXT;');
    await db.query('ALTER TABLE ticket_attachments ALTER COLUMN file_name DROP NOT NULL;');
    console.log('Migration successful!');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
