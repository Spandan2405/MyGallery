// app/page.tsx
import Gallery from "@/components/Gallery";
import { format } from "date-fns";
import { Metadata } from "next/dist/types";

export const metadata: Metadata = {
  title: "Spandan & Disha | Memories",
  description:
    "A timeless private gallery celebrating Spandan and Disha's journey together — filled with love, laughter, and memories.",
  openGraph: {
    title: "Spandan & Disha | Memory Vault",
    description: "A private gallery of our most cherished memories together.",
    url: "https://spandandisha.com",
    type: "website",
    images: ["/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Spandan & Disha | Memory Vault",
    description: "A private gallery celebrating love and memories.",
    images: ["/og-image.jpg"],
  },
  authors: [{ name: "Spandan" }],
};

export default function Home() {
  const anniversary = new Date("2023-11-09");
  const today = new Date();
  const years = 2;

  return (
    <main className="max-w-7xl mx-auto p-4">
      <div className="text-center mb-8 p-6 bg-linear-to-r from-purple-300 to-violet-400 rounded-2xl shadow-lg">
        <h1 className="text-4xl font-bold text-pink-800 mb-2">
          Happy {years === 2 ? "2nd" : `${years}th`} Anniversary, Disha!
        </h1>
        <p className="text-lg text-black">
          {format(anniversary, "MMMM d, yyyy")} → Today
        </p>
        <p className="mt-2 text-blue-900 italic font-bold">
          Every photo is a memory. Every memory is us.
        </p>
      </div>

      <Gallery folder="" />
    </main>
  );
}
