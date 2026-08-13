const db = require('../server/src/config/database');

(async () => {
  // Check the ticket from the screenshot: BEM-AS5M
  const ticketRes = await db.query(`SELECT id, ticket_code FROM tickets WHERE ticket_code = 'BEM-AS5M'`);
  console.log('Ticket BEM-AS5M:', ticketRes.rows);
  
  if (ticketRes.rowCount > 0) {
    const ticketId = ticketRes.rows[0].id;
    const attRes = await db.query(`SELECT id, LEFT(file_url, 100) as url_preview, LENGTH(file_url) as url_length FROM ticket_attachments WHERE ticket_id = $1`, [ticketId]);
    console.log('Attachments for BEM-AS5M:', attRes.rows);
  }

  // Also check the latest ticket from user test at 16:07
  const latestRes = await db.query(`SELECT id, ticket_code, created_at FROM tickets ORDER BY created_at DESC LIMIT 5`);
  console.log('\nLatest 5 tickets:', latestRes.rows);
  
  for (const t of latestRes.rows) {
    const attRes = await db.query(`SELECT id, LEFT(file_url, 80) as url_preview, LENGTH(file_url) as url_length FROM ticket_attachments WHERE ticket_id = $1`, [t.id]);
    console.log(`  Attachments for ${t.ticket_code}:`, attRes.rows.length > 0 ? attRes.rows : 'NONE');
  }
  
  process.exit(0);
})();
