const db = require('../server/src/config/database');

async function check() {
  try {
    const res = await db.query(`SELECT id, ticket_id, content, created_at FROM admin_notes WHERE is_internal = TRUE ORDER BY created_at DESC LIMIT 5`);
    console.log('Admin Notes:', res.rows);
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

check();
