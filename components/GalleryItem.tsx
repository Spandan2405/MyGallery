// components/GalleryItem.tsx
"use client";
import Image from "next/image";
import { Heart, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

interface MediaItem {
  resource_type: "image" | "video" | string;
  secure_url: string;
  public_id: string;
}

interface GalleryItemProps {
  item: MediaItem;
  isFav: boolean;
  folders: string[];
  onUpdate: () => void;
}

export default function GalleryItem({
  item,
  isFav,
  onUpdate,
}: GalleryItemProps) {
  const [loading, setLoading] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const isVideo = item.resource_type === "video";
  const thumb = isVideo
    ? `${item.secure_url.replace(
        /\.\w+$/,
        ".jpg"
      )}?w=400&h=400&c=fill&f=auto&q=80`
    : `${item.secure_url}?w=400&h=400&c=fill&f=auto&q=80`;

  const toggleFav = async () => {
    setLoading(true);
    try {
      if (isFav) {
        await axios.delete("/api/favorites", {
          data: { public_id: item.public_id },
        });
        toast.success("Removed from favorites");
      } else {
        await axios.post("/api/favorites", { public_id: item.public_id });
        toast.success("Added to favorites");
      }
      onUpdate();
    } catch {
      toast.error("Failed");
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async () => {
    // Custom Confirm Dialog
    const confirmed = await showDeleteConfirm();
    if (!confirmed) return;

    setLoading(true);
    try {
      await axios.delete("/api/media", { data: { public_id: item.public_id } });
      toast.success("Photo deleted");
      onUpdate();
    } catch {
      toast.error("Failed to delete");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow mt-4"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {isVideo ? (
        <video src={thumb} className="w-full h-full object-cover" />
      ) : (
        <Image
          src={thumb}
          alt=""
          width={400}
          height={400}
          className="w-full max-h-100 object-cover"
          loading="lazy"
        />
      )}

      {/* Hover Actions */}
      <div
        className={`absolute inset-0 bg-black/60 flex items-center justify-center gap-4 transition-opacity ${
          showActions ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="absolute flex top-6 right-3 gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFav();
            }}
            disabled={loading}
            className="p-3 rounded-full bg-white/90 text-red-500 hover:scale-110 transition-transform"
          >
            {loading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Heart size={20} fill={isFav ? "currentColor" : "none"} />
            )}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteItem();
            }}
            className="p-3 rounded-full bg-white/90 text-red-600 hover:scale-110 transition-transform"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// Custom Beautiful Confirm Dialog
function showDeleteConfirm(): Promise<boolean> {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.className =
      "fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4";
    overlay.onclick = () => resolve(false);

    overlay.innerHTML = `
      <div class="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200" onclick="event.stopPropagation()">
        <h3 class="text-xl font-bold text-gray-900 mb-2">Delete Photo?</h3>
        <p class="text-gray-600 mb-6">This action cannot be undone.</p>
        <div class="flex gap-3 justify-end">
          <button id="cancel" class="px-5 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition">Cancel</button>
          <button id="delete" class="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">Delete</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    overlay.querySelector("#cancel")?.addEventListener("click", () => {
      overlay.remove();
      resolve(false);
    });

    overlay.querySelector("#delete")?.addEventListener("click", () => {
      overlay.remove();
      resolve(true);
    });
  });
}
