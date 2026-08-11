-- ============================================================
-- PORTAL ADVOKASI TERPADU BEM
-- Database Schema for PostgreSQL
-- Version: 1.0.0
-- ============================================================

-- ============================================================
-- 1. EXTENSIONS & CUSTOM TYPES
-- ============================================================

-- UUID generator (bawaan PostgreSQL 13+)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enum untuk status tiket (mengikuti alur bisnis)
CREATE TYPE ticket_status AS ENUM (
  'menunggu_verifikasi',   -- Laporan baru masuk, belum ditinjau
  'sedang_diproses',       -- Sedang ditangani oleh kementerian
  'tahap_audiensi',        -- Sudah masuk tahap audiensi dengan pihak terkait
  'selesai'                -- Laporan telah selesai ditindaklanjuti
);

-- Enum untuk role admin
CREATE TYPE admin_role AS ENUM (
  'super_admin',           -- Ketua/Wakil BEM, bisa akses identitas anonim
  'kementerian'            -- Staff kementerian, TIDAK bisa lihat identitas anonim
);

-- ============================================================
-- 2. TABEL: categories
-- Deskripsi: Kategori laporan (UKT, Fasilitas, Akademik, dll)
-- ============================================================

CREATE TABLE categories (
  id            SERIAL        PRIMARY KEY,
  name          VARCHAR(100)  NOT NULL UNIQUE,       -- "UKT", "Fasilitas Kampus", "Akademik"
  slug          VARCHAR(100)  NOT NULL UNIQUE,       -- "ukt", "fasilitas-kampus", "akademik"
  description   TEXT,                                 -- Deskripsi singkat kategori
  icon          VARCHAR(50)   DEFAULT 'folder',      -- Nama icon untuk frontend
  is_active     BOOLEAN       DEFAULT TRUE,           -- Soft toggle kategori
  display_order INTEGER       DEFAULT 0,              -- Urutan tampilan di frontend
  created_at    TIMESTAMPTZ   DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   DEFAULT NOW()
);

COMMENT ON TABLE categories IS 'Kategori laporan advokasi (UKT, Fasilitas, Akademik, dll)';

-- ============================================================
-- 3. TABEL: admins
-- Deskripsi: Akun admin kementerian BEM untuk panel admin
-- ============================================================

CREATE TABLE admins (
  id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  username      VARCHAR(50)   NOT NULL UNIQUE,
  email         VARCHAR(150)  NOT NULL UNIQUE,
  password_hash VARCHAR(255)  NOT NULL,              -- Hashed dengan bcrypt
  full_name     VARCHAR(100)  NOT NULL,
  role          admin_role    NOT NULL DEFAULT 'kementerian',
  department    VARCHAR(100),                         -- Nama kementerian (misal: "Advokasi & Kesejahteraan")
  avatar_url    VARCHAR(500),
  is_active     BOOLEAN       DEFAULT TRUE,
  last_login_at TIMESTAMPTZ,
  created_at    TIMESTAMPTZ   DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   DEFAULT NOW()
);

COMMENT ON TABLE admins IS 'Akun admin panel kementerian BEM';

-- ============================================================
-- 4. TABEL: tickets (TABEL UTAMA)
-- Deskripsi: Data laporan/tiket dari mahasiswa
-- ============================================================

CREATE TABLE tickets (
  id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_code     VARCHAR(20)     NOT NULL UNIQUE,   -- Format: ADV-YYMM-XXX (misal: ADV-2608-001)

  -- ── Identitas Mahasiswa (selalu tersimpan, tersembunyi jika anonim) ──
  student_name    VARCHAR(150)    NOT NULL,           -- Nama lengkap mahasiswa
  student_nim     VARCHAR(20)     NOT NULL,           -- Nomor Induk Mahasiswa
  student_email   VARCHAR(150),                       -- Email kampus (opsional)
  student_phone   VARCHAR(20),                        -- No. WhatsApp (opsional)
  student_faculty VARCHAR(100),                       -- Fakultas
  student_program VARCHAR(100),                       -- Program Studi

  -- ── Opsi Anonimitas ──
  is_anonymous    BOOLEAN         DEFAULT FALSE,      -- TRUE = identitas disembunyikan di publik & admin kementerian

  -- ── Detail Laporan ──
  category_id     INTEGER         NOT NULL REFERENCES categories(id) ON UPDATE CASCADE,
  subject         VARCHAR(255)    NOT NULL,           -- Judul/perihal laporan
  description     TEXT            NOT NULL,           -- Isi laporan lengkap

  -- ── Status & Penanganan ──
  status          ticket_status   NOT NULL DEFAULT 'menunggu_verifikasi',
  priority        SMALLINT        DEFAULT 0           -- 0=normal, 1=penting, 2=urgent
                                  CHECK (priority BETWEEN 0 AND 2),

  -- ── Penyelesaian ──
  resolution_note TEXT,                               -- Catatan penyelesaian akhir
  resolved_at     TIMESTAMPTZ,                        -- Kapan diselesaikan
  resolved_by     UUID            REFERENCES admins(id) ON SET NULL,

  -- ── Metadata ──
  created_at      TIMESTAMPTZ     DEFAULT NOW(),
  updated_at      TIMESTAMPTZ     DEFAULT NOW()
);

COMMENT ON TABLE tickets IS 'Tabel utama laporan/tiket advokasi mahasiswa';
COMMENT ON COLUMN tickets.is_anonymous IS 'Jika TRUE, identitas mahasiswa disembunyikan dari tampilan publik dan admin role kementerian';
COMMENT ON COLUMN tickets.ticket_code IS 'Kode tiket unik format ADV-YYMM-XXX untuk tracking publik tanpa login';

-- ============================================================
-- 5. TABEL: ticket_attachments
-- Deskripsi: Lampiran bukti pendukung laporan
-- ============================================================

CREATE TABLE ticket_attachments (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id   UUID          NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  file_url    VARCHAR(500)  NOT NULL,               -- Path/URL file yang diupload
  file_name   VARCHAR(255)  NOT NULL,               -- Nama file asli
  file_type   VARCHAR(100),                          -- MIME type (image/jpeg, application/pdf, dll)
  file_size   INTEGER,                               -- Ukuran file dalam bytes
  created_at  TIMESTAMPTZ   DEFAULT NOW()
);

COMMENT ON TABLE ticket_attachments IS 'Lampiran bukti pendukung yang diunggah mahasiswa bersama laporan';

-- ============================================================
-- 6. TABEL: status_logs
-- Deskripsi: Audit trail setiap perubahan status tiket
-- ============================================================

CREATE TABLE status_logs (
  id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id       UUID            NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  previous_status ticket_status,                     -- NULL jika status pertama (baru dibuat)
  new_status      ticket_status   NOT NULL,
  changed_by      UUID            REFERENCES admins(id) ON SET NULL,  -- NULL jika oleh sistem
  note            TEXT,                               -- Catatan perubahan status
  created_at      TIMESTAMPTZ     DEFAULT NOW()
);

COMMENT ON TABLE status_logs IS 'Log perubahan status tiket sebagai audit trail';

-- ============================================================
-- 7. TABEL: admin_notes
-- Deskripsi: Catatan internal atau respon publik dari admin
-- ============================================================

CREATE TABLE admin_notes (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id   UUID          NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  admin_id    UUID          NOT NULL REFERENCES admins(id) ON SET NULL,
  content     TEXT          NOT NULL,               -- Isi catatan
  is_internal BOOLEAN       DEFAULT TRUE,           -- TRUE = catatan internal antar admin
                                                     -- FALSE = respon publik (bisa dilihat pelapor)
  created_at  TIMESTAMPTZ   DEFAULT NOW(),
  updated_at  TIMESTAMPTZ   DEFAULT NOW()
);

COMMENT ON TABLE admin_notes IS 'Catatan admin pada tiket. is_internal=TRUE hanya terlihat sesama admin';

-- ============================================================
-- 8. INDEXES (Optimisasi Query)
-- ============================================================

-- Tickets: lookup by ticket_code (tracking publik) — paling kritis
CREATE INDEX idx_tickets_ticket_code ON tickets (ticket_code);

-- Tickets: filter by status (dashboard admin)
CREATE INDEX idx_tickets_status ON tickets (status);

-- Tickets: filter by category
CREATE INDEX idx_tickets_category_id ON tickets (category_id);

-- Tickets: sorting by tanggal (laporan terbaru)
CREATE INDEX idx_tickets_created_at ON tickets (created_at DESC);

-- Tickets: composite index untuk query admin yang sering (status + category + date)
CREATE INDEX idx_tickets_status_category_date ON tickets (status, category_id, created_at DESC);

-- Tickets: filter by NIM (untuk cek duplikat laporan)
CREATE INDEX idx_tickets_student_nim ON tickets (student_nim);

-- Status Logs: lookup by ticket
CREATE INDEX idx_status_logs_ticket_id ON status_logs (ticket_id);

-- Admin Notes: lookup by ticket
CREATE INDEX idx_admin_notes_ticket_id ON admin_notes (ticket_id);

-- Attachments: lookup by ticket
CREATE INDEX idx_attachments_ticket_id ON ticket_attachments (ticket_id);

-- ============================================================
-- 9. TRIGGER: auto-update `updated_at`
-- ============================================================

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_tickets_updated_at
  BEFORE UPDATE ON tickets
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trg_admins_updated_at
  BEFORE UPDATE ON admins
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trg_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trg_admin_notes_updated_at
  BEFORE UPDATE ON admin_notes
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- ============================================================
-- 10. FUNCTION: Generate Ticket Code
-- Format: ADV-YYMM-XXX
-- Contoh: ADV-2608-001 (tahun 2026, bulan 08, urutan 001)
-- ============================================================

CREATE OR REPLACE FUNCTION generate_ticket_code()
RETURNS VARCHAR(20) AS $$
DECLARE
  prefix      VARCHAR(4) := 'ADV-';
  year_month  VARCHAR(4);
  seq_number  INTEGER;
  new_code    VARCHAR(20);
BEGIN
  -- Format: YYMM dari tanggal sekarang
  year_month := TO_CHAR(NOW(), 'YYMM');

  -- Hitung jumlah tiket di bulan ini + 1
  SELECT COUNT(*) + 1 INTO seq_number
  FROM tickets
  WHERE ticket_code LIKE prefix || year_month || '-%';

  -- Gabungkan menjadi kode tiket: ADV-2608-001
  new_code := prefix || year_month || '-' || LPAD(seq_number::TEXT, 3, '0');

  RETURN new_code;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 11. SEED DATA: Kategori Default
-- ============================================================

INSERT INTO categories (name, slug, description, icon, display_order) VALUES
  ('UKT',               'ukt',               'Keluhan terkait Uang Kuliah Tunggal, keringanan, dan pembayaran',   'banknotes',    1),
  ('Fasilitas Kampus',   'fasilitas-kampus',   'Keluhan terkait gedung, laboratorium, WiFi, dan sarana prasarana',  'building',     2),
  ('Akademik',           'akademik',           'Keluhan terkait perkuliahan, dosen, kurikulum, dan nilai',         'academic-cap', 3),
  ('Kemahasiswaan',      'kemahasiswaan',      'Keluhan terkait organisasi, beasiswa, dan kegiatan mahasiswa',     'users',        4),
  ('Birokrasi',          'birokrasi',          'Keluhan terkait pelayanan administrasi dan birokrasi kampus',      'document',     5),
  ('Lainnya',            'lainnya',            'Keluhan lain yang tidak termasuk kategori di atas',                'ellipsis',     6);

-- ============================================================
-- 12. SEED DATA: Super Admin Default
-- Password: admin123 (HARUS diganti setelah deploy!)
-- Hash ini menggunakan bcrypt, generate ulang saat seeding sebenarnya
-- ============================================================

-- INSERT INTO admins (username, email, password_hash, full_name, role, department) VALUES
--   ('superadmin', 'bem@university.ac.id', '$2b$12$PLACEHOLDER_HASH', 'Administrator BEM', 'super_admin', 'Presidium');
