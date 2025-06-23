import { getUserProfile } from "@/lib/actions/github";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const profile = await getUserProfile();
    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
