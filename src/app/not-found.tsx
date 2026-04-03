import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="flex min-h-dvh flex-col items-center justify-center bg-[#0a0a0a] px-4 text-center"
      style={{ fontFamily: "var(--font-sreda), sans-serif" }}
    >
      <p className="text-sm font-medium tracking-widest text-zinc-600">404</p>
      <h1 className="mt-3 text-2xl font-bold text-white sm:text-4xl">
        Page not found
      </h1>
      <p className="mt-3 text-sm text-zinc-500 sm:text-base">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-lg border border-zinc-800 px-6 py-2.5 text-sm font-bold text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white"
      >
        Go Home
      </Link>
    </div>
  );
}
