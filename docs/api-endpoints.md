# Portal Advokasi Terpadu BEM — Rancangan API Endpoints

> **Base URL**: `/api/v1`  
> **Format Response**: JSON  
> **Auth**: JWT Bearer Token (khusus endpoint admin)

---

## 1. 📋 Publik — Laporan (Tanpa Autentikasi)

Endpoint yang diakses mahasiswa tanpa perlu login.

| Method   | Route                              | Deskripsi                                                                                              |
|----------|-------------------------------------|--------------------------------------------------------------------------------------------------------|
| `GET`    | `/categories`                      | Mengambil daftar semua kategori laporan yang aktif                                                     |
| `POST`   | `/reports`                         | Mengirim laporan baru. Mengembalikan `ticket_code` unik untuk tracking                                |
| `POST`   | `/reports/:ticketCode/attachments` | Upload lampiran bukti pendukung untuk laporan (multipart/form-data)                                   |
| `GET`    | `/reports/track/:ticketCode`       | Melacak status laporan berdasarkan kode tiket. Mengembalikan status, timeline, dan respon publik admin |

### Detail Request/Response

#### `POST /reports` — Submit Laporan Baru
```json
// Request Body
{
  "student_name": "Andi Kurniawan",
  "student_nim": "2201001234",
  "student_email": "andi@student.ac.id",       // opsional
  "student_phone": "08123456789",               // opsional
  "student_faculty": "Teknik",                  // opsional
  "student_program": "Teknik Informatika",      // opsional
  "is_anonymous": true,
  "category_id": 1,
  "subject": "Keringanan UKT Semester Genap",
  "description": "Saya mengajukan keringanan UKT karena..."
}

// Response 201
{
  "success": true,
  "message": "Laporan berhasil dikirim",
  "data": {
    "ticket_code": "ADV-2608-001",
    "status": "menunggu_verifikasi",
    "created_at": "2026-08-10T09:30:00Z"
  }
}
```

#### `GET /reports/track/:ticketCode` — Lacak Laporan
```json
// Response 200
{
  "success": true,
  "data": {
    "ticket_code": "ADV-2608-001",
    "subject": "Keringanan UKT Semester Genap",
    "category": "UKT",
    "status": "sedang_diproses",
    "is_anonymous": true,
    "student_name": null,            // null karena anonim
    "student_nim": null,             // null karena anonim
    "created_at": "2026-08-10T09:30:00Z",
    "updated_at": "2026-08-11T14:00:00Z",
    "resolution_note": null,
    "timeline": [
      {
        "status": "menunggu_verifikasi",
        "note": null,
        "timestamp": "2026-08-10T09:30:00Z"
      },
      {
        "status": "sedang_diproses",
        "note": "Laporan sedang ditinjau oleh Kementerian Advokasi",
        "timestamp": "2026-08-11T14:00:00Z"
      }
    ],
    "public_responses": [
      {
        "content": "Laporan Anda sedang kami proses...",
        "created_at": "2026-08-11T14:05:00Z"
      }
    ]
  }
}
```

---

## 2. 🔐 Autentikasi Admin

| Method   | Route               | Deskripsi                                                   |
|----------|----------------------|--------------------------------------------------------------|
| `POST`   | `/auth/login`       | Login admin dengan username & password, mengembalikan JWT   |
| `POST`   | `/auth/logout`      | Logout admin (invalidate refresh token)                     |
| `GET`    | `/auth/me`          | Mengambil profil admin yang sedang login                    |
| `PUT`    | `/auth/me/password` | Mengubah password admin yang sedang login                   |

### Detail

#### `POST /auth/login`
```json
// Request Body
{
  "username": "superadmin",
  "password": "admin123"
}

// Response 200
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJI...",
    "refresh_token": "dGhpcyBpcyBh...",
    "admin": {
      "id": "uuid",
      "username": "superadmin",
      "full_name": "Administrator BEM",
      "role": "super_admin",
      "department": "Presidium"
    }
  }
}
```

---

## 3. 🎫 Admin — Manajemen Tiket

Semua endpoint di bawah ini memerlukan header `Authorization: Bearer <token>`.

| Method   | Route                                | Deskripsi                                                                                       | Akses              |
|----------|---------------------------------------|-------------------------------------------------------------------------------------------------|---------------------|
| `GET`    | `/admin/tickets`                     | Mengambil semua tiket dengan filter, sorting, dan paginasi                                     | Semua Admin         |
| `GET`    | `/admin/tickets/:id`                 | Detail lengkap satu tiket (identitas tergantung role)                                          | Semua Admin         |
| `PATCH`  | `/admin/tickets/:id/status`          | Memperbarui status tiket                                                                        | Semua Admin         |
| `PATCH`  | `/admin/tickets/:id/priority`        | Memperbarui prioritas tiket (0=normal, 1=penting, 2=urgent)                                    | Semua Admin         |
| `PATCH`  | `/admin/tickets/:id/resolve`         | Menyelesaikan tiket: set status `selesai` + catatan resolusi                                   | Semua Admin         |
| `DELETE` | `/admin/tickets/:id`                 | Hapus tiket secara permanen (hard delete)                                                      | Super Admin Only    |

### Query Parameters untuk `GET /admin/tickets`

| Parameter    | Tipe     | Deskripsi                                      | Contoh                     |
|-------------|----------|------------------------------------------------|----------------------------|
| `page`       | integer  | Halaman ke-n (default: 1)                     | `?page=2`                  |
| `limit`      | integer  | Jumlah per halaman (default: 15, max: 50)     | `?limit=20`                |
| `status`     | string   | Filter by status                               | `?status=sedang_diproses`  |
| `category`   | integer  | Filter by category ID                          | `?category=1`              |
| `priority`   | integer  | Filter by priority (0/1/2)                     | `?priority=2`              |
| `search`     | string   | Cari di subject, description, atau ticket_code | `?search=UKT`              |
| `sort_by`    | string   | Kolom sorting (default: `created_at`)          | `?sort_by=updated_at`      |
| `sort_order` | string   | `asc` atau `desc` (default: `desc`)            | `?sort_order=asc`          |
| `date_from`  | string   | Filter dari tanggal (ISO 8601)                 | `?date_from=2026-08-01`    |
| `date_to`    | string   | Filter sampai tanggal (ISO 8601)               | `?date_to=2026-08-31`      |

### Perilaku Berdasarkan Role

| Kondisi                             | `super_admin`                  | `kementerian`                      |
|--------------------------------------|--------------------------------|-------------------------------------|
| Tiket **bukan** anonim               | Lihat identitas lengkap       | Lihat identitas lengkap            |
| Tiket **anonim** (`is_anonymous=true`)| Lihat identitas lengkap       | Identitas di-mask (`null`)         |
| Hapus tiket                          | ✅ Diizinkan                   | ❌ Ditolak (403)                    |

### Detail

#### `PATCH /admin/tickets/:id/status`
```json
// Request Body
{
  "status": "sedang_diproses",
  "note": "Laporan sedang ditinjau oleh tim advokasi"   // opsional, masuk ke status_logs
}
```

#### `PATCH /admin/tickets/:id/resolve`
```json
// Request Body
{
  "resolution_note": "Keringanan UKT telah disetujui melalui audiensi dengan Wakil Rektor II pada 15 Agustus 2026."
}
```

---

## 4. 💬 Admin — Catatan Tiket

| Method   | Route                              | Deskripsi                                                          |
|----------|-------------------------------------|--------------------------------------------------------------------|
| `GET`    | `/admin/tickets/:id/notes`         | Mengambil semua catatan (internal + publik) pada tiket             |
| `POST`   | `/admin/tickets/:id/notes`         | Menambah catatan baru (internal atau respon publik ke mahasiswa)   |
| `PUT`    | `/admin/tickets/:id/notes/:noteId` | Mengedit catatan yang sudah ada                                    |
| `DELETE` | `/admin/tickets/:id/notes/:noteId` | Menghapus catatan                                                  |

#### `POST /admin/tickets/:id/notes`
```json
// Request Body
{
  "content": "Sudah dikirimkan surat ke Wakil Rektor II, menunggu jadwal audiensi.",
  "is_internal": true     // true = hanya terlihat admin, false = bisa dilihat mahasiswa via tracking
}
```

---

## 5. 📁 Admin — Manajemen Kategori

| Method   | Route                    | Deskripsi                        |
|----------|--------------------------|----------------------------------|
| `GET`    | `/admin/categories`      | Daftar semua kategori (termasuk non-aktif) |
| `POST`   | `/admin/categories`      | Tambah kategori baru             |
| `PUT`    | `/admin/categories/:id`  | Update kategori                  |
| `PATCH`  | `/admin/categories/:id/toggle` | Toggle aktif/non-aktif kategori |
| `DELETE` | `/admin/categories/:id`  | Hapus kategori (jika tidak ada tiket terkait) |

---

## 6. 📊 Admin — Dashboard & Statistik

| Method   | Route                      | Deskripsi                                                              |
|----------|----------------------------|-------------------------------------------------------------------------|
| `GET`    | `/admin/stats/overview`    | Ringkasan: total tiket, per status, per kategori, rata-rata waktu resolusi |
| `GET`    | `/admin/stats/trends`      | Data tren bulanan untuk grafik (jumlah tiket per bulan, 12 bulan terakhir) |
| `GET`    | `/admin/stats/categories`  | Distribusi tiket per kategori (untuk pie/bar chart)                    |

#### `GET /admin/stats/overview`
```json
// Response 200
{
  "success": true,
  "data": {
    "total_tickets": 156,
    "by_status": {
      "menunggu_verifikasi": 12,
      "sedang_diproses": 28,
      "tahap_audiensi": 5,
      "selesai": 111
    },
    "by_priority": {
      "normal": 130,
      "penting": 20,
      "urgent": 6
    },
    "avg_resolution_hours": 72.5,
    "tickets_this_month": 23,
    "anonymous_percentage": 34.6
  }
}
```

---

## 7. 👤 Admin — Manajemen User (Super Admin Only)

| Method   | Route                         | Deskripsi                                      |
|----------|-------------------------------|-------------------------------------------------|
| `GET`    | `/admin/users`                | Daftar semua admin                             |
| `POST`   | `/admin/users`                | Buat akun admin baru                           |
| `PUT`    | `/admin/users/:id`            | Update data admin                              |
| `PATCH`  | `/admin/users/:id/toggle`     | Aktifkan/nonaktifkan akun admin                |
| `DELETE` | `/admin/users/:id`            | Hapus akun admin                               |

---

## Catatan Arsitektural

### Middleware yang Perlu Dibuat
1. **`authMiddleware`** — Verifikasi JWT token, inject `req.admin`
2. **`roleMiddleware(roles[])`** — Cek apakah `req.admin.role` ada di list yang diizinkan
3. **`anonymityFilter`** — Middleware/helper yang otomatis mask data identitas pada tiket anonim jika role bukan `super_admin`
4. **`rateLimiter`** — Rate limiting untuk endpoint publik (mencegah spam laporan)
5. **`uploadMiddleware`** — Handle multipart/form-data untuk upload lampiran (gunakan `multer`)
6. **`validationMiddleware`** — Validasi request body (gunakan `joi` atau `zod`)

### Struktur Folder Express.js (Rekomendasi)
```
server/
├── src/
│   ├── config/
│   │   ├── database.js          # Koneksi PostgreSQL (pg / knex)
│   │   └── env.js               # Environment variables
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   ├── role.js              # Role-based access control
│   │   ├── anonymity.js         # Mask identitas anonim
│   │   ├── rateLimiter.js       # Rate limiting
│   │   ├── upload.js            # Multer config
│   │   └── validate.js          # Request validation
│   ├── routes/
│   │   ├── index.js             # Route aggregator
│   │   ├── public.routes.js     # GET /categories, POST /reports, GET /track
│   │   ├── auth.routes.js       # POST /login, /logout, GET /me
│   │   ├── ticket.routes.js     # Admin ticket management
│   │   ├── note.routes.js       # Admin notes
│   │   ├── category.routes.js   # Admin category management
│   │   ├── stats.routes.js      # Dashboard statistics
│   │   └── user.routes.js       # Admin user management (super_admin)
│   ├── controllers/
│   │   ├── public.controller.js
│   │   ├── auth.controller.js
│   │   ├── ticket.controller.js
│   │   ├── note.controller.js
│   │   ├── category.controller.js
│   │   ├── stats.controller.js
│   │   └── user.controller.js
│   ├── services/                # Business logic layer
│   │   ├── ticket.service.js
│   │   ├── auth.service.js
│   │   └── stats.service.js
│   ├── utils/
│   │   ├── ticketCode.js        # Generate kode tiket
│   │   ├── response.js          # Standardized API response helper
│   │   └── errors.js            # Custom error classes
│   └── app.js                   # Express app setup
├── .env
├── package.json
└── server.js                    # Entry point
```

### Format Response Standar
```json
// Success
{
  "success": true,
  "message": "Deskripsi aksi",
  "data": { ... },
  "meta": {                          // hanya untuk paginated response
    "page": 1,
    "limit": 15,
    "total_items": 156,
    "total_pages": 11
  }
}

// Error
{
  "success": false,
  "message": "Deskripsi error",
  "errors": [                       // opsional, untuk validation errors
    { "field": "student_name", "message": "Nama wajib diisi" }
  ]
}
```

### HTTP Status Codes yang Digunakan
| Code  | Penggunaan                                  |
|-------|----------------------------------------------|
| `200` | Request berhasil                            |
| `201` | Resource berhasil dibuat (POST)             |
| `400` | Bad request / validation error              |
| `401` | Unauthorized (token tidak valid / expired)  |
| `403` | Forbidden (role tidak memiliki akses)       |
| `404` | Resource tidak ditemukan                    |
| `409` | Conflict (misal: kategori dengan slug sama) |
| `429` | Too many requests (rate limited)            |
| `500` | Internal server error                       |
