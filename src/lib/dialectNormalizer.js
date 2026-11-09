/**
 * Modul Dialect Normalizer & Cross-Lingual Engine PANGANITA
 * Mendukung pemahaman dialek daerah dari seluruh pelosok Nusantara:
 * - Papua (Teluk Bintuni, Sorong, Jayapura, Merauke)
 * - Sunda (Banten, Pandeglang, Priangan, Cirebon)
 * - Jawa (Jawa Tengah, Jawa Timur, Banyumasan, Jogja/Solo)
 * - Minang & Melayu (Sumatera Barat, Riau, Jambi, Sumsel)
 * - Bugis & Makassar (Sulawesi Selatan, Barat)
 * - Banjar & Dayak (Kalimantan Selatan, Tengah, Timur)
 * - Bali, Sasak (Lombok), & NTT (Kupang, Flores, Sumba)
 * - Batak & Toba (Sumatera Utara)
 */

export const DIALECT_DICTIONARY = [
  // ==================== 1. PAPUA & INDONESIA TIMUR ====================
  { dialect: "Papua", regex: /\b(tong|tong pu|kitorang|kitorang pu)\b/gi, standard: "kami / anak kami", category: "subjek" },
  { dialect: "Papua", regex: /\b(tra|traada|tada|sonde|trada)\s+(mau|makan|bisa|usah)/gi, standard: "tidak $2", category: "negasi" },
  { dialect: "Papua", regex: /\b(tra|trada)\b/gi, standard: "tidak", category: "negasi" },
  { dialect: "Papua", regex: /\b(de|dong)\b/gi, standard: "dia / mereka", category: "subjek" },
  { dialect: "Papua", regex: /\b(kasbi)\b/gi, standard: "singkong ubi kayu", category: "pangan" },
  { dialect: "Papua", regex: /\b(petatas)\b/gi, standard: "ubi jalar manis", category: "pangan" },
  { dialect: "Papua", regex: /\b(keladi)\b/gi, standard: "talas", category: "pangan" },
  { dialect: "Papua", regex: /\b(papeda)\b/gi, standard: "bubur sagu karbohidrat", category: "pangan" },
  { dialect: "Papua", regex: /\b(ikan kuah kuning)\b/gi, standard: "sup ikan bumbu kuning berkuah kaya rempah", category: "olahan" },
  { dialect: "Papua", regex: /\b(kaskado)\b/gi, standard: "gangguan kulit gatal alergi", category: "keluhan" },
  { dialect: "Papua", regex: /\b(lemas sekali|lunglai|trada tenaga)\b/gi, standard: "lemas lelah lesu", category: "keluhan" },
  { dialect: "Papua", regex: /\b(molo)\b/gi, standard: "menyelam mencari ikan", category: "aktivitas" },
  { dialect: "Papua", regex: /\b(bagaimana e|ka apa|iyo ka|yo)\b/gi, standard: "bagaimana caranya ya", category: "pertanyaan" },

  // ==================== 2. SUNDA (BANTEN & JAWA BARAT) ====================
  { dialect: "Sunda", regex: /\b(budak leutik|orok|murangkalih)\b/gi, standard: "bayi anak balita", category: "subjek" },
  { dialect: "Sunda", regex: /\b(abdi|simkuring|urang)\b/gi, standard: "saya", category: "subjek" },
  { dialect: "Sunda", regex: /\b(embung|alim|teu purun)\s+(tuang|neda|emam|makan)/gi, standard: "GTM tidak mau makan", category: "keluhan" },
  { dialect: "Sunda", regex: /\b(embung|alim|teu purun)\b/gi, standard: "tidak mau", category: "negasi" },
  { dialect: "Sunda", regex: /\b(tuang|neda|emam)\b/gi, standard: "makan", category: "aktivitas" },
  { dialect: "Sunda", regex: /\b(panas tiris|muriang|haredang)\b/gi, standard: "demam panas dingin meriang", category: "keluhan" },
  { dialect: "Sunda", regex: /\b(lauk lele|lauk kembung|lauk mas|lauk mujair)\b/gi, standard: "ikan lele kembung air tawar", category: "pangan" },
  { dialect: "Sunda", regex: /\b(lauk)\b/gi, standard: "ikan protein hewani", category: "pangan" },
  { dialect: "Sunda", regex: /\b(kumaha atuh|kumaha carana|kumaha ieu)\b/gi, standard: "bagaimana solusinya", category: "pertanyaan" },
  { dialect: "Sunda", regex: /\b(sae teu|sae henteu|sae pami)\b/gi, standard: "apakah bagus dan aman jika", category: "pertanyaan" },
  { dialect: "Sunda", regex: /\b(tiasa|tiasa teu)\b/gi, standard: "apakah bisa", category: "pertanyaan" },
  { dialect: "Sunda", regex: /\b(tahan sabaraha dinten|kuat sabaraha lami)\b/gi, standard: "tahan berapa hari masa simpan", category: "penyimpanan" },
  { dialect: "Sunda", regex: /\b(sayur lompong)\b/gi, standard: "sayur batang talas kaya serat", category: "pangan" },

  // ==================== 3. JAWA (JATENG, JATIM, DIY, BANYUMAS) ====================
  { dialect: "Jawa", regex: /\b(anak kulo|lare kulo|bocah kulo|thole|genduk)\b/gi, standard: "anak balita saya", category: "subjek" },
  { dialect: "Jawa", regex: /\b(kulo|kula|nyong|aku)\b/gi, standard: "saya", category: "subjek" },
  { dialect: "Jawa", regex: /\b(mboten purun|ra gelem|mboten kersa)\s+(nedha|maem|mangan)/gi, standard: "GTM tidak mau makan", category: "keluhan" },
  { dialect: "Jawa", regex: /\b(mboten purun|ra gelem|ora gelem|mboten kersa)\b/gi, standard: "tidak mau", category: "negasi" },
  { dialect: "Jawa", regex: /\b(nedha|maem|mangan)\b/gi, standard: "makan MPASI", category: "aktivitas" },
  { dialect: "Jawa", regex: /\b(awake anget|awake sumer|gerah panas|panas sanget)\b/gi, standard: "badan demam panas", category: "keluhan" },
  { dialect: "Jawa", regex: /\b(lemes sanget|nglentruk|lunglai)\b/gi, standard: "lemas lesu tidak bertenaga", category: "keluhan" },
  { dialect: "Jawa", regex: /\b(sekul)\b/gi, standard: "nasi bubur", category: "pangan" },
  { dialect: "Jawa", regex: /\b(jangan kelor|bobor kelor|jangan bening)\b/gi, standard: "sayur bening daun kelor", category: "olahan" },
  { dialect: "Jawa", regex: /\b(pripun nggih|kados pundi|kepriye carane)\b/gi, standard: "bagaimana caranya dan rekomendasinya", category: "pertanyaan" },
  { dialect: "Jawa", regex: /\b(sae mboten|sae nopo mboten)\b/gi, standard: "bagus dan aman atau tidak", category: "pertanyaan" },
  { dialect: "Jawa", regex: /\b(awet pinten dinten|tahan pirang dino)\b/gi, standard: "tahan disimpan berapa hari", category: "penyimpanan" },

  // ==================== 4. MINANG & MELAYU SUMATERA ====================
  { dialect: "Minang", regex: /\b(anak ambo|anak den)\b/gi, standard: "anak saya", category: "subjek" },
  { dialect: "Minang", regex: /\b(ambo|aden)\b/gi, standard: "saya", category: "subjek" },
  { dialect: "Minang", regex: /\b(indak namuah|indak amuah|ndak nio)\s+(makan|maem)/gi, standard: "GTM tidak mau makan", category: "keluhan" },
  { dialect: "Minang", regex: /\b(indak namuah|ndak nio|indak amuah)\b/gi, standard: "tidak mau", category: "negasi" },
  { dialect: "Minang", regex: /\b(dingin manggigia|paneh badannyo|damam)\b/gi, standard: "demam panas dingin menggigil", category: "keluhan" },
  { dialect: "Minang", regex: /\b(baa caronyo|baa caro|ba a caronyo)\b/gi, standard: "bagaimana caranya", category: "pertanyaan" },
  { dialect: "Minang", regex: /\b(rancak|rancak bana|rancak indak)\b/gi, standard: "bagus dan bergizi", category: "pertanyaan" },
  { dialect: "Minang", regex: /\b(tahan barapo ari|tahan bara hari)\b/gi, standard: "tahan berapa hari simpan", category: "penyimpanan" },
  { dialect: "Minang", regex: /\b(pangek ikan|gulai ikan)\b/gi, standard: "olahan sup ikan bumbu rempah kuning", category: "olahan" },

  // ==================== 5. BUGIS & MAKASSAR ====================
  { dialect: "Makassar", regex: /\b(anakkong|anana|ana-ana)\b/gi, standard: "anak balita saya", category: "subjek" },
  { dialect: "Makassar", regex: /\b(teai|tena naero)\s+(manre|nganre)/gi, standard: "GTM tidak mau makan", category: "keluhan" },
  { dialect: "Makassar", regex: /\b(teai|tena naero)\b/gi, standard: "tidak mau", category: "negasi" },
  { dialect: "Makassar", regex: /\b(manre|nganre)\b/gi, standard: "makan", category: "aktivitas" },
  { dialect: "Makassar", regex: /\b(mamburisi|bambang kale|garring)\b/gi, standard: "demam panas badan meriang", category: "keluhan" },
  { dialect: "Makassar", regex: /\b(juku|bale|peje)\b/gi, standard: "ikan protein hewani", category: "pangan" },
  { dialect: "Makassar", regex: /\b(baiko narekko|antekamma carana|pakkua carana)\b/gi, standard: "bagaimana caranya apakah baik jika", category: "pertanyaan" },
  { dialect: "Makassar", regex: /\b(siaga allona tahan|siapa allona)\b/gi, standard: "tahan berapa hari simpan", category: "penyimpanan" },

  // ==================== 6. BANJAR (KALIMANTAN) ====================
  { dialect: "Banjar", regex: /\b(anak ulun|kakanakan ulun)\b/gi, standard: "anak balita saya", category: "subjek" },
  { dialect: "Banjar", regex: /\b(ulun)\b/gi, standard: "saya", category: "subjek" },
  { dialect: "Banjar", regex: /\b(kada hakun|kada handak)\s+(makan|mamamah)/gi, standard: "GTM tidak mau makan", category: "keluhan" },
  { dialect: "Banjar", regex: /\b(kada hakun|kada handak|kada kawa)\b/gi, standard: "tidak mau", category: "negasi" },
  { dialect: "Banjar", regex: /\b(panas awak|garing|muriang)\b/gi, standard: "demam panas badan sakit", category: "keluhan" },
  { dialect: "Banjar", regex: /\b(iwak|iwak lele|iwak haruan|iwak kembung)\b/gi, standard: "ikan lele gabus kembung protein hewani", category: "pangan" },
  { dialect: "Banjar", regex: /\b(kayapa caranya|kayapa ninih)\b/gi, standard: "bagaimana caranya", category: "pertanyaan" },
  { dialect: "Banjar", regex: /\b(tahan barapa hari|bisa tahan lawas)\b/gi, standard: "tahan berapa hari simpan", category: "penyimpanan" },

  // ==================== 7. BALI & NUSA TENGGARA (NTB/NTT) ====================
  { dialect: "NusaTenggara", regex: /\b(panak tiange|pianak|anake)\b/gi, standard: "anak saya", category: "subjek" },
  { dialect: "NusaTenggara", regex: /\b(tusing nyak|sing nyak)\s+(madaar|makan)/gi, standard: "GTM tidak mau makan", category: "keluhan" },
  { dialect: "NusaTenggara", regex: /\b(sonde mau|sonde bisa)\s+(makan)/gi, standard: "GTM tidak mau makan", category: "keluhan" },
  { dialect: "NusaTenggara", regex: /\b(sonde)\b/gi, standard: "tidak", category: "negasi" },
  { dialect: "NusaTenggara", regex: /\b(marungga)\b/gi, standard: "daun kelor kaya zat besi", category: "pangan" },
  { dialect: "NusaTenggara", regex: /\b(ikan kuah asam)\b/gi, standard: "sup ikan kuah asam segar bebas duri", category: "olahan" },
  { dialect: "NusaTenggara", regex: /\b(karmana su|kenken carane)\b/gi, standard: "bagaimana caranya", category: "pertanyaan" },

  // ==================== 8. BATAK & TOBA (SUMUT) ====================
  { dialect: "Batak", regex: /\b(dakdanak|anakhu|anakkon)\b/gi, standard: "anak balita saya", category: "subjek" },
  { dialect: "Batak", regex: /\b(ndang olo|dang olo)\s+(mangan)/gi, standard: "GTM tidak mau makan", category: "keluhan" },
  { dialect: "Batak", regex: /\b(ndang|dang)\b/gi, standard: "tidak", category: "negasi" },
  { dialect: "Batak", regex: /\b(mangan)\b/gi, standard: "makan", category: "aktivitas" },
  { dialect: "Batak", regex: /\b(mohop pamatang|hansit)\b/gi, standard: "demam panas badan sakit", category: "keluhan" },
  { dialect: "Batak", regex: /\b(dengke|dekke)\b/gi, standard: "ikan protein hewani", category: "pangan" },
  { dialect: "Batak", regex: /\b(songondia dalanna|boha carana)\b/gi, standard: "bagaimana caranya", category: "pertanyaan" }
];

/**
 * Normalisasi teks pertanyaan dalam dialek nusantara apapun
 * Menghasilkan:
 * - normalizedText: teks bahasa Indonesia baku untuk pencarian semantik RAG
 * - detectedDialects: daftar dialek yang teridentifikasi (misal: ['Papua'] atau ['Sunda'])
 * - localCommodities: komoditas pangan lokal yang disebut (lele, kelor, sagu, dll.)
 * - greetings: kata sapaan hangat yang sesuai dengan daerah ibu
 */
export function normalizeDialectText(rawText) {
  if (!rawText || typeof rawText !== "string") {
    return {
      rawText: "",
      normalizedText: "",
      detectedDialects: [],
      localCommodities: [],
      greetings: "Ibu",
      isDialectDetected: false
    };
  }

  let text = rawText;
  const detectedDialects = new Set();
  const localCommodities = [];

  // 1. Eksekusi mapping kamus dialek nusantara
  DIALECT_DICTIONARY.forEach((entry) => {
    if (entry.regex.test(text)) {
      detectedDialects.add(entry.dialect);
      text = text.replace(entry.regex, entry.standard);
    }
  });

  // 2. Deteksi komoditas spesifik pangan nusantara
  const lowerText = (rawText + " " + text).toLowerCase();
  if (lowerText.includes("lele")) localCommodities.push("ikan lele");
  if (lowerText.includes("kembung")) localCommodities.push("ikan kembung");
  if (lowerText.includes("tongkol")) localCommodities.push("ikan tongkol");
  if (lowerText.includes("gurame")) localCommodities.push("ikan gurame");
  if (lowerText.includes("kelor") || lowerText.includes("marungga")) localCommodities.push("daun kelor");
  if (lowerText.includes("sagu") || lowerText.includes("papeda")) localCommodities.push("sagu pekarangan");
  if (lowerText.includes("kasbi") || lowerText.includes("singkong")) localCommodities.push("singkong");
  if (lowerText.includes("petatas") || lowerText.includes("ubi jalar")) localCommodities.push("ubi jalar");
  if (lowerText.includes("lompong") || lowerText.includes("keladi")) localCommodities.push("talas lompong");
  if (lowerText.includes("abon")) localCommodities.push("abon ikan lele");

  // 3. Tentukan sapaan hangat berbasis dialek
  let greetings = "Ibu";
  if (detectedDialects.has("Papua")) greetings = "Mama";
  else if (detectedDialects.has("Sunda")) greetings = "Ibu / Teteh";
  else if (detectedDialects.has("Jawa")) greetings = "Ibu / Mbak";
  else if (detectedDialects.has("Minang")) greetings = "Ibu / Uni";
  else if (detectedDialects.has("Makassar")) greetings = "Ibu / Daeng";
  else if (detectedDialects.has("Banjar")) greetings = "Ibu / Acil";
  else if (detectedDialects.has("NusaTenggara")) greetings = "Mama";
  else if (detectedDialects.has("Batak")) greetings = "Inang";

  return {
    rawText,
    normalizedText: text.replace(/\s+/g, " ").trim(),
    detectedDialects: Array.from(detectedDialects),
    localCommodities: Array.from(new Set(localCommodities)),
    greetings,
    isDialectDetected: detectedDialects.size > 0
  };
}

