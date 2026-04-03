"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      className="flex min-h-dvh flex-col items-center justify-center bg-[#0a0a0a] px-4 text-center"
      style={{ fontFamily: "var(--font-sreda), sans-serif" }}
    >
      <p className="text-sm font-medium tracking-widest text-zinc-600">500</p>
      <h1 className="mt-3 text-2xl font-bold text-white sm:text-4xl">
        Something went wrong
      </h1>
      <p className="mt-3 text-sm text-zinc-500 sm:text-base">
        An unexpected error occurred. Please try again.
      </p>
      <div className="mt-8 flex gap-3">
        <button
          onClick={reset}
          className="rounded-lg border border-zinc-800 px-6 py-2.5 text-sm font-bold text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white"
        >
          Try Again
        </button>
        <a
          href="/"
          className="rounded-lg border border-zinc-800 px-6 py-2.5 text-sm font-bold text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
