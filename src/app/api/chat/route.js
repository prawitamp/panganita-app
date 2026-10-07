import { NextResponse } from "next/server";
import { profile } from "@/lib/db";

// POST /api/chat
export async function POST(request) {
  try {
    const body = await request.json();
    const userMessage = body?.message || "";

    if (!userMessage.trim()) {
      return NextResponse.json(
        { success: false, error: "Pesan tidak boleh kosong" },
        { status: 400 }
      );
    }

    const motherName = profile.name?.trim() ? `Ibu ${profile.name.trim()}` : "Ibu";
    const lower = userMessage.toLowerCase();

    // Konseling responsif Bu Nita (Penyuluh Posyandu)
    let reply = `Terima kasih ${motherName} sudah berkonsultasi. Menjaga asupan protein hewani dan sayuran pekarangan setiap hari sangat ampuh untuk mencegah stunting pada buah hati tercinta.`;

    if (
      lower.includes("tahan") ||
      lower.includes("simpan") ||
      lower.includes("toples") ||
      lower.includes("basi") ||
      lower.includes("awet")
    ) {
      reply =
        `Abon lele pekarangan ini tahan hingga 5 hari jika disimpan di dalam toples kaca kedap udara yang bersih dan kering pada suhu ruang ya Bu! Jika disimpan di kulkas atau freezer, bisa tahan hingga 1 bulan.`;
    } else if (
      lower.includes("resep") ||
      lower.includes("masak") ||
      lower.includes("cara olah") ||
      lower.includes("mpasi") ||
      lower.includes("menu")
    ) {
      reply =
        `Untuk menu MPASI si kecil, kukus daging ikan lele atau kakap hingga matang, lalu suwir halus bebas duri. Padukan dengan kaldu bumbu kuning alami dan daun kelor tumbuk agar nutrisi protein hewani dan zat besinya terserap maksimal!`;
    } else if (
      lower.includes("lele") ||
      lower.includes("kakap") ||
      lower.includes("ikan") ||
      lower.includes("lauk") ||
      lower.includes("protein")
    ) {
      reply =
        `Ikan lele dan kakap segar kaya akan protein hewani dan asam lemak Omega-3 (DHA & EPA) yang sangat penting untuk kecerdasan otak balita. 1 potong sehari sudah memenuhi kebutuhan asam amino harian si kecil.`;
    } else if (
      lower.includes("sayur") ||
      lower.includes("kelor") ||
      lower.includes("katuk") ||
      lower.includes("bayam")
    ) {
      reply =
        `Daun kelor pekarangan sangat kaya zat besi alami untuk mencegah anemia pada ibu hamil dan balita. Masak sebentar saja (1-2 menit) setelah api dimatikan agar vitamin C dan zat besinya tidak rusak ya Bu!`;
    } else if (
      lower.includes("stunting") ||
      lower.includes("tinggi") ||
      lower.includes("berat") ||
      lower.includes("badan") ||
      lower.includes("kurus") ||
      lower.includes("tumbuh")
    ) {
      reply =
        `Kunci utama pencegahan stunting di 1.000 Hari Pertama Kehidupan adalah konsistensi protein hewani setiap hari. Memanfaatkan hasil panen pekarangan sendiri jauh lebih hemat dan terjamin kesegarannya tanpa formalin.`;
    } else if (
      lower.includes("gtm") ||
      lower.includes("makan") ||
      lower.includes("nafsu") ||
      lower.includes("susah")
    ) {
      reply =
        `Jika si kecil sedang sulit makan (GTM), coba variasikan penyajiannya, Bu. Misalnya buat perkedel lele kukus atau abon lele wangi yang ditabur di atas bubur hangat agar aromanya menggugah selera si kecil.`;
    } else if (lower.includes("suara") || lower.includes("catatan suara") || lower.includes("vn")) {
      reply =
        `Terima kasih ${motherName}, Bu Nita sudah mendengarkan pesan suara Ibu. Menjaga gizi buah hati dengan hasil panen sendiri adalah keputusan terbaik. Silakan tanyakan resep atau takaran yang Ibu butuhkan ya!`;
    }

    const timezone = profile.province?.toLowerCase().includes("papua")
      ? "WIT"
      : profile.province?.toLowerCase().includes("sulawesi") || profile.province?.toLowerCase().includes("ntt") || profile.province?.toLowerCase().includes("bali")
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
        sender: "Bu Nita",
        time: currentTime,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Gagal memproses pesan konsultasi" },
      { status: 500 }
    );
  }
}
