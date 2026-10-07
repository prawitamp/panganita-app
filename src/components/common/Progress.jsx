import React from "react";
import Logo from "./Logo";
import LeafIcon from "./LeafIcon";
import { ASSETS } from "@/constants/assets";

export default function Progress({ step, back, setScreen, stepTitle }) {
  const percent = step * 50;

  const handleHomeClick = () => {
    if (setScreen) {
      setScreen("landing");
    } else if (back) {
      back();
    }
  };

  return (
    <header className="setup-header-modern">
      {/* Top Navbar Row */}
      <div className="setup-nav-top">
        <div className="setup-nav-left">
          {back ? (
            <button
              className="setup-back-btn"
              onClick={back}
              aria-label="Kembali ke langkah sebelumnya"
              title="Kembali"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          ) : null}

          <div
            className="setup-brand-link"
            onClick={handleHomeClick}
            role="button"
            tabIndex={0}
            title="PANGANITA - Halaman Utama"
          >
            <Logo compact />
            <div className="setup-brand-text">
              <span className="brand-subtitle" style={{ borderLeft: "1.5px solid #d1e7dd", paddingLeft: "10px", marginLeft: "4px" }}>
                Sistem Panen &amp; Gizi Ibu Nusantara
              </span>
            </div>
          </div>
        </div>

        <div className="setup-nav-right">
          <div className="setup-step-pill">
            <LeafIcon />
            <span>Langkah {step} dari 2{stepTitle ? ` • ${stepTitle}` : ""}</span>
          </div>

          <button
            className="setup-exit-btn"
            onClick={handleHomeClick}
            title="Keluar ke Halaman Beranda"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            <span>Beranda</span>
          </button>
        </div>
      </div>

      {/* Progress Bar Row */}
      <div className="setup-progress-row">
        <div className="setup-progress-meta">
          <span className="meta-step-label">
            {step === 1 ? "1. Profil Ibu & Data Gizi Anak" : "2. Pemilihan Komoditas Panen"}
          </span>
          <span className="meta-percent">{percent}% Selesai</span>
        </div>
        <div className="progress-track">
          <div style={{ width: `${percent}%` }} />
        </div>
      </div>
    </header>
  );
}
