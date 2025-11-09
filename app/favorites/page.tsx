// app/favorites/page.tsx (New)
import Gallery from "@/components/Gallery";

export default function Favorites() {
  return (
    <main className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Favorites</h1>
      <Gallery isFavorites={true} />
    </main>
  );
}
