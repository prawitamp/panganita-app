# Panganita — Sahabat Gizi & Panen Ibu Nusantara

> **Tugas Akhir & Demo Day — Kelompok 10 (Malahayati)**  
> **Beasiswa Bootcamp AI Fullstack Web Development**  
> *Program Perempuan Inovasi x Markoding x IBM SkillsBuild*

---

## 📌 Tentang Proyek

**Panganita** adalah aplikasi web pendamping keluarga (khususnya para ibu di daerah pelosok/pesisir seperti Teluk Bintuni, Papua Barat) untuk mengoptimalkan potensi pangan pekarangan dan kolam lokal guna **mencegah stunting pada 1.000 Hari Pertama Kehidupan (HPK)**. 

Aplikasi ini mengintegrasikan panduan kader Posyandu dan Bidan Desa dengan fitur-fitur praktis yang ramah pengguna:
1. **Onboarding & Profil Keluarga**: Pendataan kelompok rentan (Balita 0-36 bulan, Ibu Hamil/Menyusui, Anak Usia Sekolah) dan komoditas pekarangan utama.
2. **Pemindai AI Vision Pekarangan**: Deteksi estimasi berat hasil panen (ikan lele/kakap, sayuran) langsung dari wadah panen.
3. **Simulator Keputusan Pangan & Gizi (Tumbuh1000)**: Simulasi trade-off ekonomi vs gizi—menunjukkan dampak nyata menyisihkan sebagian panen (misal 0.5 kg lele untuk balita) dibanding menjual semuanya.
4. **Resep MPASI Lokal Bebas Duri**: Panduan olahan bernutrisi tinggi (seperti Abon Lele Bumbu Kuning & Papeda Ikan Kuah Kuning) lengkap dengan panduan audio suara Posyandu.
5. **Edukasi Gizi 1.000 HPK (Literasi Suara Posyandu Babo)**: Konten edukasi berbasis audio yang ramah bagi ibu tanpa perlu membaca teks panjang.
6. **Konseling Chat Interaktif Bu Nita (Bidan Desa)**: Konsultasi kesehatan dan takaran porsi pangan pekarangan secara cepat.

---

## 🛠️ Tech Stack

Aplikasi ini dibangun menggunakan arsitektur modern sesuai kurikulum bootcamp:

- **Framework**: [Next.js (App Router)](https://nextjs.org/)
- **UI Library**: React 19
- **Styling**: Tailwind CSS & Vanilla Custom System (100% presisi sesuai desain Figma)
- **State Management**: React Context API (`PanganitaContext`)
- **Bahasa**: JavaScript (ES6+ / JSX)
- **Backend Ready**: Next.js Route Handlers (`app/api/`) & In-Memory Database (`lib/db.js`)

---

## 📁 Struktur Direktori

```text
panganita/
├── public/
│   └── assets/                     # Seluruh aset visual (SVG, PNG) dari desain Figma
├── src/
│   ├── app/                        # Next.js App Router (Materi FE Live 1-3 & BE Live 1-5)
│   │   ├── layout.jsx              # Root Layout & Metadata
│   │   ├── globals.css             # Desain & Styling sistem visual
│   │   ├── page.jsx                # Halaman utama aplikasi (orchestrator)
│   │   ├── beranda/page.jsx        # Route halaman Beranda
│   │   ├── scanner/page.jsx        # Route halaman Pemindai AI
│   │   ├── simulator/page.jsx      # Route halaman Simulator Keputusan
│   │   ├── pangan-lokal/page.jsx   # Route informasi Gizi Pangan Lokal
│   │   ├── resep/page.jsx          # Route Resep MPASI Lokal
│   │   ├── edukasi/page.jsx        # Route Edukasi Suara 1000 HPK
│   │   ├── bu-nita/page.jsx        # Route Chat Konseling Bidan Desa
│   │   ├── profil/page.jsx         # Route Pengaturan Profil Keluarga
│   │   └── api/                    # REST API Route Handlers
│   │       ├── profile/route.js    # Endpoint pengelolaan profil
│   │       ├── favorites/route.js  # Endpoint data favorit
│   │       └── chat/route.js       # Endpoint pesan & konseling
│   ├── components/                 # Komponen UI modular & reusable
│   │   ├── common/                 # Header, BottomNav, Logo, LeafIcon, Progress
│   │   ├── onboarding/             # WelcomeScreen, ProfileSetup, HarvestSetup
│   │   ├── home/                   # GreetingCard, HpkBanner, FeatureGrid, DailyRecipe
│   │   ├── scanner/                # ScannerScreen, CameraView, DetectionCard
│   │   ├── simulator/              # SimulatorScreen, TradeoffCard, NitaTipAside
│   │   ├── decision/               # DecisionResultScreen, ImpactGrid, CashAnalysis
│   │   ├── food/                   # LocalFoodScreen, FoodCategoryFilter
│   │   ├── recipes/                # RecipesScreen, FeaturedRecipe, KitchenTip
│   │   ├── education/              # EducationScreen, AudioCard, ConsultAside
│   │   ├── profile/                # ProfilePageScreen, FamilyConditionGroup
│   │   └── chat/                   # NitaChatScreen, ChatBubble, ChatInputBar
│   ├── context/
│   │   └── PanganitaContext.jsx    # Global State Management (React Context)
│   ├── data/                       # Mock dataset terstruktur
│   │   ├── familyOptions.js        # Pilihan kondisi sasaran gizi
│   │   ├── harvestOptions.js       # Pilihan komoditas pekarangan
│   │   ├── localFoods.js           # Data nilai gizi pangan lokal
│   │   ├── recipes.js              # Data resep olahan lokal MPASI
│   │   ├── educationItems.js       # Data materi edukasi audio
│   │   └── initialChat.js          # Data riwayat percakapan awal
│   ├── constants/
│   │   └── assets.js               # Helper jalur aset dan ikon
│   ├── lib/
│   │   └── db.js                   # In-memory database helper (CRUD ready)
│   └── middleware.js               # Middleware logging & request matcher
├── package.json
└── jsconfig.json
```

---

## 🚀 Cara Menjalankan Proyek

1. **Pastikan Node.js terpasang** (disarankan v20+):
   ```bash
   node -v
   ```

2. **Jalankan development server**:
   ```bash
   npm run dev
   ```

3. **Buka di peramban**:
   Akses [http://localhost:3000](http://localhost:3000)

4. **Build untuk production**:
   ```bash
   npm run build
   npm run start
   ```

---

## 👥 Kelompok 10 — Malahayati
- Proyek Tugas Akhir Bootcamp AI Fullstack Web Development (Perempuan Inovasi 2026)
