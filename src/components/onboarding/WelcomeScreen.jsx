import React, { useState, useRef, useEffect } from "react";
import Logo from "@/components/common/Logo";
import LeafIcon from "@/components/common/LeafIcon";
import { ASSETS } from "@/constants/assets";

export default function WelcomeScreen({ onNext, onBack, setScreen, updateProfileData }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const handleBackToLanding = () => {
    if (setScreen) {
      setScreen("landing");
    } else if (onBack) {
      onBack();
    }
  };

  const handleWhatsAppLogin = (e) => {
    e.preventDefault();
    const cleanPhone = phoneNumber.trim();
    if (!cleanPhone) {
      setPhoneError("Silakan masukkan nomor WhatsApp Anda terlebih dahulu.");
      document.getElementById("wa-phone-input")?.focus();
      return;
    }
    if (cleanPhone.length < 8) {
      setPhoneError("Nomor WhatsApp minimal 8 digit angka.");
      document.getElementById("wa-phone-input")?.focus();
      return;
    }
    setPhoneError("");
    if (updateProfileData) {
      const formattedPhone = cleanPhone.startsWith("0") ? cleanPhone : `0${cleanPhone}`;
      updateProfileData({ phone: formattedPhone });
    }
    if (onNext) onNext();
  };

  const handleGuestLogin = () => {
    if (onNext) onNext();
  };

  return (
    <div className="gov-portal-wrapper welcome-wrapper">
      {/* 1. Global Navigation Bar with Back & Services */}
      <header className="gov-header">
        <div className="gov-header-inner">
          <div
            className="gov-brand-group"
            onClick={handleBackToLanding}
            title="PANGANITA - Kembali ke Beranda"
            role="button"
            tabIndex={0}
          >
            <Logo compact />
            <div className="gov-brand-text">
              <span className="gov-brand-sub" style={{ borderLeft: "1.5px solid #d1e7dd", paddingLeft: "10px", marginLeft: "4px" }}>
                Sistem Panen &amp; Gizi Ibu Nusantara
              </span>
            </div>
          </div>



          <div className="gov-auth-box">
            {/* Tombol Back di Navbar */}
            <button
              className="gov-btn-back-landing"
              onClick={handleBackToLanding}
              id="btn-back-to-landing"
              aria-label="Kembali ke Beranda"
              title="Kembali ke Halaman Utama"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              <span>Kembali ke Beranda</span>
            </button>

          </div>
        </div>
      </header>

      {/* 2. Main Login Area */}
      <main className="welcome-page">
        <section className="welcome-copy">
          {/* Breadcrumb Tombol Kembali */}
          <button
            className="welcome-breadcrumb"
            onClick={handleBackToLanding}
            aria-label="Kembali ke Beranda"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span>Kembali ke Beranda</span>
          </button>

          <Logo />

          <div className="welcome-kicker">
            <LeafIcon /> Mulai Bersama Nita
          </div>

          <h1>Sahabat Gizi &amp; Panen Ibu Nusantara</h1>
          <p className="desktop-intro">
            Pendamping keluarga untuk mengolah hasil panen menjadi gizi sehat,
            praktis, dan bernilai.
          </p>

          <div className="trust-row">
            <span>Dukungan Pertanian Desa</span>
            <span>Pemberdayaan Ibu</span>
          </div>
        </section>

        <section className="welcome-card">
          <div className="hello-chip">Halo Ibu Hebat!</div>
          <img
            className="nita-illustration"
            src={ASSETS.nitaIllustration}
            alt="Bu Nita, asisten cerdas pangan &amp; gizi keluarga"
          />
          <p className="illustration-caption">
            Asisten Cerdas Panganita
          </p>

          <div className="quote-card">
            <strong>Panen sehat, keluarga kuat</strong>
            <p>
              Ubah hasil panen jadi rupiah dan gizi sehat untuk si kecil tanpa
              ribet mengetik.
            </p>
          </div>

          <form onSubmit={handleWhatsAppLogin} className="login-form-container">
            {/* Input WhatsApp Phone Number */}
            <div className="wa-input-wrapper">
              <label htmlFor="wa-phone-input" className="wa-input-label">
                Nomor WhatsApp Anda:
              </label>
              <div className="wa-input-box" style={phoneError ? { borderColor: "#dc2626", boxShadow: "0 0 0 2px rgba(220, 38, 38, 0.15)" } : {}}>
                <span className="wa-prefix">🇮🇩 +62</span>
                <input
                  id="wa-phone-input"
                  type="tel"
                  placeholder="812-3456-7890"
                  className="wa-input-field"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value.replace(/[^0-9]/g, ""));
                    if (phoneError) setPhoneError("");
                  }}
                  autoComplete="tel"
                />
              </div>
              {phoneError && (
                <div
                  className="wa-error-message"
                  style={{
                    color: "#dc2626",
                    fontSize: "12.5px",
                    marginTop: "6px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontWeight: "600",
                  }}
                >
                  <span>⚠️</span>
                  <span>{phoneError}</span>
                </div>
              )}
            </div>

            {/* Primary WhatsApp Button */}
            <button type="submit" className="primary-button whatsapp-button">
              <span className="whatsapp-mark">
                <img src={ASSETS.whatsappIcon} alt="" />
              </span>
              Masuk Cepat via WhatsApp
            </button>
          </form>

          <p className="security-note">
            <img className="inline-icon" src={ASSETS.securityShield} alt="" /> Tanpa
            sandi, langsung tersambung otomatis
          </p>

          {/* Opsi Mode Tamu / Demo */}
          <div className="guest-login-divider">
            <span>atau</span>
          </div>

          <button
            type="button"
            className="secondary-guest-button"
            onClick={handleGuestLogin}
            title="Coba aplikasi tanpa memasukkan nomor WhatsApp"
          >
            <span>✨ Coba Mode Demo (Tanpa Akun)</span>
          </button>

          {/* Link Batal Kembali ke Landing */}
          <button
            type="button"
            className="link-back-landing"
            onClick={handleBackToLanding}
          >
            ← Batal &amp; Kembali ke Beranda
          </button>
        </section>
      </main>
    </div>
  );
}
