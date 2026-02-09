import Link from "next/link";

export function Header() {
  return (
    <header className="bg-gradient-to-r from-emerald-600 to-teal-600 shadow-sm">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-white hover:text-emerald-100 transition-colors flex items-center gap-2"
        >
          <span className="text-2xl">🌍</span>
          Carbon Calculator
        </Link>
        <nav>
          <Link
            href="/survey"
            className="text-sm font-medium text-emerald-100 hover:text-white transition-colors bg-white/10 px-4 py-2 rounded-full"
          >
            Take Survey
          </Link>
        </nav>
      </div>
    </header>
  );
}
