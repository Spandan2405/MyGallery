// app/api/media/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  getFolderContents,
  deleteResource,
  getAllResources,
} from "@/lib/cloudinary";

export async function GET(req: NextRequest) {
  try {
    // ✅ Correct way to read query in App Router
    const folderParam = req.nextUrl.searchParams.get("folder");
    console.log("🔍 Folder param received from frontend:", folderParam);

    if (!folderParam || folderParam === "undefined") {
      console.log("📦 No folder provided — fetching all resources");
      const all = await getAllResources();
      return NextResponse.json(all);
    }

    // ✅ Decode and normalize folder name
    const decodedFolder = decodeURIComponent(folderParam).replace(
      /^\/+|\/+$/g,
      ""
    );

    console.log("📁 Decoded folder for Cloudinary prefix:", decodedFolder);

    // ✅ Fetch only images from that folder
    const resources = await getFolderContents(decodedFolder);
    return NextResponse.json(resources);
  } catch (error) {
    console.error("❌ Error fetching folder contents:", error);
    return NextResponse.json(
      { error: "Failed to fetch folder contents" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { public_id } = await req.json();
  try {
    await deleteResource(public_id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
