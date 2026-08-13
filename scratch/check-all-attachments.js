const db = require('../server/src/config/database');

(async () => {
  const r = await db.query(
    `SELECT id, ticket_id, LEFT(file_url, 80) as url_preview, LENGTH(file_url) as url_length, created_at 
     FROM ticket_attachments ORDER BY created_at DESC`
  );
  console.log('Total attachments:', r.rowCount);
  console.log(JSON.stringify(r.rows, null, 2));
  process.exit(0);
})();
