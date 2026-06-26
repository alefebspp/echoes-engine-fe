import { Link } from "react-router-dom";
import { Wordmark } from "@/shared/components/Wordmark";
import { SignalRibbon } from "@/shared/components/SignalRibbon";
import { sampleRibbon } from "@/shared/utils/sampleRibbon";

const heroSample = sampleRibbon(64);

const captureNow = [
  {
    label: "Browser visit events",
    body: "The backend captures WEB_VISIT events today — URL, title, browser, and time.",
    status: "Live",
  },
  {
    label: "Period analytics",
    body: "Every capture rolls up into totals, trends, and breakdowns over a window you choose.",
    status: "Live",
  },
  {
    label: "Test ingestion",
    body: "Send a visit by hand to watch it move through the pipeline into your dashboard.",
    status: "Live",
  },
];

const resolvesInto = [
  { k: "Events by day", v: "A line of daily capture volume across the period." },
  { k: "Top domains", v: "The places your attention returned to most." },
  { k: "Categories", v: "How visits concentrate by tag and theme." },
  { k: "Sources & browsers", v: "Which channels and apps fed the record." },
  { k: "Activity by hour", v: "A 24-hour map of when your day is busiest." },
  { k: "Signal ribbon", v: "The whole period as one band of pulses and gaps." },
];

const roadmap = [
  "Semantic search across captured activity",
  "Embeddings for related-memory recall",
  "A knowledge graph of people, places, and topics",
  "Personalized behavioral insights",
];

export function LandingPage() {
  return (
    <div className="mx-auto max-w-shell px-5 lg:px-8">
      <header className="flex items-center justify-between py-6">
        <Wordmark />
        <nav className="flex items-center gap-2.5" aria-label="Account">
          <Link
            to="/login"
            className="rounded-sm px-3.5 py-2 text-sm font-medium text-ink_text-muted transition-colors hover:text-lilac"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="rounded-sm bg-memory px-3.5 py-2 font-display text-sm font-semibold text-ink transition-[transform,background-color] hover:-translate-y-px hover:bg-[#95b8ff]"
          >
            Create account
          </Link>
        </nav>
      </header>

      {/* Hero — the ribbon is the thesis. */}
      <section className="py-10 lg:py-16">
        <span className="eyebrow">Personal memory observatory</span>
        <h1 className="mt-4 max-w-[18ch] text-display font-semibold leading-[1.02]">
          What has your digital life been doing lately?
        </h1>
        <p className="mt-5 max-w-[56ch] text-lg text-ink_text-muted">
          Echoes Engine records your digital activity and resolves it into legible
          signals — timelines, rhythms, domains, and categories you can actually read.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/register"
            className="rounded-sm bg-memory px-5 py-3 font-display text-sm font-semibold text-ink transition-[transform,background-color] hover:-translate-y-px hover:bg-[#95b8ff]"
          >
            Create account
          </Link>
          <Link
            to="/login"
            className="rounded-sm border border-hairline-strong px-5 py-3 font-display text-sm font-semibold text-lilac transition-colors hover:border-memory hover:bg-surface-2"
          >
            Sign in
          </Link>
        </div>

        <figure className="panel mt-12 flex flex-col gap-4 p-6 lg:p-8">
          <figcaption className="flex items-center justify-between">
            <span className="eyebrow">A period, captured</span>
            <span className="font-mono text-micro text-ink_text-faint">
              illustration — not your data
            </span>
          </figcaption>
          <SignalRibbon data={heroSample} height={168} caption="An illustration of captured rhythm" />
          <p className="font-mono text-micro text-ink_text-faint">
            Each pulse is a day. Taller, brighter pulses mean more activity; flat ticks
            mark quiet days.
          </p>
        </figure>
      </section>

      {/* What it captures today — honest about current scope. */}
      <section className="border-t border-hairline py-12">
        <h2 className="text-h2">What it records today</h2>
        <p className="mt-2 max-w-[56ch] text-ink_text-muted">
          This is an evolving learning project. Here's exactly what works right now.
        </p>
        <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-3">
          {captureNow.map((item) => (
            <div key={item.label} className="panel flex flex-col gap-2 p-5">
              <span className="inline-flex w-fit items-center gap-1.5 rounded-pill border border-signal/40 px-2 py-0.5 font-mono text-micro uppercase tracking-[0.1em] text-signal">
                <span className="size-1.5 rounded-full bg-signal" aria-hidden="true" />
                {item.status}
              </span>
              <h3 className="text-h3 font-semibold">{item.label}</h3>
              <p className="text-sm text-ink_text-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What the dashboard resolves activity into. */}
      <section className="border-t border-hairline py-12">
        <h2 className="text-h2">How activity becomes legible</h2>
        <p className="mt-2 max-w-[56ch] text-ink_text-muted">
          The dashboard turns raw captures into a small set of views you can read at a glance.
        </p>
        <dl className="mt-7 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
          {resolvesInto.map((item, index) => (
            <div key={item.k} className="flex gap-4 border-t border-hairline pt-4">
              <span className="font-mono text-micro text-ink_text-faint tnum">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <dt className="font-display font-semibold text-lilac">{item.k}</dt>
                <dd className="mt-0.5 text-sm text-ink_text-muted">{item.v}</dd>
              </div>
            </div>
          ))}
        </dl>
      </section>

      {/* Roadmap — clearly labeled as not-yet-built. */}
      <section className="border-t border-hairline py-12">
        <div className="panel flex flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between lg:p-8">
          <div>
            <span className="eyebrow">Roadmap · not yet built</span>
            <h2 className="mt-3 text-h2">Toward a searchable memory</h2>
            <p className="mt-2 max-w-[48ch] text-sm text-ink_text-muted">
              Where this is headed once the matching backend lands. Nothing here is active yet.
            </p>
          </div>
          <ul className="flex flex-col gap-2.5">
            {roadmap.map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-sm text-ink_text-muted">
                <span
                  className="size-1.5 rounded-full border border-trace"
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <footer className="flex flex-col gap-3 border-t border-hairline py-8 sm:flex-row sm:items-center sm:justify-between">
        <Wordmark />
        <p className="font-mono text-micro text-ink_text-faint">
          A learning project · honest about what it can do
        </p>
      </footer>
    </div>
  );
}
