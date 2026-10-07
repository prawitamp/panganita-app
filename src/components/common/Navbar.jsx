import React, { useState, useRef, useEffect } from "react"
import Logo from "./Logo"
import { useRouter, usePathname } from "next/navigation"
import { ROUTES, PATH_TO_SCREEN } from "@/constants/routes"
import { usePanganita } from "@/context/PanganitaContext"

export default function Navbar({ activeScreen, setScreen, profile }) {
  const router = useRouter()
  const pathname = usePathname()
  const { logout } = usePanganita()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [layananDropdownOpen, setLayananDropdownOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)

  const layananRef = useRef(null)
  const userRef = useRef(null)

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (layananRef.current && !layananRef.current.contains(event.target)) {
        setLayananDropdownOpen(false)
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setUserDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const activeTab = activeScreen || PATH_TO_SCREEN[pathname] || "home"

  const handleNavClick = (screenId) => {
    if (setScreen) {
      setScreen(screenId)
    }
    const targetRoute = ROUTES[screenId] || "/beranda"
    if (pathname !== targetRoute.split("?")[0]) {
      router.push(targetRoute)
    }
    setMobileMenuOpen(false)
    setLayananDropdownOpen(false)
    setUserDropdownOpen(false)
  }

  const handleLogout = () => {
    if (logout) {
      logout()
    }
    handleNavClick("welcome")
  }

  const isLayananActive = ["local-food", "recipes", "education"].includes(
    activeTab,
  )

  const displayName = profile?.name?.trim() || "Ibu"
  const userInitials = displayName
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "IB"
  const rawLoc = profile?.location?.trim() || "";
  const locCity = rawLoc ? rawLoc.split(",")?.[0]?.trim() : "";
  const locProvince =
    rawLoc && rawLoc.includes(",")
      ? rawLoc.split(",")?.slice(1)?.join(",")?.trim()
      : "";

  const city = locCity || profile?.city || "Kab. Teluk Bintuni";
  const province = locProvince || profile?.province || "Papua Barat";
  const displayLocation = `${city} • ${province}`;

  return (
    <header className="site-navbar-wrapper">
      {/* 1. Top Mini Bar: Info Wilayah & Program */}
      <div className="gov-mini-bar">
        <div className="gov-mini-container">
          <div className="mini-bar-left">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>{displayLocation}</span>
          </div>
          <div className="mini-bar-right">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>Prioritas Percepatan Penurunan Stunting 1.000 HPK</span>
          </div>
        </div>
      </div>

      {/* 2. Main Navbar Bar */}
      <div className="site-navbar-container">
        {/* Brand: Logo & Title */}
        <div
          className="site-navbar-brand"
          onClick={() => handleNavClick("home")}
          role="button"
          tabIndex={0}
        >
          <Logo compact />
          <div className="brand-text-col hidden sm:flex border-l border-emerald-900/15 pl-2.5 ml-1">
            <span className="brand-tagline text-emerald-900/80 font-medium text-xs">Sahabat Gizi &amp; Panen</span>
          </div>
        </div>

        {/* Desktop Navigation: Minimalist Pill Navigation */}
        <nav className="site-navbar-desktop-nav" aria-label="Menu Utama">
          {/* Tab 1: Beranda */}
          <button
            className={`site-nav-pill ${
              activeTab === "home" ? "active" : ""
            }`}
            onClick={() => handleNavClick("home")}
          >
            <span>Beranda</span>
          </button>

          {/* Tab 2: Pindai Panen */}
          <button
            className={`site-nav-pill ${
              activeTab === "scanner" ? "active" : ""
            }`}
            onClick={() => handleNavClick("scanner")}
          >
            <span>Pindai Panen</span>
          </button>

          {/* Tab 3: Simulator Panen & Gizi */}
          <button
            className={`site-nav-pill ${
              activeTab === "simulator" ? "active" : ""
            }`}
            onClick={() => handleNavClick("simulator")}
          >
            <span>Simulator Gizi</span>
            <span className="nav-accent-dot" />
          </button>

          {/* Tab 4: Dropdown Layanan Gizi */}
          <div className="site-nav-dropdown-wrapper" ref={layananRef}>
            <button
              className={`site-nav-pill dropdown-trigger ${
                isLayananActive ? "active" : ""
              }`}
              onClick={() => setLayananDropdownOpen(!layananDropdownOpen)}
              aria-expanded={layananDropdownOpen}
            >
              <span>Layanan Gizi</span>
              <svg
                className={`chevron-icon ${layananDropdownOpen ? "open" : ""}`}
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {layananDropdownOpen && (
              <div className="modern-dropdown-popover">
                <div className="dropdown-popover-header">
                  <span>PILIHAN LAYANAN GIZI</span>
                </div>
                <div className="dropdown-popover-body">
                  <button
                    className={`dropdown-popover-item ${
                      activeTab === "local-food" ? "active" : ""
                    }`}
                    onClick={() => handleNavClick("local-food")}
                  >
                    <div className="dropdown-item-icon green">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                      </svg>
                    </div>
                    <div className="dropdown-item-info">
                      <strong>Gizi Pangan Lokal</strong>
                      <small>Kandungan nutrisi ikan, kelor &amp; sagu</small>
                    </div>
                  </button>

                  <button
                    className={`dropdown-popover-item ${
                      activeTab === "recipes" ? "active" : ""
                    }`}
                    onClick={() => handleNavClick("recipes")}
                  >
                    <div className="dropdown-item-icon amber">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                        <line x1="6" y1="1" x2="6" y2="4" />
                        <line x1="10" y1="1" x2="10" y2="4" />
                        <line x1="14" y1="1" x2="14" y2="4" />
                      </svg>
                    </div>
                    <div className="dropdown-item-info">
                      <strong>Resep MPASI Bebas Duri</strong>
                      <small>Menu olahan lauk emas ramah balita</small>
                    </div>
                  </button>

                  <button
                    className={`dropdown-popover-item ${
                      activeTab === "education" ? "active" : ""
                    }`}
                    onClick={() => handleNavClick("education")}
                  >
                    <div className="dropdown-item-icon blue">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                      </svg>
                    </div>
                    <div className="dropdown-item-info">
                      <strong>Panduan Suara 1.000 HPK</strong>
                      <small>Edukasi audio tanpa baca teks panjang</small>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Tab 5: Tanya Bu Nita */}
          <button
            className={`site-nav-pill ai-pill ${
              activeTab === "nita-chat" ? "active" : ""
            }`}
            onClick={() => handleNavClick("nita-chat")}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="22" />
              <line x1="8" y1="22" x2="16" y2="22" />
            </svg>
            <span>Tanya Bu Nita</span>
          </button>
        </nav>

        {/* Right Section: User Profile & Actions */}
        <div className="site-navbar-actions">
          {/* User Profile Capsule with Dropdown */}
          <div className="user-profile-menu-wrap" ref={userRef}>
            <button
              className="user-profile-capsule"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              aria-label="Menu Pengguna"
            >
              <div className="user-avatar-circle" style={{ overflow: "hidden" }}>
                {profile?.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={displayName}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <span>{userInitials}</span>
                )}
                <span className="user-online-dot" />
              </div>
              <div className="user-info-text">
                <span className="user-name" title={displayName}>{displayName}</span>
                <span className="user-meta" title={city}>{city}</span>
              </div>
              <svg
                className={`user-chevron ${userDropdownOpen ? "open" : ""}`}
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {userDropdownOpen && (
              <div className="user-dropdown-popover">
                <div className="user-popover-header">
                  <div className="avatar-large" style={{ overflow: "hidden" }}>
                    {profile?.avatar ? (
                      <img
                        src={profile.avatar}
                        alt={displayName}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      userInitials
                    )}
                  </div>
                  <div className="header-meta">
                    <strong>{displayName}</strong>
                    <small>Ibu Keluarga Nusantara</small>
                    <span className="location-tag">
                      {city}, {province}
                    </span>
                  </div>
                </div>

                <div className="user-popover-links">
                  <button
                    className={`user-link-btn ${
                      activeTab === "profile-page" ? "active" : ""
                    }`}
                    onClick={() => handleNavClick("profile-page")}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span>Profil Ibu &amp; Anak</span>
                  </button>

                  <button
                    className="user-link-btn"
                    onClick={() => handleNavClick("landing")}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    <span>Ke Halaman Depan</span>
                  </button>

                  <hr className="popover-divider" />

                  <button
                    className="user-link-btn danger"
                    onClick={handleLogout}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    <span>Keluar / Ganti Akun</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <button
            className={`modern-hamburger-btn ${mobileMenuOpen ? "open" : ""}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Tutup Menu" : "Buka Menu"}
          >
            {mobileMenuOpen ? (
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* 3. Mobile / Tablet Modern Drawer */}
      {mobileMenuOpen && (
        <div
          className="mobile-drawer-backdrop"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="mobile-drawer-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="drawer-header">
              <div className="drawer-user-info">
                <div className="drawer-avatar" style={{ overflow: "hidden" }}>
                  {profile?.avatar ? (
                    <img
                      src={profile.avatar}
                      alt={displayName}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    userInitials
                  )}
                </div>
                <div>
                  <strong>{displayName}</strong>
                  <small>{displayLocation}</small>
                </div>
              </div>
              <button
                className="drawer-close-btn"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Tutup menu"
              >
                ✕
              </button>
            </div>

            <div className="drawer-nav-list">
              <p className="drawer-section-title">MENU UTAMA</p>

              <button
                className={`drawer-nav-link ${
                  activeTab === "home" ? "active" : ""
                }`}
                onClick={() => handleNavClick("home")}
              >
                <span>Beranda</span>
                <span className="drawer-arrow">→</span>
              </button>

              <button
                className={`drawer-nav-link ${
                  activeTab === "scanner" ? "active" : ""
                }`}
                onClick={() => handleNavClick("scanner")}
              >
                <span>Pindai Panen (Kamera)</span>
                <span className="drawer-arrow">→</span>
              </button>

              <button
                className={`drawer-nav-link ${
                  activeTab === "simulator" ? "active" : ""
                }`}
                onClick={() => handleNavClick("simulator")}
              >
                <span>Simulator Panen &amp; Gizi</span>
                <span className="badge-pill-small">Gizi Anak</span>
              </button>

              <button
                className={`drawer-nav-link ${
                  activeTab === "nita-chat" ? "active" : ""
                }`}
                onClick={() => handleNavClick("nita-chat")}
              >
                <span>Tanya Bu Nita (Suara &amp; Chat)</span>
                <span className="badge-pill-small green">24 Jam</span>
              </button>

              <p className="drawer-section-title" style={{ marginTop: "20px" }}>
                LAYANAN GIZI &amp; EDUKASI
              </p>

              <button
                className={`drawer-nav-link ${
                  activeTab === "local-food" ? "active" : ""
                }`}
                onClick={() => handleNavClick("local-food")}
              >
                <span>Gizi Pangan Lokal</span>
                <span className="drawer-arrow">→</span>
              </button>

              <button
                className={`drawer-nav-link ${
                  activeTab === "recipes" ? "active" : ""
                }`}
                onClick={() => handleNavClick("recipes")}
              >
                <span>Resep MPASI Bebas Duri</span>
                <span className="drawer-arrow">→</span>
              </button>

              <button
                className={`drawer-nav-link ${
                  activeTab === "education" ? "active" : ""
                }`}
                onClick={() => handleNavClick("education")}
              >
                <span>Panduan Suara 1.000 HPK</span>
                <span className="drawer-arrow">→</span>
              </button>

              <p className="drawer-section-title" style={{ marginTop: "20px" }}>
                AKUN
              </p>

              <button
                className={`drawer-nav-link ${
                  activeTab === "profile-page" ? "active" : ""
                }`}
                onClick={() => handleNavClick("profile-page")}
              >
                <span>Profil Ibu &amp; Anak</span>
                <span className="drawer-arrow">→</span>
              </button>

              <button
                className="drawer-nav-link"
                onClick={() => handleNavClick("landing")}
              >
                <span>Ke Halaman Depan</span>
                <span className="drawer-arrow">→</span>
              </button>
            </div>

            <div className="drawer-footer">
              <button
                className="drawer-logout-btn"
                onClick={handleLogout}
              >
                Keluar / Ganti Akun
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
