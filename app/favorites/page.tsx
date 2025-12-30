// app/favorites/page.tsx (New)
import Gallery from "@/components/Gallery";

export default function Favorites() {
  return (
    <main className="max-w-7xl mx-auto p-4">
      <div className="pb-4">
        <h1 className="inline-block text-2xl md:text-4xl font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          Favorites 💘
        </h1>
        <p className="text-pink-600 mt-2 text-sm md:text-base">
          Our most cherished moments
        </p>
      </div>

      <Gallery isFavorites={true} />
    </main>
  );
}
