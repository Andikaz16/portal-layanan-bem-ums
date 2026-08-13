const fs = require('fs');
const path = require('path');
const db = require('../server/src/config/database');

async function testVercel() {
  const fetch = (await import('node-fetch')).default;
  
  const testFile = path.join(__dirname, 'test.png');
  const fileData = fs.readFileSync(testFile).toString('base64');
  const base64DataUri = `data:image/png;base64,${fileData}`;

  const payload = {
    student_name: 'Test JSON Vercel',
    student_nim: 'L200240001',
    student_email: 'l200240001@student.ums.ac.id',
    student_phone: '08123456789',
    student_faculty: 'FKI',
    student_program: 'Informatika',
    category_id: '1',
    subject: 'Test Image Upload JSON Vercel',
    description: 'Testing upload JSON ini deskripsi laporan yang panjang agar lolos validasi minimal 50 karakter',
    attachments_base64: [base64DataUri]
  };
  
  try {
    const res = await fetch('https://portal-layanan-bem-ums.vercel.app/api/v1/reports', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    const result = await res.json();
    console.log('Status:', res.status);
    console.log('Response:', result);
    
    if (result.success) {
      // Check DB directly
      const ticketRes = await db.query('SELECT id FROM tickets WHERE ticket_code = $1', [result.data.ticket_code]);
      const ticketId = ticketRes.rows[0].id;
      const attRes = await db.query('SELECT id, file_url FROM ticket_attachments WHERE ticket_id = $1', [ticketId]);
      console.log('Attachments in DB:', attRes.rows.length);
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
testVercel();
