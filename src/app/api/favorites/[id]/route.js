import { NextResponse } from "next/server";
import {
  getFavoriteById,
  updateFavorite,
  removeFavorite,
} from "@/lib/services/favoriteService";

export async function GET(request, { params }) {
  const { id } = await params;
  const result = getFavoriteById(id);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json(result.data, { status: 200 });
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = updateFavorite(id, body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status }
      );
    }

    return NextResponse.json(result.data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Format request body tidak valid" },
      { status: 400 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const result = removeFavorite(id);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({ message: result.message }, { status: 200 });
}
