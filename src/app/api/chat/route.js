import { NextResponse } from "next/server";
import { profile } from "@/lib/db";
import { searchKnowledgeBase, getFallbackResponse } from "@/lib/ragKnowledge";

/**
 * Endpoint RAG AI Chatbot Bu Nita
 * POST /api/chat
 * Integrasi Retrieval-Augmented Generation (RAG) resmi Panganita
 * dengan Google Gemini API, Basis Pengetahuan Gizi 15 Halaman,
 * serta Prinsip Transparansi & Disclaimer Medis IBM SkillsBuild
 */
export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const userMessage = body?.message || "";

    if (!userMessage.trim()) {
      return NextResponse.json(
        { success: false, error: "Pesan tidak boleh kosong" },
        { status: 400 }
      );
    }

    const motherName = profile.name?.trim() ? `Ibu ${profile.name.trim()}` : "Ibu";
    const apiKey = process.env.GEMINI_API_KEY || "";
    const modelName = process.env.GEMINI_MODEL || "gemini-3-flash-preview";

    // 1. TAHAP RETRIEVAL: Cari 3 potongan dokumen paling relevan dari basis data 15 halaman
    const retrievedChunks = searchKnowledgeBase(userMessage, 3);
    const contextText = retrievedChunks
      .map((c, i) => `[Kutipan Dokumen ${i + 1} - Halaman ${c.page}]:\n${c.text}`)
      .join("\n\n");

    const sourcePages = Array.from(new Set(retrievedChunks.map((c) => c.page))).sort((a, b) => a - b);

    // 2. TAHAP AUGMENTASI & PROMPT ENGINEERING (Persona Bu Nita AI - Ramah, Ringkas, Ber-emoticon, Ber-disclaimer)
    const systemPrompt = `Anda adalah Bu Nita AI, sahabat gizi keluarga terpercaya dari platform Panganita untuk lokus pencegahan stunting di Teluk Bintuni, Papua Barat.

LANDASAN PENGETAHUAN RESMI (RAG KNOWLEDGE BASE):
${contextText}

PEDOMAN GAYA BAHASA & STRUKTUR FORMAT KETAT:
1. AFIRMASI AWAL: Awali HANYA dengan SATU kalimat sapaan hangat dan afirmasi positif singkat menggunakan emoji ramah (contoh: 'Halo ${motherName}! Senang sekali bisa membersamai Ibu merawat si kecil tercinta 🥰✨'). JANGAN bertele-tele di pembuka.
2. JEDA PARAGRAF WAJIB: Pisahkan setiap bagian paragraf dan setiap kelompok langkah dengan DUA KALI ENTER / BARIS KOSONG (double newline) agar teks lega, tidak menumpuk, dan nyaman dibaca di layar ponsel.
3. FORMAT POIN DENGAN EMOJI: Setiap poin bahan atau langkah pengolahan WAJIB berada di barisnya sendiri dan diawali emoticon yang relevan (misalnya 🐟, 🥣, 🌿, 💡, ⏰). DILARANG menulis nomor inline bersambung dalam satu baris panjang.
4. RINGKAS, PADAT & TIDAK TERPOTONG: Panjang jawaban inti maksimal 120-150 kata. Utamakan takaran dapur praktis, tekstur ramah lambung bayi, dan keamanan bebas duri. Jangan membuat esai panjang.
5. RUJUKAN RESMI: Cantumkan rujukan resmi singkat (contoh: '📚 Rujukan: Buku Panduan Panganita Hlm. ${sourcePages.join(", ")} & Standar AKG Kemenkes RI').
6. PENAFIAN MEDIS (DISCLAIMER TRANSPARANSI IBM SKILLSBUILD): Di baris paling akhir setelah rujukan, WAJIB sertakan disclaimer etika AI:
'⚠️ Penafian Medis: Bu Nita AI adalah asisten edukasi gizi dan bukan pengganti diagnosis dokter. Tindakan medis harus selalu dikonfirmasikan dengan tenaga kesehatan di fasilitas kesehatan setempat.'
7. LARANGAN KERAS FORMAT: DILARANG KERAS menggunakan tanda bintang (* atau **) untuk tebal/miring dan DILARANG menggunakan tanda pagar (#). Gunakan bahasa ibu-ibu kader posyandu yang santun, hangat, dan sangat suportif.`;

    let reply = "";

    // 3. TAHAP GENERASI (Google Gemini API)
    if (apiKey) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

        const payload = {
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `${systemPrompt}\n\nPertanyaan dari ${motherName}: "${userMessage}"\n\nJawaban Bu Nita AI:`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1400,
            thinkingConfig: {
              thinkingBudget: 0,
            },
          },
        };

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 9500);

        const geminiRes = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const rawReply = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawReply && rawReply.trim()) {
            reply = rawReply.trim();
          }
        } else {
          console.warn("Gemini API HTTP Error:", geminiRes.status, await geminiRes.text());
        }
      } catch (geminiError) {
        console.warn("Gagal menghubungi Gemini API, mengaktifkan Fallback Cerdas RAG:", geminiError.message);
      }
    }

    // 4. JIKA API KEY KOSONG ATAU GEMINI GAGAL: Gunakan RAG Intelligent Fallback
    if (!reply) {
      reply = getFallbackResponse(userMessage, motherName);
    }

    // 5. PEMBERSIHAN FORMAT AKHIR: Pastikan nol tanda bintang dan nol tanda pagar, serta jeda spasi rapi
    reply = reply
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/#/g, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    // Waktu lokal respon
    const timezone = profile.province?.toLowerCase().includes("papua")
      ? "WIT"
      : profile.province?.toLowerCase().includes("sulawesi") ||
        profile.province?.toLowerCase().includes("ntt") ||
        profile.province?.toLowerCase().includes("bali")
      ? "WITA"
      : "WIB";

    const currentTime =
      new Intl.DateTimeFormat("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date()) + ` ${timezone}`;

    return NextResponse.json({
      success: true,
      data: {
        reply,
        sender: "Bu Nita AI",
        time: currentTime,
        sources: sourcePages.map((p) => `Halaman ${p}`),
        retrievedCount: retrievedChunks.length,
      },
    });
  } catch (error) {
    console.error("Chat API Critical Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Gagal memproses pesan konsultasi Bu Nita AI",
      },
      { status: 500 }
    );
  }
}
