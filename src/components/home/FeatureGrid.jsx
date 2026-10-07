import React from "react";
import { ASSETS } from "@/constants/assets";

export default function FeatureGrid({ onSelectFeature }) {
  const subFeatures = [
    {
      id: "local-food",
      icon: ASSETS.featurePanganLokal,
      symbol: "🥬",
      title: "Gizi Pangan Lokal",
      tagline: "Hasil Laut & Pekarangan",
      note: "Cek gizi ikan kakap, udang, daun kelor, dan sagu sekitar rumah tanpa perlu beli bahan mahal.",
      target: "local-food",
      actionText: "Cek Gizi Bahan Sekitar",
    },
    {
      id: "education",
      icon: ASSETS.featureEdukasi,
      symbol: "📢",
      title: "Edukasi Gizi (Suara)",
      tagline: "Literasi Suara Bu Nita",
      note: "Dengarkan panduan suara ramah dari Bu Nita. Praktis didengar saat Ibu sedang memasak atau berladang.",
      target: "education",
      actionText: "Dengarkan Penjelasan Suara",
    },
    {
      id: "recipes",
      icon: ASSETS.featureResep,
      symbol: "🍲",
      title: "Resep Lokal MPASI",
      tagline: "Olahan Bebas Duri",
      note: "Panduan masak Abon Lele awet 5 hari dan Papeda Kuah Kuning kaya protein hewani untuk tumbuh kembang anak.",
      target: "recipes",
      actionText: "Lihat Cara Masak",
    },
  ];

  return (
    <div className="home-feature-container">
      {/* 1. HIGHLIGHT UTAMA: Simulator Pangan dan Gizi (Tumbuh1000) */}
      <section
        className="simulator-priority-card"
        onClick={() => onSelectFeature("simulator")}
        aria-label="Fitur Utama: Simulator Pangan dan Gizi"
      >
        <div className="priority-header-row">
          <div className="priority-badge-group">
            <span className="priority-badge-pill">
              ★ FITUR UTAMA KEPUTUSAN PANEN
            </span>
            <span className="priority-sub-tag">Panduan Nutrisi 1.000 HPK</span>
          </div>
          <span className="quick-time-chip">⏱ Cukup 30 Detik</span>
        </div>

        <div className="priority-body-layout">
          <div className="priority-icon-wrapper">
            <img src={ASSETS.featureSimulator} alt="Ikon Simulator" />
          </div>

          <div className="priority-copy-wrapper">
            <h3>Simulator Pangan &amp; Gizi (Tumbuh1000)</h3>
            <p>
              Bantu Ibu mengambil keputusan dengan tenang: hitung berapa banyak hasil panen yang{" "}
              <strong>dijual untuk uang dapur</strong>, dan berapa yang{" "}
              <strong>disimpan untuk kebutuhan otak si Kecil</strong>.
            </p>

            <div className="tradeoff-mini-preview">
              <div className="mini-preview-item benefit">
                <span className="item-icon">👶</span>
                <div>
                  <strong>Sisihkan 0.5 Kg (2 Ekor Lele)</strong>
                  <small>Kebutuhan protein hewani harian anak terpenuhi 100%, hemat belanja lauk luar.</small>
                </div>
              </div>
              <div className="mini-preview-item cash">
                <span className="item-icon">💵</span>
                <div>
                  <strong>Porsi 1.5 Kg Tetap Dijual ke Pasar</strong>
                  <small>Ibu tetap bawa pulang uang tunai Rp 45.000 untuk kas belanja harian.</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="priority-footer-actions">
          <button
            className="priority-primary-button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectFeature("scanner");
            }}
          >
            <span className="btn-camera-icon">📷</span>
            <span>Foto Panen / Buka Simulator Sekarang</span>
            <span className="btn-arrow">→</span>
          </button>
        </div>
      </section>

      {/* 2. TEPAT DI BAWAH HIGHLIGHT: 3 Cards Layanan Saja */}
      <div className="trio-cards-section-header">
        <h4>Layanan Pendamping Pangan &amp; Gizi:</h4>
      </div>

      <div className="sub-features-trio-grid">
        {subFeatures.map((item) => (
          <article
            className="sub-feature-card"
            key={item.id}
            onClick={() => onSelectFeature(item.target)}
          >
            <div className="sub-card-top">
              <div className="sub-card-icon-bubble">
                <img src={item.icon} alt={item.title} />
              </div>
              <span className="sub-card-chip">{item.tagline}</span>
            </div>

            <div className="sub-card-copy">
              <strong>{item.title}</strong>
              <p>{item.note}</p>
            </div>

            <button
              className="sub-card-cta-btn"
              onClick={(e) => {
                e.stopPropagation();
                onSelectFeature(item.target);
              }}
            >
              <span>{item.actionText}</span>
              <i>→</i>
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
