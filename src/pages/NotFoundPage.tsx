import { Link, useNavigate } from 'react-router-dom'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-[var(--bg)]">
      {/* Decorative number */}
      <div aria-hidden="true" className="relative mb-6">
        <p className="text-[8rem] sm:text-[12rem] font-extrabold text-[var(--border)] leading-none select-none">
          404
        </p>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-5xl">🧭</span>
        </div>
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-h)] mb-3">
        Page not found
      </h1>
      <p className="text-[var(--text)] max-w-sm mb-8 leading-relaxed">
        Looks like you've wandered off the roadmap. The page you're looking for doesn't exist or has been moved.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link to="/"
          className="px-6 py-3 rounded-xl bg-[var(--brand)] hover:bg-[var(--brand-dark)] text-white font-semibold text-sm transition-all shadow-md shadow-purple-300/30">
          Go to Home
        </Link>
        <button type="button" onClick={() => navigate(-1)}
          className="px-6 py-3 rounded-xl border border-[var(--border)] text-[var(--text-h)] font-semibold text-sm hover:border-[var(--brand)] hover:text-[var(--brand)] transition-colors">
          Go Back
        </button>
        <Link to="/roadmaps"
          className="px-6 py-3 rounded-xl border border-[var(--border)] text-[var(--text-h)] font-semibold text-sm hover:border-[var(--brand)] hover:text-[var(--brand)] transition-colors">
          Browse Roadmaps
        </Link>
      </div>
    </div>
  )
}
