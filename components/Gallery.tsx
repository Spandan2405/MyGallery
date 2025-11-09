// components/Gallery.tsx
"use client";

import { useState, useEffect } from "react";
import Masonry from "react-masonry-css";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import axios from "axios";
import GalleryItem from "./GalleryItem";
import { Loader2 } from "lucide-react";

// === Cloudinary Resource Type ===
interface CloudinaryResource {
  public_id: string;
  secure_url: string;
  resource_type: "image" | "video";
  format: string;
  width?: number;
  height?: number;
  bytes?: number;
  created_at?: string;
  tags?: string[];
}

// === Props Type ===
interface GalleryProps {
  folder?: string;
  isFavorites?: boolean;
}

const breakpointColumns = {
  default: 4,
  1100: 3,
  500: 2,
} as const;

export default function Gallery({
  folder = "",
  isFavorites = false,
}: GalleryProps) {
  const [media, setMedia] = useState<CloudinaryResource[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [folders, setFolders] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      // don't pass "undefined" as folder
      const mediaPromise = isFavorites
        ? axios.get<CloudinaryResource[]>("/api/favorites")
        : folder && folder !== "undefined"
        ? axios.get<CloudinaryResource[]>(
            `/api/media?folder=${encodeURIComponent(folder)}`
          )
        : axios.get<CloudinaryResource[]>(`/api/media`); // fetch all when folder is empty

      // Fetch favorites & folders in parallel
      const [mediaRes, favRes, folderRes] = await Promise.all([
        mediaPromise,
        axios.get<CloudinaryResource[]>("/api/favorites"),
        axios.get<string[]>("/api/folders"),
      ]);

      setMedia(mediaRes.data);
      setFavorites(new Set(favRes.data.map((m) => m.public_id)));
      setFolders(folderRes.data);
    } catch (err) {
      console.error("Failed to fetch gallery data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!folder && !isFavorites) {
      console.warn("⚠️ No folder provided — skipping fetchData()");
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folder, isFavorites]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 size={40} className="animate-spin text-pink-600" />
      </div>
    );
  }

  if (media.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No photos here yet</p>
        <p className="text-sm mt-1">Upload some memories!</p>
      </div>
    );
  }

  return (
    <PhotoProvider
      maskOpacity={0.85}
      toolbarRender={({ index, images, onIndexChange }) => (
        <div className="flex items-center justify-center gap-8 p-6 bg-black/90 text-white">
          <button
            onClick={() => onIndexChange(index - 1)}
            disabled={index === 0}
            className="px-4 py-2 bg-white/10 rounded-lg disabled:opacity-50 hover:bg-white/20 transition"
          >
            Previous
          </button>
          <span className="text-sm font-medium min-w-20 text-center">
            {index + 1} / {images.length}
          </span>
          <button
            onClick={() => onIndexChange(index + 1)}
            disabled={index === images.length - 1}
            className="px-4 py-2 bg-white/10 rounded-lg disabled:opacity-50 hover:bg-white/20 transition"
          >
            Next
          </button>
        </div>
      )}
    >
      <Masonry
        breakpointCols={breakpointColumns}
        className="flex w-auto -ml-4"
        columnClassName="pl-4"
      >
        {media.map((item) => (
          <PhotoView key={item.public_id} src={item.secure_url}>
            <div className="mb-4 cursor-zoom-in">
              <GalleryItem
                item={item}
                isFav={favorites.has(item.public_id)}
                folders={folders}
                onUpdate={fetchData}
              />
            </div>
          </PhotoView>
        ))}
      </Masonry>
    </PhotoProvider>
  );
}
