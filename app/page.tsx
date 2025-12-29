/* eslint-disable react-hooks/purity */
// app/page.tsx
import Gallery from "@/components/Gallery";
import { format } from "date-fns";
import { Heart } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Spandan & Disha | Memories",
  description:
    "A timeless private gallery celebrating Spandan and Disha's journey together — filled with love, laughter, and memories.",
};

// Romantic quotes (random per reload)
const QUOTES = [
  "Every photo is a memory. Every memory is us.",
  "In every frame, I find a reason to love you more.",
  "Time passes, love stays — and we capture it forever.",
  "Some moments are too special to fade. We kept them.",
  "Still falling for you, one memory at a time.",
];

const NAMES = [
  "Cutie",
  "Meri Jaan",
  "My Love",
  "My Panda",
  "My Baby",
  "My World",
];

export default function Home() {
  const anniversary = new Date("2023-11-09");
  const years = 2;

  // Pick a random quote on each reload
  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  const names = NAMES[Math.floor(Math.random() * NAMES.length)];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* ===== Header Card ===== */}
      <div className="text-center mb-10 px-4 py-8 sm:p-10 bg-linear-to-r from-purple-300 to-violet-400 rounded-3xl shadow-xl">
        <h1 className="flex flex-wrap items-center justify-center gap-2 text-3xl md:text-4xl font-bold text-pink-900 mb-3 leading-tight">
          Happy {years === 2 ? "2nd" : `${years}th`} Anniversary, {names}!
          <Heart size={28} className="text-pink-700" fill="currentColor" />
        </h1>

        <p className="text-md text-black/80">
          {format(anniversary, "MMMM d, yyyy")} → Today
        </p>

        <p className="mt-4 text-base sm:text-lg md:text-xl text-blue-900 italic font-semibold max-w-2xl mx-auto">
          {quote}
        </p>
      </div>

      {/* ===== Gallery ===== */}
      <Gallery folder="" />
    </main>
  );
}
