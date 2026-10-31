import { NextResponse } from "next/server";
import { execFile } from "child_process";
import path from "path";
import fs from "fs";
import { promisify } from "util";
import { FOOD_DETECTION_MAP, getFoodMetadata } from "@/data/foodDetectionMap";

const execFileAsync = promisify(execFile);

/**
 * Endpoint Computer Vision Panganita
 * POST /api/detect
 * Mengintegrasikan Model YOLO26n Panen (Karya Aulya Rakhmawati, PIC CV Kelompok 10)
 * Dual-Mode Engine:
 * 1. Mode Lokal: Menjalankan cvInference.py dengan bobot best.pt secara read-only.
 * 2. Mode Cloud/Serverless Vercel: Google Gemini Vision AI yang dipetakan ketat ke 15 kelas panganita.
 */
export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { image, sampleClass } = body;

    // Skenario 1: Pengujian Cepat dengan Sampel Komoditas
    let imageToProcess = image;
    let sampleImagePath = null;

    if (sampleClass) {
      const sampleMap = {
        ikan_lele: "ikanlele10.jpg",
        bayam: "bayam2.jpg",
        tomat: "Tomato_041.jpg",
        pisang: "Banana_002.jpg",
        jagung: "jagung1.jpg",
        kangkung: "kangung5.jpg",
        ikan_kembung: "kembung_4_jpg.rf.9e37355a4f2429250b005745a56f861d.jpg",
        udang: "udang7.jpg",
        wortel: "wortel.jpg",
        buah_naga: "Dragon_fruit.jpg",
        ikan_gurame: "gurame1.jpg",
        ikan_tongkol: "ikantongkol4.jpg",
      };

      const filename = sampleMap[sampleClass];
      if (filename) {
        const testDir = path.join(
          process.cwd(),
          "ai-pipeline",
          "cv",
          "dataset-yolo-detect",
          "images",
          "test"
        );
        const resolvedPath = path.join(testDir, filename);
        if (fs.existsSync(resolvedPath)) {
          sampleImagePath = resolvedPath;
          imageToProcess = resolvedPath;
        }
      }
    }

    if (!imageToProcess) {
      return NextResponse.json(
        { success: false, error: "Gambar atau pilihan sampel komoditas harus disertakan." },
        { status: 400 }
      );
    }

    let rawResult = null;
    let engineUsed = "YOLO26n Local (Aulya Rakhmawati, PIC CV)";

    // 1. Jalankan Engine Lokal YOLO26n via Python jika tersedia
    const pythonPaths = [
      path.join(process.cwd(), "..", ".venv", "bin", "python3"),
      path.join(process.cwd(), ".venv", "bin", "python3"),
      "python3",
      "python",
    ];

    let foundPython = null;
    for (const p of pythonPaths) {
      if (p.startsWith("/") && fs.existsSync(/*turbopackIgnore: true*/ p)) {
        foundPython = p;
        break;
      }
    }
    if (!foundPython) foundPython = "python3";

    const scriptPath = path.join(process.cwd(), "src", "lib", "cvInference.py");
    const weightsPath = path.join(
      process.cwd(),
      "ai-pipeline",
      "cv",
      "runs",
      "yolo26n_detect_v1",
      "weights",
      "best.pt"
    );

    if (fs.existsSync(weightsPath) && fs.existsSync(scriptPath)) {
      try {
        const { stdout } = await execFileAsync(
          foundPython,
          [scriptPath, imageToProcess, weightsPath],
          { timeout: 15000, maxBuffer: 10 * 1024 * 1024 }
        );
        const parsed = JSON.parse(stdout.trim());
        if (parsed && parsed.success) {
          rawResult = parsed;
        }
      } catch (err) {
        console.warn("Local YOLO execution failed, falling back to Gemini Vision:", err.message);
      }
    }

    // 2. Fallback ke Google Gemini Vision jika python/YOLO lokal tidak tersedia (misal di Vercel serverless)
    if (!rawResult || !rawResult.detections || rawResult.detections.length === 0) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey) {
        try {
          const geminiResult = await runGeminiVisionDetection(imageToProcess, apiKey);
          if (geminiResult && geminiResult.detections && geminiResult.detections.length > 0) {
            rawResult = geminiResult;
            engineUsed = "Gemini Vision AI (Fallback Cloud Engine)";
          }
        } catch (gemErr) {
          console.error("Gemini Vision fallback error:", gemErr);
        }
      }
    }

    // 3. Jika tetap belum ada deteksi (misal gambar blur atau bukan bahan makanan), sediakan respons informatif
    const detections = (rawResult?.detections || []).map((det) => {
      const meta = getFoodMetadata(det.class);
      return {
        ...det,
        metadata: meta || {
          name: det.class,
          icon: "🌱",
          category: "greens",
          categoryName: "Hasil Panen",
          defaultPrice: "20000",
          defaultWeight: "1.0",
          nutrition: {
            protein: "Kaya Gizi Alami",
            calories: "100 kkal",
            keyNutrient: "Nutrisi Alami Pekarangan",
            stuntingBenefit: "Mendukung asupan gizi seimbang keluarga dan balita.",
            mpasiRecommendation: "Masak matang dan sesuaikan tekstur dengan usia anak.",
          },
        },
      };
    });

    const primary = detections[0] || null;

    // Konversi gambar sampel ke base64 untuk preview di frontend jika menggunakan sampleClass
    let previewImage = image;
    if (sampleImagePath && fs.existsSync(sampleImagePath)) {
      const fileData = fs.readFileSync(sampleImagePath);
      const mime = sampleImagePath.endsWith(".png") ? "image/png" : "image/jpeg";
      previewImage = `data:${mime};base64,${fileData.toString("base64")}`;
    }

    return NextResponse.json({
      success: true,
      engine: engineUsed,
      modelOrigin: "Aulya Rakhmawati (PIC Database & CV Kelompok 10 Malahayati)",
      previewImage: previewImage || null,
      totalDetected: detections.length,
      detections,
      primary,
      summary: primary
        ? `Berhasil mendeteksi ${primary.metadata.name} dengan tingkat keyakinan ${Math.round(
            primary.confidence * 100
          )}%. Komoditas ini kaya akan ${primary.metadata.nutrition.keyNutrient}.`
        : "Tidak ada komoditas pangan yang terdeteksi dengan jelas. Silakan ambil foto panen yang lebih terang dan fokus.",
    });
  } catch (error) {
    console.error("Error in /api/detect:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Gagal memproses deteksi gambar." },
      { status: 500 }
    );
  }
}

/**
 * Fallback engine menggunakan Google Gemini Vision AI
 * Dikalibrasi spesifik untuk 15 kelas komoditas panganita buatan Aulya
 */
async function runGeminiVisionDetection(imageInput, apiKey) {
  let base64Data = imageInput;
  let mimeType = "image/jpeg";

  if (imageInput.startsWith("data:")) {
    const match = imageInput.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
    if (match) {
      mimeType = match[1];
      base64Data = match[2];
    }
  } else if (fs.existsSync(imageInput)) {
    const fileBuf = fs.readFileSync(imageInput);
    base64Data = fileBuf.toString("base64");
    if (imageInput.endsWith(".png")) mimeType = "image/png";
  }

  const model = "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const allowedClasses = [
    "ikan_lele",
    "ikan_kembung",
    "ikan_tongkol",
    "ikan_gurame",
    "udang",
    "bayam",
    "kangkung",
    "wortel",
    "tomat",
    "singkong",
    "ubi_jalar",
    "jagung",
    "pisang",
    "buah_naga",
    "telur_ayam_ras",
  ];

  const promptText = `Anda adalah sistem pendeteksi komoditas panen pangan lokal untuk aplikasi Panganita pencegahan stunting.
Periksa gambar ini dan kenali objek pangan dari daftar 15 kelas berikut:
${allowedClasses.join(", ")}

Kembalikan HANYA format JSON valid tanpa tanda markdown (tanpa \`\`\`json):
{
  "detections": [
    {
      "class": "nama_kelas_dari_daftar_di_atas",
      "confidence": 0.85,
      "normalizedBox": {
        "top": 15,
        "left": 20,
        "width": 60,
        "height": 55
      }
    }
  ]
}
Catatan: normalizedBox adalah persentase (0-100) koordinat bounding box di gambar. Jika objek bukan salah satu dari 15 kelas di atas, jangan dimasukkan.`;

  const payload = {
    contents: [
      {
        parts: [
          { text: promptText },
          {
            inline_data: {
              mime_type: mimeType,
              data: base64Data,
            },
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.1,
      response_mime_type: "application/json",
    },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Gemini Vision API status ${res.status}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
  const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
  const parsed = JSON.parse(cleaned);

  return {
    success: true,
    engine: "Gemini Vision AI (Cloud Fallback)",
    detections: parsed.detections || [],
  };
}
