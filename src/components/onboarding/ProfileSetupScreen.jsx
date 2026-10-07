import React, { useState, useRef } from "react";
import Progress from "@/components/common/Progress";
import { familyOptions } from "@/data/familyOptions";
import { ASSETS, getAssetUrl } from "@/constants/assets";
import {
  INDONESIA_PROVINCES,
  REGIONS_BY_PROVINCE,
  ALL_COMMON_CITIES,
} from "@/data/indonesiaRegions";

const AVATAR_OPTIONS = [
  { id: "mamaNur", name: "Mama Nur", src: ASSETS.mamaNurAvatar },
  { id: "nita", name: "Bu Nita", src: ASSETS.nitaAvatar },
  { id: "bundaAnak", name: "Bunda & Anak", src: ASSETS.childFishBanner },
  { id: "nitaIllust", name: "Ibu Ceria", src: ASSETS.nitaIllustration },
];

export default function ProfileSetupScreen({
  onNext,
  onBack,
  setScreen,
  profile,
  setProfile,
  updateProfileData,
}) {
  // 1. Data Diri Ibu / Pengguna
  const [userName, setUserName] = useState(profile?.name || "");
  const [userPhone, setUserPhone] = useState(profile?.phone || "");
  const initialProvince =
    profile?.province && INDONESIA_PROVINCES.includes(profile.province)
      ? profile.province
      : "Banten";
  const initialCity =
    profile?.city && (REGIONS_BY_PROVINCE[initialProvince] || []).includes(profile.city)
      ? profile.city
      : REGIONS_BY_PROVINCE[initialProvince]?.[0] || "Kota Serang";

  const [userProvince, setUserProvince] = useState(initialProvince);
  const [userCity, setUserCity] = useState(initialCity);
  const [userAvatar, setUserAvatar] = useState(
    profile?.avatar || ASSETS.mamaNurAvatar
  );
  const [uploadedAvatar, setUploadedAvatar] = useState(
    profile?.avatar && !AVATAR_OPTIONS.some((a) => a.src === profile.avatar)
      ? profile.avatar
      : null
  );

  const fileInputRef = useRef(null);

  // Handler Upload Foto Mandiri
  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Ukuran gambar maksimal 5 MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === "string") {
          setUploadedAvatar(result);
          setUserAvatar(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // 2. Siapa yang Ingin Dipenuhi Gizinya (Multi-Select Array)
  const initialConditions = Array.isArray(profile?.familyCondition)
    ? profile.familyCondition
    : profile?.familyCondition
    ? [profile.familyCondition]
    : ["baby"];
  const [selectedConditions, setSelectedConditions] = useState(initialConditions);

  // 3. Data Anak (Opsional - User Control)
  const [childrenList, setChildrenList] = useState(
    Array.isArray(profile?.children) ? profile.children : []
  );

  // Toggle multi-select prioritas gizi
  const handleToggleCondition = (id) => {
    setSelectedConditions((prev) => {
      if (prev.includes(id)) {
        if (prev.length > 1) {
          return prev.filter((item) => item !== id);
        }
        return prev;
      }
      return [...prev, id];
    });
  };

  // Tambah anak baru
  const handleAddChild = () => {
    const nextIndex = childrenList.length + 1;
    setChildrenList((prev) => [
      ...prev,
      {
        id: `child_${Date.now()}`,
        name: "",
        age: nextIndex === 1 ? "9" : "4",
        ageUnit: nextIndex === 1 ? "bulan" : "tahun",
        gender: nextIndex === 1 ? "female" : "male",
      },
    ]);
  };

  // Hapus data anak
  const handleRemoveChild = (index) => {
    setChildrenList((prev) => prev.filter((_, i) => i !== index));
  };

  // Update data anak
  const handleUpdateChild = (index, field, value) => {
    setChildrenList((prev) =>
      prev.map((child, i) => (i === index ? { ...child, [field]: value } : child))
    );
  };

  // Helper rekomendasi AKG & MPASI
  const getNutritionAdvice = (ageNum, unit) => {
    const ageMonths = unit === "tahun" ? Number(ageNum || 0) * 12 : Number(ageNum || 0);
    if (ageMonths < 6) {
      return {
        badge: "ASI Eksklusif",
        tone: "gold",
        text: "Usia 0–6 bulan: Asupan terbaik adalah 100% ASI. Belum memerlukan makanan pendamping (MPASI).",
      };
    } else if (ageMonths <= 8) {
      return {
        badge: "Fase Awal MPASI (6–8 Bln)",
        tone: "emerald",
        text: "Tekstur bubur saring lumat kental. Butuh asupan protein hewani ~10–15g/hari (contoh: 1 butir telur atau hati ayam).",
      };
    } else if (ageMonths <= 11) {
      return {
        badge: "Fase Emas MPASI (9–11 Bln)",
        tone: "emerald",
        text: "Tekstur cincang halus & finger food. Butuh ~15–20g protein hewani/hari (contoh: 1 ekor lele kecil atau ikan tanpa duri).",
      };
    } else if (ageMonths <= 23) {
      return {
        badge: "Fase Menu Keluarga (1–2 Thn)",
        tone: "emerald",
        text: "Makanan keluarga diiris kecil. Prioritas emas cegah stunting 1.000 HPK dengan minimal 2 porsi lauk hewani setiap hari.",
      };
    } else {
      return {
        badge: "Balita Prasekolah",
        tone: "blue",
        text: "Gizi seimbang, energi bermain, dan protein hewani teratur untuk daya tahan tubuh & perkembangan kognitif.",
      };
    }
  };

  // Simpan dan Lanjut ke Langkah 2 (Panen)
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!userName.trim()) {
      alert("Nama Ibu tidak boleh kosong.");
      return;
    }

    if (!INDONESIA_PROVINCES.includes(userProvince)) {
      alert("Silakan pilih Provinsi resmi di Indonesia.");
      return;
    }

    const validCities = REGIONS_BY_PROVINCE[userProvince] || ALL_COMMON_CITIES;
    if (!validCities.includes(userCity)) {
      alert(`Silakan pilih Kabupaten / Kota resmi untuk provinsi ${userProvince}.`);
      return;
    }

    const finalProfile = {
      ...profile,
      name: userName.trim() || "Ibu",
      phone: userPhone.trim(),
      province: userProvince.trim(),
      district: userProvince.trim(),
      city: userCity.trim(),
      location: `${userCity.trim()}, ${userProvince.trim()}`,
      avatar: userAvatar,
      familyCondition: selectedConditions.length > 0 ? selectedConditions : ["baby"],
      children: childrenList.map((c, i) => ({
        ...c,
        name: c.name.trim() || `Anak Ke-${i + 1}`,
        note: getNutritionAdvice(c.age, c.ageUnit).text,
      })),
    };

    if (setProfile) {
      setProfile(finalProfile);
    }
    if (updateProfileData) {
      updateProfileData(finalProfile);
    }
    try {
      localStorage.setItem("panganita_profile", JSON.stringify(finalProfile));
    } catch {}

    if (onNext) onNext();
  };

  return (
    <main className="setup-page">
      <div className="setup-shell">
        <Progress
          step={1}
          back={onBack}
          setScreen={setScreen}
          stepTitle="Profil Keluarga &amp; Anak"
        />

        <div className="setup-grid">
          {/* Kolom Kiri: Live Preview Profil Ibu & Edukasi */}
          <section className="setup-intro">
            <div className="setup-intro-badge">
              <span>🌿 Langkah 1 dari 2</span>
            </div>
            <h1>Lengkapi Profil Keluarga Ibu</h1>
            <p>
              Isi data diri Ibu dan anggota keluarga agar rekomendasi gizi 1.000 HPK
              dan porsi hasil panen dihitung tepat sasaran.
            </p>

            {/* Kartu Live Preview Profil Ibu */}
            <div className="profile-card" style={{ transition: "all 200ms ease" }}>
              <img src={userAvatar} alt="Foto Profil Ibu" />
              <div>
                <h2>
                  {userName.trim() ? (
                    userName
                  ) : (
                    <span style={{ color: "#064e3b", fontStyle: "italic", opacity: 0.85 }}>
                      Nama Ibu (Belum diisi)
                    </span>
                  )}{" "}
                  <span className="online-dot" />
                </h2>
                <p>
                  <img className="inline-icon" src={ASSETS.checkGreen} alt="" />{" "}
                  {userPhone ? (
                    `${userPhone} (Terhubung via WhatsApp)`
                  ) : (
                    <span style={{ opacity: 0.75 }}>WhatsApp belum terhubung</span>
                  )}
                </p>
                <div className="location-pill">
                  <img src={ASSETS.locationPin} alt="" />{" "}
                  {userCity ? `${userCity}, ` : ""}
                  {userProvince}
                </div>
              </div>
            </div>

            {/* Ringkasan Fokus Gizi Terpilih */}
            <div className="setup-info-box" style={{ marginTop: "16px" }}>
              <div className="info-box-header">
                <span className="info-icon">🎯</span>
                <strong>Fokus Gizi Keluarga Terpilih:</strong>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", margin: "8px 0" }}>
                {selectedConditions.map((condId) => {
                  const item = familyOptions.find((f) => f.id === condId);
                  return item ? (
                    <span
                      key={condId}
                      style={{
                        background: "#dcfce7",
                        color: "#166534",
                        fontSize: "11.5px",
                        fontWeight: 700,
                        padding: "4px 10px",
                        borderRadius: "999px",
                      }}
                    >
                      ✓ {item.title}
                    </span>
                  ) : null;
                })}
              </div>
              <p style={{ fontSize: "11.5px", color: "#6b7280", margin: 0 }}>
                {childrenList.length > 0
                  ? `👶 ${childrenList.length} anak dicatat untuk perhitungan protein harian.`
                  : "👶 Belum ada data anak (opsional)."}
              </p>
            </div>

            {/* Kotak Edukasi Kenapa Data Ini Dibutuhkan */}
            <div className="setup-info-box">
              <div className="info-box-header">
                <span className="info-icon">💡</span>
                <strong>Kenapa Detail Ini Dibutuhkan?</strong>
              </div>
              <p>
                Kebutuhan protein hewani berbeda di tiap rentang usia. Data ini
                akan dipakai oleh <strong>Simulator Pangan &amp; Gizi</strong> untuk
                menghitung porsi ikan yang wajib disisihkan vs yang boleh dijual ke pasar.
              </p>
            </div>
          </section>

          {/* Kolom Kanan: Formulir Bertahap */}
          <section className="selection-panel">
            <form onSubmit={handleSubmit}>
              {/* BAGIAN 1: PENGINPUTAN DATA DIRI IBU TERLEBIH DAHULU */}
              <div className="user-info-form-card">
                <div className="section-form-header">
                  <span className="section-form-icon">👤</span>
                  <div>
                    <h3>1. Data Diri Ibu / Pengguna</h3>
                    <p>Masukkan identitas Ibu untuk personalisasi akun dan kontak posyandu</p>
                  </div>
                </div>

                <div className="child-form-fields">
                  {/* Pilihan Avatar Ibu & Opsi Unggah Foto */}
                  <div className="form-group-field">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <label>Pilih Foto / Avatar Ibu:</label>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#059669",
                          fontSize: "12px",
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          padding: 0,
                        }}
                      >
                        📷 Unggah Foto Sendiri
                      </button>
                    </div>

                    <div className="avatar-picker-grid">
                      {AVATAR_OPTIONS.map((av) => (
                        <button
                          key={av.id}
                          type="button"
                          className={`avatar-pick-item ${userAvatar === av.src ? "active" : ""}`}
                          onClick={() => setUserAvatar(av.src)}
                          title={av.name}
                        >
                          <img src={av.src} alt={av.name} />
                          {userAvatar === av.src && (
                            <span className="avatar-check-badge">✓</span>
                          )}
                        </button>
                      ))}

                      {/* Tombol / Tile Unggah Foto Sendiri */}
                      <label
                        className={`avatar-pick-item upload-avatar-item ${
                          userAvatar === uploadedAvatar && uploadedAvatar ? "active" : ""
                        }`}
                        title="Unggah Foto dari Galeri / Kamera HP"
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          style={{ display: "none" }}
                        />
                        {uploadedAvatar ? (
                          <img src={uploadedAvatar} alt="Foto Unggahan Ibu" />
                        ) : (
                          <div className="upload-avatar-placeholder">
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
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                              <polyline points="17 8 12 3 7 8" />
                              <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                            <span>Unggah</span>
                          </div>
                        )}
                        {userAvatar === uploadedAvatar && uploadedAvatar && (
                          <span className="avatar-check-badge">✓</span>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Input Nama Ibu */}
                  <div className="form-group-field">
                    <label htmlFor="user-name-input">
                      Nama Panggilan / Lengkap Ibu <span style={{ color: "#e11d48" }}>*</span>
                    </label>
                    <input
                      id="user-name-input"
                      type="text"
                      className="child-text-input"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Contoh: Mama Nurhayati, Ibu Siti, Bunda Ani"
                      required
                    />
                  </div>

                  {/* Input Kontak WhatsApp */}
                  <div className="form-group-field">
                    <label htmlFor="user-phone-input">
                      Nomor WhatsApp (Opsional untuk Jadwal Posyandu)
                    </label>
                    <input
                      id="user-phone-input"
                      type="tel"
                      className="child-text-input"
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value)}
                      placeholder="Contoh: 0812-3456-7890"
                    />
                  </div>

                  {/* Lokasi / Domisili: Dropdown Pilihan Provinsi & Kab/Kota Resmi di Indonesia */}
                  <div className="two-col-inputs">
                    {/* Dropdown Provinsi */}
                    <div className="form-group-field">
                      <label htmlFor="user-province-select">Provinsi:</label>
                      <select
                        id="user-province-select"
                        className="child-text-input"
                        value={userProvince}
                        onChange={(e) => {
                          const val = e.target.value;
                          setUserProvince(val);
                          if (REGIONS_BY_PROVINCE[val] && REGIONS_BY_PROVINCE[val].length > 0) {
                            setUserCity(REGIONS_BY_PROVINCE[val][0]);
                          }
                        }}
                        style={{ cursor: "pointer", background: "#ffffff" }}
                        required
                      >
                        {INDONESIA_PROVINCES.map((prov) => (
                          <option key={prov} value={prov}>
                            {prov}
                          </option>
                        ))}
                      </select>

                      {/* Chip Rekomendasi Cepat Provinsi */}
                      <div className="region-suggest-row">
                        {["Banten", "Jawa Barat", "DKI Jakarta", "Jawa Timur", "Papua Barat"].map((p) => (
                          <button
                            key={p}
                            type="button"
                            className={`region-chip-btn ${userProvince === p ? "active" : ""}`}
                            onClick={() => {
                              setUserProvince(p);
                              if (REGIONS_BY_PROVINCE[p]) {
                                setUserCity(REGIONS_BY_PROVINCE[p][0]);
                              }
                            }}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Dropdown Kabupaten / Kota sesuai Provinsi */}
                    <div className="form-group-field">
                      <label htmlFor="user-city-select">Kabupaten / Kota:</label>
                      <select
                        id="user-city-select"
                        className="child-text-input"
                        value={userCity}
                        onChange={(e) => setUserCity(e.target.value)}
                        style={{ cursor: "pointer", background: "#ffffff" }}
                        required
                      >
                        {(REGIONS_BY_PROVINCE[userProvince] || ALL_COMMON_CITIES).map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>

                      {/* Chip Rekomendasi Cepat Kab/Kota sesuai Provinsi */}
                      <div className="region-suggest-row">
                        {(REGIONS_BY_PROVINCE[userProvince] || ALL_COMMON_CITIES).slice(0, 4).map((c) => (
                          <button
                            key={c}
                            type="button"
                            className={`region-chip-btn ${userCity === c ? "active" : ""}`}
                            onClick={() => setUserCity(c)}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* BAGIAN 2: SIAPA YANG INGIN DIPENUHI GIZINYA (BISA PILIH 2 ATAU LEBIH) */}
              <div style={{ marginBottom: "22px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
                  <h2 style={{ fontSize: "17.5px", margin: 0 }}>2. Siapa yang ingin Ibu penuhi gizinya?</h2>
                  <span className="multi-badge-note">Bisa pilih 2 atau lebih</span>
                </div>
                <p className="selection-subtitle" style={{ marginTop: "4px" }}>
                  Centang semua kondisi yang sedang dijalani di keluarga Ibu:
                </p>

                <div className="option-list">
                  {familyOptions.map((option) => {
                    const isSelected = selectedConditions.includes(option.id);
                    return (
                      <button
                        type="button"
                        className={`select-card ${isSelected ? "selected" : ""}`}
                        key={option.id}
                        onClick={() => handleToggleCondition(option.id)}
                        aria-pressed={isSelected}
                      >
                        <span className="option-icon">
                          <img src={getAssetUrl(option.icon)} alt="" />
                        </span>
                        <span className="option-copy">
                          <strong>{option.title}</strong>
                          <small className={option.tone}>{option.note}</small>
                        </span>
                        <span className="radio" style={{ borderRadius: "8px" }}>
                          {isSelected ? (
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          ) : null}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* BAGIAN 3: DETAIL DATA ANAK (OPSIONAL DENGAN BUTTON TAMBAH) */}
              <div className="child-detail-container">
                <div className="child-detail-header">
                  <div className="child-title-group">
                    <span className="child-icon-tag">👶</span>
                    <div>
                      <h3>3. Detail Data Anak (Opsional)</h3>
                      <p>Tambahkan data si kecil untuk takaran protein &amp; panduan MPASI akurat</p>
                    </div>
                  </div>

                  {childrenList.length > 0 && (
                    <button
                      type="button"
                      className="add-child-toggle-btn"
                      onClick={handleAddChild}
                      style={{ margin: 0, width: "auto", padding: "6px 14px" }}
                    >
                      <span>+ Tambah Anak</span>
                    </button>
                  )}
                </div>

                {/* Tampilan jika belum ada data anak */}
                {childrenList.length === 0 ? (
                  <div className="empty-child-invite">
                    <span style={{ fontSize: "32px", display: "block", marginBottom: "6px" }}>👶</span>
                    <h4>Belum ada data anak yang ditambahkan</h4>
                    <p>
                      Jika Ibu sedang hamil atau belum memiliki balita, Ibu bisa langsung
                      melanjutkan ke pemilihan panen pekarangan.
                    </p>
                    <button
                      type="button"
                      className="btn-add-first-child"
                      onClick={handleAddChild}
                    >
                      + Tambah Data Anak Sekarang
                    </button>
                  </div>
                ) : (
                  /* Daftar Form Anak */
                  childrenList.map((child, index) => {
                    const advice = getNutritionAdvice(child.age, child.ageUnit);
                    return (
                      <div key={child.id || index} className="child-card-wrapper">
                        <div className="child-card-top-bar">
                          <h4>Detail Anak Ke-{index + 1}</h4>
                          <button
                            type="button"
                            className="btn-remove-child-card"
                            onClick={() => handleRemoveChild(index)}
                          >
                            ✕ Hapus Anak
                          </button>
                        </div>

                        <div className="child-form-fields">
                          {/* Nama Anak */}
                          <div className="form-group-field">
                            <label>Nama Panggilan Anak:</label>
                            <input
                              type="text"
                              className="child-text-input"
                              value={child.name}
                              onChange={(e) => handleUpdateChild(index, "name", e.target.value)}
                              placeholder={`Contoh: Adek ${index === 0 ? "Aisyah" : "Arka"}`}
                            />
                          </div>

                          {/* Usia Anak */}
                          <div className="form-group-field">
                            <label>Usia Si Kecil:</label>
                            <div className="age-input-row">
                              <input
                                type="number"
                                min="0"
                                max="150"
                                className="age-number-input"
                                value={child.age}
                                onChange={(e) => handleUpdateChild(index, "age", e.target.value)}
                              />
                              <select
                                className="age-unit-select"
                                value={child.ageUnit}
                                onChange={(e) => handleUpdateChild(index, "ageUnit", e.target.value)}
                              >
                                <option value="bulan">Bulan (0–36 Bulan)</option>
                                <option value="tahun">Tahun (Anak Usia Sekolah)</option>
                              </select>
                            </div>

                            {/* Tombol Cepat Pilihan Usia */}
                            <div className="quick-age-chips">
                              <span className="quick-chip-label">Pilihan Cepat:</span>
                              {[
                                { val: "6", unit: "bulan", label: "6 Bulan" },
                                { val: "9", unit: "bulan", label: "9 Bulan" },
                                { val: "12", unit: "bulan", label: "12 Bulan" },
                                { val: "18", unit: "bulan", label: "18 Bulan" },
                                { val: "2", unit: "tahun", label: "2 Tahun" },
                                { val: "4", unit: "tahun", label: "4 Tahun" },
                              ].map((chip) => {
                                const isActive =
                                  String(child.age) === chip.val && child.ageUnit === chip.unit;
                                return (
                                  <button
                                    key={chip.label}
                                    type="button"
                                    className={`quick-age-btn ${isActive ? "active" : ""}`}
                                    onClick={() => {
                                      handleUpdateChild(index, "age", chip.val);
                                      handleUpdateChild(index, "ageUnit", chip.unit);
                                    }}
                                  >
                                    {chip.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Jenis Kelamin */}
                          <div className="form-group-field">
                            <label>Jenis Kelamin:</label>
                            <div className="gender-toggle-row">
                              <button
                                type="button"
                                className={`gender-btn ${
                                  child.gender === "male" ? "selected" : ""
                                }`}
                                onClick={() => handleUpdateChild(index, "gender", "male")}
                              >
                                👦 Laki-laki
                              </button>
                              <button
                                type="button"
                                className={`gender-btn ${
                                  child.gender === "female" ? "selected" : ""
                                }`}
                                onClick={() => handleUpdateChild(index, "gender", "female")}
                              >
                                👧 Perempuan
                              </button>
                            </div>
                          </div>

                          {/* Rekomendasi Gizi & AKG Otomatis */}
                          <div className="smart-nutrition-advice">
                            <div className="advice-top">
                              <span className="advice-badge">{advice.badge}</span>
                              <span className="advice-target">✨ Target AKG Otomatis</span>
                            </div>
                            <p className="advice-desc">{advice.text}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}

                {childrenList.length > 0 && (
                  <button
                    type="button"
                    className="add-child-toggle-btn"
                    onClick={handleAddChild}
                  >
                    <span>+ Tambah Data Anak Lain (Kakak / Adik)</span>
                  </button>
                )}
              </div>

              {/* Integrasi Asisten Bu Nita */}
              <div className="integration-card" style={{ marginTop: "14px" }}>
                <span className="medical-icon">
                  <img src={getAssetUrl("95578.svg")} alt="" />
                </span>
                <span>
                  <strong>Didukung Asisten Bu Nita</strong>
                  Data profil ini digunakan untuk menghitung porsi gizi harian secara otomatis.
                </span>
              </div>

              {/* Tombol Lanjut ke Langkah 2 */}
              <button
                type="submit"
                className="primary-button dark mt-3"
                style={{
                  width: "100%",
                  padding: "16px",
                  borderRadius: "16px",
                  fontSize: "15px",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  boxShadow: "0 6px 18px rgba(0, 76, 62, 0.2)",
                  cursor: "pointer",
                }}
              >
                <span>Lanjut ke Hasil Panen (Langkah 2) →</span>
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
