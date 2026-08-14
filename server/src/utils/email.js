const nodemailer = require('nodemailer');

/**
 * Konfigurasi Transport Nodemailer
 * Mengambil setting dari Environment Variables.
 */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Mengirim email notifikasi tiket berhasil dibuat.
 * 
 * @param {string} to - Alamat email penerima
 * @param {string} ticketCode - Kode tiket (e.g. BEM-X1A2)
 * @param {string} studentName - Nama pelapor
 * @param {string} subject - Subjek laporan
 */
const sendTicketEmail = async (to, ticketCode, studentName, subject) => {
  if (!to || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('[Email] Skipping email notification. SMTP config missing or email not provided.');
    return;
  }

  const name = studentName || 'Mahasiswa';
  
  const mailOptions = {
    from: `"Portal Layanan BEM UMS" <${process.env.SMTP_USER}>`,
    to: to,
    replyTo: process.env.SMTP_USER,
    subject: `Kode Tiket Laporan Anda: ${ticketCode}`,
    text: `Halo ${name},\n\nTerima kasih telah menggunakan Portal Layanan BEM UMS. Laporan Anda dengan subjek "${subject}" telah berhasil kami terima.\n\nKODE TIKET ANDA: ${ticketCode}\n\nSimpan kode tiket ini untuk melacak status laporan Anda di website kami.\n\nLacak Laporan Sekarang: ${process.env.FRONTEND_URL || 'https://portal-layanan-bem-ums.vercel.app'}/lacak/${ticketCode}\n\nTerima kasih,\nBEM UMS`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 10px; overflow: hidden;">
        <div style="background-color: #dc2626; padding: 20px; text-align: center;">
          <h2 style="color: #ffffff; margin: 0; font-size: 24px;">Laporan Berhasil Diterima</h2>
        </div>
        
        <div style="padding: 30px 20px; background-color: #ffffff; color: #333333;">
          <p style="font-size: 16px; margin-top: 0;">Halo, <strong>${name}</strong>,</p>
          <p style="font-size: 16px; line-height: 1.5;">Terima kasih telah menggunakan Portal Layanan BEM UMS. Laporan Anda dengan subjek <strong>"${subject}"</strong> telah berhasil kami terima dan masuk ke dalam antrean verifikasi.</p>
          
          <div style="background-color: #f9fafb; border: 1px dashed #cbd5e1; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
            <p style="font-size: 14px; color: #64748b; margin-top: 0; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px;">KODE TIKET ANDA</p>
            <h1 style="font-family: monospace; font-size: 36px; color: #dc2626; margin: 0; letter-spacing: 4px;">${ticketCode}</h1>
          </div>
          
          <p style="font-size: 16px; line-height: 1.5;">Simpan kode tiket ini baik-baik. Anda dapat menggunakan kode ini untuk melacak status dan perkembangan laporan Anda di website kami.</p>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.FRONTEND_URL || 'https://portal-layanan-bem-ums.vercel.app'}/lacak/${ticketCode}" style="display: inline-block; background-color: #dc2626; color: #ffffff; text-decoration: none; padding: 12px 25px; border-radius: 6px; font-weight: bold; font-size: 16px;">Lacak Laporan Sekarang</a>
          </div>
        </div>
        
        <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #eaeaea;">
          <p style="font-size: 12px; color: #94a3b8; margin: 0;">Email ini dihasilkan secara otomatis. Mohon tidak membalas email ini.</p>
          <p style="font-size: 12px; color: #94a3b8; margin: 5px 0 0 0;">&copy; ${new Date().getFullYear()} BEM Universitas Muhammadiyah Surakarta</p>
        </div>
      </div>
    `,
    headers: {
      'X-Priority': '1 (Highest)',
      'X-Mailer': 'Nodemailer'
    }
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[Email] Ticket notification sent to ${to} for ticket ${ticketCode}`);
  } catch (error) {
    console.error('[Email] Failed to send ticket notification:', error);
  }
};

/**
 * Mengirim email notifikasi saat status tiket berubah atau admin membalas.
 * 
 * @param {string} to - Alamat email penerima
 * @param {string} ticketCode - Kode tiket
 * @param {string} studentName - Nama pelapor
 * @param {string} subject - Subjek laporan
 * @param {string} newStatus - Status baru
 * @param {string} adminNote - Pesan/balasan dari admin (opsional)
 */
const sendStatusUpdateEmail = async (to, ticketCode, studentName, subject, newStatus, adminNote = '') => {
  if (!to || !process.env.SMTP_USER || !process.env.SMTP_PASS) return;

  const name = studentName || 'Mahasiswa';
  const statusLabels = {
    'menunggu_verifikasi': '⏳ Menunggu Verifikasi',
    'sedang_diproses': '⚙️ Sedang Diproses',
    'selesai': '✅ Selesai',
    'ditolak': '❌ Ditolak'
  };
  const statusLabel = statusLabels[newStatus] || newStatus;
  
  let noteHtml = '';
  if (adminNote) {
    noteHtml = `
      <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin: 25px 0;">
        <p style="margin-top: 0; font-size: 14px; font-weight: bold; color: #991b1b;">Catatan dari Admin:</p>
        <p style="margin: 0; font-size: 15px; color: #7f1d1d; font-style: italic;">"${adminNote}"</p>
      </div>
    `;
  }

  const mailOptions = {
    from: `"Portal Layanan BEM UMS" <${process.env.SMTP_USER}>`,
    to: to,
    replyTo: process.env.SMTP_USER,
    subject: `[Update] Laporan Anda (${ticketCode}): ${statusLabel}`,
    text: `Halo ${name},\n\nStatus laporan Anda "${subject}" (${ticketCode}) telah diperbarui menjadi: ${statusLabel}.\n\n${adminNote ? 'Catatan Admin: ' + adminNote + '\n\n' : ''}Cek detail laporan Anda di: ${process.env.FRONTEND_URL || 'https://portal-layanan-bem-ums.vercel.app'}/lacak/${ticketCode}\n\nBEM UMS`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 10px; overflow: hidden;">
        <div style="background-color: #dc2626; padding: 20px; text-align: center;">
          <h2 style="color: #ffffff; margin: 0; font-size: 24px;">Update Status Laporan</h2>
        </div>
        
        <div style="padding: 30px 20px; background-color: #ffffff; color: #333333;">
          <p style="font-size: 16px; margin-top: 0;">Halo, <strong>${name}</strong>,</p>
          <p style="font-size: 16px; line-height: 1.5;">Laporan Anda dengan subjek <strong>"${subject}"</strong> (Kode: ${ticketCode}) telah diperbarui statusnya.</p>
          
          <div style="text-align: center; margin: 25px 0;">
            <p style="font-size: 14px; color: #64748b; margin-top: 0; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">STATUS SAAT INI</p>
            <span style="display: inline-block; background-color: #f1f5f9; padding: 10px 20px; border-radius: 20px; font-weight: bold; font-size: 18px; color: #1e293b;">
              ${statusLabel}
            </span>
          </div>

          ${noteHtml}
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.FRONTEND_URL || 'https://portal-layanan-bem-ums.vercel.app'}/lacak/${ticketCode}" style="display: inline-block; background-color: #dc2626; color: #ffffff; text-decoration: none; padding: 12px 25px; border-radius: 6px; font-weight: bold; font-size: 16px;">Lihat Detail Laporan</a>
          </div>
        </div>
        
        <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #eaeaea;">
          <p style="font-size: 12px; color: #94a3b8; margin: 0;">&copy; ${new Date().getFullYear()} BEM Universitas Muhammadiyah Surakarta</p>
        </div>
      </div>
    `,
    headers: { 'X-Priority': '3 (Normal)' }
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[Email] Status update sent to ${to} for ticket ${ticketCode}`);
  } catch (error) {
    console.error('[Email] Failed to send status update email:', error);
  }
};

module.exports = {
  sendTicketEmail,
  sendStatusUpdateEmail
};
