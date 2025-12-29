// components/GalleryItem.tsx
"use client";

import Image from "next/image";
import { Heart, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

interface MediaItem {
  resource_type: "image" | "video";
  secure_url: string;
  public_id: string;
}

interface GalleryItemProps {
  item: MediaItem;
  isFav: boolean;
  onUpdate: () => void;
}

export default function GalleryItem({
  item,
  isFav,
  onUpdate,
}: GalleryItemProps) {
  const [loading, setLoading] = useState(false);

  const isVideo = item.resource_type === "video";

  // Cloudinary-optimized thumbnail
  const thumbnail = isVideo
    ? `${item.secure_url.replace(/\.\w+$/, ".jpg")}?w=400&h=400&c=fill&q=80`
    : `${item.secure_url}?w=400&h=400&c=fill&q=80`;

  const toggleFav = async (e: React.MouseEvent) => {
    e.stopPropagation(); // ⛔ prevent modal open
    setLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      isFav
        ? await axios.delete("/api/favorites", {
            data: { public_id: item.public_id },
          })
        : await axios.post("/api/favorites", {
            public_id: item.public_id,
          });

      toast.success(isFav ? "Removed from favorites" : "Added to favorites");
      onUpdate();
    } catch {
      toast.error("Action failed");
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (e: React.MouseEvent) => {
    e.stopPropagation(); // ⛔ prevent modal open
    if (!confirm("Delete this photo? This action cannot be undone.")) return;

    setLoading(true);
    try {
      await axios.delete("/api/media", {
        data: { public_id: item.public_id },
      });
      toast.success("Photo deleted");
      onUpdate();
    } catch {
      toast.error("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="relative group cursor-pointer overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-shadow"
    >
      {/* ===== Media ===== */}
      {isVideo ? (
        <video
          src={thumbnail}
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      ) : (
        <Image
          src={thumbnail}
          alt=""
          width={400}
          height={400}
          loading="lazy"
          className="w-full max-h-100 object-cover"
        />
      )}

      {/* ===== Hover / Tap Overlay ===== */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Actions */}
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={toggleFav}
            disabled={loading}
            className="p-2 rounded-full bg-white/90 text-red-500 hover:scale-110 transition"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Heart size={18} fill={isFav ? "currentColor" : "none"} />
            )}
          </button>

          <button
            onClick={deleteItem}
            className="p-2 rounded-full bg-white/90 text-red-600 hover:scale-110 transition"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
