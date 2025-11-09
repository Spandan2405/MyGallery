/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/cloudinary.ts (Update with favorites and all resources)
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// lib/cloudinary.ts
export async function uploadFile(file: File, folder: string) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const uploadOptions: any = {
    resource_type: "auto",
  };

  if (folder) {
    uploadOptions.folder = folder; // Cloudinary handles prefix
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
}

export async function getFolderContents(folder: string = "") {
  const prefix = folder ? `${folder}/` : ""; // 🔥 ensure trailing slash for folder lookup
  console.log("📸 Fetching from Cloudinary prefix:", prefix);
  const { resources } = await cloudinary.api.resources({
    type: "upload",
    resource_type: "image", // ✅ ensures you get images only
    prefix,
    max_results: 500,
  });

  return resources;
}

export async function getAllResources() {
  return getFolderContents("");
}

export async function getFavorites() {
  const { resources } = await cloudinary.api.resources_by_tag("favorite", {
    type: "upload",
    max_results: 100,
  });
  return resources;
}

export async function deleteResource(public_id: string) {
  return await cloudinary.uploader.destroy(public_id);
}

export async function addFavorite(public_id: string) {
  await cloudinary.uploader.add_tag("favorite", [public_id]);
}

export async function removeFavorite(public_id: string) {
  await cloudinary.uploader.remove_tag("favorite", [public_id]);
}

export async function createFolder(name: string) {
  await cloudinary.api.create_folder(name);
}

export async function renameFolder(oldName: string, newName: string) {
  const contents = await getFolderContents(oldName);
  for (const item of contents) {
    await cloudinary.uploader.rename(
      item.public_id,
      `${newName}/${item.public_id.split("/").pop()}`
    );
  }
}

export async function deleteFolder(name: string) {
  await cloudinary.api.delete_resources_by_prefix(name);
  await cloudinary.api.delete_folder(name);
}

export async function getFolders() {
  const { folders } = await cloudinary.api.root_folders();
  return folders;
}
