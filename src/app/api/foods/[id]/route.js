import { NextResponse } from "next/server";
import { foods } from "@/lib/db";
import { getLocalFoodsByLocation } from "@/lib/foodService";

export async function GET(request, { params }) {
  const { id } = await params;
  const targetId = String(id || "").toLowerCase();

  let food = foods.find(
    (f) => String(f.id).toLowerCase() === targetId
  );

  if (!food) {
    // Cari dari seluruh katalog pangan lokal
    const allRegionalFoods = [
      ...getLocalFoodsByLocation("banten").foods,
      ...getLocalFoodsByLocation("papua").foods,
      ...getLocalFoodsByLocation("jabar").foods,
      ...getLocalFoodsByLocation("jateng").foods,
      ...getLocalFoodsByLocation("sumatera").foods,
      ...getLocalFoodsByLocation("kalimantan").foods,
      ...getLocalFoodsByLocation("sulawesi").foods,
    ];
    food = allRegionalFoods.find(
      (f) => String(f.id).toLowerCase() === targetId
    );
  }

  if (!food) {
    return NextResponse.json(
      { error: "Komoditas pangan lokal tidak ditemukan" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: food }, { status: 200 });
}
