// app/folders/page.tsx
"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Edit2, Trash2, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AlbumsPage() {
  const [folders, setFolders] = useState<string[]>([]);
  const [newFolder, setNewFolder] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const fetchFolders = async () => {
    const { data } = await axios.get("/api/folders");
    setFolders(data);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchFolders();
  }, []);

  const createFolder = async () => {
    if (!newFolder.trim()) return;
    await axios.post("/api/folders", { name: newFolder });
    toast.success(`Album "${newFolder}" created`);
    setNewFolder("");
    fetchFolders();
  };

  const renameFolder = async (oldName: string) => {
    if (!editName.trim()) return;
    await axios.put("/api/folders", { oldName, newName: editName });
    toast.success(`Renamed to "${editName}"`);
    setEditing(null);
    fetchFolders();
  };

  const deleteFolder = async (name: string) => {
    if (!confirm(`Delete album "${name}" and all its photos?`)) return;
    await axios.delete("/api/folders", { data: { name } });
    toast.success(`Album "${name}" deleted`);
    fetchFolders();
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Our Albums 💕
          </h1>
          <p className="text-pink-600 mt-2 text-sm md:text-base">
            Create timeless collections of us
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="New album name (e.g., 'Our First Trip')"
            value={newFolder}
            onChange={(e) => setNewFolder(e.target.value)}
            className="flex-1 sm:flex-none border-2 border-pink-200 rounded-xl px-4 py-3 focus:border-pink-400 focus:outline-none transition"
            onKeyPress={(e) => e.key === "Enter" && createFolder()}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={createFolder}
            className="bg-linear-to-r from-pink-500 to-purple-600 text-white p-4 rounded-xl shadow-lg disabled:opacity-50 hover:shadow-xl transition disabled:cursor-not-allowed"
          >
            <Plus size={20} />
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {folders.length === 0
          ? // Skeleton
            Array(8)
              .fill(0)
              .map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-gray-200 border-2 border-dashed rounded-xl aspect-square animate-pulse"
                />
              ))
          : folders.map((folder) => (
              <Link href={`/folders/${folder}`} key={folder}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="group relative bg-gray-300 rounded-xl shadow-md overflow-hidden cursor-pointer"
                >
                  <div className="aspect-square bg-linear-to-br from-indigo-300 to-purple-300 flex items-center justify-center">
                    <ImageIcon size={48} className="text-indigo-600" />
                  </div>
                  <div className="p-3">
                    {editing === folder ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onBlur={() => renameFolder(folder)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && renameFolder(folder)
                        }
                        className="w-full border rounded px-1"
                        autoFocus
                      />
                    ) : (
                      <h3 className="font-semibold truncate text-black">
                        {folder}
                      </h3>
                    )}
                  </div>

                  {/* Hover Actions */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setEditing(folder);
                        setEditName(folder);
                      }}
                      className="p-2 bg-black rounded-full shadow"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        deleteFolder(folder);
                      }}
                      className="p-2 bg-black rounded-full shadow text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              </Link>
            ))}
      </div>
    </div>
  );
}
