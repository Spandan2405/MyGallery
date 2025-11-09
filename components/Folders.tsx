// components/Folders.tsx (Update to use Links for folders)
"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Folders() {
  const [folders, setFolders] = useState<string[]>([]);
  const [newFolder, setNewFolder] = useState("");

  const fetchFolders = async () => {
    const { data } = await axios.get("/api/folders");
    setFolders(data);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchFolders();
  }, []);

  const create = async () => {
    await axios.post("/api/folders", { name: newFolder });
    fetchFolders();
    setNewFolder("");
  };

  const rename = async (oldName: string, newName: string) => {
    if (newName) {
      await axios.put("/api/folders", { oldName, newName });
      fetchFolders();
    }
  };

  const deleteFolder = async (name: string) => {
    await axios.delete("/api/folders", { data: { name } });
    fetchFolders();
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={newFolder}
        onChange={(e) => setNewFolder(e.target.value)}
        placeholder="New Folder"
        className="border p-2"
      />
      <button onClick={create} className="bg-green-500 text-white p-2 rounded">
        Create
      </button>
      <ul>
        {folders.map((folder) => (
          <motion.li
            key={folder}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex space-x-2 items-center"
          >
            <Link
              href={`/folders/${encodeURIComponent(folder)}`}
              className="text-blue-500 hover:underline"
            >
              {folder}
            </Link>
            <button
              onClick={() =>
                rename(folder, prompt("New Name", folder) || folder)
              }
              className="text-yellow-500"
            >
              Rename
            </button>
            <button
              onClick={() => deleteFolder(folder)}
              className="text-red-500"
            >
              Delete
            </button>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
