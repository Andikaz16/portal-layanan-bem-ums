const fs = require('fs');
const path = require('path');

async function testUploadJSON() {
  const fetch = (await import('node-fetch')).default;
  
  const testFile = path.join(__dirname, 'large.png');
  const fileData = fs.readFileSync(testFile).toString('base64');
  const base64DataUri = `data:image/png;base64,${fileData}`;

  const payload = {
    student_name: 'Test JSON Local',
    student_nim: 'L200240001',
    student_email: 'l200240001@student.ums.ac.id',
    student_phone: '08123456789',
    student_faculty: 'FKI',
    student_program: 'Informatika',
    category_id: '1',
    subject: 'Test Large Upload',
    description: 'Testing upload JSON ini deskripsi laporan yang panjang agar lolos validasi minimal 50 karakter',
    attachments_base64: [base64DataUri]
  };
  
  try {
    const res = await fetch('http://localhost:5000/api/v1/reports', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    const text = await res.text();
    console.log('Status:', res.status);
    console.log('Response:', text);
  } catch (err) {
    console.error(err);
  }
}
testUploadJSON();
