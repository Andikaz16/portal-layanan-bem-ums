const db = require('../server/src/config/database');

async function check() {
  try {
    const res = await db.query(`SELECT id, ticket_id, file_url, created_at FROM ticket_attachments ORDER BY created_at DESC LIMIT 5`);
    console.log('Attachments:', res.rows.map(r => ({ ...r, file_url: r.file_url ? r.file_url.substring(0, 50) + '...' : null })));
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

check();
