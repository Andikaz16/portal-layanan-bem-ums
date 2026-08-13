const fs = require('fs');
const path = require('path');

async function testUpload() {
  const fetch = (await import('node-fetch')).default;
  const FormData = require('form-data');
  
  const form = new FormData();
  form.append('student_name', 'Test User');
  form.append('student_nim', 'L200240001');
  form.append('student_email', 'l200240001@student.ums.ac.id');
  form.append('student_phone', '08123456789');
  form.append('student_faculty', 'FKI');
  form.append('student_program', 'Informatika');
  form.append('category_id', '1');
  form.append('subject', 'Test Image Upload');
  form.append('description', 'Testing upload ini deskripsi laporan yang panjang agar lolos validasi minimal 50 karakter');
  
  // Attach a dummy image file
  const testFile = path.join(__dirname, 'test.png');
  fs.writeFileSync(testFile, 'dummy image data');
  form.append('attachments', fs.createReadStream(testFile), { filename: 'test.png', contentType: 'image/png' });
  
  try {
    const res = await fetch('http://localhost:5000/api/v1/reports', {
      method: 'POST',
      body: form,
      headers: form.getHeaders()
    });
    const text = await res.text();
    console.log('Status:', res.status);
    console.log('Response:', text);
  } catch (err) {
    console.error(err);
  }
}
testUpload();
