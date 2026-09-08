import sys, re, os

# Read original
with open(r'C:\Users\andik\.gemini\antigravity\brain\a13c921a-d8ea-4f28-9086-ccdbd9c4139c\.system_generated\steps\3159\content.md', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Strip header
lines = lines[8:]
html = ''.join(lines)

reps = [
    # Head & Preloader
    (r'<title>Kage — Where stillness reveals the unseen</title>', r'<title>Layanan BEM UMS — Portal Aspirasi Mahasiswa</title>'),
    (r'content="A five-chapter night walk through a Kyoto mountain temple. Charred cypress, lantern light and a vermilion moon, rendered live in WebGL."', r'content="Portal layanan resmi BEM UMS untuk menampung keluhan dan aspirasi mahasiswa. Aman, terlacak, dan ditindaklanjuti."'),
    (r'>影の道<', r'>BEM UMS<'),
    (r'Raising the mountain temple', r'Memuat Portal Layanan'),
    
    # Nav
    (r'<span class="brand-tx"><b>KAGE</b><i>HIDDEN REALMS OF KYOTO</i></span>', r'<span class="brand-tx"><b>LAPOR</b><i>PORTAL LAYANAN BEM UMS</i></span>'),
    (r'>Temples<', r'>Beranda<'), (r'>伽藍<', r'>Home<'),
    (r'>Gardens<', r'>Layanan<'), (r'>庭園<', r'>Service<'),
    (r'>Rituals<', r'>Prosedur<'), (r'>神事<', r'>Steps<'),
    (r'>Afterlight<', r'>Tentang<'), (r'>残光<', r'>About<'),
    
    # Hero
    (r'Chapter 00 — The Hidden Gate', r'Portal Resmi — Layanan BEM UMS'),
    (r'>Where stillness<', r'>Suaramu<'),
    (r'>reveals the<', r'>didengar,<'),
    (r'>unseen.<', r'>ditindaklanjuti.<'),
    (r'Enter Kyoto through its quiet thresholds, where ritual,\s*craft, and memory shape the path.', r'Kanal resmi Badan Eksekutif Mahasiswa UMS untuk menampung keluhan dan aspirasi mahasiswa. Laporanmu aman, terlacak, dan ditindaklanjuti.'),
    
    # Hero chips
    (r'>Thresholds<', r'>Kirim Laporan<'),
    (r'Discover the hidden gates that open on to deeper paths.', r'Sampaikan keluhan melalui form pelaporan yang mudah digunakan.'),
    (r'>Still Gardens<', r'>Dapatkan Tiket<'),
    (r'Witness the courts where silence gently unfolds.', r'Simpan kode unik BEM-XXXX untuk melacak status laporan.'),
    (r'>Sacred Craft<', r'>Tim Bergerak<'),
    (r'Embrace the hands and heritage that shape devotion.', r'Laporan diverifikasi, diproses, dan dikawal oleh kementerian.'),
    (r'>Night Rituals<', r'>Masalah Selesai<'),
    (r'Explore the rites that awaken when the day is done.', r'Resolusi dicapai melalui audiensi dengan pihak kampus.'),
    
    # Peek caption
    (r'<b class="jp">山門</b><i>Sanmon — before the bell</i>', r'<b class="jp">BEM</b><i>Portal Layanan Mahasiswa</i>'),
    
    # word-fb & hero-side
    (r'<div class="word-fb" aria-hidden="true">KAGE</div>', r'<div class="word-fb" aria-hidden="true">BEM</div>'),
    (r'<span class="v jp">影の道</span>', r'<span class="v jp">BEM UMS</span>'),
    
    # Chapter I
    (r'<b>01</b> — The Sanmon', r'<b>01</b> — Tentang Kami'),
    (r'<span class="k jp">山門</span>', r'<span class="k jp">Info</span>'),
    (r'Charred cypress, worn stone, one gate left open.', r'Aman, transparan, dan ditindaklanjuti.'),
    (r'Kage begins where the city stops: a mountain gate of cedar burned black,\s*standing in its own weather\. The soot is not decoration\. It is how a board is taught to survive a\s*hundred rainy seasons, and the first thing this place asks you to understand\.', r'Layanan BEM UMS adalah kanal resmi yang menghubungkan suara mahasiswa dengan kebijakan kampus. Setiap laporan ditangani secara profesional melalui sistem tiket digital yang aman dan terenkripsi.'),
    (r'Climb the worn steps and the worship hall lifts out of the mist, its paper\s*screens lit from inside like a lantern the size of a house\. Above the eaves a vermilion moon holds\s*its place, patient, half hidden\. Nothing here is in a hurry\. Neither, for the next ninety minutes,\s*are you\.', r'Identitas Anda terlindungi dengan opsi anonim. Pantau progres laporan secara real-time menggunakan kode tiket unik. Tim kementerian akan memverifikasi, menginvestigasi, dan mengawal proses audiensi dengan pihak kampus terkait.'),
    (r'>Cross the threshold<', r'>Mulai Melapor<'),
    (r'<b>05</b><span>Chapters</span>', r'<b>500+</b><span>Laporan Diterima</span>'),
    (r'<b>92</b><span>Minutes</span>', r'<b>430+</b><span>Laporan Selesai</span>'),
    (r'<b>1611</b><span>Hall raised</span>', r'<b>3 Hari</b><span>Rata-rata Respon</span>'),
    (r'<b>∞</b><span>Stillness</span>', r'<b>100%</b><span>Keamanan Data</span>'),
    
    # Chapter II
    (r'<b>02</b> — Still Gardens', r'<b>02</b> — Kategori Layanan'),
    (r'<span class="k jp">庭園</span>', r'<span class="k jp">Kategori</span>'),
    
    (r'<b>Approach</b><span class="jp">参道</span>', r'<b>UKT & Akademik</b><span class="jp">📚</span>'),
    (r'>The long climb<', r'>Keringanan, nilai, kurikulum<'),
    
    (r'<b>Lanterns</b><span class="jp">灯籠</span>', r'<b>Fasilitas</b><span class="jp">🏛️</span>'),
    (r'>Lantern court<', r'>Gedung, WiFi, sarana<'),
    
    (r'<b>Moonwater</b><span class="jp">月影</span>', r'<b>Kemahasiswaan</b><span class="jp">👥</span>'),
    (r'>The wet court<', r'>Organisasi, beasiswa<'),
    
    # Chapter III
    (r'<b>03</b> — Sacred Craft', r'<b>03</b> — Alur Proses'),
    (r'<span class="k jp">手業</span>', r'<span class="k jp">Proses</span>'),
    (r'Five chapters\. Ninety minutes\. One quiet mind\.', r'Empat langkah. Satu tujuan. Suaramu didengar.'),
    (r'Each chapter is a walk, not a lecture\. You arrive at the gate, climb the\s*steps, sit with the lantern, and leave with one thing worth keeping\.', r'Setiap laporan melewati proses yang jelas dan terstruktur. Dari pengiriman hingga resolusi, kami memastikan setiap aspirasi mahasiswa ditangani secara profesional.'),
    
    (r'<h3>The Hidden Gate<em class="jp">山門</em></h3>', r'<h3>Kirim Laporan<em class="jp"></em></h3>'),
    (r'>Why a gate is a sentence, and what you agree to when you walk under one\.<', r'>Isi formulir pelaporan dengan detail keluhan Anda melalui portal digital.<'),
    (r'>14 min<', r'>Langkah 1<'),
    
    (r'<h3>Borrowed Scenery<em class="jp">借景</em></h3>', r'<h3>Verifikasi Tim<em class="jp"></em></h3>'),
    (r'>Shakkei: composing with a mountain you will never own\.<', r'>Tim BEM memverifikasi dan mengkategorikan laporan Anda.<'),
    (r'>18 min<', r'>Langkah 2<'),
    
    (r'<h3>Charred Cypress<em class="jp">焼杉</em></h3>', r'<h3>Proses Audiensi<em class="jp"></em></h3>'),
    (r'>Yakisugi: burning a board black so the weather will let it live\.<', r'>Kementerian mengawal proses audiensi dengan pihak kampus.<'),
    (r'>21 min<', r'>Langkah 3<'),
    
    (r'<h3>Lantern Light<em class="jp">灯籠</em></h3>', r'<h3>Resolusi<em class="jp"></em></h3>'),
    (r'>How a single ember decides the scale of everything around it\.<', r'>Masalah terselesaikan dan laporan ditutup dengan hasil.<'),
    (r'>17 min<', r'>Langkah 4<'),
    
    (r'<h3>The Vermilion Moon<em class="jp">朱月</em></h3>', r'<h3>Evaluasi<em class="jp"></em></h3>'),
    (r'>Why the moon burns red over the valley, and what the garden does with it\.<', r'>Umpan balik dikumpulkan untuk perbaikan layanan berkelanjutan.<'),
    (r'>22 min<', r'>Langkah 5<'),
    
    # Chapter IV
    (r'Chapter 04 — Afterlight', r'Suaramu Penting'),
    (r'<h2 class="display" data-rv="up">Afterlight</h2>', r'<h2 class="display" data-rv="up">LAPOR PRES!!</h2>'),
    (r'The gate does not close behind you\. Take the walk whenever the noise\s*gets loud — it is always the same path, and never the same light\.', r'Jangan biarkan keluhanmu hanya jadi bisikan. Sampaikan aspirasimu sekarang — setiap laporan akan ditindaklanjuti oleh tim BEM UMS.'),
    (r'>Begin the walk<', r'>Buat Laporan Sekarang<'),
    
    # Footer
    (r'<p>A five-chapter night walk through a Kyoto mountain temple\. Three illustrated garden field notes\s*sit inside a live Three\.js sanctuary\.</p>', r'<p>Portal layanan resmi Badan Eksekutif Mahasiswa Universitas Muhammadiyah Surakarta untuk menampung aspirasi dan keluhan mahasiswa.</p>'),
    (r'<h4>Chapters</h4>', r'<h4>Layanan</h4>'),
    (r'>The Sanmon<', r'>Buat Laporan<'),
    (r'>Still Gardens<', r'>Lacak Laporan<'),
    (r'>Sacred Craft<', r'>Kategori<'),
    (r'<li><a href="#eternity" data-cursor>Afterlight</a></li>', r'<li><a href="#eternity" data-cursor>FAQ</a></li>'),
    
    (r'<h4>Practice</h4>', r'<h4>Informasi</h4>'),
    (r'>Borrowed scenery<', r'>Tentang BEM<'),
    (r'>Lantern light<', r'>Kontak<'),
    (r'>Charred cypress<', r'>Kebijakan Privasi<'),
    (r'>Raked gravel<', r'>Panduan<'),
    
    (r'<h4>Elsewhere</h4>', r'<h4>Tautan</h4>'),
    (r'>Journal<', r'>BEM UMS<'),
    (r'>Field notes<', r'>UMS Official<'),
    (r'>Colophon<', r'>Instagram BEM<'),
    
    (r'>© 2026 Kage — Kage no Michi<', r'>© 2026 BEM UMS — Layanan Aspirasi Mahasiswa<'),
    (r'<span class="jp">静けさは一つの技である</span>', r'<span class="jp">Suaramu, Aksi Kami</span>'),
    (r'>WebGL · Onest · Kyoto<', r'>Portal · BEM · UMS<')
]

for src, dst in reps:
    html = re.sub(src, dst, html)

out_path = r'c:\Users\andik\OneDrive\Documents\TEKNIK INFORMATIKA\Project\WEB BEM\Portal web Advokasi\client\public\landing-pages\kage.html'
os.makedirs(os.path.dirname(out_path), exist_ok=True)
with open(out_path, 'w', encoding='utf-8') as f:
    f.write(html)
