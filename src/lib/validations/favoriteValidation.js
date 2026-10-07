export function validateFavoriteInput(body) {
  if (!body) {
    return { valid: false, error: "Request body tidak boleh kosong" };
  }

  if (!body.id || !body.name) {
    return { valid: false, error: "id dan name wajib diisi" };
  }

  if (typeof body.name !== "string" || body.name.trim().length === 0) {
    return { valid: false, error: "name harus berupa teks yang valid" };
  }

  return { valid: true };
}

export function validateFavoritePatchInput(body) {
  if (!body || Object.keys(body).length === 0) {
    return { valid: false, error: "Data perubahan tidak boleh kosong" };
  }

  return { valid: true };
}
