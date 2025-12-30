import { Metadata } from "next";
import HomePage from "./home";

export const metadata: Metadata = {
  title: {
    default: "Spandan & Disha | Memories",
    template: "%s | Memories",
  },
  description:
    "A timeless private gallery celebrating Spandan and Disha's journey together — filled with love, laughter, and memories.",
};

export default function Home() {
  return (
    <main>
      <HomePage />
    </main>
  );
}
