import Link from "next/link";

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-gray-900 hover:text-gray-700 transition-colors"
        >
          Carbon Calculator
        </Link>
        <nav>
          <Link
            href="/survey"
            className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            Take Survey
          </Link>
        </nav>
      </div>
    </header>
  );
}
