import Link from "next/link";

export default function HelpPage() {
  return (
    <div
      className="min-h-dvh bg-[#0a0a0a]"
      style={{ fontFamily: "var(--font-sreda), sans-serif" }}
    >
      <div className="mx-auto max-w-2xl px-4 py-16 sm:py-24">
        <Link
          href="/"
          className="text-sm text-zinc-500 transition-colors hover:text-white"
        >
          &larr; Back
        </Link>

        <h1 className="mt-8 text-2xl font-bold text-white sm:text-3xl">
          How to use Resume
        </h1>

        <div className="mt-10 space-y-10 text-sm leading-relaxed text-zinc-400">
          <section>
            <h2 className="text-base font-semibold text-white">
              Getting Started
            </h2>
            <p className="mt-3">
              You have three ways to start building your resume:
            </p>
            <ul className="mt-3 list-inside list-disc space-y-2">
              <li>
                <span className="text-zinc-300">Start fresh</span> — click
                Start Building and fill in each section from scratch.
              </li>
              <li>
                <span className="text-zinc-300">Import a PDF</span> — upload an
                existing resume and our AI will parse it into an editable
                format.
              </li>
              <li>
                <span className="text-zinc-300">Continue editing</span> — your
                work is saved automatically in your browser. Just come back and
                pick up where you left off.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white">
              Bring Your Own API Key
            </h2>
            <p className="mt-3">
              Resume uses AI to improve your bullet points, tailor your resume
              to job descriptions, and score ATS compatibility. To use these
              features, you need to provide your own API key from one of the
              supported providers:
            </p>
            <ul className="mt-3 list-inside list-disc space-y-2">
              <li>Google Gemini</li>
              <li>OpenAI (GPT-4o)</li>
              <li>Anthropic (Claude)</li>
              <li>DeepSeek</li>
            </ul>
            <p className="mt-3">
              Click the <span className="text-zinc-300">settings icon</span> in
              the top right, select a provider, paste your key, and hit Save.
              You can switch providers at any time.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white">
              Your Keys Stay on Your Machine
            </h2>
            <p className="mt-3">
              API keys are stored in your browser&apos;s local storage. They
              never leave your device and are never sent to our servers. When
              you use an AI feature, your browser calls the AI provider
              directly.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white">
              AI Features
            </h2>
            <ul className="mt-3 list-inside list-disc space-y-2">
              <li>
                <span className="text-zinc-300">Bullet Improver</span> —
                select a bullet point and get stronger, quantified variations.
              </li>
              <li>
                <span className="text-zinc-300">Job Tailoring</span> — paste a
                job description and let AI rewrite your resume to match.
              </li>
              <li>
                <span className="text-zinc-300">ATS Score</span> — check how
                well your resume matches a job description and get suggestions.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white">
              Resume Preview & Download
            </h2>
            <p className="mt-3">
              The live preview updates as you type. Your resume supports up to
              two pages — if content overflows the first page, a second page
              appears automatically. Use the zoom slider to adjust the preview
              size, and click Download to get a PDF.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white">
              Run It Locally
            </h2>
            <p className="mt-3">
              Resume is open source. Clone the repo and run it on your own
              machine:
            </p>
            <div className="mt-3 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 font-mono text-xs text-zinc-300">
              <p>git clone https://github.com/Festus-Ewakaa-Kahunla/resume.git</p>
              <p>cd resume</p>
              <p>npm install</p>
              <p>npm run dev</p>
            </div>
            <p className="mt-3">
              View the full source on{" "}
              <a
                href="https://github.com/Festus-Ewakaa-Kahunla/resume"
                target="_blank"
                rel="noreferrer"
                className="text-zinc-300 underline transition-colors hover:text-white"
              >
                GitHub
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
