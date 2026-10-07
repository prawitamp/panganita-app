import React from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/common/BottomNav";
import { ASSETS, getAssetUrl } from "@/constants/assets";
import { usePanganita } from "@/context/PanganitaContext";
import { hitungCadangan, mapProfileToAnggota } from "@/lib/panganitaCadangan";

function NitaResultCard({ setScreen, router, keep, motherName, targetBeneficiary, keepAmount, sellAmount }) {
  const handleChat = () => {
    if (setScreen) setScreen("nita-chat");
    if (router) router.push("/bu-nita");
  };

  return (
    <section className="result-nita">
      <img src={ASSETS.nitaAvatar} alt="Bu Nita" />
      <div>
        <h3>
          Bu Nita <span>Konselor Gizi Panganita</span>
        </h3>
        <p>
          {keep
            ? `Pilihan luar biasa, ${motherName}! Kebutuhan protein hewani untuk ${targetBeneficiary} sudah aman terkunci. Sekarang, mari Bu Nita bantu rekomendasi menu bergizi dari hasil panen pekarangan Ibu.`
            : `${motherName}, Bu Nita sangat memahami kebutuhan uang belanja hari ini. Namun jika semua hasil panen langsung dijual, sebagian uangnya sering kali harus dialokasikan lagi untuk membeli lauk pengganti dari luar.`}
        </p>
        {!keep ? (
          <div className="smart-solution">
            <strong>Mau solusi yang lebih untung?</strong>
            Sisihkan {keepAmount} Kg untuk lauk {targetBeneficiary}, lalu jual {sellAmount.toFixed(1)} Kg ke pasar agar dapur tetap hemat dan anak-anak tetap berenergi.
          </div>
        ) : null}
        <button onClick={handleChat}>
          {keep ? "Buka Panduan Resep & Chat Bu Nita" : "Tanya Solusi ke Bu Nita"}
        </button>
      </div>
    </section>
  );
}

export default function DecisionResultScreen({ setScreen, decision }) {
  const router = useRouter();
  const keep = decision === "keep";
  const context = usePanganita();
  const profile = context?.profile || {};
  const currentWeight = Number(context?.detectedWeight || "2.0");
  const children = Array.isArray(profile.children) ? profile.children : [];
  
  // Format daftar seluruh anak atau target gizi keluarga secara lengkap
  const targetBeneficiary =
    children.length === 1
      ? children[0].name || "Si Kecil"
      : children.length === 2
      ? `${children[0].name || "Anak 1"} & ${children[1].name || "Anak 2"}`
      : children.length > 2
      ? `${children.slice(0, -1).map((c, i) => c.name || `Anak ke-${i + 1}`).join(", ")} & ${children[children.length - 1].name || "Si Kecil"}`
      : profile.familyCondition?.includes?.("pregnant")
      ? "Ibu Hamil & Janin"
      : profile.familyCondition?.includes?.("breastfeeding")
      ? "Ibu Menyusui & Bayi"
      : "Balita Keluarga";

  const motherName = profile.name?.trim() ? `Ibu ${profile.name.trim()}` : "Ibu";
  const userLocation = profile.location || "Teluk Bintuni, Papua Barat";

  // Perhitungan porsi menggunakan rumus resmi dari tutor (Standar Kemenkes)
  const mappedAnggota = mapProfileToAnggota(profile);
  const hasilHitung = hitungCadangan({
    bahan: "ikan-lele",
    beratPanenKg: currentWeight,
    anggota: mappedAnggota,
    hariCadangan: 3,
  });

  const keepAmount = hasilHitung.keputusan?.disimpanKg ?? 0.8;
  const sellAmount = hasilHitung.keputusan?.dijualKg ?? Math.max(0, currentWeight - keepAmount);
  const keepPercent = currentWeight > 0 ? Math.round((keepAmount / currentWeight) * 100) : 0;
  const sellPercent = 100 - keepPercent;

  const handleBack = () => {
    if (setScreen) setScreen("simulator");
    router.push("/simulator");
  };

  return (
    <main className="decision-page">
      <div className="result-shell">
        <header className="result-header">
          <button onClick={handleBack} aria-label="Kembali ke Simulator">
            <img src={ASSETS.backArrowDark} alt="" />
          </button>
          <div>
            <h1>Hasil Keputusan</h1>
            <p>{keep ? `Tumbuh1000 • ${targetBeneficiary}` : `${motherName} • ${userLocation}`}</p>
          </div>
          <span className={keep ? "saved" : "warning"}>
            {keep ? "Tersimpan Otomatis" : "Perlu Pertimbangan"}
          </span>
        </header>

        {keep ? (
          <>
            <section className="locked-result">
              <span>
                <img src={getAssetUrl("9e02c.svg")} alt="" /> KEPUTUSAN TERKUNCI &amp;
                TERBAIK
              </span>
              <h2>Pilihan 1: Sisihkan {keepAmount} Kg untuk {targetBeneficiary}</h2>
              <p>
                Alokasi dari total panen pekarangan {currentWeight} Kg lele segar hari ini.
                {sellAmount.toFixed(1)} Kg tetap dijual untuk kas keluarga.
              </p>
              <div>
                <span>
                  Bagian Anak <strong>{keepAmount} Kg ({keepPercent}%)</strong>
                </span>
                <span>
                  Kas Terjual <strong>{sellAmount.toFixed(1)} Kg ({sellPercent}%)</strong>
                </span>
              </div>
            </section>

            <h2 className="impact-title">Dampak Nyata Keputusan</h2>
            <div className="impact-grid">
              <div>
                <img src={getAssetUrl("889e9.svg")} alt="" />
                <strong>100% AKG Terpenuhi</strong>
                <span>Kebutuhan Protein Hewani {targetBeneficiary} Sesuai Standar Kemenkes</span>
              </div>
              <div>
                <img src={getAssetUrl("c45d4.svg")} alt="" />
                <strong>Hemat Rp {Math.round(keepAmount * 2 * 30000).toLocaleString("id-ID")}</strong>
                <span>Substitusi Susu Formula &amp; Suplemen</span>
              </div>
              <div className="wide">
                <img src={getAssetUrl("2bec1.svg")} alt="" />
                <strong>Nutrisi {targetBeneficiary} Aman 3 Hari ke Depan</strong>
                <span>
                  Protein hewani bersih tanpa pengawet atau formalin, segar dari
                  kolam bioflok.
                </span>
              </div>
            </div>

            <NitaResultCard
              setScreen={setScreen}
              router={router}
              keep={true}
              motherName={motherName}
              targetBeneficiary={targetBeneficiary}
              keepAmount={keepAmount}
              sellAmount={sellAmount}
            />
          </>
        ) : (
          <>
            <div className="result-tags">
              <span>Panen Kolam Pekarangan</span>
              <span>Simulasi Imbangan Porsi &amp; Uang</span>
            </div>

            <section className="cash-analysis">
              <div>
                <strong>Pilihan: Jual Semua Panen ({currentWeight} Kg)</strong>
                <span>Harga Rp {Number(context?.harvestPrice || 30000).toLocaleString("id-ID")}/kg</span>
              </div>
              <h2>Analisis Arus Kas &amp; Gizi Nyata</h2>
              <p>
                Perhitungan riil dompet &amp; kebutuhan dapur 3 hari ke depan
              </p>
              <dl>
                <div>
                  <dt>Penerimaan Tunai Cepat</dt>
                  <dd>+Rp {(currentWeight * Number(context?.harvestPrice || 30000)).toLocaleString("id-ID")}</dd>
                </div>
                <div>
                  <dt>Alokasi Lauk Pengganti (3 Hari)</dt>
                  <dd>-Rp {Math.round(keepAmount * 2 * 30000).toLocaleString("id-ID")}</dd>
                </div>
                <div>
                  <dt>Sisa Uang Bersih Sebenarnya:</dt>
                  <dd>Rp {Math.max(0, currentWeight * Number(context?.harvestPrice || 30000) - Math.round(keepAmount * 2 * 30000)).toLocaleString("id-ID")}</dd>
                </div>
              </dl>
              <b>
                Pertimbangan Nutrisi: Diperlukan alokasi lauk luar pengganti agar
                asupan protein hewani untuk {targetBeneficiary} tetap terpenuhi minggu ini.
              </b>
            </section>

            <NitaResultCard
              setScreen={setScreen}
              router={router}
              keep={false}
              motherName={motherName}
              targetBeneficiary={targetBeneficiary}
              keepAmount={keepAmount}
              sellAmount={sellAmount}
            />
          </>
        )}

        <BottomNav active={null} setScreen={setScreen} />
      </div>
    </main>
  );
}
