import React, { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/common/Logo";
import BottomNav from "@/components/common/BottomNav";
import { ASSETS, getAssetUrl } from "@/constants/assets";
import { usePanganita } from "@/context/PanganitaContext";
import { INDONESIA_PROVINCES, REGIONS_BY_PROVINCE } from "@/data/indonesiaRegions";

// Kamus kecamatan/distrik umum untuk kota-kota utama
const KNOWN_DISTRICTS_BY_CITY = {
  "Kota Serang": [
    "Kecamatan Serang",
    "Kecamatan Cipocok Jaya",
    "Kecamatan Curug",
    "Kecamatan Kasemen",
    "Kecamatan Taktakan",
    "Kecamatan Walantaka",
  ],
  "Kota Cilegon": [
    "Kecamatan Cilegon",
    "Kecamatan Cibeber",
    "Kecamatan Citangkil",
    "Kecamatan Ciwandan",
    "Kecamatan Grogol",
    "Kecamatan Jombang",
    "Kecamatan Pulomerak",
    "Kecamatan Purwakarta",
  ],
  "Kota Tangerang": [
    "Kecamatan Tangerang",
    "Kecamatan Batuceper",
    "Kecamatan Benda",
    "Kecamatan Cibodas",
    "Kecamatan Ciledug",
    "Kecamatan Cipondoh",
    "Kecamatan Jatiuwung",
    "Kecamatan Karawaci",
    "Kecamatan Periuk",
    "Kecamatan Pinang",
  ],
  "Kota Tangerang Selatan": [
    "Kecamatan Serpong",
    "Kecamatan Serpong Utara",
    "Kecamatan Ciputat",
    "Kecamatan Ciputat Timur",
    "Kecamatan Pamulang",
    "Kecamatan Pondok Aren",
    "Kecamatan Setu",
  ],
  "Kab. Pandeglang": [
    "Kecamatan Pandeglang",
    "Kecamatan Majasari",
    "Kecamatan Cadasari",
    "Kecamatan Labuan",
    "Kecamatan Menes",
  ],
  "Kab. Lebak": [
    "Kecamatan Rangkasbitung",
    "Kecamatan Cibadak",
    "Kecamatan Kalanganyar",
    "Kecamatan Maja",
    "Kecamatan Bayah",
  ],
  "Kota Bandung": [
    "Kecamatan Bandung Wetan",
    "Kecamatan Coblong",
    "Kecamatan Sukasari",
    "Kecamatan Cicendo",
    "Kecamatan Regol",
    "Kecamatan Lengkong",
  ],
  "Kota Jakarta Selatan": [
    "Kecamatan Kebayoran Baru",
    "Kecamatan Kebayoran Lama",
    "Kecamatan Cilandak",
    "Kecamatan Pasar Minggu",
    "Kecamatan Tebet",
    "Kecamatan Setiabudi",
  ],
  "Kota Jakarta Pusat": [
    "Kecamatan Gambir",
    "Kecamatan Menteng",
    "Kecamatan Tanah Abang",
    "Kecamatan Senen",
    "Kecamatan Cempaka Putih",
  ],
  "Kota Surabaya": [
    "Kecamatan Tegalsari",
    "Kecamatan Genteng",
    "Kecamatan Bubutan",
    "Kecamatan Gubeng",
    "Kecamatan Wonokromo",
    "Kecamatan Rungkut",
  ],
  "Kota Semarang": [
    "Kecamatan Semarang Tengah",
    "Kecamatan Semarang Barat",
    "Kecamatan Semarang Selatan",
    "Kecamatan Semarang Timur",
    "Kecamatan Semarang Utara",
    "Kecamatan Banyumanik",
  ],
  "Kota Yogyakarta": [
    "Kemantren Danurejan",
    "Kemantren Gondomanan",
    "Kemantren Kotagede",
    "Kemantren Kraton",
    "Kemantren Umbulharjo",
    "Kemantren Mantrijeron",
  ],
  "Kota Surakarta": [
    "Kecamatan Banjarsari",
    "Kecamatan Jebres",
    "Kecamatan Laweyan",
    "Kecamatan Pasar Kliwon",
    "Kecamatan Serengan",
  ],
  "Kota Medan": [
    "Kecamatan Medan Kota",
    "Kecamatan Medan Baru",
    "Kecamatan Medan Barat",
    "Kecamatan Medan Timur",
    "Kecamatan Medan Petisah",
  ],
  "Kota Makassar": [
    "Kecamatan Ujung Pandang",
    "Kecamatan Panakkukang",
    "Kecamatan Tamalanrea",
    "Kecamatan Rappocini",
    "Kecamatan Mariso",
  ],
  "Kota Denpasar": [
    "Kecamatan Denpasar Selatan",
    "Kecamatan Denpasar Barat",
    "Kecamatan Denpasar Utara",
    "Kecamatan Denpasar Timur",
  ],
  "Kab. Teluk Bintuni": [
    "Distrik Babo",
    "Distrik Bintuni",
    "Distrik Aranday",
    "Distrik Manimeri",
    "Distrik Tembuni",
    "Distrik Merdey",
  ],
  "Kota Sorong": [
    "Distrik Sorong",
    "Distrik Sorong Barat",
    "Distrik Sorong Timur",
    "Distrik Sorong Kepulauan",
    "Distrik Sorong Manoi",
  ],
  "Kota Jayapura": [
    "Distrik Jayapura Utara",
    "Distrik Jayapura Selatan",
    "Distrik Abepura",
    "Distrik Muara Tami",
    "Distrik Heram",
  ],
};

const getDistrictsForCity = (cityName, provinceName) => {
  if (cityName && KNOWN_DISTRICTS_BY_CITY[cityName]) {
    return KNOWN_DISTRICTS_BY_CITY[cityName];
  }
  const clean = (cityName || "").replace(/^(Kab\.|Kota)\s*/i, "").trim() || "Daerah";
  const isPapua = (provinceName || "").toLowerCase().includes("papua");
  const prefix = isPapua ? "Distrik" : "Kecamatan";
  return [
    `${prefix} ${clean} (Pusat Kota)`,
    `${prefix} ${clean} Utara`,
    `${prefix} ${clean} Selatan`,
    `${prefix} ${clean} Barat`,
    `${prefix} ${clean} Timur`,
  ];
};

export default function ProfilePageScreen({
  profile,
  setScreen,
  updateFamilyCondition,
  toggleCommodity,
  addChild: propAddChild,
  removeChild: propRemoveChild,
}) {
  const router = useRouter();
  const context = usePanganita();
  const handleAddChild = propAddChild || context?.addChild;
  const handleRemoveChild = propRemoveChild || context?.removeChild;

  const [showAddForm, setShowAddForm] = useState(false);
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState("9");
  const [childAgeUnit, setChildAgeUnit] = useState("bulan");
  const [childNote, setChildNote] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editProvince, setEditProvince] = useState("Banten");
  const [editCity, setEditCity] = useState("Kota Serang");
  const [editDistrict, setEditDistrict] = useState("Kecamatan Serang");

  const availableCities = useMemo(() => {
    return REGIONS_BY_PROVINCE[editProvince] || [];
  }, [editProvince]);

  const availableDistricts = useMemo(() => {
    return getDistrictsForCity(editCity, editProvince);
  }, [editCity, editProvince]);

  const handleStartEdit = () => {
    setEditName(profile?.name || "");
    setEditPhone(profile?.phone || "");

    let currentProv = profile?.province || "";
    let currentCity = profile?.city || "";

    if (!currentProv && profile?.location) {
      if (profile.location.includes(",")) {
        const parts = profile.location.split(",");
        currentCity = parts[0]?.trim() || "";
        currentProv = parts.slice(1).join(",").trim() || "";
      } else {
        currentProv = profile.location.trim();
      }
    }

    if (!INDONESIA_PROVINCES.includes(currentProv)) {
      currentProv = "Banten";
    }

    const citiesInProv = REGIONS_BY_PROVINCE[currentProv] || [];
    if (!citiesInProv.includes(currentCity)) {
      currentCity = citiesInProv[0] || "Kota Serang";
    }

    const districts = getDistrictsForCity(currentCity, currentProv);
    let currentDist = profile?.district || "";
    if (!currentDist || !districts.includes(currentDist)) {
      currentDist = districts[0] || "";
    }

    setEditProvince(currentProv);
    setEditCity(currentCity);
    setEditDistrict(currentDist);
    setIsEditing(true);
  };

  const handleProvinceChange = (newProv) => {
    setEditProvince(newProv);
    const cities = REGIONS_BY_PROVINCE[newProv] || [];
    const firstCity = cities[0] || "";
    setEditCity(firstCity);
    const districts = getDistrictsForCity(firstCity, newProv);
    setEditDistrict(districts[0] || "");
  };

  const handleCityChange = (newCity) => {
    setEditCity(newCity);
    const districts = getDistrictsForCity(newCity, editProvince);
    setEditDistrict(districts[0] || "");
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!editName.trim()) {
      if (context?.showToast) {
        context.showToast("Nama Ibu tidak boleh kosong.", "warning", "Perhatian");
      }
      return;
    }

    if (!editProvince || !editCity) {
      if (context?.showToast) {
        context.showToast(
          "Silakan pilih Provinsi dan Kabupaten / Kota resmi.",
          "warning",
          "Wilayah Belum Lengkap"
        );
      }
      return;
    }

    const updatedData = {
      name: editName.trim(),
      phone: editPhone.trim(),
      location: `${editCity}, ${editProvince}`,
      city: editCity,
      province: editProvince,
      district: editDistrict.trim(),
    };

    if (context?.updateProfileData) {
      context.updateProfileData(updatedData);
    }
    setIsEditing(false);
    if (context?.showToast) {
      context.showToast("Data profil Ibu berhasil diperbarui!", "success", "Tersimpan");
    }
  };

  const currentConditions = Array.isArray(profile?.familyCondition)
    ? profile.familyCondition
    : profile?.familyCondition
    ? [profile.familyCondition]
    : ["baby"];

  const handleToggleCondition = (id) => {
    let next;
    if (currentConditions.includes(id)) {
      if (currentConditions.length > 1) {
        next = currentConditions.filter((c) => c !== id);
      } else {
        if (context?.showToast) {
          context.showToast("Minimal pilih 1 fokus perhatian gizi keluarga.", "info", "Info");
        }
        return;
      }
    } else {
      next = [...currentConditions, id];
    }

    if (updateFamilyCondition) {
      updateFamilyCondition(next);
    } else if (context?.updateFamilyCondition) {
      context.updateFamilyCondition(next);
    }

    if (context?.showToast) {
      context.showToast("Fokus perhatian gizi berhasil diperbarui!", "success", "Tersimpan");
    }
  };

  const familyConditions = [
    {
      id: "mother",
      icon: "3f3c5.svg",
      title: "Sedang Hamil / Menyusui",
      note: "Nutrisi janin & persiapan ASI",
    },
    {
      id: "baby",
      icon: "a0a29.svg",
      title: "Balita Usia 0 – 24 Bulan",
      note: "Periode Emas MPASI 1.000 HPK (Prioritas)",
    },
    {
      id: "school",
      icon: "e150c.svg",
      title: "Anak Usia Tumbuh Kembang (TK / SD)",
      note: "Daya Tahan & Asupan Protein Belajar",
    },
  ];

  const commodityOptions = [
    { id: "fish", symbol: "🐟", label: "Ikan & Tambak" },
    { id: "greens", symbol: "🥬", label: "Sayur Hijau" },
    { id: "tuber", symbol: "🍠", label: "Umbi & Sagu" },
    { id: "eggs", symbol: "🥚", label: "Telur & Ayam" },
  ];

  const onSubmitNewChild = (e) => {
    e.preventDefault();
    if (!childName.trim()) {
      alert("Silakan masukkan nama panggilan anak.");
      return;
    }

    if (handleAddChild) {
      handleAddChild({
        name: childName.trim(),
        age: childAge,
        ageUnit: childAgeUnit,
        note:
          childNote.trim() ||
          (childAgeUnit === "bulan" && Number(childAge) <= 24
            ? "Fase 1.000 HPK (MPASI Emas)"
            : "Pertumbuhan & Daya Tahan Aktif"),
      });
    }

    setChildName("");
    setChildAge("1");
    setChildAgeUnit("tahun");
    setChildNote("");
    setShowAddForm(false);
  };

  const childrenList = profile?.children || [];

  return (
    <main className="profile-page-screen">
      <div className="profile-page-shell">
        <header className="profile-page-header">
          <button
            onClick={() => {
              if (setScreen) setScreen("home");
              router.push("/beranda");
            }}
            aria-label="Kembali ke Beranda"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Logo compact />
          </button>
          <h1>Profil Ibu &amp; Data Anak</h1>
        </header>

        {/* 1. Identitas Ibu & Form Edit */}
        {!isEditing ? (
          <section className="profile-identity">
            <div className="profile-photo">
              <img src={profile?.avatar || ASSETS.mamaNurAvatar} alt={profile?.name || "Foto Ibu"} />
              <span>
                <img src={getAssetUrl("57115.svg")} alt="" />
              </span>
            </div>
            <div>
              <h2>{profile?.name || "Ibu"}</h2>
              <p>{profile?.phone || "Nomor belum diatur"} • Terhubung WhatsApp</p>
              <span>
                <img src={getAssetUrl("89c3b.svg")} alt="" /> {profile?.location || "Banten"}
                {profile?.district ? ` • ${profile.district}` : ""}
              </span>
            </div>
            <button
              type="button"
              className="profile-edit-btn"
              onClick={handleStartEdit}
              aria-label="Edit profil Ibu"
              title="Edit Data Profil Ibu"
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
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              <span>Edit Profil</span>
            </button>
          </section>
        ) : (
          <section className="profile-identity editing-mode">
            <div className="profile-edit-header">
              <div className="profile-edit-title">
                <span className="profile-edit-badge">✏️ Edit Data Ibu</span>
                <h3>Perbarui Informasi Profil</h3>
              </div>
              <button
                type="button"
                className="profile-edit-close"
                onClick={() => setIsEditing(false)}
                aria-label="Batal edit profil"
              >
                ✕
              </button>
            </div>

            <form className="profile-edit-form" onSubmit={handleSaveProfile}>
              <div className="profile-form-grid">
                <div className="profile-form-field">
                  <label htmlFor="edit-name-input">
                    Nama Lengkap / Panggilan Ibu <span style={{ color: "#e11d48" }}>*</span>:
                  </label>
                  <input
                    id="edit-name-input"
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Contoh: Mama Nurhayati"
                    required
                    autoFocus
                  />
                </div>

                <div className="profile-form-field">
                  <label htmlFor="edit-phone-input">Nomor WhatsApp:</label>
                  <input
                    id="edit-phone-input"
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="Contoh: 0812-XXXX-9821"
                  />
                </div>

                {/* Dropdown Provinsi Resmi Indonesia */}
                <div className="profile-form-field">
                  <label htmlFor="edit-province-select">Provinsi:</label>
                  <select
                    id="edit-province-select"
                    value={editProvince}
                    onChange={(e) => handleProvinceChange(e.target.value)}
                    style={{ cursor: "pointer", background: "#ffffff" }}
                    required
                  >
                    {INDONESIA_PROVINCES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dropdown Kabupaten / Kota Sesuai Provinsi */}
                <div className="profile-form-field">
                  <label htmlFor="edit-city-select">Kabupaten / Kota:</label>
                  <select
                    id="edit-city-select"
                    value={editCity}
                    onChange={(e) => handleCityChange(e.target.value)}
                    style={{ cursor: "pointer", background: "#ffffff" }}
                    required
                  >
                    {availableCities.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dropdown Kecamatan / Distrik Sesuai Kota */}
                <div className="profile-form-field">
                  <label htmlFor="edit-district-select">Kecamatan / Distrik:</label>
                  <select
                    id="edit-district-select"
                    value={editDistrict}
                    onChange={(e) => setEditDistrict(e.target.value)}
                    style={{ cursor: "pointer", background: "#ffffff" }}
                  >
                    {availableDistricts.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Ringkasan Wilayah Resmi Terpilih */}
                <div className="profile-form-field">
                  <label>Wilayah Terpilih:</label>
                  <div
                    style={{
                      padding: "10px 14px",
                      borderRadius: "10px",
                      background: "#ecfdf5",
                      border: "1.5px solid #a7f3d0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      fontSize: "13px",
                      color: "#065f46",
                      fontWeight: "600",
                      minHeight: "42px",
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span>📍</span>
                      <span>
                        {editDistrict ? `${editDistrict}, ` : ""}
                        {editCity}, {editProvince}
                      </span>
                    </span>
                    <span
                      style={{
                        fontSize: "11px",
                        background: "#10b981",
                        color: "#ffffff",
                        padding: "2px 8px",
                        borderRadius: "9999px",
                        fontWeight: "700",
                      }}
                    >
                      ✓ Resmi
                    </span>
                  </div>
                </div>
              </div>

              <div className="profile-edit-actions">
                <button
                  type="button"
                  className="btn-cancel-profile"
                  onClick={() => setIsEditing(false)}
                >
                  Batal
                </button>
                <button type="submit" className="btn-save-profile">
                  ✓ Simpan Perubahan
                </button>
              </div>
            </form>
          </section>
        )}

        {/* 2. FORM & DAFTAR ANAK IBU (Bisa 1, 2, atau 3 Anak) */}
        <section className="children-profile-section">
          <div className="profile-section-title">
            <div>
              <h2>Data Anak Ibu ({childrenList.length} Anak)</h2>
              <p>
                Daftarkan semua anak Ibu agar takaran porsi lauk
                dan kebutuhan protein pas untuk masing-masing anak:
              </p>
            </div>
            <span className="children-count-pill">{childrenList.length} Terdaftar</span>
          </div>

          {/* List Kartu Anak */}
          <div className="children-cards-list">
            {childrenList.map((child, index) => (
              <div className="child-card-box" key={child.id || index}>
                <div className="child-badge-tag">Anak ke-{index + 1}</div>
                <div className="child-main-row">
                  <div className="child-avatar-pill">
                    <span>{child.ageUnit === "bulan" ? "👶" : "🧒"}</span>
                  </div>
                  <div className="child-info-col">
                    <strong>{child.name}</strong>
                    <span className="child-age-label">
                      Usia: <strong>{child.age} {child.ageUnit}</strong>
                    </span>
                    <small>{child.note}</small>
                  </div>
                  {childrenList.length > 1 && (
                    <button
                      type="button"
                      className="child-delete-btn"
                      onClick={() => handleRemoveChild && handleRemoveChild(child.id)}
                      title={`Hapus ${child.name}`}
                      aria-label={`Hapus ${child.name}`}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Form Tambah Anak Baru */}
          {showAddForm ? (
            <form className="add-child-form-wrapper" onSubmit={onSubmitNewChild}>
              <h3>+ Tambah Data Anak (Anak ke-{childrenList.length + 1})</h3>
              
              <div className="profile-input-group">
                <label>Nama Panggilan Anak:</label>
                <input
                  type="text"
                  placeholder="Misal: Adek Bilal / Kakak Zahra"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="profile-input-dual">
                <div className="profile-input-group">
                  <label>Usia:</label>
                  <input
                    type="number"
                    min="1"
                    max="18"
                    value={childAge}
                    onChange={(e) => setChildAge(e.target.value)}
                  />
                </div>
                <div className="profile-input-group">
                  <label>Satuan Usia:</label>
                  <select
                    value={childAgeUnit}
                    onChange={(e) => setChildAgeUnit(e.target.value)}
                  >
                    <option value="bulan">Bulan (0 - 24 Bulan / 1000 HPK)</option>
                    <option value="tahun">Tahun (Balita / Usia Sekolah)</option>
                  </select>
                </div>
              </div>

              <div className="profile-input-group">
                <label>Catatan Gizi / Kondisi Khusus (Opsional):</label>
                <input
                  type="text"
                  placeholder="Misal: Suka makan lele, baru mulai MPASI"
                  value={childNote}
                  onChange={(e) => setChildNote(e.target.value)}
                />
              </div>

              <div className="child-form-btn-row">
                <button
                  type="button"
                  className="btn-cancel-child"
                  onClick={() => setShowAddForm(false)}
                >
                  Batal
                </button>
                <button type="submit" className="btn-confirm-child">
                  + Simpan Data Anak
                </button>
              </div>
            </form>
          ) : (
            <button
              type="button"
              className="open-add-child-btn"
              onClick={() => setShowAddForm(true)}
            >
              <span>+</span> Tambah Anak Lainnya (Misal Anak ke-2 atau ke-3)
            </button>
          )}
        </section>

        {/* 3. Kondisi Keluarga Saat Ini (Bisa Pilih > 1) */}
        <section className="family-condition">
          <div className="profile-section-title">
            <div>
              <h2>Fokus Perhatian Gizi</h2>
              <p>
                Pilih prioritas utama Ibu agar rekomendasi menu gizi harian disesuaikan (bisa pilih lebih dari 1):
              </p>
            </div>
            <span>Bisa Pilih &gt; 1</span>
          </div>

          {familyConditions.map(({ id, icon, title, note }) => {
            const isSelected = currentConditions.includes(id);
            return (
              <button
                type="button"
                className={isSelected ? "active" : ""}
                key={id}
                onClick={() => handleToggleCondition(id)}
                aria-pressed={isSelected}
              >
                <span className="family-symbol">
                  <img src={getAssetUrl(icon)} alt="" />
                </span>
                <span>
                  <strong>{title}</strong>
                  <small>{note}</small>
                </span>
                <i>
                  {isSelected ? (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : null}
                </i>
              </button>
            );
          })}
        </section>

        {/* 4. Komoditas Pekarangan Rutin */}
        <section className="commodities">
          <h2>Komoditas Pekarangan Rutin:</h2>
          <p>
            Pilih yang mudah dipanen di sekitar rumah untuk rekomendasi resep
            hemat:
          </p>
          <div>
            {commodityOptions.map(({ id, symbol, label }) => {
              const isActive = profile.commodities.includes(id);
              return (
                <button
                  className={isActive ? "active" : ""}
                  key={id}
                  onClick={() => toggleCommodity(id)}
                >
                  <span>{symbol}</span>
                  {label}
                  {isActive ? (
                    <img src={getAssetUrl("a5624.svg")} alt="" />
                  ) : null}
                </button>
              );
            })}
          </div>
        </section>

        <button
          className="save-profile"
          onClick={() => {
            if (setScreen) setScreen("home");
            router.push("/beranda");
          }}
        >
          Simpan Perubahan Data
        </button>

        <BottomNav active="profile" setScreen={setScreen} />
      </div>
    </main>
  );
}
