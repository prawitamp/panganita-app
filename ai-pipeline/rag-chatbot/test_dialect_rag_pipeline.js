/**
 * Test Suite AI Pipeline RAG Chatbot Bu Nita
 * Validasi Dukungan Multidialek Daerah Nusantara & Audio Voice Note Lintas Browser (Incognito/Firefox/Edge/Chrome)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Impor kamus dan modul dialek normalizer
import { normalizeDialectText } from "../../src/lib/dialectNormalizer.js";
import { searchKnowledgeBase, getFallbackResponse, KNOWLEDGE_CHUNKS } from "../../src/lib/ragKnowledge.js";

console.log("================================================================================");
console.log("🧪 MEMULAI PENGUJIAN AI PIPELINE RAG CHATBOT BU NITA - MULTIDIALEK & VOICE NOTE");
console.log("================================================================================\n");

// 1. DAFTAR TEST CASES MULTIDIALEK NUSANTARA
const TEST_CASES = [
  {
    id: "TC-01-PAPUA",
    region: "Papua (Teluk Bintuni - Lokus Panganita)",
    speaker: "Mama Nurhayati (Bintuni)",
    query: "Tong pu anak ini tra mau makan papeda sama ikan lele, badan lemas sekali, ada resep ka Bu Nita?",
    expectedDialect: "Papua",
    expectedKeywords: ["ikan lele", "sagu pekarangan", "tidak mau makan", "lemas"],
    scenario: "Ibu pedesaan Papua mengeluh anak GTM tidak mau makan bubur sagu (papeda) dan lele"
  },
  {
    id: "TC-02-SUNDA",
    region: "Sunda (Banten / Lebak / Pandeglang)",
    speaker: "Ibu Enok (Pandeglang)",
    query: "Bu Nita, ieu budak leutik abdi nuju tiris sareng embung tuang lele, sae teu pami dipasihan daun kelor?",
    expectedDialect: "Sunda",
    expectedKeywords: ["bayi anak balita", "demam panas dingin meriang", "GTM tidak mau makan", "daun kelor"],
    scenario: "Ibu di desa Banten bertanya anak demam dan GTM lele, apakah bagus diberi daun kelor"
  },
  {
    id: "TC-03-JAWA",
    region: "Jawa (Jawa Tengah / Jawa Timur / Banyumas)",
    speaker: "Ibu Sri (Banyumas)",
    query: "Bu Nita, anak kulo mboten purun nedha lele, awake anget sanget, abon lele niku awet pinten dinten nggih?",
    expectedDialect: "Jawa",
    expectedKeywords: ["anak balita saya", "GTM tidak mau makan", "badan demam panas", "tahan berapa hari"],
    scenario: "Ibu Jawa menanyakan anak tidak mau makan lele dan daya simpan abon lele toples"
  },
  {
    id: "TC-04-MINANG",
    region: "Minang (Sumatera Barat)",
    speaker: "Uni Desi (Padang Pariaman)",
    query: "Bu Nita, anak ambo indak namuah makan nasi jo lauk kembung, baa caronyo mangolah supayo inyo nio makan?",
    expectedDialect: "Minang",
    expectedKeywords: ["anak saya", "GTM tidak mau makan", "ikan kembung", "bagaimana caranya"],
    scenario: "Ibu Minang menanyakan cara mengolah ikan kembung untuk anak yang tidak mau makan"
  },
  {
    id: "TC-05-MAKASSAR",
    region: "Bugis / Makassar (Sulawesi Selatan)",
    speaker: "Daeng Bau (Gowa / Bone)",
    query: "Bu Nita, anakkong teai manre lele, le'ba' mamburisi' pole, baiko naoki narekko diurungang daun kelor?",
    expectedDialect: "Makassar",
    expectedKeywords: ["anak balita saya", "GTM tidak mau makan", "demam panas", "daun kelor"],
    scenario: "Ibu di Sulsel menanyakan anak demam dan tidak mau makan lele dipadukan daun kelor"
  },
  {
    id: "TC-06-BANJAR",
    region: "Banjar (Kalimantan Selatan)",
    speaker: "Acil Anisah (Martapura)",
    query: "Bu Nita, anak ulun kada hakun makan iwak, panas awaknya, ada resep nang nyaman lah?",
    expectedDialect: "Banjar",
    expectedKeywords: ["anak balita saya", "GTM tidak mau makan", "demam panas", "ikan"],
    scenario: "Ibu Banjar mengeluhkan anak demam tidak mau makan iwak (ikan)"
  },
  {
    id: "TC-07-KUPANG_NTT",
    region: "Nusa Tenggara Timur (Kupang / Flores)",
    speaker: "Mama Maria (Kupang)",
    query: "Bu Nita, ini anak sonde mau makan kelor deng lele, badan panas karmana su?",
    expectedDialect: "NusaTenggara",
    expectedKeywords: ["tidak mau makan", "daun kelor", "ikan lele", "bagaimana caranya"],
    scenario: "Ibu NTT mengeluhkan anak tidak mau makan kelor (marungga) dan lele saat demam"
  },
  {
    id: "TC-08-INCOGNITO_VN",
    region: "Semua Browser (Chrome Incognito / Firefox / Edge Raw Audio)",
    speaker: "Voice Note Recorder (Audio Base64 Simulator)",
    query: "🎤 Pesan Suara Ibu (00:09) [Audio Base64 Payload]",
    isAudioPayload: true,
    audioBase64: "GkXfo59ChoEBQveBAULygQ8USAhOuwEAAAAAAAA+t3vh8gAAAAAAAAA=",
    mimeType: "audio/webm",
    duration: "0:09",
    simulatedTranscript: "Bu Nita, bagaimana cara menyimpan abon lele di toples agar awet tidak basi?",
    scenario: "Pengujian Voice Note di browser Incognito / Firefox tanpa Web Speech API"
  }
];

const results = [];
let passedCount = 0;

TEST_CASES.forEach((tc, idx) => {
  console.log(`\n--------------------------------------------------------------------------------`);
  console.log(`[TEST ${idx + 1}/${TEST_CASES.length}] ${tc.id}: ${tc.region}`);
  console.log(`Pengguna: ${tc.speaker}`);
  console.log(`Skenario: ${tc.scenario}`);
  console.log(`Input: "${tc.query}"`);

  const startTime = Date.now();

  // 1. Uji Normalisasi Dialek
  const effectiveQuery = tc.isAudioPayload ? tc.simulatedTranscript : tc.query;
  const dialectData = normalizeDialectText(effectiveQuery);

  console.log(`-> Dialek Terdeteksi: ${dialectData.detectedDialects.join(", ") || "(Bahasa Indonesia Baku)"}`);
  console.log(`-> Normalisasi Semantik: "${dialectData.normalizedText}"`);
  console.log(`-> Komoditas Dikenali: ${dialectData.localCommodities.join(", ") || "-"}`);

  // 2. Uji Retrieval RAG
  const retrievedChunks = searchKnowledgeBase(effectiveQuery, 3);
  const sourcePages = Array.from(new Set(retrievedChunks.map((c) => c.page))).sort((a, b) => a - b);
  console.log(`-> Retrieval RAG: Berhasil mengambil ${retrievedChunks.length} chunks dari Halaman: ${sourcePages.join(", ")}`);

  // 3. Uji Generasi Respon (Fallback Cerdas Multidialek Panganita)
  const answer = getFallbackResponse(effectiveQuery, tc.speaker);
  const latency = (Date.now() - startTime) / 1000;

  // 4. Validasi Format Kepatuhan Ketat
  const hasAsterisk = answer.includes("*");
  const hasHash = answer.includes("#");
  const hasDisclaimer = answer.includes("⚠️ Penafian Medis:");
  const hasCitation = answer.includes("📚 Rujukan: Buku Panduan Panganita");
  const hasEmoji = /[\u{1F300}-\u{1F9FF}]/u.test(answer);

  // Kriteria Kelulusan
  const isDialectPass = tc.isAudioPayload || dialectData.detectedDialects.includes(tc.expectedDialect);
  const isRetrievalPass = retrievedChunks.length > 0;
  const isFormattingPass = !hasAsterisk && !hasHash && hasDisclaimer && hasCitation && hasEmoji;

  const passed = isDialectPass && isRetrievalPass && isFormattingPass;
  if (passed) passedCount++;

  console.log(`-> Format Validasi: Bebas Markdown Kasar? ${!hasAsterisk && !hasHash ? "YA ✅" : "TIDAK ❌"}`);
  console.log(`-> Penafian Medis IBM SkillsBuild? ${hasDisclaimer ? "YA ✅" : "TIDAK ❌"}`);
  console.log(`-> Sitasi Buku Panduan? ${hasCitation ? "YA ✅" : "TIDAK ❌"}`);
  console.log(`-> Status: ${passed ? "PASSED (100% LOLOS) ✅" : "FAILED ❌"}`);

  results.push({
    test_id: tc.id,
    region: tc.region,
    speaker: tc.speaker,
    query: tc.query,
    detected_dialect: dialectData.detectedDialects,
    normalized_query: dialectData.normalizedText,
    retrieved_pages: sourcePages,
    retrieved_chunks_count: retrievedChunks.length,
    response_preview: answer.substring(0, 180) + "...",
    latency_seconds: latency,
    formatting_check: {
      zero_asterisks: !hasAsterisk,
      zero_hashes: !hasHash,
      has_disclaimer: hasDisclaimer,
      has_citation: hasCitation,
      has_emoji: hasEmoji
    },
    status: passed ? "PASSED" : "FAILED"
  });
});

console.log("\n================================================================================");
console.log(`📊 RINGKASAN HASIL PENGUJIAN: ${passedCount} / ${TEST_CASES.length} TEST CASES LOLOS (${Math.round((passedCount / TEST_CASES.length) * 100)}%)`);
console.log("================================================================================\n");

// Simpan hasil ke file JSON
const outputPath = path.join(__dirname, "dialect_test_results.json");
fs.writeFileSync(outputPath, JSON.stringify({
  timestamp: new Date().toISOString(),
  total_tests: TEST_CASES.length,
  passed_tests: passedCount,
  success_rate: `${Math.round((passedCount / TEST_CASES.length) * 100)}%`,
  test_details: results
}, null, 2));

console.log(`Hasil pengujian tersimpan rapi di: ${outputPath}`);
