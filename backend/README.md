⚙️ CARA KERJA & ALUR EXECUTION BACKEND REST API MYTANI

Dokumen ini menjelaskan alur perjalanan data (Data Flow) pada backend Flask MyTani, mulai dari HTTP Request yang dikirim oleh klien (Postman/Frontend), melewati setiap lapisan (Layered Architecture), hingga dieksekusi ke Database MySQL.

🗂️ DAFTAR ISI

Gambaran Umum Arsitektur (Layered Architecture)

Alur Perjalanan Request HTTP (Step-by-Step Flow)

Alur Transaksi Atomik (ACID / Lahan + Tanaman Sekaligus)

Alur Paginasi & Pencarian Live (.ilike())

Standarisasi Respons JSON (JSend Format)

1. 🏗️ GAMBARAN UMUM ARSITEKTUR (LAYERED ARCHITECTURE)

Backend MyTani dirancang menggunakan Separation of Concerns (SoC) dengan 4 lapisan utama:

[ Client / Postman / Frontend ]
               │
               ▼  (HTTP Request JSON)
[ 1. ROUTES LAYER ] ──────────► Menangani URL Endpoint, Method, & Request Body
               │
               ▼  (Data Dict / Parameters)
[ 2. SERVICES LAYER ] ────────► Tempat Logika Bisnis, Validasi Input, & Transaksi ACID
               │
               ▼  (Query Parameters / Model Entities)
[ 3. REPOSITORIES LAYER ] ────► Tempat Operasi CRUD Query SQLAlchemy ORM
               │
               ▼  (SQL Query)
[ 4. MODELS / DATABASE ] ─────► Tabel MySQL (users, lands, plants)


2. 🔄 ALUR PERJALANAN REQUEST HTTP (STEP-BY-STEP FLOW)

Contoh Kasus: Tambah Lahan Baru (POST /api/v1/lands)

Client (Postman/Frontend)

Mengirim request POST http://127.0.0.1:5000/api/v1/lands dengan bawaan JSON Body:

{
  "land_name": "Kebun Sayur Singojuruh",
  "soil_type": "Andosol",
  "area_size": 2.5,
  "location": "Singojuruh, Banyuwangi",
  "user_id": 1
}


Routes Layer (land_routes.py)

Menangkap endpoint /api/v1/lands.

Mengambil data JSON menggunakan request.get_json().

Mengirimkan data ke LandService.create_land(data).

Services Layer (land_service.py)

Validasi Data Input:

Cek apakah land_name diisi?

Cek apakah area_size > 0?

Cek apakah user_id terdaftar di tabel users?

Jika validasi lolos, memanggil LandRepository.create(...).

Repositories Layer (land_repository.py)

Membuat instansiasi dari ORM Model Land(...).

Mengisi field land_name, soil_type, area_size, location, user_id.

Memanggil db.session.add(new_land) dan db.session.commit().

Models & Database (land_model.py -> MySQL)

SQLAlchemy mengonversi objek Land menjadi SQL Query:
INSERT INTO lands (land_name, soil_type, area_size, location, user_id) VALUES (...)

MySQL menyimpan data dan mengembalikan ID Primary Key baru.

Response Helper (response_helper.py)

Service mengembalikan data dalam format dict ke Route.

Route membungkus data menggunakan success_response(...) format JSend (201 Created).

Client menerima respons akhir JSON.

3. ⚡ ALUR TRANSAKSI ATOMIK (POST /api/v1/plants/atomic)

Transaksi Atomik digunakan saat kita ingin membuka Lahan Baru sekaligus menanam Tanaman Pertama dalam 1 alur HTTP Request tanpa takut terjadi data parsial/setengah jadi (All or Nothing).

1. Request Masuk (JSON: Data Lahan + Data Tanaman)
                    │
                    ▼
2. db.session.add(new_land)
                    │
                    ▼
3. db.session.flush() ───► Simpan sementara di buffer session & dapatkan new_land.id
                    │
                    ▼
4. db.session.add(new_plant) (Menggunakan land_id = new_land.id)
                    │
        ┌───────────┴───────────┐
        │                       │
 [ 100% Sukses ]          [ Ada Error ]
        │                       │
        ▼                       ▼
5. db.session.commit()  5. db.session.rollback()
(Simpan Permanen ke DB)  (Batal Total! Tidak ada data
                         tersimpan di MySQL)


Mengapa Digunakan flush() Dulu Sebelum commit()?

flush(): Mengirimkan query INSERT Lahan ke buffer MySQL tanpa mempermanenkannya. Ini membuat kita bisa langsung mengambil ID Lahan (new_land.id) untuk dipasang sebagai Foreign Key pada Tanaman.

commit(): Mempermanenkan kedua perubahan sekaligus setelah Lahan dan Tanaman siap.

rollback(): Jika input Tanaman gagal/eror, fungsi rollback akan menghapus perintah INSERT Lahan di buffer tadi, sehingga database MySQL tetap bersih.

4. 🔍 ALUR PAGINASI & PENCARIAN LIVE (.ilike())

Endpoint: GET /api/v1/lands?page=1&per_page=5&search=Singojuruh

Parameter Handling (Routes)

Route membaca query params: page=1, per_page=5, search="Singojuruh".

Query Filtering (Repository)

Query SQLAlchemy disusun dengan kondisi dinamis:

query = Land.query
if search:
    query = query.filter(
        Land.land_name.ilike(f"%{search}%") | 
        Land.location.ilike(f"%{search}%")
    )


.ilike() memastikan pencarian case-insensitive (tidak membedakan huruf besar/kecil).

Paginasi Execution

Menjalankan .paginate(page=1, per_page=5, error_out=False).

Pembentukan Metadata Paginasi (Service)

Menyusun respons metadata untuk kebutuhan navigasi tombol di frontend:

"pagination": {
  "current_page": 1,
  "per_page": 5,
  "total_items": 1,
  "total_pages": 1
}


5. 📬 STANDARISASI RESPONS JSON (JSend Format)

Seluruh output API dibungkus oleh helper response_helper.py agar format responsnya seragam di seluruh endpoint:

Format Sukses (200 OK / 201 Created):

{
  "status": "success",
  "message": "Pesan keberhasilan",
  "data": { ... }
}


Format Gagal Validasi Input (400 Bad Request / 404 Not Found):

{
  "status": "fail",
  "data": {
    "field_name": "Pesan kesalahan validasi"
  }
}


Format Error Server (500 Internal Server Error):

{
  "status": "error",
  "message": "Pesan kesalahan dari server/database"
}



Dokumen penjelasan alur kerja backend ini sudah diperbarui di editor. File ini menjelaskan secara gamblang tentang arsitektur layer, perjalanan request HTTP, alur transaksi atomik ACID (`flush` & `commit`), paginasi, hingga format JSON yang dikembalikan server.
