export function validateProfileInput(body) {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Request body tidak boleh kosong" };
  }

  if (body.name !== undefined && (typeof body.name !== "string" || body.name.trim().length === 0)) {
    return { valid: false, error: "Nama profil tidak boleh kosong" };
  }

  return { valid: true };
}

export function validateChildInput(child) {
  if (!child || !child.name || !child.age) {
    return { valid: false, error: "Nama dan usia anak wajib diisi" };
  }

  const ageNum = Number(child.age);
  if (isNaN(ageNum) || ageNum <= 0) {
    return { valid: false, error: "Usia anak harus berupa angka positif" };
  }

  return { valid: true };
}
