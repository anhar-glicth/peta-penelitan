# peta-penelitian

Aplikasi Peta Penelitian Ekologi Mangrove dan Perairan Teluk Jor, Jerowaru, Lombok Timur, NTB.

Aplikasi ini menggunakan **Leaflet.js** untuk pemetaan interaktif SIG dan **Chart.js** untuk visualisasi parameter lingkungan stasiun penelitian secara real-time. Dilengkapi fitur ekspor cetak peta berstandar kartografi formal (A4 Landscape).

## Fitur Utama
- **Pemetaan Interaktif**: Zooming, panning, detail marker stasiun sampling dan plot penelitian (3x3 m, jarak 5 m).
- **Multi Basemap**: Ganti tampilan peta ke Citra Satelit (Esri World Imagery), OpenStreetMap, atau Topografi.
- **Grafik Parameter Lingkungan**: Menampilkan komposisi vegetasi mangrove dominan per stasiun.
- **Layout Cetak Kartografi**: Ekspor peta berbingkai lengkap dengan Inset Lombok, Kompas Arah Mata Angin, Skala Batang Grafis/Angka, Legenda resmi, dan kolom nama peneliti yang bisa disunting.

## Cara Menjalankan Secara Lokal
Untuk menjalankan server lokal di Windows menggunakan PowerShell:
```powershell
powershell -ExecutionPolicy Bypass -File server.ps1
```
Buka browser dan kunjungi `http://localhost:8080/`.
