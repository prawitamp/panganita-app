import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ASSETS } from "@/constants/assets";
import { usePanganita } from "@/context/PanganitaContext";
import { REGIONS_BY_PROVINCE } from "@/data/indonesiaRegions";

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
    price !== undefined ? price : (context?.harvestPrice || "30000");
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
  const pricePresets = ["20000", "25000", "30000", "35000"];

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

  // State Foto Panen dari Galeri / Kamera
  const [harvestPhotoState, setHarvestPhotoState] = useState(
    context?.harvestPhoto || null
  );
  const [flashOn, setFlashOn] = useState(false);
  const galleryInputRef = useRef(null);

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
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBack = () => {
    if (setScreen) setScreen("home");
    router.push("/beranda");
  };

  const handleGoSimulator = () => {
    if (setScreen) setScreen("simulator");
    router.push("/simulator");
  };

  const userAvatar = profile?.avatar || ASSETS.mamaNurAvatar;
  const userName = profile?.name || "Ibu";

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
          <div className="camera-status">
            <span />{" "}
            {harvestPhotoState
              ? "Foto Panen Terpilih • Siap Dihitung"
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
              <span>🖼️ Foto Galeri Terpilih</span>
              <button
                type="button"
                onClick={() => {
                  setHarvestPhotoState(null);
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
            {harvestPhotoState
              ? "Foto Panen Terpilih"
              : "Komoditas: Ikan Lele Segar"}
          </div>

          <div className="detection-card">
            <div className="detection-title">
              <h1>
                Terdeteksi:
                <br />
                Ikan Segar
              </h1>
              <div>
                <strong>Perkiraan: ~{currentWeight} Kg</strong>
                <small>Estimasi wadah bakul</small>
              </div>
            </div>

            <hr />

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
                    min="5000"
                    max="250000"
                    value={currentPrice}
                    onChange={(e) => updatePrice && updatePrice(e.target.value)}
                    placeholder="30000"
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
