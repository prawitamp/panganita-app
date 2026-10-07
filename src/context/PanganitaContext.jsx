"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import { initialChatMessages } from "@/data/initialChat";
import { ROUTES, PATH_TO_SCREEN } from "@/constants/routes";

const SCREEN_LABELS = {
  landing: "Halaman Utama",
  welcome: "Halaman Masuk",
  profile: "Pengaturan Profil",
  harvest: "Komoditas Panen",
  home: "Beranda",
  simulator: "Simulator Panen & Gizi",
  scanner: "Pindai Panen",
  "local-food": "Gizi Pangan Lokal",
  recipes: "Resep MPASI",
  education: "Panduan Suara 1.000 HPK",
  "nita-chat": "Tanya Bu Nita",
  "profile-page": "Profil Keluarga",
  "decision-keep": "Hasil Keputusan",
  "decision-sell": "Hasil Keputusan",
};

const defaultProfile = {
  name: "",
  phone: "",
  location: "Kab. Teluk Bintuni, Papua Barat",
  district: "Distrik Babo",
  avatar: "/assets/58a27.png",
  familyCondition: ["baby"],
  commodities: ["fish", "greens"],
  children: [],
};

const PanganitaContext = createContext(undefined);

export function PanganitaProvider({ children }) {
  const pathname = usePathname();
  const [screen, setScreenState] = useState("landing");
  const [profile, setProfile] = useState(defaultProfile);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);
  const [navLoading, setNavLoading] = useState(false);
  const [navTargetName, setNavTargetName] = useState("");
  const navLoadingTimerRef = useRef(null);
  const [detectedWeight, setDetectedWeight] = useState("2.0");
  const [harvestPrice, setHarvestPrice] = useState("30000");
  const [harvestLocation, setHarvestLocation] = useState("Pasar Sentral Pandeglang");
  const [harvestPhoto, setHarvestPhoto] = useState(null);
  const [decision, setDecision] = useState(null);
  const [chatMessages, setChatMessages] = useState(initialChatMessages);
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const hideToast = useCallback(() => {
    setToast(null);
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }
  }, []);

  const showToast = useCallback((message, type = "warning", title = null, duration = 4000) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    const toastTitle =
      title ||
      (type === "warning"
        ? "Akses Diperlukan"
        : type === "error"
        ? "Gagal"
        : type === "success"
        ? "Berhasil"
        : "Informasi");

    setToast({ message, type, title: toastTitle, id: Date.now() });
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, duration);
  }, []);

  const startNavigation = useCallback((label = "Memuat...") => {
    setNavLoading(true);
    setNavTargetName(label);
    if (navLoadingTimerRef.current) {
      clearTimeout(navLoadingTimerRef.current);
    }
    // Batas waktu keamanan agar animasi tidak menggantung
    navLoadingTimerRef.current = setTimeout(() => {
      setNavLoading(false);
    }, 700);
  }, []);

  const finishNavigation = useCallback(() => {
    if (navLoadingTimerRef.current) {
      clearTimeout(navLoadingTimerRef.current);
    }
    navLoadingTimerRef.current = setTimeout(() => {
      setNavLoading(false);
    }, 200);
  }, []);

  // Tutup loading bar begitu halaman rute tujuan telah selesai berganti
  useEffect(() => {
    if (navLoading) {
      const timer = setTimeout(() => {
        setNavLoading(false);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  useEffect(() => {
    return () => {
      if (navLoadingTimerRef.current) clearTimeout(navLoadingTimerRef.current);
    };
  }, []);

  // Sinkronisasi rute URL saat setScreen dipanggil
  const setScreen = useCallback((targetScreen, shouldPushUrl = true) => {
    const label = SCREEN_LABELS[targetScreen] || "Memuat Halaman...";
    startNavigation(label);
    setScreenState(targetScreen);

    if (shouldPushUrl && typeof window !== "undefined") {
      const targetRoute = ROUTES[targetScreen];
      if (targetRoute) {
        const currentPath = window.location.pathname;
        const currentSearch = window.location.search;
        const currentUrl = currentPath + currentSearch;

        if (currentUrl !== targetRoute) {
          try {
            window.history.pushState({ screen: targetScreen }, "", targetRoute);
          } catch {}
        }
      }
    }
  }, [startNavigation]);

  // 1. Deteksi rute URL awal dan browser Back/Forward (popstate)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const syncScreenWithUrl = () => {
      const path = window.location.pathname;
      const search = window.location.search;

      if (path === "/" && search.includes("step=")) {
        const step = new URLSearchParams(search).get("step");
        if (step) setScreenState(step);
      } else if (PATH_TO_SCREEN[path]) {
        setScreenState(PATH_TO_SCREEN[path]);
      }
    };

    // Sinkronkan saat halaman pertama dimuat
    syncScreenWithUrl();

    // Dengarkan navigasi browser back / forward
    window.addEventListener("popstate", syncScreenWithUrl);
    return () => window.removeEventListener("popstate", syncScreenWithUrl);
  }, []);

  // 2. Muat state profil lokal dan cek status login
  useEffect(() => {
    try {
      const savedAuth = localStorage.getItem("panganita_logged_in");
      const savedProfile = localStorage.getItem("panganita_profile");
      const parsedProfile = savedProfile ? JSON.parse(savedProfile) : null;

      // Autentikasi valid hanya jika eksplisit login DAN memiliki nomor telepon atau nama akun
      const hasUserData = Boolean(parsedProfile && (parsedProfile.phone || parsedProfile.name));
      const hasAuthFlag = savedAuth === "true" || (parsedProfile && parsedProfile.isLoggedIn === true);

      if (hasAuthFlag && hasUserData) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        try {
          localStorage.removeItem("panganita_logged_in");
        } catch {}
      }

      if (parsedProfile) {
        if (!parsedProfile.children || !Array.isArray(parsedProfile.children)) {
          parsedProfile.children = [];
        }
        if (parsedProfile.familyCondition && !Array.isArray(parsedProfile.familyCondition)) {
          parsedProfile.familyCondition = [parsedProfile.familyCondition];
        }
        // Pastikan city & province sinkron dengan location terbaru jika ada perubahan
        if (parsedProfile.location) {
          const locCity = parsedProfile.location.split(",")[0]?.trim();
          if (locCity) parsedProfile.city = locCity;
          if (parsedProfile.location.includes(",")) {
            const locProv = parsedProfile.location.split(",").slice(1).join(",").trim();
            if (locProv) parsedProfile.province = locProv;
          }
        }
        setProfile((prev) => ({ ...prev, ...parsedProfile }));
      }
    } catch {
      setIsLoggedIn(false);
    } finally {
      setIsAuthReady(true);
    }

    // Direct API call: GET /api/profile
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data && typeof data.data === "object") {
          setProfile((prev) => {
            // Jika profil lokal belum ada nama, gunakan data server API
            if (!prev.name && data.data.name) {
              return { ...prev, ...data.data };
            }
            return prev;
          });
        }
      })
      .catch(() => {});
  }, []);

  // Update profil secara lokal & simpan ke Direct API /api/profile
  const updateProfileData = (fields) => {
    setProfile((prev) => {
      // Otomatis sinkronkan city dan province jika fields memiliki location
      const derived = {};
      if (fields?.location && typeof fields.location === "string") {
        const parts = fields.location.split(",");
        const derivedCity = parts[0]?.trim();
        const derivedProvince = parts.slice(1).join(",").trim();
        if (derivedCity) derived.city = derivedCity;
        if (derivedProvince) derived.province = derivedProvince;
      }
      const updated = { ...prev, ...derived, ...fields };
      try {
        localStorage.setItem("panganita_profile", JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // Direct API call: POST /api/profile
    try {
      fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      }).catch(() => {});
    } catch {}
  };

  const updateFamilyCondition = (conditions) => {
    setProfile((prev) => {
      const updatedConditions = Array.isArray(conditions)
        ? conditions
        : [conditions];
      const updated = { ...prev, familyCondition: updatedConditions };
      try {
        localStorage.setItem("panganita_profile", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const toggleCommodity = (commodityId) => {
    setProfile((prev) => {
      const exists = prev.commodities.includes(commodityId);
      const nextCommodities = exists
        ? prev.commodities.filter((c) => c !== commodityId)
        : [...prev.commodities, commodityId];
      const updated = { ...prev, commodities: nextCommodities };
      try {
        localStorage.setItem("panganita_profile", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const addChild = (childData) => {
    setProfile((prev) => {
      const newChild = {
        id: `c-${Date.now()}`,
        name: childData.name || "Anak",
        age: childData.age || "1",
        ageUnit: childData.ageUnit || "tahun",
        note: childData.note || "Tumbuh Kembang Anak",
      };
      const updated = {
        ...prev,
        children: [...(prev.children || []), newChild],
      };
      try {
        localStorage.setItem("panganita_profile", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const removeChild = (childId) => {
    setProfile((prev) => {
      const updated = {
        ...prev,
        children: (prev.children || []).filter((c) => c.id !== childId),
      };
      try {
        localStorage.setItem("panganita_profile", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const updateChild = (childId, updatedFields) => {
    setProfile((prev) => {
      const updated = {
        ...prev,
        children: (prev.children || []).map((c) =>
          c.id === childId ? { ...c, ...updatedFields } : c
        ),
      };
      try {
        localStorage.setItem("panganita_profile", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const sendUserMessage = async (input) => {
    let text = "";
    let voiceNote = null;

    if (typeof input === "string") {
      text = input;
    } else if (input && typeof input === "object") {
      text = input.text || "🎤 Pesan Suara Ibu";
      voiceNote = input.voiceNote || null;
    }

    if (!text.trim() && !voiceNote) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: "user",
      senderName: profile.name ? `Ibu ${profile.name}` : "Ibu",
      time:
        new Intl.DateTimeFormat("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date()) + " WIB",
      text,
      voiceNote,
    };

    setChatMessages((prev) => [...prev, userMsg]);

    try {
      // Direct API call: POST /api/chat
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text || "Pesan suara dari Ibu" }),
      });
      const result = await res.json();

      if (result.success && result.data) {
        const nitaMsg = {
          id: `nita-${Date.now()}`,
          sender: "nita",
          senderName: result.data.sender || "Bu Nita",
          time:
            result.data.time ||
            new Intl.DateTimeFormat("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            }).format(new Date()) + " WIB",
          text: result.data.reply,
          voiceNote: {
            duration: "0:12",
            icon: "68f0c.svg",
          },
        };

        setChatMessages((prev) => [...prev, nitaMsg]);
        return;
      }
    } catch (e) {
      console.warn("Direct API /api/chat fallback", e);
    }

    // Fallback respons lokal jika offline
    setTimeout(() => {
      const nitaMsg = {
        id: `nita-${Date.now()}`,
        sender: "nita",
        senderName: "Bu Nita",
        time:
          new Intl.DateTimeFormat("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          }).format(new Date()) + " WIT",
        text: "Terima kasih Ibu sudah berkonsultasi. Menjaga asupan gizi hewani dari pekarangan sangat ampuh untuk mencegah stunting pada si kecil.",
        voiceNote: {
          duration: "0:15",
          icon: "68f0c.svg",
        },
      };

      setChatMessages((prev) => [...prev, nitaMsg]);
    }, 600);
  };

  const togglePlayAudio = (id) => {
    setPlayingAudioId((prev) => (prev === id ? null : id));
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isFavorite = (id) => favorites.includes(id);

  const login = useCallback((updates) => {
    setIsLoggedIn(true);
    try {
      localStorage.setItem("panganita_logged_in", "true");
      if (updates) {
        if (typeof updates === "string") {
          updateProfileData({ phone: updates });
        } else if (typeof updates === "object") {
          updateProfileData(updates);
        }
      }
    } catch {}
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    try {
      localStorage.removeItem("panganita_logged_in");
      const saved = localStorage.getItem("panganita_profile");
      if (saved) {
        const parsed = JSON.parse(saved);
        delete parsed.isLoggedIn;
        localStorage.setItem("panganita_profile", JSON.stringify(parsed));
      }
    } catch {}
    showToast("Anda telah keluar dari akun.", "info", "Selesai");
  }, [showToast]);

  return (
    <PanganitaContext.Provider
      value={{
        screen,
        setScreen,
        profile,
        setProfile,
        isLoggedIn,
        isAuthReady,
        login,
        logout,
        toast,
        showToast,
        hideToast,
        updateProfileData,
        updateFamilyCondition,
        toggleCommodity,
        detectedWeight,
        setDetectedWeight,
        harvestPrice,
        setHarvestPrice,
        harvestLocation,
        setHarvestLocation,
        harvestPhoto,
        setHarvestPhoto,
        addChild,
        removeChild,
        updateChild,
        decision,
        setDecision,
        chatMessages,
        sendUserMessage,
        playingAudioId,
        setPlayingAudioId,
        togglePlayAudio,
        favorites,
        toggleFavorite,
        isFavorite,
        navLoading,
        navTargetName,
        startNavigation,
        finishNavigation,
      }}
    >
      {/* 1. Global Navigation Loading Indicator (Top Progress Bar & Pill) */}
      {navLoading && (
        <div className="panganita-nav-loader" role="status" aria-live="polite">
          <div className="panganita-nav-progress-bar" />
          <div className="panganita-nav-pill-badge">
            <div className="panganita-nav-spinner" />
            <span>{navTargetName ? `Membuka ${navTargetName}...` : "Memuat Halaman..."}</span>
          </div>
        </div>
      )}

      {children}
      {toast && (
        <div className="panganita-toast-container" role="status" aria-live="polite">
          <div className={`panganita-toast ${toast.type || "warning"}`}>
            <span className="toast-icon" aria-hidden="true">
              {toast.type === "success"
                ? "✓"
                : toast.type === "error"
                ? "✕"
                : toast.type === "info"
                ? "ℹ"
                : "🔒"}
            </span>
            <div className="toast-content">
              {toast.title && <strong>{toast.title}</strong>}
              <p>{toast.message}</p>
            </div>
            <button
              type="button"
              className="toast-close"
              onClick={hideToast}
              aria-label="Tutup notifikasi"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </PanganitaContext.Provider>
  );
}

export function usePanganita() {
  const context = useContext(PanganitaContext);
  if (!context) {
    throw new Error("usePanganita harus digunakan di dalam PanganitaProvider");
  }
  return context;
}
