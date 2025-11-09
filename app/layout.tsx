// app/layout.tsx
"use client"; // ADD THIS LINE

import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
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
        {/* Navbar */}
        <nav className="bg-linear-to-r from-violet-500 to-violet-800 text-white shadow-xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link
                href="/"
                className="text-2xl font-bold tracking-tight flex items-center gap-2"
              >
                <span className="text-3xl">Memories❤️</span>
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
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                        active ? "bg-white/20 shadow-md" : "hover:bg-white/10"
                      }`}
                    >
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              <button
                onClick={() => setMobileMenu(!mobileMenu)}
                className="md:hidden p-2"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>

          {mobileMenu && (
            <div className="md:hidden bg-pink-600">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenu(false)}
                    className={`flex items-center gap-3 px-6 py-3 transition-all ${
                      active ? "bg-white/20" : "hover:bg-white/10"
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
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
