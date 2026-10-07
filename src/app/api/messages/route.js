import { NextResponse } from "next/server";
import { messages } from "@/lib/db";

export async function GET() {
  return NextResponse.json({
    success: true,
    total: messages.length,
    data: messages,
  });
}

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body || !body.name || !body.message) {
      return NextResponse.json(
        { error: "Nama dan isi pesan wajib diisi" },
        { status: 400 }
      );
    }

    const newMsg = {
      id: Date.now(),
      name: body.name,
      email: body.email || "anonim@panganita.id",
      phone: body.phone || "-",
      message: body.message,
      createdAt: new Date().toISOString(),
    };

    messages.push(newMsg);
    return NextResponse.json(newMsg, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: "Format request body tidak valid" },
      { status: 400 }
    );
  }
}
