import { Link } from "react-router-dom";
import { Wordmark } from "@/shared/components/Wordmark";

export function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-shell flex-col px-5 lg:px-8">
      <header className="py-6">
        <Link to="/" aria-label="Echoes Engine home">
          <Wordmark />
        </Link>
      </header>
      <div className="flex flex-1 flex-col items-start justify-center gap-4 py-12">
        <span className="eyebrow">404 · off the record</span>
        <h1 className="max-w-[20ch] text-h1">
          There's no signal at this address
        </h1>
        <p className="max-w-[48ch] text-ink_text-muted">
          The page you're after doesn't exist. Head back to your observatory.
        </p>
        <Link
          to="/app/dashboard"
          className="mt-2 rounded-sm bg-memory px-5 py-3 font-display text-sm font-semibold text-ink transition-[transform,background-color] hover:-translate-y-px hover:bg-[#95b8ff]"
        >
          Go to dashboard
        </Link>
      </div>
    </main>
  );
}
