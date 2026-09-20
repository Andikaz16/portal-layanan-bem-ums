const { sendSuccess, sendError } = require('../utils/response');

/**
 * ═══════════════════════════════════════════════════
 * Cyber Forensic & Data Breach Controller
 * Mengintegrasikan pengecekan kebocoran data siber
 * ═══════════════════════════════════════════════════
 */

class CyberController {
  /**
   * POST /api/v1/cyber/check-email
   * Mengecek apakah email pernah bocor di insiden data breach
   */
  static async checkEmail(req, res) {
    try {
      const { email } = req.body;

      if (!email || !email.includes('@')) {
        return sendError(res, { message: 'Email tidak valid. Masukkan alamat email yang benar.', statusCode: 400 });
      }

      const trimmedEmail = email.trim().toLowerCase();

      // Query ke XposedOrNot Breach Analytics API (Free & Public)
      let breachData = null;
      let isBreached = false;
      let breachesList = [];
      let exposedDataClasses = new Set();
      let riskScore = 0; // 0 - 100

      try {
        const response = await fetch(`https://api.xposedornot.com/v1/breach-analytics?email=${encodeURIComponent(trimmedEmail)}`, {
          headers: {
            'User-Agent': 'Portal-Advokasi-BEM-CyberCheck/1.0',
          },
          signal: AbortSignal.timeout(6000), // 6 seconds timeout
        });

        if (response.ok) {
          const data = await response.json();
          const hasBreaches = (Array.isArray(data?.ExposedBreaches?.breaches_details) && data.ExposedBreaches.breaches_details.length > 0) ||
                              (data?.BreachesSummary?.site && data.BreachesSummary.site.trim() !== '');

          if (data && data.Error !== 'Not found' && hasBreaches) {
            isBreached = true;
            breachData = data;

            // Extract exposed data classes (e.g. Passwords, Phone, Names)
            if (Array.isArray(data.BreachesSummary.xposed_data)) {
              data.BreachesSummary.xposed_data.forEach(item => {
                if (typeof item === 'string') {
                  item.split(';').forEach(subItem => {
                    const trimmed = subItem.trim();
                    if (trimmed) exposedDataClasses.add(trimmed);
                  });
                }
              });
            }

            // Helper untuk menerjemahkan data classes ke bahasa Indonesia sederhana
            const translateDataClass = (item) => {
              const lower = item.toLowerCase();
              if (lower.includes('password')) return 'Kata Sandi (Password)';
              if (lower.includes('email')) return 'Alamat Email';
              if (lower.includes('ip')) return 'Alamat Jaringan / IP';
              if (lower.includes('name')) return 'Nama Lengkap';
              if (lower.includes('phone') || lower.includes('mobile')) return 'Nomor Telepon / HP';
              if (lower.includes('username')) return 'Nama Pengguna (Username)';
              if (lower.includes('dob') || lower.includes('birth')) return 'Tanggal Lahir';
              if (lower.includes('address')) return 'Alamat Tempat Tinggal';
              return item;
            };

            // Helper untuk menyederhanakan deskripsi insiden ke bahasa Indonesia ramah pemula
            const simplifyDescription = (name, details, xposedData) => {
              const lowerName = name.toLowerCase();
              const lowerDetails = (details || '').toLowerCase();

              if (lowerName.includes('stealer') || lowerDetails.includes('stealer')) {
                return 'Kumpulan kata sandi dan email Anda dicuri oleh virus/malware pencuri data (Stealer) yang menyusup lewat file bajakan atau aplikasi tidak resmi, lalu disebarkan di komunitas peretas.';
              }
              if (lowerName.includes('cutout') || lowerDetails.includes('cutout')) {
                return 'Situs edit foto AI Cutout.pro pernah diretas, menyebabkan jutaan email dan kata sandi penggunanya bocor ke internet publik.';
              }
              if (lowerDetails.includes('telegram')) {
                return 'Data akun Anda ditemukan beredar di saluran percakapan peretas di Telegram akibat pencurian data massal.';
              }
              if (lowerDetails.includes('database dump') || lowerDetails.includes('forum')) {
                return `Layanan ${name} mengalami kebocoran database, sehingga data pendaftaran pengguna (termasuk kata sandi) dibagikan di forum hacker.`;
              }
              return details ? details.replace(/<[^>]*>?/gm, '') : `Layanan ${name} mengalami insiden peretasan yang mengekspos data akun penggunanya.`;
            };

            // Helper untuk menerjemahkan risiko password
            const translatePasswordRisk = (risk) => {
              const r = (risk || '').toLowerCase();
              if (r.includes('plaintext')) return 'Sangat Bahaya (Kata Sandi Terbaca Polos)';
              if (r.includes('easy')) return 'Mudah Ditebak (Enkripsi Lemah)';
              if (r.includes('strong')) return 'Terenkripsi Kuat';
              return 'Perlu Diwaspadai';
            };

            // Extract breach details with rich metadata & simplified language
            if (Array.isArray(data.ExposedBreaches?.breaches_details)) {
              breachesList = data.ExposedBreaches.breaches_details.map(b => ({
                name: b.breach || 'Insiden Tidak Dikenal',
                domain: b.domain || '',
                year: b.xposed_date || (b.added ? b.added.substring(0, 4) : 'Tercatat Baru-baru Ini'),
                addedDate: b.added ? new Date(b.added).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : null,
                details: simplifyDescription(b.breach, b.details, b.xposed_data),
                originalDetails: b.details || '',
                recordsCount: b.xposed_records ? b.xposed_records.toLocaleString('id-ID') : null,
                passwordRisk: translatePasswordRisk(b.password_risk),
                isPlaintext: (b.password_risk || '').toLowerCase().includes('plaintext'),
                industry: b.industry || 'Layanan Digital / Aplikasi',
                logo: b.logo || null,
                referenceUrl: b.references || null,
                verified: b.verified === 'Yes',
                dataClasses: b.xposed_data ? b.xposed_data.split(';').map(s => translateDataClass(s.trim())).filter(Boolean) : []
              }));
            }

            // Hitung Tingkat Risiko yang Akurat (Tidak boleh AMAN jika ada kebocoran!)
            const hasPassword = Array.from(exposedDataClasses).some(d => d.toLowerCase().includes('password'));
            const count = breachesList.length;

            if (count > 0) {
              if (hasPassword) {
                riskScore = Math.max(75, Math.min(100, 60 + (count * 15)));
              } else {
                riskScore = Math.max(45, Math.min(70, 30 + (count * 10)));
              }
            } else {
              riskScore = 5;
            }
          }
        }
      } catch (apiErr) {
        console.warn('⚠️ Breach API fetch warning:', apiErr.message);
      }

      // Tentukan label risiko yang konsisten
      const riskLevel = isBreached 
        ? (riskScore >= 70 ? 'BAHAYA (KATA SANDI BOCOR)' : 'WASPADA (DATA TERBUKA)')
        : 'AMAN (TIDAK TERDETEKSI)';

      // Pemetaan dampak langsung ke Media Sosial (Instagram, WhatsApp, TikTok, Google)
      const socialMediaImpact = [
        {
          platform: 'Instagram',
          iconName: 'Instagram',
          status: isBreached ? 'Rentan Dibajak' : 'Aman Terkendali',
          statusType: isBreached ? 'danger' : 'safe',
          explanation: isBreached
            ? 'Jika kata sandi Instagram Anda sama atau mirip dengan kata sandi lama Anda yang bocor, peretas bisa langsung login tanpa perlu meretas Instagram Anda.'
            : 'Belum terdeteksi adanya kata sandi Anda yang beredar luas di internet.',
          actionTip: 'Buka Pengaturan Instagram > Pusat Akun > Kata Sandi & Keamanan > Cek "Tempat Anda Login". Putuskan perangkat yang tidak dikenal.'
        },
        {
          platform: 'TikTok',
          iconName: 'Video',
          status: isBreached ? 'Rentan Diambil Alih' : 'Aman Terkendali',
          statusType: isBreached ? 'danger' : 'safe',
          explanation: isBreached
            ? 'Akun TikTok sering menjadi sasaran pembajakan bot untuk menyebarkan video spam atau penipuan pinjaman online.'
            : 'Kredensial akun Anda dalam kondisi aman dari database kebocoran publik.',
          actionTip: 'Aktifkan Verifikasi 2 Langkah di Pengaturan TikTok > Keamanan.'
        },
        {
          platform: 'WhatsApp',
          iconName: 'MessageCircle',
          status: isBreached ? 'Waspada Penipuan OTP' : 'Aman Terkendali',
          statusType: isBreached ? 'warning' : 'safe',
          explanation: isBreached
            ? 'Jika nomor HP Anda ikut bocor, waspadai telepon atau pesan palsu yang meminta kode 6 digit (OTP) dengan alasan salah transfer pulsa/hadiah.'
            : 'Nomor telepon dan akun WhatsApp Anda tidak terindikasi terekspos.',
          actionTip: 'Wajib pasang PIN Verifikasi Dua Langkah di Pengaturan WhatsApp > Akun > Verifikasi Dua Langkah.'
        },
        {
          platform: 'Email Utama / Google',
          iconName: 'Mail',
          status: isBreached ? 'Pintu Gerbang Kritis' : 'Aman Terkendali',
          statusType: isBreached ? 'danger' : 'safe',
          explanation: isBreached
            ? 'Email adalah kunci dari semua akun media sosial Anda. Jika peretas masuk ke email ini, mereka bisa mereset password Instagram dan TikTok Anda kapan saja!'
            : 'Email utama Anda memiliki reputasi aman di database intelijen ancaman.',
          actionTip: 'Segera ganti kata sandi email utama ini sekarang dan jangan gunakan kata sandi yang sama di tempat lain.'
        }
      ];

      // Format rekomendasi aksi ramah mahasiswa
      const recommendations = [];
      if (isBreached) {
        recommendations.push({
          title: '1. Ganti Kata Sandi Medsos & Email Sekarang',
          priority: 'HIGH',
          detail: 'Buat kata sandi baru yang berbeda dari yang pernah Anda pakai. Jangan gunakan tanggal lahir atau nama panggilan.'
        });

        recommendations.push({
          title: '2. Aktifkan 2FA (Verifikasi 2 Langkah)',
          priority: 'HIGH',
          detail: 'Aktifkan 2FA di Instagram dan TikTok menggunakan aplikasi Google Authenticator. Dengan 2FA, peretas TIDAK BISA MASUK meskipun mereka tahu password Anda!'
        });

        recommendations.push({
          title: '3. Keluarkan Perangkat Asing (Logout All)',
          priority: 'MEDIUM',
          detail: 'Buka menu Keamanan di Instagram/Google > Cek "Tempat Login". Jika ada kota atau HP yang tidak Anda kenali, klik "Keluar / Logout".'
        });

        recommendations.push({
          title: '4. Beritahu Teman Jika Sudah Diperas',
          priority: 'MEDIUM',
          detail: 'Jika akun Anda sudah terlanjur dikuasai peretas dan dipakai memeras orang, buat story di akun teman/keluarga bahwa akun Anda sedang dibajak.'
        });
      } else {
        recommendations.push({
          title: 'Pertahankan Kebiasaan Aman',
          priority: 'LOW',
          detail: 'Email Anda bersih dari catatan kebocoran besar. Tetap gunakan kata sandi yang berbeda untuk masing-masing media sosial Anda.'
        });
      }

      // Terjemahkan exposedData ke bahasa Indonesia
      const translatedExposedData = Array.from(exposedDataClasses).map(item => translateDataClass(item));

      return sendSuccess(res, {
        message: 'Pemeriksaan keamanan berhasil dilakukan.',
        data: {
          email: trimmedEmail,
          isBreached,
          riskScore, // 0 - 100
          riskLevel,
          totalBreaches: breachesList.length,
          breaches: breachesList,
          exposedData: translatedExposedData,
          socialMediaImpact,
          recommendations,
          metrics: {
            passwordStrength: breachData?.BreachMetrics?.passwords_strength?.[0] || null,
            yearwise: breachData?.BreachMetrics?.yearwise_details?.[0] || null,
          },
          dataSource: {
            name: 'XposedOrNot & Open Cyber Threat Intelligence',
            url: 'https://xposedornot.com',
            description: 'Lapor Pres terhubung dengan basis data pemantau intelijen siber global yang melacak miliaran kredensial hasil peretasan di forum underground, data leaks, dan paste sites secara real-time.',
            transparency: 'Lapor Pres TIDAK PERNAH membobol akun Anda dan TIDAK PERNAH menyimpan kata sandi. Pengecekan ini hanya mencocokkan identitas email dengan hash rekaman publik yang telah terekspos di dunia siber.'
          }
        }
      });
    } catch (error) {
      console.error('❌ Error in CyberController.checkEmail:', error);
      return sendError(res, { message: 'Gagal memproses pemeriksaan keamanan. Silakan coba lagi.', statusCode: 500 });
    }
  }
}

module.exports = CyberController;
