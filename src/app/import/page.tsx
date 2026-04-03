import { Header } from "@/components/layout/header";
import { ImportClientLoader } from "@/components/import/import-client-loader";

export default function ImportPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-white">Import Resume</h1>
          <p className="mt-2 text-sm text-zinc-500">
            Upload an existing PDF resume and we&apos;ll extract the content for
            you to edit
          </p>
        </div>
        <ImportClientLoader />
      </main>
    </div>
  );
}
