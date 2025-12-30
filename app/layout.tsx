// app/layout.tsx
"use client"; // ADD THIS LINE

import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Heart, FolderPlus, Upload, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenu, setMobileMenu] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "All Memories", icon: Home },
    { href: "/favorites", label: "Our Favorites", icon: Heart },
    { href: "/folders", label: "Albums", icon: FolderPlus },
    { href: "/upload", label: "Add More", icon: Upload },
  ];

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/heart-favicon.ico" />
      </head>
      <body
        className={`${inter.className} bg-linear-to-br from-pink-50 to-purple-50 min-h-screen`}
      >
        {/* Version 4: Mystical Purple Navbar */}
        <nav className="bg-linear-to-r from-purple-700 via-violet-700 to-purple-900 text-white shadow-2xl sticky top-0 z-50 backdrop-blur-xl border-b border-purple-500/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link
                href="/"
                className="text-2xl font-bold tracking-tight flex items-center gap-2 group"
              >
                <span className="text-3xl flex items-center justify-center gap-1 relative">
                  Memories
                  <motion.div
                    className="relative animate-pulse"
                    whileHover={{ scale: 1.15, rotate: 360 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 15,
                      duration: 1,
                    }}
                  >
                    <Heart
                      size={30}
                      color="white"
                      fill="white"
                      className="drop-shadow-2xl group-hover:text-purple-300 transition-colors"
                    />
                    <div className="absolute -inset-2 bg-linear-to-r from-white via-purple-600 to-violet-600 rounded-full blur opacity-40 group-hover:opacity-60 transition-opacity" />
                  </motion.div>
                </span>
              </Link>

              {/* Desktop Nav */}
              <div className="hidden md:flex space-x-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 relative overflow-hidden group ${
                        active
                          ? "bg-white/15 shadow-lg ring-2 ring-purple-400/30"
                          : "hover:bg-white/10 hover:shadow-md"
                      }`}
                    >
                      <motion.div
                        className="absolute inset-0 bg-linear-to-r from-purple-500 to-violet-600 opacity-0 group-hover:opacity-25"
                        initial={{ opacity: 0 }}
                        animate={active ? { opacity: 0.35 } : { opacity: 0 }}
                      />
                      <Icon
                        size={18}
                        className={
                          active
                            ? "text-white drop-shadow-sm"
                            : "text-white/80 group-hover:text-white"
                        }
                      />
                      <span
                        className={
                          active ? "font-semibold" : "group-hover:font-semibold"
                        }
                      >
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>

              <button
                onClick={() => setMobileMenu(!mobileMenu)}
                className="md:hidden p-2 rounded-full hover:bg-white/10 transition-colors group"
              >
                <motion.div whileTap={{ scale: 0.9 }} className="relative">
                  <Menu size={24} className="text-white" />
                  <div className="absolute -inset-1 bg-linear-to-r from-purple-500 to-violet-600 rounded-full blur opacity-0 group-hover:opacity-40" />
                </motion.div>
              </button>
            </div>
          </div>

          {mobileMenu && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden bg-linear-to-b from-violet-700 to-purple-900"
            >
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenu(false)}
                    className={`flex items-center gap-3 px-6 py-4 border-b border-white/10 transition-all duration-200 ${
                      active ? "bg-white/10" : "hover:bg-white/5"
                    }`}
                  >
                    <Icon
                      size={20}
                      className={active ? "text-white" : "text-white/80"}
                    />
                    <span className={active ? "font-semibold" : ""}>
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </motion.div>
          )}
        </nav>

        <main className="pb-20">{children}</main>

        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: "12px",
              padding: "16px",
              fontSize: "16px",
              maxWidth: "400px",
            },
            success: { style: { background: "#ec4899", color: "#fff" } },
            error: { style: { background: "#ef4444", color: "#fff" } },
          }}
        />
      </body>
    </html>
  );
}
