import { NextRequest, NextResponse } from "next/server";
// app/api/upload/route.ts
import { uploadFile } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const files = formData.getAll("files") as File[];
  const rawFolder = formData.get("folder") as string;
  const cleanFolder = rawFolder?.trim() || "";

  console.log(`Uploading ${files.length} files to folder: "${cleanFolder}"`); // Debug

  try {
    const results = [];
    for (const file of files) {
      const result = await uploadFile(file, cleanFolder);
      results.push(result);
    }
    return NextResponse.json({ success: true, uploaded: results.length });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
