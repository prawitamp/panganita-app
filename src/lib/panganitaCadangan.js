/**
 * PANGANITA – Rumus Cadangan Panen (Kemenkes & Standar Tim)
 * Sumber: CodePen Hanifa Fissalma / Sheet "Panganita_Simulasi_Rumus_v2_1.xlsx"
 * ===========================================================================
 * Menentukan berapa kg hasil panen yang DISIMPAN sebagai cadangan makan keluarga
 * (bawaan: 3 hari) dan berapa kg yang bisa DIJUAL.
 */

// ---------------------------------------------------------------------------
// 1. PENGATURAN (asumsi rumus – kesepakatan ahli gizi & standar Kemenkes)
// ---------------------------------------------------------------------------
export const PENGATURAN = {
  hariCadangan: 3,                 // cadangan disimpan untuk 3 hari
  targetProteinDariLaukPanen: 0.3, // 30% kebutuhan protein dari lauk panen
  porsiEnergiDariMakananPokok: 0.5,// Pedoman Gizi Seimbang: ±setengah energi dari makanan pokok
  makananPokokDariPanen: 0.5,      // separuh makanan pokok dari panen
  sayurDariPanen: 1.0,             // seluruh porsi sayur dari panen
  pembulatanKg: 0.1,               // berat disimpan dibulatkan ke atas per 0,1 kg
};

// ---------------------------------------------------------------------------
// 2. DATA KELOMPOK ANGGOTA KELUARGA (sheet "Kebutuhan Gizi")
//    protein = AKG protein (g/hari), energi = AKG energi (kkal/hari), sayur = porsi sayur (g/hari)
// ---------------------------------------------------------------------------
export const KELOMPOK = {
  'ibu-hamil-tm1':     { label: 'Ibu hamil – trimester 1',     protein: 61, energi: 2430, sayur: 250 },
  'ibu-hamil-tm2':     { label: 'Ibu hamil – trimester 2',     protein: 70, energi: 2550, sayur: 250 },
  'ibu-hamil-tm3':     { label: 'Ibu hamil – trimester 3',     protein: 90, energi: 2550, sayur: 250 },
  'ibu-menyusui-0-6':  { label: 'Ibu menyusui – 0–6 bulan',    protein: 80, energi: 2580, sayur: 250 },
  'ibu-menyusui-7-12': { label: 'Ibu menyusui – 7–12 bulan',   protein: 75, energi: 2650, sayur: 250 },
  'bayi-6-11':         { label: 'Bayi 6–11 bulan',             protein: 15, energi: 800,  sayur: 30 },
  'anak-1-3':          { label: 'Anak 1–3 tahun',              protein: 20, energi: 1350, sayur: 200 },
  'anak-4-6':          { label: 'Anak 4–6 tahun (TK)',         protein: 25, energi: 1400, sayur: 200 },
  'anak-7-9':          { label: 'Anak 7–9 tahun (SD)',         protein: 40, energi: 1650, sayur: 200 },
  'anak-l-10-12':      { label: 'Anak laki-laki 10–12 tahun',  protein: 50, energi: 2000, sayur: 250 },
  'anak-p-10-12':      { label: 'Anak perempuan 10–12 tahun',  protein: 55, energi: 1900, sayur: 250 },
};

// ---------------------------------------------------------------------------
// 3. DATA BAHAN PANGAN (sheet "Data Pangan")
// ---------------------------------------------------------------------------
export const IKAN = 'ikan-tambak';
export const UNGGAS = 'telur-unggas';
export const SAYUR = 'sayur';
export const POKOK = 'ubi-padi';

export const KATEGORI = {
  [IKAN]: 'Ikan & Tambak',
  [UNGGAS]: 'Telur & Unggas',
  [SAYUR]: 'Sayur',
  [POKOK]: 'Ubi & Padi',
};

export const BAHAN = {
  'ikan-lele':             { nama: 'Ikan lele',             kategori: IKAN,   energi: 92,  protein: 16.2,  bdd: 1 },
  'ikan-mujair':           { nama: 'Ikan mujair',           kategori: IKAN,   energi: 89,  protein: 18.7,  bdd: 1 },
  'ikan-nila':             { nama: 'Ikan nila',             kategori: IKAN,   energi: 96,  protein: 20.08, bdd: 1 },
  'ikan-bandeng':          { nama: 'Ikan bandeng',          kategori: IKAN,   energi: 123, protein: 20,    bdd: 1 },
  'ikan-kembung':          { nama: 'Ikan kembung',          kategori: IKAN,   energi: 125, protein: 21.3,  bdd: 1 },
  'ikan-teri-nasi-segar':  { nama: 'Ikan teri nasi segar',  kategori: IKAN,   energi: 74,  protein: 10.3,  bdd: 1 },
  'ikan-teri-nasi-kering': { nama: 'Ikan teri nasi kering', kategori: IKAN,   energi: 144, protein: 32.5,  bdd: 1 },
  'udang':                 { nama: 'Udang',                 kategori: IKAN,   energi: 91,  protein: 21,    bdd: 1 },
  'udang-galah':           { nama: 'Udang galah',           kategori: IKAN,   energi: 81,  protein: 16.5,  bdd: 1 },
  'ikan-gabus':            { nama: 'Ikan gabus',            kategori: IKAN,   energi: 80,  protein: 16.2,  bdd: 1 },
  'ikan-cakalang':         { nama: 'Ikan cakalang',         kategori: IKAN,   energi: 107, protein: 19.6,  bdd: 1 },
  'ikan-tongkol':          { nama: 'Ikan tongkol',          kategori: IKAN,   energi: 100, protein: 13.7,  bdd: 1 },
  'ikan-gurame':           { nama: 'Ikan gurame',           kategori: IKAN,   energi: 125, protein: 19.9,  bdd: 1 },
  'ikan-patin':            { nama: 'Ikan patin',            kategori: IKAN,   energi: 132, protein: 17,    bdd: 1 },
  'telur-ayam-ras':        { nama: 'Telur ayam ras',        kategori: UNGGAS, energi: 154, protein: 12.4,  bdd: 1 },
  'telur-ayam-kampung':    { nama: 'Telur ayam kampung',    kategori: UNGGAS, energi: 174, protein: 10.8,  bdd: 1 },
  'telur-bebek':           { nama: 'Telur bebek',           kategori: UNGGAS, energi: 185, protein: 11.8,  bdd: 1 },
  'telur-puyuh':           { nama: 'Telur puyuh',           kategori: UNGGAS, energi: 116, protein: 10.7,  bdd: 1 },
  'daging-ayam-ras':       { nama: 'Daging ayam ras',       kategori: UNGGAS, energi: 298, protein: 18.2,  bdd: 1 },
  'daging-ayam-kampung':   { nama: 'Daging ayam kampung',   kategori: UNGGAS, energi: 215, protein: 25.9,  bdd: 1 },
  'daging-bebek':          { nama: 'Daging bebek',          kategori: UNGGAS, energi: 321, protein: 16,    bdd: 1 },
  'hati-ayam':             { nama: 'Hati ayam',             kategori: UNGGAS, energi: 261, protein: 27.4,  bdd: 1 },
  'bayam':                 { nama: 'Bayam',                 kategori: SAYUR,  energi: 16,  protein: 0.9,   bdd: 1 },
  'bayam-merah':           { nama: 'Bayam merah',           kategori: SAYUR,  energi: 41,  protein: 2.2,   bdd: 1 },
  'kangkung':              { nama: 'Kangkung',              kategori: SAYUR,  energi: 29,  protein: 3,     bdd: 1 },
  'daun-kelor':            { nama: 'Daun kelor',            kategori: SAYUR,  energi: 92,  protein: 5.1,   bdd: 1 },
  'daun-singkong':         { nama: 'Daun singkong',         kategori: SAYUR,  energi: 73,  protein: 6.8,   bdd: 1 },
  'kacang-panjang':        { nama: 'Kacang panjang',        kategori: SAYUR,  energi: 31,  protein: 2.3,   bdd: 1 },
  'singkong':              { nama: 'Singkong',              kategori: POKOK,  energi: 154, protein: 1,     bdd: 1 },
  'ubi-jalar':             { nama: 'Ubi jalar',             kategori: POKOK,  energi: 151, protein: 1.6,   bdd: 1 },
  'jagung':                { nama: 'Jagung',                kategori: POKOK,  energi: 366, protein: 9.8,   bdd: 1 },
  'sagu':                  { nama: 'Sagu',                  kategori: POKOK,  energi: 355, protein: 0.6,   bdd: 1 },
  'talas':                 { nama: 'Talas',                 kategori: POKOK,  energi: 98,  protein: 1.9,   bdd: 1 },
  'beras-giling':          { nama: 'Beras giling',          kategori: POKOK,  energi: 357, protein: 8.4,   bdd: 1 },
};

// ---------------------------------------------------------------------------
// 4. FUNGSI BANTU
// ---------------------------------------------------------------------------
export const bulatkan = (n, digit = 2) => Math.round(n * 10 ** digit) / 10 ** digit;

export function bulatkanKeAtas(nilai, langkah) {
  if (nilai <= 0) return 0;
  return bulatkan(Math.ceil(nilai / langkah - 1e-9) * langkah, 3);
}

export const daftarBahan = () =>
  Object.entries(BAHAN).map(([id, b]) => ({ id, nama: b.nama, kategori: KATEGORI[b.kategori] }));

export const daftarKelompok = () =>
  Object.entries(KELOMPOK).map(([id, k]) => ({ id, label: k.label }));

// ---------------------------------------------------------------------------
// 5. RUMUS UTAMA DARI TUTOR
// ---------------------------------------------------------------------------
export function hitungCadangan({
  bahan = 'ikan-lele',
  beratPanenKg = 2,
  anggota = [],
  hariCadangan = PENGATURAN.hariCadangan,
  pengaturanKustom = {},
}) {
  const P = { ...PENGATURAN, ...pengaturanKustom };
  const kesalahan = [];
  const dataBahan = BAHAN[bahan];

  if (!dataBahan) kesalahan.push(`Bahan "${bahan}" tidak dikenal.`);
  if (!(Number.isFinite(beratPanenKg) && beratPanenKg > 0)) kesalahan.push('Berat panen harus lebih dari 0 kg.');
  if (!(Number.isInteger(hariCadangan) && hariCadangan > 0)) kesalahan.push('Hari cadangan harus bilangan bulat > 0.');

  for (const a of anggota) {
    if (!KELOMPOK[a.kelompok]) kesalahan.push(`Kelompok "${a.kelompok}" tidak dikenal.`);
    if (!(Number.isInteger(a.jumlah) && a.jumlah >= 0)) kesalahan.push(`Jumlah orang "${a.kelompok}" harus bilangan bulat ≥ 0.`);
  }

  if (kesalahan.length) return { status: 'input_tidak_valid', kesalahan };

  // Langkah 1: jumlahkan kebutuhan seluruh anggota (per hari)
  const total = { protein: 0, energi: 0, sayur: 0, orang: 0 };
  for (const { kelompok, jumlah } of anggota) {
    const k = KELOMPOK[kelompok];
    total.protein += k.protein * jumlah;
    total.energi += k.energi * jumlah;
    total.sayur += k.sayur * jumlah;
    total.orang += jumlah;
  }

  // Jika belum ada anggota yang dimasukkan, default 0 atau semua dijual
  if (total.orang === 0) {
    return {
      status: 'ok',
      bahan: { id: bahan, nama: dataBahan.nama, kategori: KATEGORI[dataBahan.kategori] },
      dasarHitung: 'tidak ada anggota',
      hariCadangan,
      jumlahOrang: 0,
      kebutuhan: { gramPerHari: 0, totalCadanganKg: 0 },
      keputusan: {
        disimpanKg: 0,
        dijualKg: bulatkan(beratPanenKg, 2),
        kekuranganKg: 0,
        cukupUntukHari: 0,
      },
      giziPerHari: { proteinG: 0, energiKkal: 0, persenAkgProtein: 0 },
      catatan: ['TIDAK_ADA_ANGGOTA'],
    };
  }

  // Langkah 2: berapa gram bahan (yang dimakan) per hari, sesuai kategorinya
  let gramPerHari, dasarHitung;
  if (dataBahan.kategori === IKAN || dataBahan.kategori === UNGGAS) {
    // lauk hewani → dihitung dari PROTEIN
    gramPerHari = (total.protein * P.targetProteinDariLaukPanen) / (dataBahan.protein / 100);
    dasarHitung = 'protein';
  } else if (dataBahan.kategori === POKOK) {
    // makanan pokok → dihitung dari ENERGI
    gramPerHari = (total.energi * P.porsiEnergiDariMakananPokok * P.makananPokokDariPanen) / (dataBahan.energi / 100);
    dasarHitung = 'energi';
  } else {
    // sayur → dihitung dari PORSI
    gramPerHari = total.sayur * P.sayurDariPanen;
    dasarHitung = 'porsi sayur';
  }

  // Langkah 3: ubah ke berat utuh & kalikan jumlah hari cadangan
  const bdd = dataBahan.bdd || 1;
  const gramUtuhPerHari = gramPerHari / bdd;
  const kebutuhanCadanganKg = (gramUtuhPerHari * hariCadangan) / 1000;

  // Langkah 4: keputusan simpan vs jual
  const disimpanKg = Math.min(beratPanenKg, bulatkanKeAtas(kebutuhanCadanganKg, P.pembulatanKg));
  const dijualKg = bulatkan(beratPanenKg - disimpanKg, 3);
  const kekuranganKg = bulatkan(Math.max(0, kebutuhanCadanganKg - beratPanenKg), 2);
  const cukupUntukHari = gramUtuhPerHari > 0 ? Math.floor((beratPanenKg * 1000 / gramUtuhPerHari) * 10) / 10 : null;

  // Langkah 5: sumbangan gizi per hari dari bagian yang disimpan
  const proteinPerHari = bulatkan((gramPerHari * dataBahan.protein) / 100, 1);
  const energiPerHari = bulatkan((gramPerHari * dataBahan.energi) / 100, 0);

  return {
    status: 'ok',
    bahan: { id: bahan, nama: dataBahan.nama, kategori: KATEGORI[dataBahan.kategori] },
    dasarHitung,
    hariCadangan,
    jumlahOrang: total.orang,
    kebutuhan: {
      gramPerHari: bulatkan(gramPerHari, 1),
      totalCadanganKg: bulatkan(kebutuhanCadanganKg, 3),
    },
    keputusan: {
      disimpanKg,
      dijualKg,
      kekuranganKg,
      cukupUntukHari,
    },
    giziPerHari: {
      proteinG: proteinPerHari,
      energiKkal: energiPerHari,
      persenAkgProtein: total.protein > 0 ? bulatkan(proteinPerHari / total.protein, 3) : null,
    },
    catatan: [
      ...(kekuranganKg > 0 ? ['PANEN_TIDAK_CUKUP'] : []),
      ...(bdd === 1 ? ['BDD_BELUM_DIISI'] : []),
    ],
  };
}

// ---------------------------------------------------------------------------
// 6. HELPER: Pemetaan Profil Panganita ke Format Anggota Rumus
// ---------------------------------------------------------------------------
export function mapProfileToAnggota(profile = {}) {
  const anggotaCounts = {};

  const children = Array.isArray(profile.children) ? profile.children : [];
  const familyCondition = Array.isArray(profile.familyCondition)
    ? profile.familyCondition
    : profile.familyCondition
    ? [profile.familyCondition]
    : [];

  // 1. Petakan Anak-Anak Berdasarkan Usia
  children.forEach((c) => {
    const ageNum = Number(c.age || 0);
    const isMonths = c.ageUnit === "bulan";
    const totalMonths = isMonths ? ageNum : ageNum * 12;

    if (totalMonths <= 5) {
      // 0-5 bulan ASI Eksklusif (tidak dialokasikan bahan langsung)
    } else if (totalMonths <= 11) {
      anggotaCounts['bayi-6-11'] = (anggotaCounts['bayi-6-11'] || 0) + 1;
    } else if (totalMonths <= 36) { // 1-3 tahun
      anggotaCounts['anak-1-3'] = (anggotaCounts['anak-1-3'] || 0) + 1;
    } else if (totalMonths <= 72) { // 4-6 tahun (TK)
      anggotaCounts['anak-4-6'] = (anggotaCounts['anak-4-6'] || 0) + 1;
    } else if (totalMonths <= 108) { // 7-9 tahun (SD)
      anggotaCounts['anak-7-9'] = (anggotaCounts['anak-7-9'] || 0) + 1;
    } else { // 10-12 tahun
      const key = c.gender === 'female' ? 'anak-p-10-12' : 'anak-l-10-12';
      anggotaCounts[key] = (anggotaCounts[key] || 0) + 1;
    }
  });

  // 2. Petakan Kondisi Ibu (Hamil / Menyusui)
  if (familyCondition.includes('pregnant')) {
    anggotaCounts['ibu-hamil-tm3'] = (anggotaCounts['ibu-hamil-tm3'] || 0) + 1;
  }
  if (familyCondition.includes('breastfeeding')) {
    anggotaCounts['ibu-menyusui-0-6'] = (anggotaCounts['ibu-menyusui-0-6'] || 0) + 1;
  }

  // 3. Fallback jika data anak belum diinput spesifik tetapi memilih kondisi di onboarding
  if (children.length === 0) {
    if (familyCondition.includes('baby')) {
      anggotaCounts['anak-1-3'] = (anggotaCounts['anak-1-3'] || 0) + 1;
    }
    if (familyCondition.includes('school')) {
      anggotaCounts['anak-4-6'] = (anggotaCounts['anak-4-6'] || 0) + 1;
    }
    if (familyCondition.includes('mother') && !familyCondition.includes('pregnant') && !familyCondition.includes('breastfeeding')) {
      anggotaCounts['ibu-hamil-tm2'] = (anggotaCounts['ibu-hamil-tm2'] || 0) + 1;
    }
  }

  // Jika tetap kosong sama sekali, default ke 1 anak balita
  if (Object.keys(anggotaCounts).length === 0) {
    anggotaCounts['anak-1-3'] = 1;
  }

  return Object.entries(anggotaCounts).map(([kelompok, jumlah]) => ({
    kelompok,
    jumlah,
  }));
}
