"use client";

import Gallery from "@/components/Gallery";
import { format } from "date-fns";
import { useState } from "react";

const QUOTES = [
  "Every photo is a memory. Every memory is us.",
  "In every frame, I find a reason to love you more.",
  "Some memories never stop feeling new.",
  "Some moments are too special to fade.",
  "Still falling for you, one memory at a time.",
  "Our love story, captured one photo at a time.",
  "Together, we've created a gallery of unforgettable moments.",
  "Every picture tells a story, and ours is my favorite.",
];

const NAMES = [
  "Cutie",
  "Meri Jaan",
  "My Love",
  "My Panda",
  "My Baby",
  "My World",
  "Meri Rasmalai",
];

export default function HomePage() {
  const anniversary = new Date("2023-11-09");
  const years = 2;

  const [quote] = useState(
    () => QUOTES[Math.floor(Math.random() * QUOTES.length)]
  );
  const [name] = useState(
    () => NAMES[Math.floor(Math.random() * NAMES.length)]
  );

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="text-center mb-10 px-4 py-8 sm:p-10 bg-linear-to-r from-purple-300 to-violet-400 rounded-3xl shadow-xl">
        <h1 className="flex flex-wrap items-center justify-center gap-2 text-3xl md:text-4xl font-bold text-pink-900 mb-3 leading-tight">
          Happy {years === 2 ? "2nd" : `${years}th`} Anniversary, {name}! 💞
        </h1>

        <p className="text-md text-black/80">
          {format(anniversary, "MMMM d, yyyy")} → Today
        </p>

        <p className="mt-4 text-base sm:text-lg md:text-xl text-blue-900 italic font-semibold max-w-2xl mx-auto">
          {quote}
        </p>
      </div>

      <Gallery folder="" />
    </main>
  );
}
