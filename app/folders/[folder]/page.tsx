import Gallery from "@/components/Gallery";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function FolderGallery({ params }: { params: any }) {
  // params can be a Promise in some Next setups — await it
  const resolvedParams = await params;
  const folder: string = resolvedParams?.folder;

  console.log("folder (server page):", folder);
  return (
    <main className="max-w-7xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{folder}</h1>
      </div>
      <Gallery folder={folder} />
    </main>
  );
}
