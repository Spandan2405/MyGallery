// api/favorites.ts (New API route)
import { NextRequest, NextResponse } from "next/server";
import { getFavorites, addFavorite, removeFavorite } from "@/lib/cloudinary";

export async function GET() {
  const resources = await getFavorites();
  return NextResponse.json(resources);
}

export async function POST(req: NextRequest) {
  const { public_id } = await req.json();
  await addFavorite(public_id);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const { public_id } = await req.json();
  await removeFavorite(public_id);
  return NextResponse.json({ success: true });
}
