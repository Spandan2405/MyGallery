import { NextRequest, NextResponse } from "next/server";
import {
  getFolders,
  createFolder,
  renameFolder,
  deleteFolder,
} from "@/lib/cloudinary";

export async function GET() {
  const folders = await getFolders();
  return NextResponse.json(folders.map((f: { name: unknown }) => f.name));
}

export async function POST(req: NextRequest) {
  const { name } = await req.json();
  await createFolder(name);
  return NextResponse.json({ success: true });
}

export async function PUT(req: NextRequest) {
  const { oldName, newName } = await req.json();
  await renameFolder(oldName, newName);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const { name } = await req.json();
  await deleteFolder(name);
  return NextResponse.json({ success: true });
}
