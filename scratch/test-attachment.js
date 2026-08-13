const db = require('../server/src/config/database');

async function testInsert() {
  try {
    // 1. Get a valid ticket ID
    const res = await db.query('SELECT id FROM tickets LIMIT 1;');
    if (res.rowCount === 0) {
      console.log('No tickets found to test.');
      process.exit(0);
    }
    const ticketId = res.rows[0].id;
    
    // 2. Try inserting an attachment
    console.log('Inserting attachment for ticket:', ticketId);
    const result = await db.query(
      `INSERT INTO ticket_attachments (ticket_id, file_url)
       VALUES ($1, $2)
       RETURNING *`,
      [ticketId, '/uploads/test.jpg']
    );
    console.log('Success:', result.rows[0]);
    
    // 3. Cleanup
    await db.query('DELETE FROM ticket_attachments WHERE id = $1', [result.rows[0].id]);
    process.exit(0);
  } catch (err) {
    console.error('Error inserting:', err);
    process.exit(1);
  }
}

testInsert();
