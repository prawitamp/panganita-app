import React, { useState } from "react";
import Progress from "@/components/common/Progress";
import { harvestOptions } from "@/data/harvestOptions";
import { ASSETS, getAssetUrl } from "@/constants/assets";
import { usePanganita } from "@/context/PanganitaContext";

export default function HarvestSetupScreen({
  onNext,
  onBack,
  setScreen,
  initialSelected = ["fish", "greens"],
  profile,
  updateProfileData,
  onSelectHarvest,
}) {
  const { login } = usePanganita();
  const initialList = Array.isArray(initialSelected)
    ? initialSelected
    : initialSelected
    ? [initialSelected]
    : profile?.commodities || ["fish", "greens"];

  const [selectedCommodities, setSelectedCommodities] = useState(initialList);

  const handleToggle = (id) => {
    setSelectedCommodities((prev) => {
      let updated;
      if (prev.includes(id)) {
        if (prev.length > 1) {
          updated = prev.filter((item) => item !== id);
        } else {
          updated = prev;
        }
      } else {
        updated = [...prev, id];
      }
      if (onSelectHarvest) {
        onSelectHarvest(updated);
      }
      if (updateProfileData) {
        updateProfileData({ commodities: updated });
      }
      return updated;
    });
  };

  const handleFinish = () => {
    if (updateProfileData) {
      updateProfileData({ commodities: selectedCommodities });
    }
    try {
      const saved = localStorage.getItem("panganita_profile");
      const current = saved ? JSON.parse(saved) : {};
      localStorage.setItem(
        "panganita_profile",
        JSON.stringify({ ...current, commodities: selectedCommodities, isLoggedIn: true })
      );
    } catch {}
    if (login) {
      login();
    }
    if (onNext) onNext();
  };

  return (
    <main className="setup-page">
      <div className="setup-shell">
        <Progress
          step={2}
          back={onBack}
          setScreen={setScreen}
          stepTitle="Komoditas Panen"
        />

        <div className="harvest-layout">
          <section className="harvest-intro-col">
            <div className="setup-intro-badge">
              <span>🌾 Langkah 2 dari 2</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", margin: "12px 0 8px" }}>
              <h1 style={{ margin: 0 }}>Apa hasil panen utama Ibu?</h1>
              <span className="multi-badge-note">Bisa pilih 2 atau lebih</span>
            </div>
            <p>
              Pilih satu atau beberapa komoditas yang paling sering Ibu panen dari kolam atau kebun
              pekarangan untuk diolah menjadi lauk emas si kecil:
            </p>

            {/* Ilustrasi Bu Nita Memanen Pekarangan */}
            <div className="garden-banner-illustrated">
              <img
                src={ASSETS.nitaHarvestGarden}
                alt="Ilustrasi Bu Nita sedang panen sayuran segar dan ikan di pekarangan lestari"
                className="nita-harvest-img"
              />
              <div className="garden-banner-overlay">
                <span className="garden-banner-tag">🌱 Pekarangan Lestari Panganita</span>
                <p className="garden-banner-desc">
                  Kolam ikan segar &amp; kebun sayur keluarga untuk ketahanan gizi 1.000 HPK
                </p>
              </div>
            </div>
          </section>

          <section className="harvest-select-col">
            <div className="harvest-grid">
              {harvestOptions.map((option) => {
                const isSelected = selectedCommodities.includes(option.id);
                return (
                  <button
                    type="button"
                    className={`harvest-card ${isSelected ? "selected" : ""}`}
                    key={option.id}
                    onClick={() => handleToggle(option.id)}
                    aria-pressed={isSelected}
                  >
                    {isSelected ? (
                      <span className="check-mark">
                        <img src={ASSETS.checkWhite} alt="" />
                      </span>
                    ) : null}
                    <span className={`harvest-icon ${option.id}`}>
                      {option.symbol}
                    </span>
                    <strong>{option.title}</strong>
                    <small>{option.note}</small>
                  </button>
                );
              })}
            </div>

            <div className="integration-card">
              <span className="medical-icon">
                <img src={getAssetUrl("95578.svg")} alt="" />
              </span>
              <span>
                <strong>PANDUAN ASISTEN BU NITA</strong>
                Data {selectedCommodities.length} komoditas ini digunakan untuk menghitung takaran gizi keluarga
                dan uang kas belanja harian dari pekarangan Ibu.
              </span>
            </div>

            <button
              type="button"
              className="primary-button dark mt-3"
              onClick={handleFinish}
            >
              <span>Simpan Profil &amp; Masuk ke Beranda →</span>
            </button>
          </section>
        </div>
      </div>
    </main>
  );
}
