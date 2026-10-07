import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ASSETS, getAssetUrl } from "@/constants/assets";
import { usePanganita } from "@/context/PanganitaContext";
import {
  hitungCadangan,
  mapProfileToAnggota,
  BAHAN,
  KELOMPOK,
  KATEGORI,
  PENGATURAN,
} from "@/lib/panganitaCadangan";

export default function SimulatorScreen({
  setScreen,
  choice,
  setChoice,
  weight,
}) {
  const router = useRouter();
  const context = usePanganita();
  const profile = context?.profile || {};
  const children = Array.isArray(profile.children) ? profile.children : [];
  const familyCondition = Array.isArray(profile.familyCondition)
    ? profile.familyCondition
    : profile.familyCondition
    ? [profile.familyCondition]
    : [];

  const currentWeight = Number(weight || context?.detectedWeight || "2.0");
  const currentPrice = Number(context?.harvestPrice || 30000);
  const currentLocation =
    context?.harvestLocation ||
    (profile.location ? `Pasar ${profile.location.split(",")[0]}` : "Pasar Sentral Pandeglang");

  // State untuk Simulasi Interaktif Rumus Tutor
  const [selectedBahan, setSelectedBahan] = useState("ikan-lele");
  const [hariCadangan, setHariCadangan] = useState(3);
  const [showFormulaDetails, setShowFormulaDetails] = useState(false);

  // Inisialisasi daftar anggota dari profil pengguna
  const initialAnggotaList = mapProfileToAnggota(profile);
  const [anggotaState, setAnggotaState] = useState(() => {
    const initialMap = {};
    initialAnggotaList.forEach((a) => {
      initialMap[a.kelompok] = a.jumlah;
    });
    return initialMap;
  });

  // Susun array anggota untuk rumus
  const activeAnggota = Object.entries(anggotaState)
    .filter(([, jml]) => jml > 0)
    .map(([kelompok, jumlah]) => ({ kelompok, jumlah }));

  // Jalankan rumus resmi dari tutor
  const hasilHitung = hitungCadangan({
    bahan: selectedBahan,
    beratPanenKg: currentWeight,
    anggota: activeAnggota.length > 0 ? activeAnggota : initialAnggotaList,
    hariCadangan,
  });

  const keepAmount = hasilHitung.keputusan?.disimpanKg ?? 0.8;
  const sellAfterKeepAmount = hasilHitung.keputusan?.dijualKg ?? Math.max(0, currentWeight - keepAmount);
  const approxFishCount = Math.max(1, Math.round(keepAmount / 0.25));
  const totalMarketValue = currentWeight * currentPrice;
  const cashFromKeepChoice = sellAfterKeepAmount * currentPrice;
  const outsideFoodCost = Math.round(keepAmount * 2 * currentPrice);
  const netFromSellAll = Math.max(0, totalMarketValue - outsideFoodCost);

  // Handler Stepper Anggota
  const handleStepAnggota = (kelompokId, delta) => {
    setAnggotaState((prev) => {
      const cur = prev[kelompokId] || 0;
      const next = Math.max(0, cur + delta);
      return { ...prev, [kelompokId]: next };
    });
  };

  // Label nama anak atau target gizi
  const targetBeneficiary =
    children.length > 0
      ? children.map((c) => c.name || "Si Kecil").join(" & ")
      : familyCondition.includes("pregnant")
      ? "Ibu Hamil & Janin"
      : familyCondition.includes("breastfeeding")
      ? "Ibu Menyusui & Bayi"
      : "Balita Keluarga";

  const motherName = profile.name?.trim() ? `Ibu ${profile.name.trim()}` : "Ibu";

  const handleBack = () => {
    if (setScreen) setScreen("home");
    router.push("/beranda");
  };

  const handleAudio = () => {
    if (setScreen) setScreen("education");
    router.push("/edukasi");
  };

  return (
    <main className="decision-page">
      <div className="decision-shell">
        <header className="simulator-header">
          <button onClick={handleBack} aria-label="Kembali">
            <img src={ASSETS.backArrowDark} alt="" />
          </button>
          <div>
            <span>TUMBUH1000</span>
            <h1>Simulator Keputusan</h1>
          </div>
        </header>

        <section className="harvest-summary">
          <span className="harvest-summary-icon" style={{ overflow: "hidden", borderRadius: "14px" }}>
            <img
              src={context?.harvestPhoto || getAssetUrl("3418b.svg")}
              alt="Hasil panen"
              style={
                context?.harvestPhoto
                  ? { width: "100%", height: "100%", objectFit: "cover" }
                  : {}
              }
            />
          </span>
          <div>
            <small>PANEN PEKARANGAN HARI INI</small>
            <h1>{BAHAN[selectedBahan]?.nama || "Ikan Lele Segar"}: {currentWeight} Kg</h1>
            <p>
              Nilai Pasar: <strong>Rp {totalMarketValue.toLocaleString("id-ID")}</strong> (Rp {currentPrice.toLocaleString("id-ID")}/Kg)
            </p>
          </div>
          <span className="harvest-location-badge">📍 {currentLocation}</span>
        </section>

        {/* Banner Personalisasi Profil Keluarga */}
        <div
          className="simulator-profile-pill"
          style={{
            background: "#ecfdf5",
            border: "1.5px solid #a7f3d0",
            borderRadius: "14px",
            padding: "10px 14px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginTop: "14px",
            marginBottom: "8px",
          }}
        >
          <span style={{ fontSize: "20px" }}>🎯</span>
          <div style={{ flex: 1 }}>
            <strong style={{ color: "#065f46", fontSize: "13px" }}>
              Simulasi Khusus untuk Keluarga {motherName}:
            </strong>
            <p style={{ margin: 0, fontSize: "12px", color: "#047857" }}>
              Kebutuhan gizi disesuaikan untuk <strong>{targetBeneficiary}</strong> (alokasi panen {keepAmount} Kg untuk cadangan {hariCadangan} hari).
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowFormulaDetails(!showFormulaDetails)}
            style={{
              background: "#d1fae5",
              border: "1px solid #10b981",
              borderRadius: "8px",
              padding: "6px 10px",
              fontSize: "11px",
              fontWeight: "700",
              color: "#065f46",
              cursor: "pointer",
            }}
          >
            {showFormulaDetails ? "Tutup Rumus ▲" : "Atur Anggota ⚙️"}
          </button>
        </div>

        {/* Panel Interaktif Rumus & Anggota Keluarga (Sesuai CodePen Tutor) */}
        {showFormulaDetails && (
          <div
            className="simulator-formula-box"
            style={{
              background: "#ffffff",
              border: "1.5px solid #a7f3d0",
              borderRadius: "16px",
              padding: "16px",
              marginBottom: "14px",
              boxShadow: "0 4px 12px rgba(16, 185, 129, 0.08)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <div>
                <strong style={{ fontSize: "14px", color: "#065f46" }}>
                  📐 Rumus Cadangan Panen (Kemenkes & Standar Tim)
                </strong>
                <p style={{ margin: 0, fontSize: "11px", color: "#059669" }}>
                  Berdasarkan sheet & formula CodePen tutor ({hasilHitung.jumlahOrang} anggota aktif)
                </p>
              </div>
              <span style={{ fontSize: "12px", background: "#ecfdf5", color: "#047857", padding: "4px 8px", borderRadius: "6px", fontWeight: "700" }}>
                {hasilHitung.dasarHitung?.toUpperCase()}
              </span>
            </div>

            {/* Input Bahan & Hari Cadangan */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "12px" }}>
              <div>
                <label style={{ fontSize: "11px", fontWeight: "700", color: "#065f46", display: "block", marginBottom: "4px" }}>
                  Pilih Bahan Panen
                </label>
                <select
                  value={selectedBahan}
                  onChange={(e) => setSelectedBahan(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "7px 9px",
                    borderRadius: "8px",
                    border: "1px solid #a7f3d0",
                    background: "#f0fdf4",
                    fontSize: "12px",
                    color: "#065f46",
                    fontWeight: "600",
                  }}
                >
                  {Object.entries(KATEGORI).map(([katId, katName]) => (
                    <optgroup key={katId} label={katName}>
                      {Object.entries(BAHAN)
                        .filter(([, b]) => b.kategori === katId)
                        .map(([bId, b]) => (
                          <option key={bId} value={bId}>
                            {b.nama}
                          </option>
                        ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: "11px", fontWeight: "700", color: "#065f46", display: "block", marginBottom: "4px" }}>
                  Hari Cadangan
                </label>
                <select
                  value={hariCadangan}
                  onChange={(e) => setHariCadangan(Number(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "7px 9px",
                    borderRadius: "8px",
                    border: "1px solid #a7f3d0",
                    background: "#f0fdf4",
                    fontSize: "12px",
                    color: "#065f46",
                    fontWeight: "600",
                  }}
                >
                  <option value={1}>1 Hari</option>
                  <option value={2}>2 Hari</option>
                  <option value={3}>3 Hari (Standar)</option>
                  <option value={5}>5 Hari</option>
                  <option value={7}>7 Hari</option>
                </select>
              </div>
            </div>

            {/* Stepper Anggota Keluarga */}
            <label style={{ fontSize: "11px", fontWeight: "700", color: "#065f46", display: "block", marginBottom: "6px" }}>
              Sesuaikan Jumlah Anggota Keluarga:
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "200px", overflowY: "auto", paddingRight: "4px" }}>
              {Object.entries(KELOMPOK).map(([kId, kData]) => {
                const count = anggotaState[kId] || 0;
                return (
                  <div
                    key={kId}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "5px 8px",
                      background: count > 0 ? "#ecfdf5" : "#f8fafc",
                      border: count > 0 ? "1px solid #a7f3d0" : "1px solid #e2e8f0",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  >
                    <div>
                      <strong style={{ color: count > 0 ? "#065f46" : "#475569" }}>{kData.label}</strong>
                      <span style={{ display: "block", fontSize: "10px", color: "#64748b" }}>
                        AKG: {kData.protein}g protein, {kData.energi} kkal
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <button
                        type="button"
                        onClick={() => handleStepAnggota(kId, -1)}
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "6px",
                          border: "1px solid #cbd5e1",
                          background: "#ffffff",
                          cursor: "pointer",
                          fontWeight: "700",
                          color: "#0f172a",
                        }}
                      >
                        −
                      </button>
                      <span style={{ minWidth: "16px", textAlign: "center", fontWeight: "700", color: "#065f46" }}>
                        {count}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleStepAnggota(kId, 1)}
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "6px",
                          border: "1px solid #10b981",
                          background: "#d1fae5",
                          cursor: "pointer",
                          fontWeight: "700",
                          color: "#065f46",
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Rekap Angka Rumus */}
            <div
              style={{
                marginTop: "10px",
                padding: "8px 10px",
                background: "#f0fdf4",
                borderRadius: "8px",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                gap: "6px",
                fontSize: "11px",
                color: "#065f46",
              }}
            >
              <div>Kebutuhan harian: <strong>{hasilHitung.kebutuhan?.gramPerHari} g</strong></div>
              <div>Cadangan {hariCadangan} hari: <strong>{hasilHitung.kebutuhan?.totalCadanganKg} Kg</strong></div>
              <div>Panen cukup: <strong>{hasilHitung.keputusan?.cukupUntukHari ?? "-"} hari</strong></div>
              <div>Protein panen: <strong>{hasilHitung.giziPerHari?.proteinG} g/hari</strong></div>
            </div>
          </div>
        )}

        <div className="decision-heading">
          <div>
            <small>SIMULASI IMBANGAN GIZI VS UANG DAPUR</small>
            <h2>Bandingkan 2 Pilihan Anda</h2>
          </div>
          <span>Pilih 1 Opsi</span>
        </div>

        <div className="choice-grid">
          {/* Pilihan 1: Sisihkan Sesuai Kebutuhan Gizi Anak/Keluarga */}
          <button
            className={`decision-option keep ${
              choice === "keep" ? "selected" : ""
            }`}
            onClick={() => setChoice("keep")}
          >
            <span className="choice-radio">
              <img
                src={getAssetUrl(choice === "keep" ? "59a43.svg" : "2416d.svg")}
                alt=""
              />
            </span>
            <span className="choice-label">
              <img src={getAssetUrl("40a01.svg")} alt="" /> Rekomendasi Gizi Terbaik untuk {targetBeneficiary}
            </span>
            <h2>PILIHAN 1: Sisihkan {keepAmount} Kg</h2>
            <p>
              Simpan {keepAmount} Kg (~{approxFishCount} porsi) untuk lauk {targetBeneficiary}, jual {sellAfterKeepAmount.toFixed(1)} Kg ke pengepul.
            </p>
            <span className="choice-metrics">
              <span>
                <small>
                  <img src={getAssetUrl("272ae.svg")} alt="" /> GIZI PROTEIN
                </small>
                <strong>
                  {hasilHitung.giziPerHari?.persenAkgProtein
                    ? `${Math.round(hasilHitung.giziPerHari.persenAkgProtein * 100)}% AKG Protein`
                    : "100% AKG Terpenuhi"}
                </strong>
                {hasilHitung.giziPerHari?.proteinG}g protein/hari ({hariCadangan} hari aman)
              </span>
              <span>
                <small>
                  <img src={getAssetUrl("2abbc.svg")} alt="" /> HEMAT DAPUR
                </small>
                <strong>Hemat Rp {outsideFoodCost.toLocaleString("id-ID")}</strong>
                Dibandingkan beli lauk di luar
              </span>
            </span>
            <b>{hariCadangan} Hari Lauk Bergizi Segar aman untuk {targetBeneficiary}.</b>
            <b>Dapat Uang Tunai Rp {cashFromKeepChoice.toLocaleString("id-ID")} ({sellAfterKeepAmount.toFixed(1)} Kg tetap terjual).</b>
          </button>

          {/* Pilihan 2: Jual Semua */}
          <button
            className={`decision-option sell ${
              choice === "sell" ? "selected" : ""
            }`}
            onClick={() => setChoice("sell")}
          >
            <span className="choice-radio">
              <img
                src={getAssetUrl(choice === "sell" ? "59a43.svg" : "2416d.svg")}
                alt=""
              />
            </span>
            <span className="choice-label">Peringatan: Risiko Tersembunyi</span>
            <h2>PILIHAN 2: Jual Semua ({currentWeight} Kg)</h2>
            <p>
              Semua hasil panen langsung dijual ke pengepul untuk uang tunai instan.
            </p>
            <span className="choice-metrics">
              <span>
                <small>UANG SEKETIKA</small>
                <strong>Rp {totalMarketValue.toLocaleString("id-ID")}</strong>
                Penerimaan tunai hari ini
              </span>
              <span>
                <small>BELI LAUK PENGGANTI</small>
                <strong>- Rp {outsideFoodCost.toLocaleString("id-ID")}</strong>
                Perkiraan belanja lauk luar {hariCadangan} hari
              </span>
            </span>
            <b>Perlu alokasi lauk tambahan untuk memenuhi gizi harian {targetBeneficiary}.</b>
            <p>
              Estimasi sisa kas belanja sekitar Rp {netFromSellAll.toLocaleString("id-ID")} setelah pembelian lauk luar.
            </p>
          </button>
        </div>

        <aside className="nita-tip">
          <img src={ASSETS.nitaAvatar} alt="Bu Nita" />
          <div>
            <small>SARAN DARI BU NITA</small>
            <p>
              “{motherName}, menyisihkan {keepAmount} kg {BAHAN[selectedBahan]?.nama.toLowerCase() || "ikan"} ({approxFishCount} porsi) pas mencukupi kebutuhan gizi cadangan {hariCadangan} hari untuk {targetBeneficiary}. Sisa panen {sellAfterKeepAmount.toFixed(1)} kg tetap menghasilkan Rp {cashFromKeepChoice.toLocaleString("id-ID")} uang tunai untuk kas belanja dapur!”
            </p>
            <button onClick={() => setScreen("education")}>
              Dengarkan Penjelasan Suara
            </button>
          </div>
        </aside>

        <button
          className="confirm-decision"
          disabled={!choice}
          onClick={() =>
            setScreen(choice === "keep" ? "decision-keep" : "decision-sell")
          }
        >
          Pilih Keputusan Ini
          <img src={ASSETS.forwardArrow} alt="" />
        </button>
      </div>
    </main>
  );
}
