"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import DetailHeader from "@/components/common/DetailHeader";
import BottomNav from "@/components/common/BottomNav";
import { usePanganita } from "@/context/PanganitaContext";
import { localFoods as initialFallbackFoods } from "@/data/localFoods";
import { ASSETS, getAssetUrl } from "@/constants/assets";

export default function LocalFoodScreen({ setScreen: setScreenProp }) {
  const router = useRouter();
  const context = usePanganita();
  const setScreen = setScreenProp || context?.setScreen;
  const profile = context?.profile;

  // Lokasi default berdasarkan profil user atau Pandeglang
  const defaultUserLocation =
    profile?.location || profile?.city || "Kab. Pandeglang, Banten";

  const [activeLocation, setActiveLocation] = useState(defaultUserLocation);
  const [customLocationInput, setCustomLocationInput] = useState("");
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [filter, setFilter] = useState("Semua");
  const [foodsList, setFoodsList] = useState(initialFallbackFoods);
  const [ecosystem, setEcosystem] = useState(
    "Pesisir Selat Sunda & Agraris Vulkanik Gunung Karang"
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGeneratedAt, setLastGeneratedAt] = useState(null);
  const [aiSuccessMsg, setAiSuccessMsg] = useState("");
  const [, startTransition] = useTransition();

  // Sinkronkan lokasi jika profil baru saja dimuat
  useEffect(() => {
    const loc = profile?.location || profile?.city;
    if (loc && activeLocation === "Kab. Pandeglang, Banten") {
      setActiveLocation(loc);
    }
  }, [profile?.location, profile?.city]);

  // Ambil data pangan lokal berdasarkan lokasi
  const fetchFoodsByLocation = async (targetLoc) => {
    setIsGenerating(true);
    setAiSuccessMsg("");
    try {
      const encoded = encodeURIComponent(targetLoc || activeLocation);
      const res = await fetch(`/api/foods?location=${encoded}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        setFoodsList(json.data);
        if (json.ecosystem) setEcosystem(json.ecosystem);
        if (json.location) setActiveLocation(json.location);
        setLastGeneratedAt(new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }));
        setAiSuccessMsg(`✨ Berhasil memuat ${json.data.length} pangan lokal bergizi tinggi untuk ${json.location}!`);
      }
    } catch {
      // Jika offline, tetap gunakan dataset default
    } finally {
      setIsGenerating(false);
    }
  };

  // Panggil API saat pertama kali buka layar
  useEffect(() => {
    fetchFoodsByLocation(activeLocation);
  }, []);

  const handleManualLocationSubmit = (e) => {
    e.preventDefault();
    if (customLocationInput.trim()) {
      setActiveLocation(customLocationInput.trim());
      fetchFoodsByLocation(customLocationInput.trim());
      setShowLocationInput(false);
      setCustomLocationInput("");
    }
  };

  const handleQuickRegionSelect = (regionName) => {
    setActiveLocation(regionName);
    fetchFoodsByLocation(regionName);
  };

  const filterOptions = [
    { label: "Semua", symbol: "🌟" },
    { label: "Lauk Hewani & Ikan", symbol: "🐟" },
    { label: "Sayuran Hijau", symbol: "🥬" },
    { label: "Karbohidrat Pokok", symbol: "🍠" },
  ];

  const filteredFoods = foodsList.filter((food) => {
    if (filter === "Semua") return true;
    const cat = String(food.category || "").toLowerCase();
    if (filter === "Lauk Hewani & Ikan") return cat === "seafood" || cat === "ikan" || cat === "unggas";
    if (filter === "Sayuran Hijau") return cat === "vegetables" || cat === "sayur";
    if (filter === "Karbohidrat Pokok") return cat === "carbs" || cat === "karbohidrat";
    return true;
  });

  const handleBack = () => {
    if (setScreen) setScreen("home");
    router.push("/beranda");
  };

  const handleTestInSimulator = (food) => {
    if (context?.setDetectedWeight) {
      context.setDetectedWeight("1.5");
    }
    if (context?.setHarvestPrice && food.pricePerKg) {
      context.setHarvestPrice(String(food.pricePerKg));
    }
    if (setScreen) setScreen("simulator");
    router.push("/simulator");
  };

  const handleOpenRecipes = () => {
    if (setScreen) setScreen("recipes");
    router.push("/resep");
  };

  return (
    <main className="detail-page">
      <div className="detail-shell">
        <DetailHeader title="Gizi Pangan Lokal" back={handleBack} />

        {/* Rekomendasi Pangan Lokal Berdasarkan Wilayah */}
        <section
          style={{
            background: "linear-gradient(135deg, #063c2b 0%, #0c4d37 100%)",
            color: "white",
            borderRadius: "20px",
            padding: "20px",
            marginTop: "16px",
            boxShadow: "0 10px 25px rgba(6, 60, 43, 0.25)",
            border: "1px solid rgba(113, 239, 177, 0.25)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Subtle Glow Background */}
          <div
            style={{
              position: "absolute",
              top: "-40px",
              right: "-40px",
              width: "140px",
              height: "140px",
              background: "radial-gradient(circle, rgba(113, 239, 177, 0.25) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
            <div>
              {lastGeneratedAt && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <span style={{ fontSize: "11px", color: "#a2d4c0" }}>
                    Diperbarui {lastGeneratedAt} WIB
                  </span>
                </div>
              )}

              <h2 style={{ fontSize: "18px", fontWeight: "800", color: "#ffffff", margin: "4px 0" }}>
                📍 Pangan Lokal Khas {activeLocation}
              </h2>
              <p style={{ fontSize: "12px", color: "#c6e5d8", margin: "0", lineHeight: "1.5" }}>
                Ekosistem: <strong>{ecosystem}</strong>
              </p>
            </div>

            {/* Tombol Generate Otomatis */}
            <button
              type="button"
              onClick={() => fetchFoodsByLocation(activeLocation)}
              disabled={isGenerating}
              style={{
                background: isGenerating ? "#175a43" : "#71efb1",
                color: isGenerating ? "#ffffff" : "#063c2b",
                border: "none",
                borderRadius: "12px",
                padding: "9px 15px",
                fontSize: "12.5px",
                fontWeight: "800",
                cursor: isGenerating ? "wait" : "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                transition: "all 160ms ease",
              }}
            >
              {isGenerating ? (
                <>
                  <span className="spinner-dots">⏳</span> Menganalisis...
                </>
              ) : (
                <>
                  <span>🔄</span> Segarkan Pangan Lokal
                </>
              )}
            </button>
          </div>

          {/* Alert Sukses Generate */}
          {aiSuccessMsg && (
            <div
              style={{
                marginTop: "12px",
                background: "rgba(255, 255, 255, 0.12)",
                border: "1px solid rgba(113, 239, 177, 0.4)",
                borderRadius: "10px",
                padding: "8px 12px",
                fontSize: "12px",
                color: "#e2f5ec",
                fontWeight: "600",
              }}
            >
              {aiSuccessMsg}
            </div>
          )}

          {/* Quick Select Region Chips */}
          <div style={{ marginTop: "14px", borderTop: "1px solid rgba(255, 255, 255, 0.12)", paddingTop: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px", flexWrap: "wrap", gap: "6px" }}>
              <span style={{ fontSize: "11.5px", color: "#a2d4c0", fontWeight: "700" }}>
                Ganti Lokasi Analisis Otomatis:
              </span>
              <button
                type="button"
                onClick={() => setShowLocationInput(!showLocationInput)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#71efb1",
                  fontSize: "11.5px",
                  fontWeight: "700",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                {showLocationInput ? "Tutup Pencarian" : "🔍 Ketik Kota / Kabupaten Lain"}
              </button>
            </div>

            {/* Custom Location Input */}
            {showLocationInput && (
              <form onSubmit={handleManualLocationSubmit} style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
                <input
                  type="text"
                  value={customLocationInput}
                  onChange={(e) => setCustomLocationInput(e.target.value)}
                  placeholder="Misal: Kab. Cianjur / Teluk Bintuni / Malang..."
                  style={{
                    flex: 1,
                    background: "rgba(255, 255, 255, 0.95)",
                    border: "none",
                    borderRadius: "8px",
                    padding: "8px 12px",
                    fontSize: "12.5px",
                    color: "#063c2b",
                    fontWeight: "700",
                    outline: "none",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: "#71efb1",
                    color: "#063c2b",
                    border: "none",
                    borderRadius: "8px",
                    padding: "8px 14px",
                    fontSize: "12px",
                    fontWeight: "800",
                    cursor: "pointer",
                  }}
                >
                  Analisis
                </button>
              </form>
            )}

            {/* Preset Wilayah Nusantara */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {[
                { label: "Pandeglang (Banten)", query: "Kab. Pandeglang, Banten" },
                { label: "Teluk Bintuni (Papua)", query: "Kab. Teluk Bintuni, Papua Barat" },
                { label: "Parahyangan (Jabar)", query: "Bandung, Jawa Barat" },
                { label: "Pantura (Jateng/Jatim)", query: "Surabaya, Jawa Timur" },
                { label: "Sumatera", query: "Medan, Sumatera Utara" },
                { label: "Kalimantan", query: "Banjarmasin, Kalimantan Selatan" },
                { label: "Sulawesi / NTT", query: "Makassar, Sulawesi Selatan" },
              ].map((reg) => (
                <button
                  key={reg.query}
                  type="button"
                  onClick={() => handleQuickRegionSelect(reg.query)}
                  style={{
                    background: activeLocation.includes(reg.label.split(" ")[0])
                      ? "#71efb1"
                      : "rgba(255, 255, 255, 0.1)",
                    color: activeLocation.includes(reg.label.split(" ")[0])
                      ? "#063c2b"
                      : "#ffffff",
                    border: "1px solid rgba(113, 239, 177, 0.3)",
                    borderRadius: "999px",
                    padding: "4px 10px",
                    fontSize: "11px",
                    fontWeight: "700",
                    cursor: "pointer",
                    transition: "all 120ms ease",
                  }}
                >
                  📍 {reg.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* INTRO HERO */}
        <section className="local-intro" style={{ marginTop: "16px" }}>
          <span className="local-intro-icon">
            <img src={getAssetUrl("5cf8a.svg")} alt="" />
          </span>
          <div>
            <h2>Gizi Segar dari Alam Sendiri</h2>
            <p>
              Komoditas pangan lokal yang tumbuh alami dan mudah diperoleh di sekitar
              Ibu untuk mencukupi gizi di 1.000 Hari Pertama Kehidupan.
            </p>
            <div>
              <span>
                <img src={getAssetUrl("4188c.svg")} alt="" /> Alami &amp; Bebas Pengawet
              </span>
              <span>
                <img src={getAssetUrl("4188c.svg")} alt="" /> Hemat Biaya Keluarga
              </span>
            </div>
          </div>
        </section>

        {/* FILTER ROW */}
        <div className="filter-row">
          {filterOptions.map(({ label, symbol }) => (
            <button
              className={filter === label ? "active" : ""}
              key={label}
              onClick={() => setFilter(label)}
            >
              {filter === label ? <img src={ASSETS.checkSmall} alt="" /> : null}
              {symbol ? <span>{symbol}</span> : null}
              {label}
            </button>
          ))}
        </div>

        {/* GRID DAFTAR PANGAN LOKAL */}
        <section className="local-food-grid">
          {filteredFoods.map((food, index) => {
            const title = food.title || food.name || "Komoditas Pangan Lokal";
            const image = food.image ? getAssetUrl(food.image) : getAssetUrl("bd6ad.png");
            const nutrients = Array.isArray(food.nutrients)
              ? food.nutrients
              : food.benefits
              ? [food.benefits]
              : ["Tinggi Protein", "Kaya Vitamin"];

            return (
              <article
                className="local-food-card"
                key={food.id || `${title}_${index}`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  borderRadius: "18px",
                  background: "#ffffff",
                  padding: "16px",
                  boxShadow: "0 4px 16px rgba(6, 60, 43, 0.08)",
                  border: "1px solid #e1efe8",
                  transition: "transform 140ms ease, box-shadow 140ms ease",
                }}
              >
                {/* Bagian Atas: Gambar + Asal Komoditas */}
                <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                  <div
                    style={{
                      position: "relative",
                      width: "110px",
                      height: "110px",
                      borderRadius: "14px",
                      overflow: "hidden",
                      flexShrink: 0,
                      background: "#eef8f3",
                    }}
                  >
                    <img
                      src={image}
                      alt={title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        top: "6px",
                        left: "6px",
                        padding: "3px 6px",
                        borderRadius: "6px",
                        background: "rgba(6, 60, 43, 0.85)",
                        color: "#ffffff",
                        fontSize: "9px",
                        fontWeight: "800",
                        letterSpacing: "0.4px",
                      }}
                    >
                      {food.source || "LOKAL"}
                    </span>
                  </div>

                  {/* Info Pokok Judul & Deskripsi */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                      <span
                        style={{
                          background: "#e8f8f0",
                          color: "#08543c",
                          fontSize: "10px",
                          fontWeight: "800",
                          padding: "2px 7px",
                          borderRadius: "4px",
                        }}
                      >
                        {food.categoryLabel || "Pangan Lokal"}
                      </span>
                      {(food.isLocalSource || food.aiGenerated) && (
                        <span style={{ fontSize: "10px", color: "#065f46", fontWeight: "700" }}>
                          ✨ Pilihan Bergizi
                        </span>
                      )}
                    </div>

                    <h2
                      style={{
                        fontSize: "15px",
                        fontWeight: "800",
                        color: "#063c2b",
                        margin: "0 0 6px",
                        lineHeight: "1.3",
                      }}
                    >
                      {title}
                    </h2>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#4a5d55",
                        margin: "0",
                        lineHeight: "1.45",
                      }}
                    >
                      {food.description || food.benefits}
                    </p>
                  </div>
                </div>

                {/* Grid Rincian Nilai Gizi per 100g */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "6px",
                    background: "#f4faf7",
                    borderRadius: "10px",
                    padding: "8px 10px",
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <small style={{ fontSize: "10px", color: "#607970", display: "block" }}>Protein</small>
                    <strong style={{ fontSize: "12px", color: "#08543c" }}>
                      {food.proteinPer100g || "18g"}/100g
                    </strong>
                  </div>
                  <div style={{ textAlign: "center", borderLeft: "1px solid #dcefe6", borderRight: "1px solid #dcefe6" }}>
                    <small style={{ fontSize: "10px", color: "#607970", display: "block" }}>Kalori</small>
                    <strong style={{ fontSize: "12px", color: "#08543c" }}>
                      {food.calories || "115 kkal"}
                    </strong>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <small style={{ fontSize: "10px", color: "#607970", display: "block" }}>Pasar Lokal</small>
                    <strong style={{ fontSize: "12px", color: "#08543c" }}>
                      Rp {Number(food.pricePerKg || 30000).toLocaleString("id-ID")}/Kg
                    </strong>
                  </div>
                </div>

                {/* Nutrients Pills */}
                <div className="nutrient-row" style={{ marginTop: "0", paddingTop: "0" }}>
                  {nutrients.map((nutrient, nIdx) => (
                    <span key={nIdx}>{nutrient}</span>
                  ))}
                </div>

                {/* Takaran Porsi & Tips MPASI Bu Nita */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "6px" }}>
                  <span className="portion-chip" style={{ margin: "0" }}>
                    {food.portion || "Takaran: 1 Porsi Sesuai Usia"}
                  </span>
                  {food.omega3 && (
                    <span
                      style={{
                        fontSize: "10px",
                        color: "#0a563f",
                        fontWeight: "700",
                        background: "#def3e9",
                        padding: "3px 8px",
                        borderRadius: "999px",
                      }}
                    >
                      🧠 Omega-3: {food.omega3}
                    </span>
                  )}
                </div>

                {/* Tips Pengolahan */}
                {food.aiInsight && (
                  <div
                    style={{
                      background: "#fffbeb",
                      border: "1px solid #fef3c7",
                      borderRadius: "8px",
                      padding: "7px 10px",
                      fontSize: "11.5px",
                      color: "#92400e",
                      lineHeight: "1.4",
                    }}
                  >
                    💡 <strong>Tips Bu Nita:</strong> {food.aiInsight}
                  </div>
                )}

                {/* Tombol Aksi Cepat ke Simulator & Resep */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "4px" }}>
                  <button
                    type="button"
                    onClick={() => handleTestInSimulator(food)}
                    style={{
                      background: "#08543c",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "10px",
                      padding: "8px 10px",
                      fontSize: "11.5px",
                      fontWeight: "800",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "4px",
                      transition: "background 140ms ease",
                    }}
                  >
                    <span>⚡</span> Uji di Simulator ↗
                  </button>
                  <button
                    type="button"
                    onClick={handleOpenRecipes}
                    style={{
                      background: "#e8f8f0",
                      color: "#08543c",
                      border: "1px solid #c0e8d4",
                      borderRadius: "10px",
                      padding: "8px 10px",
                      fontSize: "11.5px",
                      fontWeight: "800",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "4px",
                    }}
                  >
                    <span>🍲</span> Resep Olahan ↗
                  </button>
                </div>
              </article>
            );
          })}
        </section>

        <BottomNav active={null} setScreen={setScreen} />
      </div>
    </main>
  );
}
