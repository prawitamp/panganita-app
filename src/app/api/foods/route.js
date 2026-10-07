import { NextResponse } from "next/server";
import { profile } from "@/lib/db";
import { getLocalFoodsByLocation } from "@/lib/foodService";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const locationParam =
      searchParams.get("location") ||
      profile.city ||
      profile.location ||
      "Kab. Pandeglang, Banten";

    const result = getLocalFoodsByLocation(locationParam);

    return NextResponse.json({
      success: true,
      location: result.location,
      ecosystem: result.ecosystem,
      total: result.totalCommodities,
      data: result.foods,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Gagal memuat data gizi pangan lokal" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const location =
      body?.location ||
      profile.city ||
      profile.location ||
      "Kab. Pandeglang, Banten";

    const result = getLocalFoodsByLocation(location);

    return NextResponse.json({
      success: true,
      location: result.location,
      ecosystem: result.ecosystem,
      total: result.totalCommodities,
      data: result.foods,
      message: `Pangan lokal untuk wilayah ${result.location} berhasil dimuat`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Gagal memproses data pangan lokal" },
      { status: 500 }
    );
  }
}
