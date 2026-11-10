/**
 * Helper Penyesuaian Zona Waktu Indonesia (WIB, WITA, WIT)
 * Berdasarkan Lokasi / Provinsi Profil Pengguna
 */

export function getRegionTimezone(provinceOrLocation = "") {
  const p = (provinceOrLocation || "").toLowerCase();

  // 1. Waktu Indonesia Timur (WIT - UTC+9)
  if (
    p.includes("papua") ||
    p.includes("maluku") ||
    p.includes("bintuni") ||
    p.includes("jayapura") ||
    p.includes("sorong") ||
    p.includes("merauke")
  ) {
    return {
      timeZone: "Asia/Jayapura",
      suffix: "WIT",
    };
  }

  // 2. Waktu Indonesia Tengah (WITA - UTC+8)
  if (
    p.includes("bali") ||
    p.includes("nusa tenggara") ||
    p.includes("ntt") ||
    p.includes("ntb") ||
    p.includes("sulawesi") ||
    p.includes("gorontalo") ||
    p.includes("kalimantan selatan") ||
    p.includes("kalsel") ||
    p.includes("kalimantan timur") ||
    p.includes("kaltim") ||
    p.includes("kalimantan utara") ||
    p.includes("kaltara") ||
    p.includes("makassar") ||
    p.includes("kupang")
  ) {
    return {
      timeZone: "Asia/Makassar",
      suffix: "WITA",
    };
  }

  // 3. Waktu Indonesia Barat (WIB - UTC+7)
  return {
    timeZone: "Asia/Jakarta",
    suffix: "WIB",
  };
}

export function formatRegionTime(date = new Date(), provinceOrLocation = "") {
  const { timeZone, suffix } = getRegionTimezone(provinceOrLocation);

  try {
    const formatted = new Intl.DateTimeFormat("id-ID", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);

    return `${formatted} ${suffix}`;
  } catch (err) {
    // Fallback jika timezone invalid di browser tertentu
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes} ${suffix}`;
  }
}

