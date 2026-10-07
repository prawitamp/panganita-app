import { favorites } from "@/lib/db";
import {
  addFavorite,
  removeFavorite,
  getAllFavorites,
} from "@/lib/services/favoriteService";

describe("favoriteService", () => {
  beforeEach(() => {
    favorites.length = 0;
  });

  test("addFavorite berhasil menyimpan data valid", () => {
    const result = addFavorite({ id: "ikan-lele", name: "Ikan Lele Segar" });

    expect(result.success).toBe(true);
    expect(result.status).toBe(201);
    expect(favorites).toHaveLength(1);
    expect(favorites[0].name).toBe("Ikan Lele Segar");
  });

  test("addFavorite menolak jika nama kosong", () => {
    const result = addFavorite({ id: "ikan-lele", name: "" });

    expect(result.success).toBe(false);
    expect(result.status).toBe(400);
    expect(favorites).toHaveLength(0);
  });

  test("addFavorite menolak duplikasi item yang sudah difavoritkan", () => {
    addFavorite({ id: "ikan-lele", name: "Ikan Lele Segar" });
    const duplicate = addFavorite({ id: "ikan-lele", name: "Ikan Lele Segar" });

    expect(duplicate.success).toBe(false);
    expect(duplicate.status).toBe(400);
    expect(favorites).toHaveLength(1);
  });

  test("removeFavorite berhasil menghapus item yang ada", () => {
    addFavorite({ id: "daun-kelor", name: "Daun Kelor" });
    expect(favorites).toHaveLength(1);

    const result = removeFavorite("daun-kelor");
    expect(result.success).toBe(true);
    expect(favorites).toHaveLength(0);
  });

  test("removeFavorite mengembalikan 404 jika item tidak ada", () => {
    const result = removeFavorite("item-tidak-ada");
    expect(result.success).toBe(false);
    expect(result.status).toBe(404);
  });

  test("getAllFavorites mengembalikan semua data", () => {
    addFavorite({ id: "1", name: "Kakap" });
    addFavorite({ id: "2", name: "Lele" });

    const all = getAllFavorites();
    expect(all).toHaveLength(2);
  });
});
