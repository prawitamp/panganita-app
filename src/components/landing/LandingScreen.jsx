import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/common/Logo";
import LeafIcon from "@/components/common/LeafIcon";
import { ASSETS } from "@/constants/assets";
import { ROUTES } from "@/constants/routes";
import { usePanganita } from "@/context/PanganitaContext";

export default function LandingScreen({ setScreen }) {
  const router = useRouter();
  const { isLoggedIn, showToast } = usePanganita();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [layananDropdownOpen, setLayananDropdownOpen] = useState(false);
  const [mobileLayananAccordion, setMobileLayananAccordion] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setLayananDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    setLayananDropdownOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleNavigate = (screenTarget) => {
    setLayananDropdownOpen(false);
    setMobileMenuOpen(false);
    if (setScreen) {
      setScreen(screenTarget);
    }
    const targetRoute = ROUTES[screenTarget] || "/";
    router.push(targetRoute);
  };

  const handleLogin = () => {
    setMobileMenuOpen(false);
    if (setScreen) {
      setScreen("welcome");
    }
    router.push("/?step=welcome");
  };

  const handleProtectedAction = (screenTarget, featureLabel) => {
    if (!isLoggedIn) {
      showToast(
        `Silakan masuk atau daftar akun terlebih dahulu untuk menggunakan ${featureLabel || "fitur ini"}.`,
        "warning",
        "Akses Terbatas"
      );
      handleLogin();
      return;
    }
    handleNavigate(screenTarget);
  };

  const handleLayananSelect = (screenTarget) => {
    setLayananDropdownOpen(false);
    setMobileMenuOpen(false);
    const serviceLabels = {
      scanner: "Pindai Hasil Panen",
      simulator: "Simulator Panen & Gizi",
      "nita-chat": "Tanya Bu Nita",
      "local-food": "Gizi Pangan Lokal",
      recipes: "Resep MPASI Bebas Duri",
      education: "Panduan Suara 1.000 HPK",
    };
    handleProtectedAction(screenTarget, serviceLabels[screenTarget] || "Layanan ini");
  };

  return (
    <div className="gov-portal-wrapper">
      <header className="gov-header">
        <div className="gov-header-inner">
          <div
            className="gov-brand-group"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            title="PANGANITA - Beranda"
          >
            <Logo compact />
            <div className="gov-brand-text hidden sm:flex border-l border-emerald-900/15 pl-3 ml-1">
              <span className="gov-brand-sub text-emerald-900/80 font-medium text-xs leading-snug">
                Sistem Panen &amp; Gizi Ibu Nusantara
              </span>
            </div>
          </div>

          <nav className="gov-nav-links" aria-label="Navigasi Utama">
            <button
              className="gov-nav-item active"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              id="nav-beranda"
            >
              Beranda
            </button>

            <button
              className="gov-nav-item"
              onClick={() => scrollTo("tentang-panganita")}
              id="nav-tentang"
            >
              Tentang
            </button>

            <div className="gov-dropdown-wrapper" ref={dropdownRef}>
              <button
                className={`gov-nav-item gov-dropdown-btn ${layananDropdownOpen ? "open" : ""}`}
                onClick={() => setLayananDropdownOpen(!layananDropdownOpen)}
                onMouseEnter={() => setLayananDropdownOpen(true)}
                aria-haspopup="true"
                aria-expanded={layananDropdownOpen}
                id="nav-layanan"
              >
                <span>Layanan</span>
                <svg
                  className={`gov-chevron ${layananDropdownOpen ? "rotate" : ""}`}
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {layananDropdownOpen && (
                <div
                  className="gov-dropdown-menu"
                  onMouseLeave={() => setLayananDropdownOpen(false)}
                >
                  <div className="dropdown-menu-header">
                    <span className="dropdown-label">FITUR &amp; LAYANAN UTAMA</span>
                  </div>

                  <div className="dropdown-menu-grid">
                    <button
                      className="dropdown-item"
                      onClick={() => handleLayananSelect("scanner")}
                    >
                      <div className="dropdown-icon-box green">📷</div>
                      <div className="dropdown-text">
                        <div className="dropdown-title">
                          Pindai Hasil Panen
                          <span className="badge-chip">Kamera</span>
                        </div>
                        <div className="dropdown-desc">
                          Deteksi hasil kebun/ikan, estimasi berat, harga &amp; lokasi
                        </div>
                      </div>
                    </button>

                    <button
                      className="dropdown-item"
                      onClick={() => handleLayananSelect("simulator")}
                    >
                      <div className="dropdown-icon-box dark">⚖️</div>
                      <div className="dropdown-text">
                        <div className="dropdown-title">
                          Simulator Pangan &amp; Gizi
                          <span className="badge-chip gold">Prioritas</span>
                        </div>
                        <div className="dropdown-desc">
                          Hitung pembagian porsi lauk emas anak vs kas belanja
                        </div>
                      </div>
                    </button>

                    <button
                      className="dropdown-item"
                      onClick={() => handleLayananSelect("nita-chat")}
                    >
                      <div className="dropdown-icon-box warm">🤖</div>
                      <div className="dropdown-text">
                        <div className="dropdown-title">
                          Tanya Bu Nita
                          <span className="badge-chip">Chat &amp; Audio</span>
                        </div>
                        <div className="dropdown-desc">
                          Konsultasi gizi, olah panen, dan MPASI via suara/teks
                        </div>
                      </div>
                    </button>

                    <button
                      className="dropdown-item"
                      onClick={() => handleLayananSelect("local-food")}
                    >
                      <div className="dropdown-icon-box green">🥗</div>
                      <div className="dropdown-text">
                        <div className="dropdown-title">Gizi Pangan Lokal</div>
                        <div className="dropdown-desc">
                          Ensiklopedia nutrisi kakap, lele, kelor, telur &amp; sagu
                        </div>
                      </div>
                    </button>

                    <button
                      className="dropdown-item"
                      onClick={() => handleLayananSelect("recipes")}
                    >
                      <div className="dropdown-icon-box warm">🍲</div>
                      <div className="dropdown-text">
                        <div className="dropdown-title">Resep MPASI Bebas Duri</div>
                        <div className="dropdown-desc">
                          Panduan masak mudah, hemat bahan bakar &amp; ramah balita
                        </div>
                      </div>
                    </button>

                    <button
                      className="dropdown-item"
                      onClick={() => handleLayananSelect("education")}
                    >
                      <div className="dropdown-icon-box dark">📢</div>
                      <div className="dropdown-text">
                        <div className="dropdown-title">Panduan Suara 1.000 HPK</div>
                        <div className="dropdown-desc">
                          Edukasi audio praktis untuk daerah minim sinyal internet
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </nav>

          <div className="gov-auth-box">
            <button
              className="gov-btn-login"
              onClick={handleLogin}
              id="btn-login-wa"
              aria-label="Masuk via WhatsApp"
              title="Masuk Cepat via WhatsApp"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
              <span>Masuk</span>
            </button>

            <button
              className="gov-hamburger-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Buka Menu Navigasi"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="gov-mobile-menu">
            <div className="gov-mobile-menu-inner">
              <button
                className="gov-mobile-link"
                onClick={() => {
                  setMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                🏠 Beranda
              </button>

              <button
                className="gov-mobile-link"
                onClick={() => scrollTo("tentang-panganita")}
              >
                ℹ️ Tentang PANGANITA
              </button>

              <div className="gov-mobile-accordion">
                <button
                  className="gov-mobile-link accordion-toggle"
                  onClick={() => setMobileLayananAccordion(!mobileLayananAccordion)}
                >
                  <span>🛠️ Layanan &amp; Fitur</span>
                  <span className="accordion-arrow">{mobileLayananAccordion ? "▲" : "▼"}</span>
                </button>

                {mobileLayananAccordion && (
                  <div className="gov-mobile-subitems">
                    <button onClick={() => handleLayananSelect("scanner")}>
                      📷 Pindai Panen
                    </button>
                    <button onClick={() => handleLayananSelect("simulator")}>
                      ⚖️ Simulator Panen &amp; Gizi
                    </button>
                    <button onClick={() => handleLayananSelect("nita-chat")}>
                      💬 Tanya Bu Nita
                    </button>
                    <button onClick={() => handleLayananSelect("local-food")}>
                      🥗 Gizi Pangan Lokal
                    </button>
                    <button onClick={() => handleLayananSelect("recipes")}>
                      🍲 Resep MPASI Bebas Duri
                    </button>
                    <button onClick={() => handleLayananSelect("education")}>
                      📢 Panduan Suara 1.000 HPK
                    </button>
                  </div>
                )}
              </div>

              <hr className="gov-mobile-divider" />

              <button
                className="gov-mobile-login-btn"
                onClick={handleLogin}
              >
                📲 Masuk via WhatsApp
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="gov-main">
        <section className="gov-hero-section" id="beranda-onboarding">
          <div className="gov-hero-split-container">
            <div className="gov-hero-copy">
              <div className="gov-hero-badge">
                <LeafIcon /> Pendampingan Cerdas Panen &amp; Gizi Keluarga
              </div>

              <h1 className="gov-hero-title">
                Solusi Panen Pekarangan &amp; Gizi Emas si Kecil
              </h1>

              <p className="gov-hero-desc">
                Selamat datang di <strong>PANGANITA</strong>. Sistem cerdas yang membantu
                Ibu di pesisir dan pedesaan memutuskan pembagian hasil panen:
                <strong> porsi gizi terbaik untuk tumbuh kembang si Kecil</strong>, serta takaran panen yang{" "}
                <strong>ideal dijual untuk tambahan uang kas belanja keluarga</strong>.
              </p>

              <div className="gov-hero-actions">
                <button
                  className="gov-btn-cta"
                  onClick={handleLogin}
                  id="btn-hero-login"
                >
                  Masuk via WhatsApp <span>→</span>
                </button>
                <button
                  className="gov-btn-outline"
                  onClick={() => handleProtectedAction("simulator", "Simulator Panen & Gizi")}
                  id="btn-hero-simulator"
                >
                  Coba Simulator
                </button>
              </div>

              <div className="gov-trust-row">
                <div className="gov-trust-pill">
                  <span className="gov-check-icon">✓</span>
                  <span><strong>Tanpa Rumus Sulit:</strong> Hitungan otomatis</span>
                </div>
                <div className="gov-trust-pill">
                  <span className="gov-check-icon">✓</span>
                  <span><strong>Pangan Lokal:</strong> Ikan kakap, lele, kelor, sagu</span>
                </div>
                <div className="gov-trust-pill">
                  <span className="gov-check-icon">✓</span>
                  <span><strong>Asisten Bu Nita:</strong> Panduan ramah suara 24 jam</span>
                </div>
              </div>
            </div>

            <div className="gov-hero-visual">
              <div className="gov-decision-card-mockup">
                <div className="mockup-header">
                  <div className="mockup-badge">Hasil Rekomendasi Simulator</div>
                  <span className="mockup-date">Tangkapan Ikan Kakap • 5.0 Kg</span>
                </div>

                <div className="mockup-body">
                  <div className="mockup-split-row">
                    <div className="mockup-box nutrition">
                      <div className="box-icon" aria-hidden="true">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
                          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
                          <line x1="6" y1="1" x2="6" y2="4"/>
                          <line x1="10" y1="1" x2="10" y2="4"/>
                          <line x1="14" y1="1" x2="14" y2="4"/>
                        </svg>
                      </div>
                      <div className="box-text">
                        <span className="box-label">SIMPAN UNTUK GIZI</span>
                        <strong className="box-val">2.0 Kg</strong>
                        <span className="box-desc">Cukup 4 porsi lauk emas anak (Cegah Stunting)</span>
                      </div>
                    </div>

                    <div className="mockup-box cash">
                      <div className="box-icon" aria-hidden="true">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="20" height="12" x="2" y="6" rx="2"/>
                          <circle cx="12" cy="12" r="2"/>
                          <path d="M6 12h.01M18 12h.01"/>
                        </svg>
                      </div>
                      <div className="box-text">
                        <span className="box-label">JUAL KE PASAR</span>
                        <strong className="box-val">3.0 Kg</strong>
                        <span className="box-desc">Tambahan kas belanja: <strong>Rp 75.000</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="mockup-footer-note">
                    <span className="note-icon" aria-hidden="true">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/>
                        <path d="M9 18h6"/>
                        <path d="M10 22h4"/>
                      </svg>
                    </span>
                    <span>Anak tercukupi protein hewani, kas dapur Ibu tetap terjaga!</span>
                  </div>
                </div>

                <div className="mockup-action-wrap">
                  <button
                    className="mockup-btn"
                    onClick={() => handleProtectedAction("simulator", "Simulator Panen & Gizi")}
                  >
                    Hitung Panen Sendiri <span>→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="gov-highlight-section" id="simulator-highlight">
          <div className="gov-highlight-container">
            <div className="gov-highlight-banner">
              <div className="gov-highlight-text">
                <span className="section-kicker">FITUR PRIORITAS PANGANITA</span>
                <h2>Simulator Panen &amp; Gizi (Tumbuh1000)</h2>
                <p>
                  Seringkali Ibu merasa dilema saat panen: <em>“Kalau dijual semua, anak makan apa?
                  Kalau disimpan semua, dari mana uang untuk beli beras dan minyak goreng?”</em>
                </p>
                <p>
                  Simulator PANGANITA menyelesaikan dilema ini dengan formula proporsional
                  yang melindungi porsi gizi si Kecil tanpa mengorbankan kebutuhan ekonomi keluarga.
                </p>
                <div className="highlight-cta-group">
                  <button
                    className="gov-btn-cta"
                    onClick={() => handleProtectedAction("simulator", "Simulator Panen & Gizi")}
                  >
                    Buka Simulator Panen <span>→</span>
                  </button>
                  <button
                    className="gov-btn-secondary-white"
                    onClick={() => handleProtectedAction("scanner", "Pindai Hasil Panen")}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "6px", verticalAlign: "middle" }}>
                      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
                      <circle cx="12" cy="13" r="3"/>
                    </svg>
                    Atau Pindai dengan Kamera
                  </button>
                </div>
              </div>

              <div className="gov-highlight-points">
                <div className="point-card">
                  <div className="point-num">01</div>
                  <h4>Tentukan Berat Panen</h4>
                  <p>Ketik berat tangkapan atau cukup foto bakul panen dengan kamera ponsel.</p>
                </div>
                <div className="point-card">
                  <div className="point-num">02</div>
                  <h4>Kalkulasi Gizi Otomatis</h4>
                  <p>Sistem memprioritaskan kebutuhan gram protein harian sesuai usia anak Ibu.</p>
                </div>
                <div className="point-card">
                  <div className="point-num">03</div>
                  <h4>Rekomendasi Kas &amp; Menu</h4>
                  <p>Dapatkan estimasi rupiah hasil jual serta ide olahan lauk lezat bebas duri.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="gov-about-section" id="tentang-panganita">
          <div className="gov-about-container">
            <div className="gov-section-heading">
              <span className="section-kicker">TENTANG PANGANITA</span>
              <h2>Solusi Cerdas Panen &amp; Gizi Emas Keluarga Nusantara</h2>
              <p>
                Menjembatani kelimpahan hasil laut dan pekarangan dengan kebutuhan gizi 1.000 HPK anak,
                tanpa mengorbankan kebutuhan uang belanja harian keluarga.
              </p>
            </div>

            <div className="gov-about-grid">
              {/* CARD 1: REZEKI PANGAN LOKAL */}
              <div
                className="about-card theme-ocean"
                style={{
                  background: "linear-gradient(145deg, #f2f9f5 0%, #e3f4ec 100%)",
                  border: "2px solid transparent",
                  borderRadius: "26px",
                  padding: "36px 30px",
                  boxShadow: "0 6px 20px -4px rgba(6, 78, 59, 0.08)",
                  transition: "all 260ms cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                <div className="about-card-top-row">
                  <div
                    className="about-round-icon green"
                    aria-hidden="true"
                    style={{
                      background: "#ffffff",
                      width: "56px",
                      height: "56px",
                      borderRadius: "18px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#064e3b",
                      boxShadow: "0 4px 12px rgba(6, 78, 59, 0.08)",
                    }}
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
                      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
                    </svg>
                  </div>
                  <span
                    className="about-color-tag green"
                    style={{
                      background: "#064e3b",
                      color: "#ffffff",
                      fontWeight: 700,
                      fontSize: "12px",
                      padding: "6px 14px",
                      borderRadius: "999px",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Pangan Melimpah
                  </span>
                </div>
                <h3 style={{ color: "#064e3b", fontSize: "21px", marginTop: "18px", marginBottom: "10px", fontWeight: 800 }}>
                  Rezeki Laut &amp; Kebun Kita
                </h3>
                <p style={{ color: "#166534", fontSize: "14.5px", lineHeight: "1.65", marginBottom: "20px" }}>
                  Ikan laut, lele kolam, dan telur ayam melimpah di sekitar kita.
                  Ibu mudah membagi mana untuk lauk anak dan mana yang dijual ke pasar.
                </p>
                <div
                  className="about-key-pill green"
                  style={{
                    background: "rgba(255, 255, 255, 0.8)",
                    color: "#064e3b",
                    padding: "10px 16px",
                    borderRadius: "14px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    border: "1px solid rgba(6, 78, 59, 0.12)",
                    fontSize: "13px",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <strong>Bahan lokal murah, gizi setara salmon!</strong>
                </div>
              </div>

              {/* CARD 2: BEBAS RASA BERSALAH */}
              <div
                className="about-card theme-gold"
                style={{
                  background: "linear-gradient(145deg, #f0f8f3 0%, #dff0e5 100%)",
                  border: "2px solid transparent",
                  borderRadius: "26px",
                  padding: "36px 30px",
                  boxShadow: "0 6px 20px -4px rgba(6, 78, 59, 0.08)",
                  transition: "all 260ms cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                <div className="about-card-top-row">
                  <div
                    className="about-round-icon green"
                    aria-hidden="true"
                    style={{
                      background: "#ffffff",
                      width: "56px",
                      height: "56px",
                      borderRadius: "18px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#064e3b",
                      boxShadow: "0 4px 12px rgba(6, 78, 59, 0.08)",
                    }}
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/>
                      <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/>
                      <path d="M7 21h10"/>
                      <path d="M12 3v18"/>
                      <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>
                    </svg>
                  </div>
                  <span
                    className="about-color-tag green"
                    style={{
                      background: "#064e3b",
                      color: "#ffffff",
                      fontWeight: 700,
                      fontSize: "12px",
                      padding: "6px 14px",
                      borderRadius: "999px",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Jalan Tengah Adil
                  </span>
                </div>
                <h3 style={{ color: "#064e3b", fontSize: "21px", marginTop: "18px", marginBottom: "10px", fontWeight: 800 }}>
                  Jual Panen, Anak Tetap Sehat
                </h3>
                <p style={{ color: "#166534", fontSize: "14.5px", lineHeight: "1.65", marginBottom: "20px" }}>
                  Ibu tetap dapat uang kas belanja dapur, si Kecil tetap kenyang lauk bergizi cegah stunting.
                  PANGANITA hitungkan takaran pasnya.
                </p>
                <div
                  className="about-key-pill green"
                  style={{
                    background: "rgba(255, 255, 255, 0.8)",
                    color: "#064e3b",
                    padding: "10px 16px",
                    borderRadius: "14px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    border: "1px solid rgba(6, 78, 59, 0.12)",
                    fontSize: "13px",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <strong>Uang dapur dapat, anak tumbuh cerdas!</strong>
                </div>
              </div>

              {/* CARD 3: PRAKTIS TANPA RUMUS */}
              <div
                className="about-card theme-cyan"
                style={{
                  background: "linear-gradient(145deg, #edf7f2 0%, #dbeee3 100%)",
                  border: "2px solid transparent",
                  borderRadius: "26px",
                  padding: "36px 30px",
                  boxShadow: "0 6px 20px -4px rgba(6, 78, 59, 0.08)",
                  transition: "all 260ms cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                <div className="about-card-top-row">
                  <div
                    className="about-round-icon green"
                    aria-hidden="true"
                    style={{
                      background: "#ffffff",
                      width: "56px",
                      height: "56px",
                      borderRadius: "18px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#064e3b",
                      boxShadow: "0 4px 12px rgba(6, 78, 59, 0.08)",
                    }}
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                      <line x1="12" y1="19" x2="12" y2="22"/>
                      <line x1="8" y1="22" x2="16" y2="22"/>
                    </svg>
                  </div>
                  <span
                    className="about-color-tag green"
                    style={{
                      background: "#064e3b",
                      color: "#ffffff",
                      fontWeight: 700,
                      fontSize: "12px",
                      padding: "6px 14px",
                      borderRadius: "999px",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Asisten Bu Nita
                  </span>
                </div>
                <h3 style={{ color: "#064e3b", fontSize: "21px", marginTop: "18px", marginBottom: "10px", fontWeight: 800 }}>
                  Cukup Foto atau Kirim Suara
                </h3>
                <p style={{ color: "#166534", fontSize: "14.5px", lineHeight: "1.65", marginBottom: "20px" }}>
                  Tak perlu hitungan rumus rumit. Cukup foto bakul panen atau bicara santai
                  lewat rekaman suara seperti kirim pesan di WhatsApp.
                </p>
                <div
                  className="about-key-pill green"
                  style={{
                    background: "rgba(255, 255, 255, 0.8)",
                    color: "#064e3b",
                    padding: "10px 16px",
                    borderRadius: "14px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    border: "1px solid rgba(6, 78, 59, 0.12)",
                    fontSize: "13px",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <strong>Bisa tanya suara, ramah sinyal minim!</strong>
                </div>
              </div>
            </div>

            <div className="gov-impact-strip">
              <div className="impact-item">
                <span className="impact-num">1.000 HPK</span>
                <span className="impact-lbl">Fokus Periode Emas Pencegahan Stunting</span>
              </div>
              <div className="impact-item">
                <span className="impact-num">100% Bebas Rasa Bersalah</span>
                <span className="impact-lbl">Keseimbangan Kas Belanja &amp; Lauk Anak</span>
              </div>
              <div className="impact-item">
                <span className="impact-num">100% Pangan Lokal</span>
                <span className="impact-lbl">Pemanfaatan Pekarangan &amp; Laut Sekitar</span>
              </div>
              <div className="impact-item">
                <span className="impact-num">24 Jam</span>
                <span className="impact-lbl">Pendampingan Asisten Bu Nita</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION LAYANAN DENGAN RUANG NAFAS LUAS */}
        <section className="gov-services-section" id="layanan-gizi">
          <div className="gov-services-container">
            <div className="gov-section-heading">
              <span className="section-kicker">EKOSISTEM LAYANAN TERPADU</span>
              <h2>Tiga Layanan Pendukung Tumbuh Kembang 1.000 HPK</h2>
              <p>
                Fitur praktis yang siap menemani langkah Ibu setiap hari dalam menghidangkan gizi terbaik
                dari komoditas segar sekitar rumah:
              </p>
            </div>

            <div className="gov-services-grid">
              <div
                className="gov-service-card card-pangan"
                onClick={() => handleProtectedAction("local-food", "Gizi Pangan Lokal")}
                role="button"
                tabIndex={0}
                style={{
                  background: "linear-gradient(145deg, #f2f9f5 0%, #e3f4ec 100%)",
                  border: "2px solid transparent",
                  borderRadius: "26px",
                  padding: "36px 30px",
                  boxShadow: "0 6px 20px -4px rgba(6, 78, 59, 0.08)",
                  transition: "all 260ms cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                <div className="service-card-top">
                  <div
                    className="service-icon-box green"
                    style={{
                      background: "#ffffff",
                      width: "56px",
                      height: "56px",
                      borderRadius: "18px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 4px 12px rgba(6, 78, 59, 0.08)",
                      color: "#064e3b",
                    }}
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
                      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
                    </svg>
                  </div>
                  <span
                    className="service-tag tag-green"
                    style={{
                      background: "#064e3b",
                      color: "#ffffff",
                      fontWeight: 700,
                      fontSize: "12px",
                      padding: "6px 14px",
                      borderRadius: "999px",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Ensiklopedia Gizi
                  </span>
                </div>
                <h3 style={{ color: "#064e3b", fontSize: "21px", marginTop: "18px", marginBottom: "10px", fontWeight: 800 }}>
                  Gizi Pangan Lokal
                </h3>
                <p style={{ color: "#166534", fontSize: "14.5px", lineHeight: "1.65", marginBottom: "24px" }}>
                  Kenali kebaikan nutrisi pangan sekitar: ikan kakap, lele kolam,
                  daun kelor, sagu, hingga telur ayam kampung.
                </p>
                <div
                  className="service-card-btn-action btn-green"
                  style={{
                    background: "#064e3b",
                    color: "#ffffff",
                    padding: "13px 22px",
                    borderRadius: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontWeight: 700,
                    fontSize: "14.5px",
                    boxShadow: "0 4px 14px rgba(6, 78, 59, 0.2)",
                  }}
                >
                  <span>Jelajahi Pangan Lokal</span>
                  <strong style={{ fontSize: "18px" }}>→</strong>
                </div>
              </div>

              <div
                className="gov-service-card card-edukasi"
                onClick={() => handleProtectedAction("education", "Panduan Suara 1.000 HPK")}
                role="button"
                tabIndex={0}
                style={{
                  background: "linear-gradient(145deg, #f0f8f3 0%, #dff0e5 100%)",
                  border: "2px solid transparent",
                  borderRadius: "26px",
                  padding: "36px 30px",
                  boxShadow: "0 6px 20px -4px rgba(6, 78, 59, 0.08)",
                  transition: "all 260ms cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                <div className="service-card-top">
                  <div
                    className="service-icon-box green"
                    style={{
                      background: "#ffffff",
                      width: "56px",
                      height: "56px",
                      borderRadius: "18px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 4px 12px rgba(6, 78, 59, 0.08)",
                      color: "#064e3b",
                    }}
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                    </svg>
                  </div>
                  <span
                    className="service-tag tag-green"
                    style={{
                      background: "#064e3b",
                      color: "#ffffff",
                      fontWeight: 700,
                      fontSize: "12px",
                      padding: "6px 14px",
                      borderRadius: "999px",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Panduan Suara
                  </span>
                </div>
                <h3 style={{ color: "#064e3b", fontSize: "21px", marginTop: "18px", marginBottom: "10px", fontWeight: 800 }}>
                  Edukasi Gizi 1.000 HPK
                </h3>
                <p style={{ color: "#166534", fontSize: "14.5px", lineHeight: "1.65", marginBottom: "24px" }}>
                  Tak perlu banyak membaca teks panjang. Dengarkan panduan suara ringkas tentang
                  cara cegah stunting, ASI eksklusif, dan stimulasi anak.
                </p>
                <div
                  className="service-card-btn-action btn-green"
                  style={{
                    background: "#064e3b",
                    color: "#ffffff",
                    padding: "13px 22px",
                    borderRadius: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontWeight: 700,
                    fontSize: "14.5px",
                    boxShadow: "0 4px 14px rgba(6, 78, 59, 0.2)",
                  }}
                >
                  <span>Dengarkan Panduan</span>
                  <strong style={{ fontSize: "18px" }}>→</strong>
                </div>
              </div>

              <div
                className="gov-service-card card-resep"
                onClick={() => handleProtectedAction("recipes", "Resep MPASI Bebas Duri")}
                role="button"
                tabIndex={0}
                style={{
                  background: "linear-gradient(145deg, #edf7f2 0%, #dbeee3 100%)",
                  border: "2px solid transparent",
                  borderRadius: "26px",
                  padding: "36px 30px",
                  boxShadow: "0 6px 20px -4px rgba(6, 78, 59, 0.08)",
                  transition: "all 260ms cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                <div className="service-card-top">
                  <div
                    className="service-icon-box green"
                    style={{
                      background: "#ffffff",
                      width: "56px",
                      height: "56px",
                      borderRadius: "18px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 4px 12px rgba(6, 78, 59, 0.08)",
                      color: "#064e3b",
                    }}
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
                      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
                      <line x1="6" y1="1" x2="6" y2="4"/>
                      <line x1="10" y1="1" x2="10" y2="4"/>
                      <line x1="14" y1="1" x2="14" y2="4"/>
                    </svg>
                  </div>
                  <span
                    className="service-tag tag-green"
                    style={{
                      background: "#064e3b",
                      color: "#ffffff",
                      fontWeight: 700,
                      fontSize: "12px",
                      padding: "6px 14px",
                      borderRadius: "999px",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Kreasi Dapur
                  </span>
                </div>
                <h3 style={{ color: "#064e3b", fontSize: "21px", marginTop: "18px", marginBottom: "10px", fontWeight: 800 }}>
                  Resep MPASI &amp; Lauk Emas
                </h3>
                <p style={{ color: "#166534", fontSize: "14.5px", lineHeight: "1.65", marginBottom: "24px" }}>
                  Kumpulan resep masakan ramah balita: teknik olah ikan bebas duri, bubur kelor
                  lembut, dan nugget ikan rumahan hemat bahan bakar.
                </p>
                <div
                  className="service-card-btn-action btn-green"
                  style={{
                    background: "#064e3b",
                    color: "#ffffff",
                    padding: "13px 22px",
                    borderRadius: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontWeight: 700,
                    fontSize: "14.5px",
                    boxShadow: "0 4px 14px rgba(6, 78, 59, 0.2)",
                  }}
                >
                  <span>Buka Buku Resep</span>
                  <strong style={{ fontSize: "18px" }}>→</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="gov-banner-card" id="tanya-bu-nita">
          <div className="gov-banner-inner">
            <div className="gov-banner-copy">
              <span className="banner-kicker">ASISTEN CERDAS BU NITA</span>
              <h2>Punya Pertanyaan Seputar MPASI atau Panen?</h2>
              <p>
                Bu Nita siap menjawab kapan saja dengan bahasa yang ramah, hangat,
                dan mudah dimengerti. Cukup kirim pesan atau bicara seperti di WhatsApp.
              </p>
              <div className="banner-btn-group">
                <button
                  className="banner-primary-btn"
                  onClick={() => handleProtectedAction("nita-chat", "Tanya Bu Nita")}
                >
                  Tanya Bu Nita Sekarang <span>→</span>
                </button>
                <button
                  className="banner-secondary-btn"
                  onClick={handleLogin}
                >
                  Masuk via WhatsApp
                </button>
              </div>
            </div>
            <div className="gov-banner-illustration">
              <img src={ASSETS.childFishBanner} alt="Balita sehat bersama hasil panen pangan lokal" />
            </div>
          </div>
        </section>
      </main>

      <footer className="gov-footer">
        <div className="gov-footer-content">
          <div className="gov-footer-col brand">
            <h3>PANGANITA: Pangan dan Gizi untuk Keluarga</h3>
            <p>
              Inovasi pemanfaatan pangan lokal mandiri untuk percepatan penurunan stunting
              pada 1.000 Hari Pertama Kehidupan (HPK) didampingi Asisten Bu Nita.
            </p>
            <div className="gov-team-badge">
              <span>Pengembang: <strong>Kelompok 10 Malahayati</strong></span>
              <span className="author-name">Tema: Ketahanan Pangan, Gizi Perempuan &amp; Keluarga</span>
            </div>
          </div>

          <div className="gov-footer-col">
            <h4>LAYANAN PANGANITA</h4>
            <ul>
              <li><button onClick={() => handleProtectedAction("simulator", "Simulator Panen & Gizi")}>Simulator Panen &amp; Gizi</button></li>
              <li><button onClick={() => handleProtectedAction("scanner", "Pindai Hasil Panen")}>Pindai Panen Pekarangan</button></li>
              <li><button onClick={() => handleNavigate("local-food")}>Ensiklopedia Gizi Lokal</button></li>
              <li><button onClick={() => handleNavigate("recipes")}>Resep Olahan Lauk Emas</button></li>
            </ul>
          </div>

          <div className="gov-footer-col">
            <h4>BANTUAN &amp; KONSULTASI</h4>
            <ul>
              <li><button onClick={() => handleProtectedAction("nita-chat", "Tanya Asisten Bu Nita")}>Tanya Asisten Bu Nita</button></li>
              <li><button onClick={() => handleNavigate("education")}>Panduan Audio 1.000 HPK</button></li>
              <li><button onClick={handleLogin}>Daftar / Masuk Akun</button></li>
            </ul>
          </div>
        </div>

        <div className="gov-footer-bottom">
          <div className="gov-footer-bottom-inner" style={{ justifyContent: "center" }}>
            <span>© 2026 PANGANITA</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
