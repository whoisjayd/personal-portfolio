import { getProjectDetails, getRepository } from "@/lib/actions/github";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { repoName: string } }
) {
  try {
    const repoName = params.repoName;
    const repo = await getRepository(repoName);

    if (!repo) {
      return NextResponse.json({ error: "Repository not found" }, { status: 404 });
    }

    const projectDetails = await getProjectDetails(repo);
    return NextResponse.json(projectDetails);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
