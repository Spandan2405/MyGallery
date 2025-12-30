// app/upload/page.tsx
"use client";
import { useState } from "react";
import { Upload as UploadIcon, X, FolderPlus } from "lucide-react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [folder, setFolder] = useState("");

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...dropped]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    if (folder) formData.append("folder", folder);

    try {
      await axios.post("/api/upload", formData, {
        onUploadProgress: (e) => {
          setProgress(Math.round((e.loaded * 100) / (e.total ?? 1)));
        },
      });
      toast.success(`Uploaded ${files.length} file(s)!`);
      setFiles([]);
      setFolder("");
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <Toaster position="top-center" />
      <h1
        className="inline-block text-2xl md:text-4xl font-bold 
               bg-linear-to-r from-pink-600 to-purple-600
               bg-clip-text text-transparent mb-6"
      >
        Upload Photos & Videos
      </h1>

      <div
        className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer  hover:border-purple-500 transition-colors"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <UploadIcon size={48} className="mx-auto text-gray-400 mb-4" />
        <p className="text-lg text-gray-600 mb-2">Drag & drop files here</p>
        <label className="bg-indigo-600 text-white px-6 py-2 rounded-lg cursor-pointer inline-block">
          Choose Files
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>

      {files.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 space-y-3"
        >
          <div className="flex items-center gap-2 mb-3">
            <FolderPlus size={20} />
            <input
              type="text"
              placeholder="Album name (optional)"
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
              className="flex-1 border rounded-lg px-3 py-2"
            />
          </div>

          {files.map((file, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-gray-600 text-black p-3 rounded-lg"
            >
              <span className="text-sm truncate max-w-xs">{file.name}</span>
              <button
                onClick={() => removeFile(i)}
                className="text-red-500 hover:text-red-700"
              >
                <X size={18} />
              </button>
            </div>
          ))}

          <div className="mt-4">
            <div className="bg-gray-600 rounded-full h-3 overflow-hidden">
              <motion.div
                className="bg-linear-to-r from-indigo-500 to-purple-500 h-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-1 text-center">
              {progress}%
            </p>
          </div>

          <button
            onClick={uploadFiles}
            disabled={uploading}
            className="w-full bg-linear-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-medium disabled:opacity-50"
          >
            {uploading ? "Uploading..." : `Upload ${files.length} File(s)`}
          </button>
        </motion.div>
      )}
    </div>
  );
}
