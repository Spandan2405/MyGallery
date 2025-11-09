// components/Upload.tsx (Update to allow uploading to root or folder)
"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { motion } from "framer-motion";

interface UploadForm {
  files: FileList;
  folder: string;
}

export default function Upload() {
  const { register, handleSubmit } = useForm<UploadForm>({
    defaultValues: { folder: "" },
  });
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const onSubmit = async (data: UploadForm) => {
    setUploading(true);
    const formData = new FormData();
    Array.from(data.files).forEach((file) => formData.append("files", file));
    formData.append("folder", data.folder);

    try {
      await axios.post("/api/upload", formData, {
        onUploadProgress: (e) =>
          setProgress(Math.round((e.loaded * 100) / (e.total ?? 1))),
      });
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input
        type="file"
        multiple
        accept="image/*,video/*"
        {...register("files")}
      />
      <input
        type="text"
        placeholder="Folder Name (optional for root)"
        {...register("folder")}
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Upload
      </button>
      {uploading && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-2 bg-green-500"
        />
      )}
    </form>
  );
}
