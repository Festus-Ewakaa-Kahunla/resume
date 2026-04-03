"use client";

import dynamic from "next/dynamic";

const ImportClient = dynamic(
  () =>
    import("@/components/import/import-client").then((mod) => mod.ImportClient),
  { ssr: false }
);

export function ImportClientLoader() {
  return <ImportClient />;
}
