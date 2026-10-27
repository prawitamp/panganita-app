import { NextResponse } from "next/server";
import { profile } from "@/lib/db";
import { searchKnowledgeBase, getFallbackResponse } from "@/lib/ragKnowledge";

/**
 * Endpoint RAG AI Chatbot Bu Nita
 * POST /api/chat
 * Integrasi Retrieval-Augmented Generation (RAG) resmi Panganita
 * dengan Google Gemini API & Basis Pengetahuan Gizi 15 Halaman
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

    // 2. TAHAP AUGMENTASI & PROMPT ENGINEERING (Persona Bu Nita AI)
    const systemPrompt = `Anda adalah Bu Nita AI, asisten konseling gizi dan pangan keluarga terpercaya dari platform Panganita.
Misi utama Anda adalah mendampingi ibu hamil, ibu menyusui, dan keluarga balita di wilayah pedesaan dan pesisir nusantara, khususnya lokus Teluk Bintuni, Papua Barat, untuk mengoptimalkan 1.000 Hari Pertama Kehidupan (1000 HPK) dan mencegah stunting.

LANDASAN PENGETAHUAN RESMI (RAG KNOWLEDGE BASE):
${contextText}

PEDOMAN GAYA BAHASA & KETENTUAN FORMAT KETAT:
1. Sapa pengguna dengan hangat, ramah, dan santun (panggil dengan "${motherName}").
2. Prioritaskan 14 komoditas pangan lokal pekarangan: Ikan Lele, Ikan Kembung, Udang, Ikan Tongkol, Ikan Gurame, Pisang, Tomat, Buah Naga, Jagung, Singkong, Ubi Jalar, Bayam, Kangkung, dan Telur Ayam Ras.
3. Sebutkan sumber data medis valid dalam penjelasan Anda (misalnya: "Berdasarkan data TKPI Kemenkes RI...", "Merujuk Buku Panduan Panganita Halaman ${sourcePages.join(", ")}...", atau "Sesuai standar AKG Permenkes Nomor 28 Tahun 2019...").
4. LARANGAN KERAS FORMAT: DILARANG KERAS menggunakan tanda bintang (* atau **) untuk huruf tebal/miring, dan DILARANG menggunakan tanda pagar (#). Gunakan kalimat mengalir, paragraf teratur, atau penomoran angka biasa (1., 2., 3.) agar teks bersih dan nyaman dibacakan oleh fitur Suara (Text-to-Speech) serta nyaman dibaca di layar ponsel.
5. Berikan jawaban yang tuntas, lengkap, praktis untuk dapur rumahan sederhana, dan bebas dari menyalahkan ibu (no victim-blaming).`;

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
                  text: `${systemPrompt}\n\nPertanyaan dari ${motherName}: "${userMessage}"\n\nJawaban lengkap Bu Nita AI:`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 2048,
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

    // 5. PEMBERSIHAN FORMAT AKHIR: Pastikan nol tanda bintang dan nol tanda pagar
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
