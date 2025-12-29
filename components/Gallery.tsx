// components/Gallery.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import Masonry from "react-masonry-css";
import axios from "axios";
import GalleryItem from "./GalleryItem";
import { Loader2 } from "lucide-react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

interface CloudinaryResource {
  public_id: string;
  secure_url: string;
  resource_type: "image" | "video";
}

interface GalleryProps {
  folder?: string;
  isFavorites?: boolean;
}

const breakpointColumns = {
  default: 4,
  1100: 3,
  500: 2,
};

// Fisher-Yates Shuffle Function
const shuffleArray = (array: CloudinaryResource[]): CloudinaryResource[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function Gallery({
  folder = "",
  isFavorites = false,
}: GalleryProps) {
  const [media, setMedia] = useState<CloudinaryResource[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // Modal state
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const mediaPromise = isFavorites
        ? axios.get("/api/favorites")
        : folder
        ? axios.get(`/api/media?folder=${encodeURIComponent(folder)}`)
        : axios.get("/api/media");

      const [mediaRes, favRes] = await Promise.all([
        mediaPromise,
        axios.get("/api/favorites"),
      ]);

      setMedia(shuffleArray(mediaRes.data));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setFavorites(new Set(favRes.data.map((m: any) => m.public_id)));
    } catch (err) {
      console.error("Gallery fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folder, isFavorites]);

  // Keyboard navigation
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (activeIndex === null) return;
      if (e.key === "Escape") setActiveIndex(null);
      if (e.key === "ArrowRight")
        setActiveIndex((i) => (i! + 1) % media.length);
      if (e.key === "ArrowLeft")
        setActiveIndex((i) => (i! - 1 + media.length) % media.length);
    },
    [activeIndex, media.length]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-pink-600" size={40} />
      </div>
    );
  }

  if (!media.length) {
    return (
      <div className="text-center py-24 text-gray-500">
        <p className="text-xl font-medium">No media found</p>
      </div>
    );
  }

  return (
    <>
      {/* ===== Masonry Grid ===== */}
      <PhotoProvider maskOpacity={0.9} bannerVisible={false}>
        <Masonry
          breakpointCols={breakpointColumns}
          className="flex w-auto -ml-4"
          columnClassName="pl-4 bg-clip-padding"
        >
          {media.map((item) => (
            <div key={item.public_id} className="mb-4">
              <PhotoView src={item.secure_url}>
                <div>
                  <GalleryItem
                    item={item}
                    isFav={favorites.has(item.public_id)}
                    onUpdate={fetchData}
                  />
                </div>
              </PhotoView>
            </div>
          ))}
        </Masonry>
      </PhotoProvider>
    </>
  );
}
