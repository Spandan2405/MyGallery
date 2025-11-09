// app/api/media/move/route.ts
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: NextRequest) {
  const { public_id, newFolder } = await req.json();
  const newPublicId = public_id.replace(/^[^/]+/, newFolder);
  await cloudinary.uploader.rename(public_id, newPublicId);
  return NextResponse.json({ success: true });
}
