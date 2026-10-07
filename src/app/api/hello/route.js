import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Halo dari backend Next.js PANGANITA (Kelompok 10 Malahayati)!",
  });
}
