# GitHub Repository Explorer 🚀

Web app berbasis React untuk mencari profil GitHub dan mengeksplorasi repositori. Dibangun menggunakan Vite dan Tailwind CSS. Dilengkapi dengan optimasi *caching* dan pemantauan limit API GitHub secara *real-time*.

## ✨ Fitur Utama
- **View**: Tampilan responsive untuk *desktop* dan *mobile*
- **User Search**: Cari profil berdasarkan *username*.
- **Top Repositories**: Menampilkan list repo yang diurutkan berdasar jumlah *star* tertinggi.
- **Repository Details**: 
  - *Render* dokumen `README.md` secara *native*.
  - Menampilkan *metrics*: jumlah kontributor, bahasa pemrograman, dan *file tree*.
- **Rate Limit Tracker**: *Custom fetch interceptor* untuk memonitor `x-ratelimit-remaining` di *footer*.
- **Client-Side Caching**: Implementasi `sessionStorage` untuk mereduksi *request* redundan dan menghemat limit API.

## 🛠️ Tech Stack
- **Core**: React 18 (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Data Fetching**: Native `fetch` API

## 📦 Getting Started

### Prerequisites
- Node.js (v18+)
- npm / yarn / pnpm
- git

### Installation
1. *Clone* repositori:
   ```bash
   git clone https://github.com/masprast/maspion-react.git
   cd maspion-react
   ```
2. *Install dependencies*:
   ```bash
   npm install
   ```
3. *Start development server*:
   ```bash
   npm run dev
   ```

## 🧪 Testing & Verifikasi
Verifikasi fitur-fitur utama aplikasi di *environment* lokal:
1. Buka aplikasi di browser (`http://localhost:5173`).
2. Ketik *username* secara acak di *search bar*.
3. Kemudian klik salah satu repositori dari *username* tersebut untuk melihat detailnya.
4. Lakukan langkah nomor 2 & 3 untuk memverifikasi fungsionalitas *cache* (API tidak akan dipanggil ulang).
5. Perhatikan *footer* yang secara otomatis meng-*update* sisa *limit* API yang di-*parsing* dari *response headers* GitHub.

## 🎥 Demo
Demo dari web app ini dapat dicoba di [**maspion-react.vercel.app**](https://maspion-react.vercel.app/)

Berikut adalah video demo dari web app ini: