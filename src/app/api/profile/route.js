import { NextResponse } from "next/server";
import {
  getProfileService,
  updateProfileService,
} from "@/lib/services/profileService";

export async function GET() {
  const profile = getProfileService();
  return NextResponse.json(
    {
      success: true,
      data: profile,
    },
    { status: 200 }
  );
}

export async function POST(request) {
  try {
    const body = await request.json();
    const result = updateProfileService(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: result.status }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Profil berhasil diperbarui",
        data: result.data,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Format request tidak valid" },
      { status: 400 }
    );
  }
}
