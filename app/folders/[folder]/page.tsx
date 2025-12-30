import Gallery from "@/components/Gallery";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function FolderGallery({ params }: { params: any }) {
  // params can be a Promise in some Next setups — await it
  const resolvedParams = await params;
  const folder: string = resolvedParams?.folder;

  if (!folder || folder === "undefined") {
    // Handle invalid folder gracefully
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold text-gray-600 mb-4">
            Album Not Found
          </h1>
          <Link href="/folders" className="text-pink-500 hover:underline">
            ← Back to Albums
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header - Pure Server Rendered */}
      <header className=" backdrop-blur-sm sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/folders"
                className="p-2 hover:bg-pink-100 rounded-full transition-colors"
              >
                <ChevronLeft size={24} className="text-pink-600" />
              </Link>
              <div>
                <h1 className="inline-block text-3xl font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  {folder}
                </h1>
                <p className="text-sm text-pink-600">
                  Our special moments in {folder}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* Gallery */}
      <main className="max-w-7xl mx-auto p-4 pb-20">
        <Gallery folder={folder} />
      </main>
    </div>
  );
}
