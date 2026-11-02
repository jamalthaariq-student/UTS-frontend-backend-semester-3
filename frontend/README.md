🌾 PANDUAN PENHGGUNAAN & CARA KERJA WEBSITE MYTANI

Selamat datang di MyTani, platform digital manajemen pertanian modern yang dirancang untuk membantu petani dan pengelola lahan dalam mencatat, memantau, serta mengoptimalkan hasil pertanian secara terstruktur.

🗂️ DAFTAR ISI

Alur Utama & Gambaran Umum

Fitur Autentikasi (Registrasi & Login)

Dashboard Pertanian & Analisis Metrik

Manajemen Data Lahan (CRUD Lahan)

Manajemen Tanaman & Transaksi Atomik (CRUD Tanaman)

Fitur Pencarian Interaktif (Live Search & Filter)

Pengaturan Profil Pengguna

1. 🔄 ALUR UTAMA & GAMBARAN UMUM

Website MyTani bekerja dengan mengintegrasikan data lahan pertanian dan tanaman komoditas secara relasional:

[ Registrasi / Login ]
         │
         ▼
[ Dashboard Pertanian ] ──► (Memantau Ringkasan & Metrik Real-Time)
         │
         ├───► [ Kelola Lahan ] ──► (Tambah / Edit / Hapus Lahan)
         │
         └───► [ Kelola Tanaman ] 
                    │
                    ├──► Mode Regular: Menambah tanaman pada Lahan Eksisting
                    │
                    └──► Mode Atomik: Membuka Lahan Baru + Tanaman Pertama Sekaligus


2. 🔐 FITUR AUTENTIKASI (REGISTRASI & LOGIN)

A. Registrasi Akun Baru (register.html)

Akses halaman pendaftaran akun.

Masukkan Nama Lengkap, Alamat Email, dan Kata Sandi (minimal 6 karakter).

Isi kolom Konfirmasi Kata Sandi untuk memastikan kesesuaian sandi.

Klik Daftar Akun Baru. Sistem akan memvalidasi kelengkapan data sebelum akun disimpan.

B. Otentikasi Login (index.html)

Masukkan email dan password terdaftar.

Klik Masuk ke Dashboard.

Jika kredensial cocok, sistem akan membuka sesi dan mengarahkan pengguna langsung ke Dashboard Utama.

3. 📊 DASHBOARD PERTANIAN & ANALISIS METRIK (dashboard.html)

Halaman Dashboard memberikan gambaran umum kondisi pertanian Anda secara cepat dan otomatis:

Metrik Ringkasan (Dihitung Real-Time):

Total Luas Lahan: Mengakumulasikan seluruh luas hektar lahan terdaftar.

Tanaman Aktif: Menghitung total jumlah komoditas dan total plot/batang yang sedang ditanam.

Kesehatan Tanaman: Menampilkan persentase tanaman yang berada dalam kondisi "Baik & Subur".

Peta Lahan: Menghitung sebaran wilayah dan lokasi unik dari lahan pertanian Anda.

4. 🌾 MANAJEMEN DATA LAHAN (lands.html)

Halaman ini digunakan untuk mengelola area pertanian yang Anda miliki.

Cara Menambah Lahan Baru:

Masukkan Nama Lahan (contoh: Kebun Jagung Singojuruh).

Pilih Jenis Tanah (contoh: Andosol, Regosol, Alluvial, dll).

Masukkan Luas Lahan dalam satuan Hektar (Ha).

Pilih Status Lahan (Aktif atau Butuh Perhatian).

Isikan Lokasi Lahan (contoh: Singojuruh, Banyuwangi).

Klik Simpan Data Lahan ✨.

Edit & Hapus Lahan:

Edit: Klik tombol Edit ✏️ pada kartu lahan untuk mengubah informasi yang ada, lalu klik simpan.

Hapus: Klik tombol Hapus 🗑️ pada kartu lahan jika lahan sudah tidak digunakan.

5. 🌿 MANAJEMEN TANAMAN & TRANSAKSI ATOMIK (plants.html)

Halaman ini menyediakan dua alur penambahan data tanaman yang dapat disesuaikan dengan kebutuhan:

1️⃣ Mode Regular (Tambah Tanaman di Lahan Eksisting)

Gunakan mode ini jika Anda ingin menambah tanaman baru pada lahan yang sudah terdaftar sebelumnya.

Pilih Lahan Pertanian dari dropdown select.

Isikan Nama Tanaman (contoh: Cabai Rawit).

Pilih Kategori Tanaman (Hortikultura, Tanaman Pangan, atau Perkebunan).

Isikan Jumlah Plot / Batang dan Kondisi Pertumbuhan.

Klik Simpan Data Tanaman ✨.

2️⃣ Mode Atomik (Buka Lahan Baru + Tanaman Pertama Sekaligus)

Gunakan mode ini jika Anda ingin membuka lahan baru dan langsung menanam tanaman pertamanya sekaligus dalam satu alur form tanpa harus berpindah halaman.

Langkah 1: Isi Detail Lahan Baru (Nama Lahan, Jenis Tanah, Luas, dan Lokasi).

Langkah 2: Isi Detail Tanaman Pertama (Nama Tanaman, Kategori, dan Jumlah Plot).

Klik Simpan Lahan & Tanaman (Atomik) ⚡: Sistem akan menyimpan entitas Lahan Baru dan Tanaman Pertama secara serentak. Jika ada kegagalan pada salah satu data, seluruh alur akan dibatalkan untuk menjaga integritas data.

6. 🔍 FITUR PENCARIAN INTERAKTIF (LIVE SEARCH & FILTER)

Untuk memudahkan navigasi saat data pertanian Anda bertambah banyak, MyTani menyediakan pencarian otomatis di Dashboard:

Live Search (Pencarian Real-Time): Ketik nama lahan, lokasi, nama tanaman, atau kategori pada kolom pencarian 🔍 Cari.... Tampilan kartu akan langsung tersaring secara otomatis saat Anda mengetik.

Filter Status: Klik tombol status (seperti Semua, Aktif, Baik, Perlu Pupuk, atau Terserang Hama) untuk menyaring daftar secara instan.

7. ⚙️ PENGATURAN PROFIL PENGGUNA (profile.html)

Melihat Profil: Klik ikon ⚙️ di pojok bawah menu sidebar untuk membuka informasi akun Anda.

Memperbarui Data: Klik Edit Profil, ubah Nama Lengkap atau Alamat Email Anda, lalu simpan perubahan.