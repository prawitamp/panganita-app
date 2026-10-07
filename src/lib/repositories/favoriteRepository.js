import { favorites } from "@/lib/db";

export function findAllFavorites() {
  return favorites;
}

export function findFavoriteById(id) {
  return favorites.find((f) => String(f.id) === String(id));
}

export function insertFavorite(data) {
  favorites.push(data);
  return data;
}

export function updateFavoriteById(id, fields) {
  const index = favorites.findIndex((f) => String(f.id) === String(id));
  if (index === -1) return null;

  favorites[index] = {
    ...favorites[index],
    ...fields,
    updatedAt: new Date().toISOString(),
  };

  return favorites[index];
}

export function deleteFavoriteById(id) {
  const index = favorites.findIndex((f) => String(f.id) === String(id));
  if (index === -1) return false;

  favorites.splice(index, 1);
  return true;
}
