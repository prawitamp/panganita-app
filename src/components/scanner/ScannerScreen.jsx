import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ASSETS } from "@/constants/assets";
import { usePanganita } from "@/context/PanganitaContext";
import { REGIONS_BY_PROVINCE } from "@/data/indonesiaRegions";
import { FOOD_DETECTION_MAP } from "@/data/foodDetectionMap";

export default function ScannerScreen({
  setScreen,
  weight,
  setWeight,
  price,
  setPrice,
  location,
  setLocation,
}) {
  const router = useRouter();
  const context = usePanganita();
  const profile = context?.profile || {};

  // Wilayah & Nama dari Profil Pengguna
  const rawLoc = profile?.location?.trim() || "";
  const locCity = rawLoc ? rawLoc.split(",")?.[0]?.trim() : "";
  const locProvince =
    rawLoc && rawLoc.includes(",")
      ? rawLoc.split(",")?.slice(1)?.join(",")?.trim()
      : "";

  const userCity = locCity || profile?.city || "Kab. Pandeglang";
  const userProvince = locProvince || profile?.province || "Banten";
  const cleanCity = userCity.replace(/^(Kab\.|Kota)\s*/i, "").trim();

  // State Berat (Kg)
  const currentWeight =
    weight !== undefined ? weight : (context?.detectedWeight || "2.0");
  const updateWeight = setWeight || context?.setDetectedWeight;

  // State Harga (Rp/Kg)
  const currentPrice =
    price !== undefined ? price : (context?.harvestPrice || "28000");
  const updatePrice = setPrice || context?.setHarvestPrice;

  // State Lokasi Panen / Pasar
  const defaultLocation =
    context?.harvestLocation &&
    !context.harvestLocation.includes("Babo") &&
    !context.harvestLocation.includes("Teluk Bintuni")
      ? context.harvestLocation
      : `Pasar Sentral ${cleanCity}`;
  const [locInput, setLocInput] = useState(
    location !== undefined && !location.includes("Babo")
      ? location
      : defaultLocation
  );
  const [showLocSuggestions, setShowLocSuggestions] = useState(false);
  const locationWrapperRef = useRef(null);

  const updateLocation = setLocation || context?.setHarvestLocation;

  // Sync initial location jika context belum punya atau masih Babo
  useEffect(() => {
    if (
      (!context?.harvestLocation ||
        context?.harvestLocation.includes("Babo") ||
        context?.harvestLocation.includes("Teluk Bintuni")) &&
      updateLocation
    ) {
      updateLocation(defaultLocation);
      setLocInput(defaultLocation);
    }
  }, [context?.harvestLocation, defaultLocation, updateLocation]);

  // Tutup dropdown sugesti saat klik di luar
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        locationWrapperRef.current &&
        !locationWrapperRef.current.contains(event.target)
      ) {
        setShowLocSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const weightPresets = ["0.5", "1.0", "1.5", "2.0", "2.5", "3.0", "5.0"];
  const pricePresets = ["15000", "20000", "28000", "35000", "45000"];

  // Rekomendasi lokasi lokal sesuai kota pengguna
  const localSpotSuggestions = [
    { title: `Pasar Sentral ${cleanCity}`, desc: `${userCity}, ${userProvince}` },
    { title: `Pasar Tradisional ${cleanCity}`, desc: "Pusat jual beli bahan pangan segar" },
    { title: `TPI / Pasar Ikan ${cleanCity}`, desc: "Tempat pelelangan & tangkapan ikan segar" },
    { title: "Pekarangan Rumah Sendiri", desc: "Konsumsi mandiri / pembeli langsung" },
    { title: "Pesisir Pantai / Tambak", desc: "Langsung dari kolam atau perahu nelayan" },
  ];

  // Sugesti berdasarkan pencarian kota se-Indonesia
  const searchLower = (locInput || "").toLowerCase().trim();
  const allFilteredRegions = [];

  if (searchLower) {
    Object.entries(REGIONS_BY_PROVINCE).forEach(([prov, cities]) => {
      cities.forEach((c) => {
        if (
          c.toLowerCase().includes(searchLower) ||
          prov.toLowerCase().includes(searchLower)
        ) {
          const cClean = c.replace(/^(Kab\.|Kota)\s*/i, "");
          allFilteredRegions.push({
            title: `Pasar Sentral ${cClean}`,
            desc: `${c}, ${prov}`,
          });
        }
      });
    });
  }

  const handleSelectLocation = (locTitle) => {
    setLocInput(locTitle);
    if (updateLocation) updateLocation(locTitle);
    setShowLocSuggestions(false);
  };

  const handleWeightChange = (val) => {
    if (updateWeight) updateWeight(val);
  };

  const handleStepWeight = (delta) => {
    const currentNum = parseFloat(currentWeight) || 0;
    const nextNum = Math.max(0.1, currentNum + delta);
    const formatted = Math.round(nextNum * 10) / 10;
    handleWeightChange(String(formatted));
  };

  // State Foto Panen & AI Detection
  const [harvestPhotoState, setHarvestPhotoState] = useState(
    context?.harvestPhoto || null
  );
  const [flashOn, setFlashOn] = useState(false);
  const galleryInputRef = useRef(null);

  // AI Detection State
  const [isScanning, setIsScanning] = useState(false);
  const [detectionResult, setDetectionResult] = useState(null);
  const [selectedSample, setSelectedSample] = useState("ikan_lele");

  // Eksekusi Deteksi AI Computer Vision
  const runDetection = useCallback(async ({ imageBase64, sampleClass }) => {
    setIsScanning(true);
    try {
      const res = await fetch("/api/detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: imageBase64,
          sampleClass: sampleClass,
        }),
      });

      const data = await res.json();
      if (data && data.success) {
        setDetectionResult(data);
        if (data.previewImage) {
          setHarvestPhotoState(data.previewImage);
          if (context?.setHarvestPhoto) {
            context.setHarvestPhoto(data.previewImage);
          }
        }
        if (data.primary) {
          const meta = data.primary.metadata;
          if (meta) {
            if (meta.defaultWeight && updateWeight) {
              updateWeight(meta.defaultWeight);
            }
            if (meta.defaultPrice && updatePrice) {
              updatePrice(meta.defaultPrice);
            }
          }
        }
      }
    } catch (err) {
      console.error("Gagal mendeteksi gambar:", err);
    } finally {
      setIsScanning(false);
    }
  }, [context, updateWeight, updatePrice]);

  // Initial Scan dengan sampel ikan_lele saat pertama kali buka jika belum ada foto
  useEffect(() => {
    if (!harvestPhotoState && !detectionResult) {
      runDetection({ sampleClass: "ikan_lele" });
    }
  }, [harvestPhotoState, detectionResult, runDetection]);

  const handleGalleryUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert("Ukuran foto maksimal 8 MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === "string") {
          setHarvestPhotoState(result);
          if (context?.setHarvestPhoto) {
            context.setHarvestPhoto(result);
          }
          setSelectedSample("");
          // Picu AI inference secara langsung
          runDetection({ imageBase64: result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectSample = (sampleKey) => {
    setSelectedSample(sampleKey);
    runDetection({ sampleClass: sampleKey });
  };

  const handleBack = () => {
    if (setScreen) setScreen("home");
    router.push("/beranda");
  };

  const handleGoSimulator = () => {
    // Sinkronkan komoditas yang terdeteksi ke profil keluarga jika belum ada
    if (detectionResult?.primary?.metadata?.category) {
      const cat = detectionResult.primary.metadata.category;
      if (profile?.commodities && !profile.commodities.includes(cat) && context?.toggleCommodity) {
        context.toggleCommodity(cat);
      }
    }
    if (setScreen) setScreen("simulator");
    router.push("/simulator");
  };

  const userAvatar = profile?.avatar || ASSETS.mamaNurAvatar;
  const userName = profile?.name || "Ibu";
  const primaryDet = detectionResult?.primary;
  const primaryMeta = primaryDet?.metadata || FOOD_DETECTION_MAP.ikan_lele;
  const confidencePercent = primaryDet ? Math.round(primaryDet.confidence * 100) : 94;

  const sampleButtons = [
    { key: "ikan_lele", label: "🐟 Ikan Lele" },
    { key: "bayam", label: "🥬 Bayam" },
    { key: "tomat", label: "🍅 Tomat" },
    { key: "pisang", label: "🍌 Pisang" },
    { key: "jagung", label: "🌽 Jagung" },
    { key: "kangkung", label: "🥬 Kangkung" },
    { key: "ikan_kembung", label: "🐟 Kembung" },
    { key: "udang", label: "🦐 Udang" },
    { key: "wortel", label: "🥕 Wortel" },
    { key: "buah_naga", label: "🐉 Buah Naga" },
  ];

  return (
    <main className="scanner-page">
      <div className="scanner-shell">
        <header className="scanner-header">
          <button onClick={handleBack} aria-label="Kembali ke Beranda">
            <img src={ASSETS.backArrowLight} alt="" />
          </button>
          <strong>Pindai Panen</strong>
          <img
            src={userAvatar}
            alt={userName}
            style={{ width: "36px", height: "36px", borderRadius: "999px", objectFit: "cover" }}
          />
        </header>

        <div className="camera-view">
          {/* Hidden File Input untuk Ambil Foto dari Galeri */}
          <input
            type="file"
            accept="image/*"
            ref={galleryInputRef}
            style={{ display: "none" }}
            onChange={handleGalleryUpload}
          />

          <img
            src={harvestPhotoState || ASSETS.cameraBasket}
            alt="Hasil panen pekarangan"
            style={harvestPhotoState ? { width: "100%", height: "100%", objectFit: "cover" } : {}}
          />

          {/* Animasi Laser Pemindai AI saat memproses */}
          {isScanning && (
            <>
              <div className="cv-laser-bar" />
              <div className="cv-scanning-badge">
                <span className="cv-scanning-dot" />
                <span>AI YOLO26n Sedang Memindai Panen...</span>
              </div>
            </>
          )}

          {/* Visualisasi Bounding Box Deteksi Model YOLO26n */}
          {!isScanning && detectionResult?.detections && detectionResult.detections.length > 0 && (
            <div className="cv-scanner-overlay">
              {detectionResult.detections.map((det, idx) => {
                const box = det.normalizedBox || { top: 20, left: 20, width: 60, height: 55 };
                return (
                  <div
                    key={`det-${idx}`}
                    className="cv-box-item"
                    style={{
                      top: `${box.top}%`,
                      left: `${box.left}%`,
                      width: `${box.width}%`,
                      height: `${box.height}%`,
                      borderColor: det.metadata?.color || "#10b981",
                    }}
                  >
                    <div
                      className="cv-box-tag"
                      style={{ background: det.metadata?.color || "#065f46" }}
                    >
                      <span>{det.metadata?.icon || "🌱"}</span>
                      <span>{det.metadata?.name || det.class}</span>
                      <span className="cv-box-conf">
                        {Math.round(det.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="camera-status">
            <span />{" "}
            {isScanning
              ? "Sedang Menganalisis Gambar • Model YOLO26n"
              : harvestPhotoState
              ? `Terdeteksi: ${primaryMeta.name} • ${confidencePercent}% Akurasi`
              : flashOn
              ? "Kamera Aktif • Flash Nyala"
              : "Kamera Aktif • Foto Panen Pekarangan"}
          </div>

          <div className="focus focus-tl" />
          <div className="focus focus-tr" />
          <div className="focus focus-bl" />
          <div className="focus focus-br" />

          <div className="camera-tools">
            <button
              type="button"
              aria-label="Lampu kilat"
              onClick={() => setFlashOn(!flashOn)}
              title={flashOn ? "Matikan Flash" : "Nyalakan Flash"}
              style={{
                cursor: "pointer",
                background: flashOn ? "#f59e0b" : "rgba(27, 77, 62, 0.88)",
              }}
            >
              <img src={ASSETS.flashIcon} alt="" />
            </button>
            <button
              type="button"
              aria-label="Buka galeri dan upload foto panen"
              onClick={() => galleryInputRef.current?.click()}
              title="Pilih foto panen dari galeri"
              style={{ cursor: "pointer" }}
            >
              <img src={ASSETS.galleryIcon} alt="" />
            </button>
            <span
              onClick={() => galleryInputRef.current?.click()}
              style={{ cursor: "pointer", fontWeight: "700" }}
            >
              Galeri
            </span>
          </div>

          {harvestPhotoState && (
            <div className="gallery-active-banner">
              <span>🖼️ Foto Panen Aktif Terpindai</span>
              <button
                type="button"
                onClick={() => {
                  setHarvestPhotoState(null);
                  setDetectionResult(null);
                  if (context?.setHarvestPhoto) context.setHarvestPhoto(null);
                  if (galleryInputRef.current) galleryInputRef.current.value = "";
                }}
              >
                Gunakan Kamera
              </button>
            </div>
          )}

          <div className="vision-chip">
            <img src={ASSETS.sparkleIcon} alt="" />{" "}
            {isScanning
              ? "Memproses Deteksi..."
              : `Pangan Terdeteksi: ${primaryMeta.name}`}
          </div>

          <div className="detection-card">
            {/* Attribution Badge Karya Tim */}
            <div className="cv-model-credit">
              <span>🔬</span>
              <span>
                Model CV: <strong>YOLO26n Detect v1</strong> (Karya <strong>Aulya Rakhmawati</strong>, PIC CV)
              </span>
            </div>

            {/* Selector Sampel Cepat untuk Pengujian Langsung */}
            <div className="cv-sample-selector">
              <div className="cv-sample-selector-label">
                <span>⚡ Uji Sampel Data Panen Aulya:</span>
                <span>{sampleButtons.length} Komoditas</span>
              </div>
              <div className="cv-sample-scroll">
                {sampleButtons.map((btn) => (
                  <button
                    key={btn.key}
                    type="button"
                    className={`cv-sample-btn ${selectedSample === btn.key ? "active" : ""}`}
                    onClick={() => handleSelectSample(btn.key)}
                    disabled={isScanning}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="detection-title">
              <div>
                <small style={{ color: "#34d399", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Hasil Analisis Pindai Panen
                </small>
                <h1 style={{ marginTop: "4px" }}>
                  {primaryMeta.icon} {primaryMeta.name}
                </h1>
              </div>
              <div>
                <strong>Akurasi {confidencePercent}%</strong>
                <small>Estimasi ~{currentWeight} Kg</small>
              </div>
            </div>

            {/* Kartu Nutrisi & Panduan Stunting MPASI Sesuai Komoditas Terdeteksi */}
            {primaryMeta?.nutrition && (
              <div className="cv-nutrition-card">
                <div className="cv-nutrition-header">
                  <strong>
                    <span>🛡️</span>
                    <span>Pencegahan Stunting</span>
                  </strong>
                  <span className="cv-nutrition-badge">{primaryMeta.nutrition.protein}</span>
                </div>
                <p className="cv-nutrition-desc">
                  {primaryMeta.nutrition.stuntingBenefit}
                </p>
                <div className="cv-nutrition-mpasi">
                  🥣 <strong>Rekomendasi MPASI:</strong> {primaryMeta.nutrition.mpasiRecommendation}
                </div>
              </div>
            )}

            <hr />

            {/* BARIS ATAS: CARD 2 KOLOM (Kiri: Kg, Kanan: Harga) */}
            <div className="scanner-grid-two-col">
              {/* Card Sebelah Kiri: Berat Panen (Kg) */}
              <div className="scanner-subcard">
                <div className="subcard-header">
                  <div className="subcard-label">
                    <span>⚖️</span>
                    <strong>Berat Panen</strong>
                  </div>
                  <span className="subcard-badge">{currentWeight} Kg</span>
                </div>

                {/* Input Angka Manual + Stepper Minus/Plus */}
                <div className="weight-manual-row">
                  <button
                    type="button"
                    className="weight-stepper-btn"
                    onClick={() => handleStepWeight(-0.5)}
                    aria-label="Kurangi berat 0.5 kg"
                    title="Kurangi 0.5 Kg"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="200"
                    value={currentWeight}
                    onChange={(e) => handleWeightChange(e.target.value)}
                    placeholder="2.0"
                    aria-label="Ketik berat manual dalam Kg"
                    style={{
                      color: "#0d3829",
                      fontWeight: "800",
                      fontSize: "17px",
                      textAlign: "center",
                      flex: 1,
                    }}
                  />
                  <span className="field-unit">Kg</span>
                  <button
                    type="button"
                    className="weight-stepper-btn"
                    onClick={() => handleStepWeight(0.5)}
                    aria-label="Tambah berat 0.5 kg"
                    title="Tambah 0.5 Kg"
                  >
                    +
                  </button>
                </div>

                {/* Pilihan Cepat Chip Berat */}
                <div className="subcard-chips-row">
                  {weightPresets.map((val) => (
                    <button
                      key={val}
                      type="button"
                      className={`param-chip ${
                        parseFloat(currentWeight) === parseFloat(val) ? "active" : ""
                      }`}
                      onClick={() => handleWeightChange(val)}
                    >
                      {val} Kg
                    </button>
                  ))}
                </div>
              </div>

              {/* Card Sebelah Kanan: Harga Jual Pasar (Rp/Kg) */}
              <div className="scanner-subcard">
                <div className="subcard-header">
                  <div className="subcard-label">
                    <span>💰</span>
                    <strong>Harga Pasar</strong>
                  </div>
                  <span className="subcard-badge">
                    Rp {Number(currentPrice || 0).toLocaleString("id-ID")}/Kg
                  </span>
                </div>

                <div className="scanner-input-field-row">
                  <span className="field-addon">Rp</span>
                  <input
                    type="number"
                    step="1000"
                    min="1000"
                    max="250000"
                    value={currentPrice}
                    onChange={(e) => updatePrice && updatePrice(e.target.value)}
                    placeholder="28000"
                    aria-label="Harga jual per kg"
                    style={{
                      color: "#0d3829",
                      fontWeight: "800",
                      fontSize: "14px",
                    }}
                  />
                </div>

                {/* Quick Chips Harga */}
                <div className="subcard-chips-row">
                  {pricePresets.map((pr) => (
                    <button
                      key={pr}
                      type="button"
                      className={`param-chip ${String(currentPrice) === String(pr) ? "active" : ""}`}
                      onClick={() => updatePrice && updatePrice(pr)}
                    >
                      {Number(pr) / 1000} rb
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* BARIS BAWAH: Card Panjang Lokasi Panen / Pasar Penjualan */}
            <div className="scanner-subcard location-subcard-full" ref={locationWrapperRef}>
              <div className="subcard-header">
                <div className="subcard-label">
                  <span>📍</span>
                  <strong>Lokasi Panen / Pasar Penjualan</strong>
                </div>
                <span className="subcard-badge">📍 {userCity}</span>
              </div>

              <div className="location-input-wrapper">
                <div className="scanner-input-field-row">
                  <span className="field-addon">📍</span>
                  <input
                    type="text"
                    value={locInput}
                    onChange={(e) => {
                      setLocInput(e.target.value);
                      if (updateLocation) updateLocation(e.target.value);
                      setShowLocSuggestions(true);
                    }}
                    onFocus={() => setShowLocSuggestions(true)}
                    placeholder={`Misal: Pasar Sentral ${cleanCity} / Pekarangan`}
                    aria-label="Lokasi panen atau pasar penjualan"
                    style={{
                      color: "#0d3829",
                      fontWeight: "700",
                      fontSize: "14px",
                    }}
                  />
                  {locInput && (
                    <button
                      type="button"
                      onClick={() => {
                        setLocInput("");
                        setShowLocSuggestions(true);
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        padding: "8px 12px",
                        cursor: "pointer",
                        color: "#64748b",
                        fontSize: "14px",
                        fontWeight: "700",
                      }}
                      aria-label="Hapus teks lokasi"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Dropdown Sugesti Daerah & Pasar */}
                {showLocSuggestions && (
                  <div className="location-suggestion-dropdown">
                    <div className="suggestion-section-label">
                      <span>📍 Pasar &amp; Titik Panen di {cleanCity}</span>
                    </div>
                    {localSpotSuggestions.map((spot, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className="location-suggestion-item"
                        onClick={() => handleSelectLocation(spot.title)}
                      >
                        <span style={{ fontSize: "16px" }}>🏪</span>
                        <div>
                          <strong>{spot.title}</strong>
                          <small>{spot.desc}</small>
                        </div>
                      </button>
                    ))}

                    {/* Jika user mengetik nama kota lain di Indonesia */}
                    {allFilteredRegions.length > 0 && (
                      <>
                        <div className="suggestion-section-label" style={{ marginTop: "6px" }}>
                          <span>🔍 Kota / Kabupaten Lain di Indonesia</span>
                        </div>
                        {allFilteredRegions.slice(0, 6).map((reg, idx) => (
                          <button
                            key={`reg_${idx}`}
                            type="button"
                            className="location-suggestion-item"
                            onClick={() => handleSelectLocation(reg.title)}
                          >
                            <span style={{ fontSize: "16px" }}>📍</span>
                            <div>
                              <strong>{reg.title}</strong>
                              <small>{reg.desc}</small>
                            </div>
                          </button>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Quick Chips Sesuai Wilayah User */}
              <div className="subcard-chips-row">
                {[
                  `Pasar ${cleanCity}`,
                  `Pasar Sentral`,
                  "TPI / Pesisir",
                  "Pekarangan Rumah",
                ].map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    className={`param-chip ${locInput.includes(loc) ? "active" : ""}`}
                    onClick={() => handleSelectLocation(loc === "Pasar Sentral" ? `Pasar Sentral ${cleanCity}` : loc)}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            <button
              className="simulator-button"
              onClick={handleGoSimulator}
            >
              Lanjut ke Simulator Tumbuh1000
              <img src={ASSETS.forwardGreenArrow} alt="" />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
