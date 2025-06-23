import { getRepositories } from "@/lib/actions/github";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const repos = await getRepositories();
    return NextResponse.json(repos);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
