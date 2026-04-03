import Link from "next/link";

export default function PrivacyPage() {
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
          Privacy
        </h1>

        <div className="mt-10 space-y-10 text-sm leading-relaxed text-zinc-400">
          <section>
            <h2 className="text-base font-semibold text-white">
              Your Data Stays With You
            </h2>
            <p className="mt-3">
              Resume is a client-side application. Your resume content, settings,
              and API keys are stored exclusively in your browser&apos;s local
              storage. We do not operate any backend database, and no personal
              data is transmitted to or stored on our servers.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white">
              API Keys
            </h2>
            <p className="mt-3">
              When you provide an API key for an AI provider (Gemini, OpenAI,
              Anthropic, or DeepSeek), it is saved only in your browser. API
              calls are made directly from your browser to the provider&apos;s
              servers. We never see, log, or have access to your keys.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white">
              AI Processing
            </h2>
            <p className="mt-3">
              When you use AI features such as bullet improvement, job
              tailoring, or ATS scoring, your resume content is sent to the AI
              provider you selected. This data is subject to that
              provider&apos;s own privacy policy. We recommend reviewing the
              terms of your chosen provider.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white">
              No Tracking
            </h2>
            <p className="mt-3">
              We do not use analytics, cookies, or tracking scripts. We do not
              collect usage data, IP addresses, or any form of telemetry.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white">
              Clearing Your Data
            </h2>
            <p className="mt-3">
              Since all data is stored in your browser, you can delete
              everything at any time by clearing your browser&apos;s local
              storage for this site. This will remove your resume, settings, and
              saved API keys.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white">
              Contact
            </h2>
            <p className="mt-3">
              If you have questions about how your data is handled, reach out
              at{" "}
              <a
                href="mailto:projects@kahunla.com"
                className="text-zinc-300 underline transition-colors hover:text-white"
              >
                projects@kahunla.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
