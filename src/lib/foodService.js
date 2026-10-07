/**
 * Layanan Data Gizi Pangan Lokal Berdasarkan Wilayah
 * Menghasilkan rekomendasi komoditas pangan lokal bernutrisi tinggi pencegah stunting
 * yang disesuaikan secara real-time dengan letak geografis/kabupaten/kota pengguna
 * tanpa memerlukan input manual dari peran admin.
 */

// Data Pangan Lokal Nusantara Berdasarkan Wilayah
const REGIONAL_KNOWLEDGE_BASE = {
  banten: {
    regionName: "Kab. Pandeglang & Pesisir Banten",
    ecosystem: "Pesisir Selat Sunda & Agraris Vulkanik Gunung Karang",
    commodities: [
      {
        id: "kakap-merah-sunda",
        title: "Ikan Kakap Merah Selat Sunda",
        name: "Ikan Kakap Merah Selat Sunda",
        category: "seafood",
        categoryLabel: "Lauk Hewani",
        source: "PESISIR SELAT SUNDA",
        image: "bd6ad.png",
        description:
          "Tangkapan nelayan pesisir Pandeglang & Selat Sunda. Kaya protein padat dan asam lemak tak jenuh ganda (DHA/EPA) untuk percepatan sinaps otak balita 1000 HPK.",
        nutrients: ["Tinggi Protein (20.5g)", "Kaya Omega-3 DHA", "Asam Folat Otak", "Zat Besi Alami"],
        portion: "Takaran MPASI: 1 Potong (50g) Cincang Halus",
        proteinPer100g: "20.5g",
        calories: "128 kkal",
        omega3: "Sangat Tinggi (DHA & EPA)",
        pricePerKg: 42000,
        stuntingBenefit: "Mendukung volume otak maksimal & percepatan tinggi badan",
        aiInsight: "Kukus dengan sedikit jahe atau parutan bawang putih agar aroma amis hilang dan asam lemak esensial tidak rusak.",
      },
      {
        id: "lele-pekarangan-banten",
        title: "Ikan Lele Kolam Pekarangan",
        name: "Ikan Lele Kolam Pekarangan",
        category: "seafood",
        categoryLabel: "Lauk Hewani",
        source: "BUDIDAYA BIOFLOK PEKARANGAN",
        image: "1c091.png",
        description:
          "Hasil budidaya pekarangan keluarga mandiri di Banten. Sangat hemat, berprotein hewani tinggi, dan berdaging lembut bebas duri untuk menu harian si kecil.",
        nutrients: ["Protein Hewani 18.7g", "Kalsium Tulang", "Fosfor Otot", "Super Hemat"],
        portion: "Takaran: 1/2 Ekor Sedang (45-50g)",
        proteinPer100g: "18.7g",
        calories: "105 kkal",
        omega3: "Tinggi",
        pricePerKg: 28000,
        stuntingBenefit: "Membangun massa otot dan tulang anak tanpa membebani dompet",
        aiInsight: "Olahan abon lele pekarangan tanpa pengawet sangat praktis untuk taburan nasi tim balita.",
      },
      {
        id: "udang-pesisir-labuan",
        title: "Udang Segar Pesisir Labuan",
        name: "Udang Segar Pesisir Labuan",
        category: "seafood",
        categoryLabel: "Lauk Hewani",
        source: "PESISIR LABUAN PANDEGLANG",
        image: "d85be.png",
        description:
          "Hasil tangkapan segar perairan Labuan Pandeglang. Sumber Zinc dan Kalsium alami terbaik untuk merangsang hormon pertumbuhan tinggi badan balita.",
        nutrients: ["Kalsium Tinggi", "Zinc Pertumbuhan", "Protein 18.1g", "Vitamin B12"],
        portion: "Takaran: 2 Ekor Sedang Halus",
        proteinPer100g: "18.1g",
        calories: "91 kkal",
        omega3: "Sedang",
        pricePerKg: 48000,
        stuntingBenefit: "Memacu kepadatan tulang dan meningkatkan nafsu makan anak",
        aiInsight: "Kupas bersih kulit dan kepala sebelum dihaluskan menjadi bola-bola udang sup bening.",
      },
      {
        id: "daun-kelor-menes",
        title: "Daun Kelor Pekarangan Menes",
        name: "Daun Kelor Pekarangan Menes",
        category: "vegetables",
        categoryLabel: "Sayuran Hijau",
        source: "KEBUN PEKARANGAN BANTEN",
        image: "94efa.png",
        description:
          "Superfood pekarangan yang subur di tanah Menes dan Pandeglang. Mengandung zat besi 25x lebih tinggi dari bayam untuk mencegah anemia pada ibu hamil dan balita.",
        nutrients: ["Zat Besi 6.7mg", "Vitamin A & C", "Kalsium 440mg", "Antioksidan Kuat"],
        portion: "Takaran: 1 Genggam Halus Ditumbuk",
        proteinPer100g: "6.7g",
        calories: "64 kkal",
        omega3: "Mikronutrien",
        pricePerKg: 10000,
        stuntingBenefit: "Pelindung dari anemia defisiensi besi penyebab utama stunting",
        aiInsight: "Masak daun kelor paling lama 1-2 menit setelah api dimatikan agar vitamin C dan zat besi tidak hilang.",
      },
      {
        id: "talas-beneng-pandeglang",
        title: "Talas Beneng Asli Pandeglang",
        name: "Talas Beneng Asli Pandeglang",
        category: "carbs",
        categoryLabel: "Karbohidrat Pokok",
        source: "LERENG GUNUNG KARANG PANDEGLANG",
        image: "8074b.png",
        description:
          "Komoditas unggulan endemik Pandeglang berbatang besar. Karbohidrat kompleks dengan indeks glikemik rendah, kaya serat prebiotik dan provitamin A alami.",
        nutrients: ["Karbohidrat Kompleks", "Beta-Karoten Tinggi", "Bebas Gluten", "Serat Prebiotik"],
        portion: "Takaran: 2-3 Sendok Makan Puree Kukus",
        proteinPer100g: "1.8g",
        calories: "120 kkal",
        omega3: "Bebas Lemak Jenuh",
        pricePerKg: 12000,
        stuntingBenefit: "Energi lambat cerna yang ramah bagi usus sensitif bayi",
        aiInsight: "Kukus talas beneng hingga empuk sempurna, lalu lumatkan bersama sedikit air kaldu ikan kakap.",
      },
    ],
  },

  papua: {
    regionName: "Kab. Teluk Bintuni & Papua Barat",
    ecosystem: "Pesisir Mangrove Teluk Bintuni & Hutan Sagu Alami Babo",
    commodities: [
      {
        id: "kakap-merah-babo",
        title: "Ikan Kakap Merah Babo",
        name: "Ikan Kakap Merah Babo",
        category: "seafood",
        categoryLabel: "Lauk Hewani",
        source: "PESISIR TELUK BINTUNI",
        image: "bd6ad.png",
        description:
          "Ikan tangkapan nelayan pesisir Distrik Babo, Teluk Bintuni. Asam amino esensial lengkap dan asam folat tinggi untuk percepatan pertumbuhan janin dan balita.",
        nutrients: ["Protein 20.8g", "DHA & EPA Tinggi", "Zat Besi Alami", "Rendah Merkuri"],
        portion: "Takaran: 1 Potong (50g) Cincang Halus",
        proteinPer100g: "20.8g",
        calories: "128 kkal",
        omega3: "Sangat Tinggi",
        pricePerKg: 45000,
        stuntingBenefit: "Pencegah stunting utama melalui penguatan sinaps otak anak",
        aiInsight: "Sangat lezat dimasak kuah kuning khas Babo tanpa santan kental.",
      },
      {
        id: "udang-putih-bintuni",
        title: "Udang Putih Bakau Bintuni",
        name: "Udang Putih Bakau Bintuni",
        category: "seafood",
        categoryLabel: "Lauk Hewani",
        source: "HUTAN MANGROVE BINTUNI",
        image: "d85be.png",
        description:
          "Udang hasil tambak alami dan muara bakau Teluk Bintuni. Padat kalsium dan seng yang mempercepat pertambahan tinggi badan balita pada periode emas.",
        nutrients: ["Kalsium Tulang", "Zinc Alami", "Protein 18.3g", "Vitamin B Kompleks"],
        portion: "Takaran: 2 Ekor Sedang Dicacah",
        proteinPer100g: "18.3g",
        calories: "92 kkal",
        omega3: "Tinggi",
        pricePerKg: 50000,
        stuntingBenefit: "Menambah panjang tulang pipa balita secara signifikan",
        aiInsight: "Giling halus daging udang untuk campuran bubur tim sagu.",
      },
      {
        id: "daun-kelor-babo",
        title: "Daun Kelor Segar Pekarangan",
        name: "Daun Kelor Segar Pekarangan",
        category: "vegetables",
        categoryLabel: "Sayuran Hijau",
        source: "PEKARANGAN RUMAH BABO",
        image: "94efa.png",
        description:
          "Tumbuh subur di pekarangan rumah warga pesisir Babo. Tanpa pestisida, kaya zat besi organik untuk mengeliminasi risiko anemia ibu menyusui.",
        nutrients: ["Zat Besi Tinggi", "Vitamin C Alami", "Kalsium Nabati", "Bebas Kimia"],
        portion: "Takaran: 1 Genggam Halus",
        proteinPer100g: "6.7g",
        calories: "64 kkal",
        omega3: "Alami",
        pricePerKg: 10000,
        stuntingBenefit: "Mencegah anemia gizi besi dan memperlancar produksi ASI",
        aiInsight: "Padukan dengan kuah asam ikan kakap untuk penyerapan zat besi optimal.",
      },
      {
        id: "sagu-murni-bintuni",
        title: "Sagu Basah Asli Hutan Babo",
        name: "Sagu Basah Asli Hutan Babo",
        category: "carbs",
        categoryLabel: "Karbohidrat Pokok",
        source: "HUTAN SAGU LESTARI BABO",
        image: "8074b.png",
        description:
          "Sagu murni hasil olahan pohon sagu liar Babo. Karbohidrat hipoalergenik bebas gluten yang sangat lembut bagi saluran cerna bayi mulai usia 6 bulan.",
        nutrients: ["Bebas Gluten", "Karbohidrat Lembut", "Serat Alami", "Energi Cepat Cerna"],
        portion: "Takaran: 2-3 Sendok Makan Papeda Lembut",
        proteinPer100g: "0.7g",
        calories: "354 kkal",
        omega3: "Nol Kolesterol",
        pricePerKg: 15000,
        stuntingBenefit: "Sumber energi harian balita yang mencegah iritasi lambung",
        aiInsight: "Sajikan dalam bentuk papeda lembut berkuah kuning ikan kakap yang kaya DHA.",
      },
    ],
  },

  jawaBarat: {
    regionName: "Jawa Barat (Parahyangan)",
    ecosystem: "Dataran Tinggi Agraris & Kolam Air Deras",
    commodities: [
      {
        id: "ikan-nila-parahyangan",
        title: "Ikan Nila Segar Kolam Parahyangan",
        name: "Ikan Nila Segar Kolam Parahyangan",
        category: "seafood",
        categoryLabel: "Lauk Hewani",
        source: "KOLAM AIR DERAS JAWA BARAT",
        image: "bd6ad.png",
        description:
          "Budidaya kolam air pegunungan Jawa Barat. Daging putih lembut, kaya selenium dan asam amino esensial penunjang pertumbuhan sel baru.",
        nutrients: ["Protein 19.2g", "Selenium Pelindung", "Fosfor Tulang", "Tekstur Lembut"],
        portion: "Takaran: 1 Potong (50g) Fillet",
        proteinPer100g: "19.2g",
        calories: "112 kkal",
        omega3: "Cukup",
        pricePerKg: 34000,
        stuntingBenefit: "Meningkatkan massa otot dan regenerasi sel tubuh anak",
        aiInsight: "Kukus dengan daun salam dan sereh agar harum dan disukai si kecil.",
      },
      {
        id: "daun-katuk-kelor-jabar",
        title: "Daun Katuk & Kelor Pekarangan",
        name: "Daun Katuk & Kelor Pekarangan",
        category: "vegetables",
        categoryLabel: "Sayuran Hijau",
        source: "KEBUN PEKARANGAN SUNDA",
        image: "94efa.png",
        description:
          "Duo superfood hijau pekarangan Sunda. Kombinasi pelancar ASI untuk ibu menyusui sekaligus sumber asam folat dan zat besi untuk MPASI balita.",
        nutrients: ["Zat Besi 7.1mg", "Pelancar ASI", "Kalsium 320mg", "Vitamin A"],
        portion: "Takaran: 1 Genggam Daun Muda",
        proteinPer100g: "6.8g",
        calories: "59 kkal",
        omega3: "Mikronutrien",
        pricePerKg: 8000,
        stuntingBenefit: "Menjamin kuantitas & kualitas ASI eksklusif 6 bulan pertama",
        aiInsight: "Cincang halus sebagai bahan dasar sup bening bersama tahu dan jagung manis.",
      },
      {
        id: "ubi-cilembu-sumedang",
        title: "Ubi Cilembu Madu",
        name: "Ubi Cilembu Madu",
        category: "carbs",
        categoryLabel: "Karbohidrat Pokok",
        source: "PERKEBUNAN LOKAL JAWA BARAT",
        image: "8074b.png",
        description:
          "Ubi manis khas Jawa Barat yang kaya beta-karoten (vitamin A). Mendukung imunitas mukosa usus dan kesehatan penglihatan anak.",
        nutrients: ["Vitamin A Alami", "Karbohidrat Kompleks", "Serat Pektin", "Energi Tahan Lama"],
        portion: "Takaran: 2 Sendok Makan Puree Ubi",
        proteinPer100g: "1.6g",
        calories: "103 kkal",
        omega3: "Nol Lemak Trans",
        pricePerKg: 16000,
        stuntingBenefit: "Memperkuat daya tahan tubuh dan menambah berat badan sehat",
        aiInsight: "Panggang atau kukus hingga empuk bertekstur selai, cocok untuk MPASI selingan sore.",
      },
      {
        id: "telur-ayam-kampung-sunda",
        title: "Telur Ayam Kampung Liar",
        name: "Telur Ayam Kampung Liar",
        category: "seafood",
        categoryLabel: "Lauk Hewani",
        source: "PETERNAKAN RAKYAT PEKARANGAN",
        image: "1c091.png",
        description:
          "Telur dari ayam pekarangan bebas kandang. Kuning telur kaya kolin dan lutein untuk plastisitas otak balita.",
        nutrients: ["Kolin Otak", "Protein 13.0g", "Vitamin D3", "Asam Amino Lengkap"],
        portion: "Takaran: 1 Butir per Hari",
        proteinPer100g: "13.0g",
        calories: "155 kkal",
        omega3: "Tinggi Kolin",
        pricePerKg: 38000,
        stuntingBenefit: "1 butir telur sehari terbukti klinis menurunkan angka stunting hingga 47%",
        aiInsight: "Rebus matang sempurna atau buat orak-arik lembut tanpa garam berlebih.",
      },
    ],
  },

  jawaTengahTimur: {
    regionName: "Jawa Tengah & Jawa Timur",
    ecosystem: "Pesisir Laut Jawa & Pertanian Lembah Subur",
    commodities: [
      {
        id: "ikan-kembung-segar-pantura",
        title: "Ikan Kembung Segar Pasar Tradisional",
        name: "Ikan Kembung Segar Pasar Tradisional",
        category: "seafood",
        categoryLabel: "Lauk Hewani",
        source: "PESISIR LAUT JAWA",
        image: "bd6ad.png",
        description:
          "Superfood lokal Indonesia dengan kandungan Omega-3 (DHA & EPA) 1.5x lebih tinggi dari ikan salmon impor, namun harganya sangat terjangkau di pasar lokal.",
        nutrients: ["Omega-3 Lebih Tinggi Salmon", "Protein 21.4g", "Vitamin B6", "Zat Besi"],
        portion: "Takaran: 1/2 Ekor Sedang (45g) Cincang",
        proteinPer100g: "21.4g",
        calories: "135 kkal",
        omega3: "Tertinggi di Indonesia (2.2g per 100g)",
        pricePerKg: 35000,
        stuntingBenefit: "Optimalisasi kecerdasan kognitif & percepatan tumbuh kembang",
        aiInsight: "Buang duri tengahnya, kukus atau buat pepes kukus lembut dengan daun kemangi.",
      },
      {
        id: "daun-kelor-bayam-jateng",
        title: "Daun Kelor & Bayam Petik Sendiri",
        name: "Daun Kelor & Bayam Petik Sendiri",
        category: "vegetables",
        categoryLabel: "Sayuran Hijau",
        source: "KEBUN PEKARANGAN RAKYAT",
        image: "94efa.png",
        description:
          "Sayuran hijau pekarangan kaya mikronutrien penting seperti asam folat, magnesium, dan vitamin C untuk penyerapan zat besi optimal.",
        nutrients: ["Zat Besi 6.5mg", "Asam Folat", "Vitamin C", "Kalsium Nabati"],
        portion: "Takaran: 1 Genggam Sayur Matang",
        proteinPer100g: "5.8g",
        calories: "55 kkal",
        omega3: "Alami",
        pricePerKg: 6000,
        stuntingBenefit: "Mencegah anemia serta infeksi berulang pada anak",
        aiInsight: "Langsung santap dalam 2 jam setelah dimasak agar nitrat tidak teroksidasi.",
      },
      {
        id: "ubi-kuning-singkong-lembut",
        title: "Ubi Kuning & Singkong Lembut",
        name: "Ubi Kuning & Singkong Lembut",
        category: "carbs",
        categoryLabel: "Karbohidrat Pokok",
        source: "TEGALAN LOKAL JAWA",
        image: "8074b.png",
        description:
          "Sumber karbohidrat kompleks khas pedesaan Jawa. Memberikan tenaga yang bertahan lama agar balita aktif bereksplorasi.",
        nutrients: ["Energi Tahan Lama", "Beta-Karoten", "Serat Halus", "Bebas Pengawet"],
        portion: "Takaran: 2-3 Sendok Makan Puree",
        proteinPer100g: "1.5g",
        calories: "115 kkal",
        omega3: "Alami",
        pricePerKg: 10000,
        stuntingBenefit: "Memenuhi kebutuhan kalori harian untuk kenaikan kurva berat badan balita",
        aiInsight: "Kukus ubi kuning lalu campurkan santan kelapa pekarangan untuk asupan lemak baik tambahan.",
      },
      {
        id: "tempe-kedelai-tradisional",
        title: "Tempe Tradisional Non-GMO",
        name: "Tempe Tradisional Non-GMO",
        category: "vegetables",
        categoryLabel: "Protein Nabati",
        source: "PRODUKSI RAKYAT LOKAL",
        image: "d85be.png",
        description:
          "Pangan warisan nusantara kaya probiotik alami hasil fermentasi Rhizopus. Asam amino mudah serap untuk kesehatan usus anak.",
        nutrients: ["Protein Nabati 20.8g", "Probiotik Alami", "Isoflavon", "Kalsium"],
        portion: "Takaran: 1 Potong Sedang (30g) Halus",
        proteinPer100g: "20.8g",
        calories: "192 kkal",
        omega3: "Asam Linoleat",
        pricePerKg: 14000,
        stuntingBenefit: "Menyehatkan mikrobioma usus anak agar nutrisi terserap 100%",
        aiInsight: "Kukus tempe lalu lumatkan bersama kuah kaldu ikan kembung.",
      },
    ],
  },

  sumatera: {
    regionName: "Pulau Sumatera & Pesisir Selat Malaka",
    ecosystem: "Sungai Besar Aluvial & Perairan Pesisir Tropis",
    commodities: [
      {
        id: "ikan-patin-sungai-sumatera",
        title: "Ikan Patin / Gabus Sungai Segar",
        name: "Ikan Patin / Gabus Sungai Segar",
        category: "seafood",
        categoryLabel: "Lauk Hewani",
        source: "ALIRAN SUNGAI SUMATERA",
        image: "bd6ad.png",
        description:
          "Ikan air tawar khas sungai Sumatera berlemak baik dan bertekstur super lembut. Sangat kaya protein dan asam lemak tak jenuh.",
        nutrients: ["Protein Halus 17.5g", "Lemak Baik MPASI", "Albumin Tinggi", "Mudah Dicerna"],
        portion: "Takaran: 1 Potong (50g) Cincang",
        proteinPer100g: "17.5g",
        calories: "132 kkal",
        omega3: "Tinggi Lemak Sehat",
        pricePerKg: 32000,
        stuntingBenefit: "Menaikkan berat badan balita yang mengalami kurva pertumbuhan datar (faltering)",
        aiInsight: "Masak sup bening kuah asam serai agar lemak alaminya menyatu lezat.",
      },
      {
        id: "daun-ubi-tumbuk-sumatera",
        title: "Daun Ubi Tumbuk & Rimbang",
        name: "Daun Ubi Tumbuk & Rimbang",
        category: "vegetables",
        categoryLabel: "Sayuran Hijau",
        source: "PEKARANGAN RUMAH SUMATERA",
        image: "94efa.png",
        description:
          "Sayuran tradisional pekarangan masyarakat Sumatera. Ditumbuk halus sehingga seratnya lembut dan zat besinya lebih mudah diserap oleh tubuh anak.",
        nutrients: ["Zat Besi Tinggi", "Vitamin C", "Kalsium Tulang", "Antioksidan"],
        portion: "Takaran: 2 Sendok Makan Daun Tumbuk Matang",
        proteinPer100g: "6.2g",
        calories: "60 kkal",
        omega3: "Alami",
        pricePerKg: 7000,
        stuntingBenefit: "Meningkatkan hemoglobin darah dan memicu daya tahan balita",
        aiInsight: "Tumbuk daun singkong muda dengan rimbang lalu masak dengan sedikit santan encer.",
      },
      {
        id: "ubi-kayu-manis-sumatera",
        title: "Ubi Kayu & Talas Manis",
        name: "Ubi Kayu & Talas Manis",
        category: "carbs",
        categoryLabel: "Karbohidrat Pokok",
        source: "KEBUN LOKAL SUMATERA",
        image: "8074b.png",
        description:
          "Karbohidrat umbi-umbian lokal yang pulen dan mudah diolah menjadi puree lembut penambah energi balita.",
        nutrients: ["Karbohidrat Murni", "Serat Pangan", "Bebas Gluten", "Energi Cepat"],
        portion: "Takaran: 2 Sendok Makan Lumat",
        proteinPer100g: "1.4g",
        calories: "125 kkal",
        omega3: "Nol Lemak Jenuh",
        pricePerKg: 8000,
        stuntingBenefit: "Memasok energi untuk aktivitas motorik balita",
        aiInsight: "Kukus hingga sangat empuk dan haluskan dengan saringan kawat untuk bayi 6-8 bulan.",
      },
    ],
  },

  kalimantan: {
    regionName: "Pulau Kalimantan (Borneo)",
    ecosystem: "Lahan Basah Gambut, Rawa Liar & Sungai Kapuas/Barito",
    commodities: [
      {
        id: "ikan-haruan-gabus-kalimantan",
        title: "Ikan Haruan (Gabus Rawa Kalimantan)",
        name: "Ikan Haruan (Gabus Rawa Kalimantan)",
        category: "seafood",
        categoryLabel: "Lauk Hewani",
        source: "PERAIRAN RAWA ALAMI BORNEO",
        image: "bd6ad.png",
        description:
          "Juara kadar Albumin tertinggi di dunia perikanan (62.24 g/kg). Albumin mempercepat pembentukan jaringan sel, penyembuhan infeksi, dan pencegahan gagal tumbuh.",
        nutrients: ["Albumin Tertinggi", "Protein Hewani 25.2g", "Zinc Alami", "Mempercepat Tumbuh"],
        portion: "Takaran: 1 Potong (45g) Kukus",
        proteinPer100g: "25.2g",
        calories: "115 kkal",
        omega3: "Sangat Tinggi",
        pricePerKg: 46000,
        stuntingBenefit: "Mempercepat regenerasi sel dan menormalkan kurva tinggi badan balita stunting",
        aiInsight: "Kukus ikan haruan dengan sedikit minyak kelapa dan bawang putih untuk mengekstrak minyak albuminnya.",
      },
      {
        id: "pakis-sayur-rawa-borneo",
        title: "Pakis Rawa Liar & Daun Kelor",
        name: "Pakis Rawa Liar & Daun Kelor",
        category: "vegetables",
        categoryLabel: "Sayuran Hijau",
        source: "HUTAN RAWA BORNEO",
        image: "94efa.png",
        description:
          "Tumbuhan paku liar yang tumbuh organik di tepian rawa Kalimantan. Kaya fosfor, zat besi, dan vitamin A alami bebas bahan kimia.",
        nutrients: ["Zat Besi Alami", "Fosfor Tulang", "Vitamin A", "Serat Halus"],
        portion: "Takaran: 1 Genggam Halus",
        proteinPer100g: "4.8g",
        calories: "45 kkal",
        omega3: "Alami",
        pricePerKg: 8000,
        stuntingBenefit: "Mendukung kepadatan tulang dan kejernihan penglihatan si kecil",
        aiInsight: "Gunakan pucuk pakis termuda yang melengkung agar teksturnya sangat lembut untuk MPASI.",
      },
      {
        id: "keladi-rawa-kalimantan",
        title: "Ubi Keladi Rawa Tradisional",
        name: "Ubi Keladi Rawa Tradisional",
        category: "carbs",
        categoryLabel: "Karbohidrat Pokok",
        source: "KEBUN RAWA BORNEO",
        image: "8074b.png",
        description:
          "Karbohidrat hipoalergenik khas Kalimantan. Struktur pati sangat halus dan tidak memicu alergi pada saluran cerna balita.",
        nutrients: ["Pati Halus", "Bebas Alergen", "Serat Prebiotik", "Karbohidrat Kompleks"],
        portion: "Takaran: 2-3 Sendok Makan Puree",
        proteinPer100g: "1.7g",
        calories: "118 kkal",
        omega3: "Nol Lemak Trans",
        pricePerKg: 11000,
        stuntingBenefit: "Menyediakan kalori padat yang mudah diserap tubuh anak",
        aiInsight: "Kukus bersama kaldu ikan haruan agar rasa gurih alaminya meresap.",
      },
    ],
  },

  sulawesiNusaTenggara: {
    regionName: "Sulawesi & Nusa Tenggara (NTT/NTB)",
    ecosystem: "Kepulauan Tropis Karang & Lahan Sabana Kering",
    commodities: [
      {
        id: "ikan-cakalang-teluk",
        title: "Ikan Cakalang Segar Teluk",
        name: "Ikan Cakalang Segar Teluk",
        category: "seafood",
        categoryLabel: "Lauk Hewani",
        source: "PERAIRAN LAUT DALAM SULAWESI",
        image: "bd6ad.png",
        description:
          "Ikan laut pelagis padat daging merah. Mengandung asam amino taurin dan Omega-3 tinggi yang esensial untuk perkembangan retina mata dan saraf otak.",
        nutrients: ["Taurin & DHA", "Protein 24.5g", "Zat Besi Heme", "Vitamin D"],
        portion: "Takaran: 1 Potong (45g) Halus",
        proteinPer100g: "24.5g",
        calories: "132 kkal",
        omega3: "Sangat Tinggi",
        pricePerKg: 38000,
        stuntingBenefit: "Meningkatkan daya konsentrasi dan pertumbuhan fisik optimal",
        aiInsight: "Kukus lalu suwir halus bebas duri, masak kuah asam khas Manado/Makassar.",
      },
      {
        id: "sayur-marungga-kelor-ntt",
        title: "Sayur Marungga (Kelor NTT)",
        name: "Sayur Marungga (Kelor NTT)",
        category: "vegetables",
        categoryLabel: "Sayuran Hijau",
        source: "PEKARANGAN RUMAH NTT",
        image: "94efa.png",
        description:
          "Masyarakat NTT menyebutnya 'Marungga'. Diakui dunia sebagai pohon ajaib pencegah stunting dengan konsentrasi zat besi dan kalsium tertinggi di tanah berbatu.",
        nutrients: ["Zat Besi 7.2mg", "Kalsium 480mg", "Zinc Alami", "Vitamin C"],
        portion: "Takaran: 1 Genggam Daun Matang",
        proteinPer100g: "6.9g",
        calories: "65 kkal",
        omega3: "Alami",
        pricePerKg: 8000,
        stuntingBenefit: "Senjata utama Kemenkes & Pemda NTT dalam menurunkan prevalensi stunting",
        aiInsight: "Rebus sebentar bersama jagung muda tumbuk, sajikan hangat untuk MPASI.",
      },
      {
        id: "jagung-bose-ubi-ntt",
        title: "Jagung Manis Bose & Ubi Kuning",
        name: "Jagung Manis Bose & Ubi Kuning",
        category: "carbs",
        categoryLabel: "Karbohidrat Pokok",
        source: "LADANG LOKAL NTT/SULAWESI",
        image: "8074b.png",
        description:
          "Karbohidrat tradisional kaya serat larut dan lutein. Memberi energi tahan lama dan menjaga kesehatan pencernaan balita.",
        nutrients: ["Lutein Mata", "Karbohidrat Kompleks", "Serat Larut", "Fosfor"],
        portion: "Takaran: 2-3 Sendok Makan Bubur Jagung Lumat",
        proteinPer100g: "2.4g",
        calories: "122 kkal",
        omega3: "Bebas Kolesterol",
        pricePerKg: 10000,
        stuntingBenefit: "Menambah cadangan tenaga dan glikogen otot anak",
        aiInsight: "Tumbuk pipil jagung manis hingga teksturnya lembut seperti bubur sumsum.",
      },
    ],
  },
};

/**
 * Helper pemetaan pangan lokal per wilayah:
 * Mendeteksi lokasi user (provinsi, kabupaten, kota, atau nama pasar)
 * lalu menyusun katalog pangan lokal cerdas secara otomatis.
 */
export function generateLocalFoodsByLocation(locationInput = "") {
  const query = String(locationInput || "").toLowerCase();

  let selectedKey = "banten"; // Default jika lokasi Pandeglang / Banten

  if (
    query.includes("bintuni") ||
    query.includes("babo") ||
    query.includes("papua") ||
    query.includes("sorong") ||
    query.includes("manokwari") ||
    query.includes("fakfak") ||
    query.includes("merauke") ||
    query.includes("jayapura") ||
    query.includes("maluku") ||
    query.includes("ambon")
  ) {
    selectedKey = "papua";
  } else if (
    query.includes("bandung") ||
    query.includes("cianjur") ||
    query.includes("bogor") ||
    query.includes("jabar") ||
    query.includes("jawa barat") ||
    query.includes("sukabumi") ||
    query.includes("garut") ||
    query.includes("tasik") ||
    query.includes("cirebon") ||
    query.includes("kuningan") ||
    query.includes("bekasi") ||
    query.includes("depok")
  ) {
    selectedKey = "jawaBarat";
  } else if (
    query.includes("pandeglang") ||
    query.includes("banten") ||
    query.includes("serang") ||
    query.includes("cilegon") ||
    query.includes("lebak") ||
    query.includes("tangerang") ||
    query.includes("labuan")
  ) {
    selectedKey = "banten";
  } else if (
    query.includes("jateng") ||
    query.includes("jawa tengah") ||
    query.includes("semarang") ||
    query.includes("solo") ||
    query.includes("surakarta") ||
    query.includes("jogja") ||
    query.includes("yogyakarta") ||
    query.includes("sleman") ||
    query.includes("bantul") ||
    query.includes("pati") ||
    query.includes("kudus") ||
    query.includes("banyumas") ||
    query.includes("cilacap") ||
    query.includes("jatim") ||
    query.includes("jawa timur") ||
    query.includes("surabaya") ||
    query.includes("malang") ||
    query.includes("banyuwangi") ||
    query.includes("jember") ||
    query.includes("kediri") ||
    query.includes("lamongan")
  ) {
    selectedKey = "jawaTengahTimur";
  } else if (
    query.includes("sumatera") ||
    query.includes("medan") ||
    query.includes("aceh") ||
    query.includes("padang") ||
    query.includes("riau") ||
    query.includes("pekanbaru") ||
    query.includes("palembang") ||
    query.includes("lampung") ||
    query.includes("jambi") ||
    query.includes("bengkulu") ||
    query.includes("bangka")
  ) {
    selectedKey = "sumatera";
  } else if (
    query.includes("kalimantan") ||
    query.includes("pontianak") ||
    query.includes("banjarmasin") ||
    query.includes("banjar") ||
    query.includes("samarinda") ||
    query.includes("balikpapan") ||
    query.includes("palangkaraya") ||
    query.includes("tarakan")
  ) {
    selectedKey = "kalimantan";
  } else if (
    query.includes("sulawesi") ||
    query.includes("makassar") ||
    query.includes("manado") ||
    query.includes("palu") ||
    query.includes("kendari") ||
    query.includes("gorontalo") ||
    query.includes("ntt") ||
    query.includes("ntb") ||
    query.includes("kupang") ||
    query.includes("mataram") ||
    query.includes("lombok") ||
    query.includes("sumba") ||
    query.includes("flores")
  ) {
    selectedKey = "sulawesiNusaTenggara";
  }

  const baseConfig = REGIONAL_KNOWLEDGE_BASE[selectedKey];
  const userCityDisplay =
    locationInput && locationInput.trim() ? locationInput.trim() : baseConfig.regionName;

  // Sesuaikan komoditas dengan nama lokasi user secara dinamis
  const tailoredCommodities = baseConfig.commodities.map((item) => ({
    ...item,
    isLocalSource: true,
    userLocation: userCityDisplay,
    regionOrigin: baseConfig.regionName,
  }));

  return {
    success: true,
    source: "Katalog Gizi Pangan Nusantara",
    location: userCityDisplay,
    regionKey: selectedKey,
    ecosystem: baseConfig.ecosystem,
    generatedAt: new Date().toISOString(),
    totalCommodities: tailoredCommodities.length,
    foods: tailoredCommodities,
  };
}

export const getLocalFoodsByLocation = generateLocalFoodsByLocation;
