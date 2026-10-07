import {
  findAllFavorites,
  findFavoriteById,
  insertFavorite,
  updateFavoriteById,
  deleteFavoriteById,
} from "@/lib/repositories/favoriteRepository";
import {
  validateFavoriteInput,
  validateFavoritePatchInput,
} from "@/lib/validations/favoriteValidation";

export function getAllFavorites() {
  return findAllFavorites();
}

export function getFavoriteById(id) {
  const item = findFavoriteById(id);
  if (!item) {
    return { success: false, status: 404, error: "Data favorite tidak ditemukan" };
  }
  return { success: true, status: 200, data: item };
}

export function addFavorite(body) {
  const validation = validateFavoriteInput(body);
  if (!validation.valid) {
    return { success: false, status: 400, error: validation.error };
  }

  const alreadyExists = findFavoriteById(body.id);
  if (alreadyExists) {
    return {
      success: false,
      status: 400,
      error: "Item ini sudah ada di dalam daftar favorit",
    };
  }

  const newFavorite = {
    id: body.id,
    name: body.name.trim(),
    category: body.category || "pangan",
    note: body.note || "",
    createdAt: new Date().toISOString(),
  };

  const saved = insertFavorite(newFavorite);
  return { success: true, status: 201, data: saved };
}

export function updateFavorite(id, body) {
  const validation = validateFavoritePatchInput(body);
  if (!validation.valid) {
    return { success: false, status: 400, error: validation.error };
  }

  const existing = findFavoriteById(id);
  if (!existing) {
    return { success: false, status: 404, error: "Data tidak ditemukan" };
  }

  const updated = updateFavoriteById(id, body);
  return { success: true, status: 200, data: updated };
}

export function removeFavorite(id) {
  const success = deleteFavoriteById(id);
  if (!success) {
    return { success: false, status: 404, error: "Data tidak ditemukan" };
  }

  return { success: true, status: 200, message: "Berhasil dihapus" };
}
