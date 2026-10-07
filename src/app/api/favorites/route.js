import { NextResponse } from "next/server";
import { getAllFavorites, addFavorite } from "@/lib/services/favoriteService";

export async function GET() {
  const data = getAllFavorites();
  return NextResponse.json(data, { status: 200 });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const result = addFavorite(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status }
      );
    }

    return NextResponse.json(result.data, { status: result.status });
  } catch (error) {
    return NextResponse.json(
      { error: "Format JSON tidak valid atau body kosong" },
      { status: 400 }
    );
  }
}
