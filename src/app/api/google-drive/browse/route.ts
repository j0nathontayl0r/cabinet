import { NextRequest, NextResponse } from "next/server";
import { listSubdirectories, detectDriveDesktop } from "@/lib/google-drive/detect-desktop";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    let dirPath = searchParams.get("path");

    // Default to the detected Drive root
    if (!dirPath) {
      const detection = await detectDriveDesktop();
      if (!detection.mountPath) {
        return NextResponse.json({ error: "Google Drive for Desktop not detected" }, { status: 404 });
      }
      dirPath = detection.mountPath;
    }

    const dirs = await listSubdirectories(dirPath);
    return NextResponse.json({ path: dirPath, dirs });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
