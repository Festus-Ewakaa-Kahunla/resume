import Link from "next/link";
import { ApiKeysPopover } from "@/components/settings/api-keys-popover";

const FEATURES = [
  {
    title: "AI Bullet Improver",
    description: "Turn weak bullet points into recruiter-ready achievements.",
  },
  {
    title: "Job Tailoring",
    description: "Auto-optimize your resume for any job description.",
  },
  {
    title: "ATS Score Checker",
    description: "Check compatibility and beat applicant tracking systems.",
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col bg-[#0a0a0a]" style={{ fontFamily: "var(--font-sreda), sans-serif" }}>
      <div className="absolute right-4 top-4 z-10">
        <ApiKeysPopover />
      </div>

      <main className="flex-1 flex items-center">
        <section className="mx-auto max-w-4xl px-4 py-8 text-center sm:py-24">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Build resumes that
            <span className="text-white"> land interviews</span>
          </h1>

          <div className="mx-auto mt-10 w-64 overflow-hidden sm:mt-16 sm:w-80">
            <div className="animate-marquee flex w-max gap-8" style={{ willChange: "transform" }}>
              {[...FEATURES, ...FEATURES].map((feature, idx) => (
                <div
                  key={idx}
                  className="flex h-64 w-64 shrink-0 flex-col justify-center rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 text-center sm:h-80 sm:w-80 sm:p-8"
                >
                  <h3 className="text-base font-semibold text-white sm:text-lg">{feature.title}</h3>
                  <p className="mt-2 text-xs text-zinc-400 sm:mt-3 sm:text-sm">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-3 sm:mt-10 sm:gap-4">
            <Link
              href="/builder"
              className="rounded-lg border border-zinc-800 px-6 py-2.5 text-sm font-bold text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white sm:px-8 sm:py-3 sm:text-base"
            >
              Start Building
            </Link>
            <Link
              href="/import"
              className="rounded-lg border border-zinc-800 px-6 py-2.5 text-sm font-bold text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white sm:px-8 sm:py-3 sm:text-base"
            >
              Import PDF
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-800/60 py-6 sm:py-8">
        <div className="flex flex-col items-center gap-3 text-xs sm:gap-4 sm:text-sm">
          <div className="flex gap-8">
            <Link href="/privacy" className="text-zinc-400 transition-colors hover:text-white">
              Privacy
            </Link>
            <Link href="/help" className="text-zinc-400 transition-colors hover:text-white">
              Help
            </Link>
            <a href="https://github.com/Festus-Ewakaa-Kahunla/resume" target="_blank" rel="noreferrer" className="text-zinc-400 transition-colors hover:text-white">
              GitHub
            </a>
          </div>
          <span className="text-zinc-600">
            &copy; {new Date().getFullYear()} All Rights Reserved. Festus Kahunla
          </span>
        </div>
      </footer>
    </div>
  );
}
