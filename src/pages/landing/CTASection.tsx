import { Link } from 'react-router-dom'

/**
 * CTASection — bottom call-to-action before the footer.
 * Encourages visitors to register and start preparing.
 */
export default function CTASection() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="py-20 sm:py-28 bg-[var(--bg)] border-t border-[var(--border)]"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        {/* Decorative gradient ring */}
        <div
          aria-hidden="true"
          className="mx-auto mb-8 w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-xl shadow-purple-300/40 dark:shadow-purple-900/40"
        >
          <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10" aria-hidden="true">
            <path d="M20 6L8 13v14l12 7 12-7V13L20 6z" stroke="#fff" strokeWidth="2.2" strokeLinejoin="round"/>
            <circle cx="20" cy="20" r="4" fill="#fff"/>
          </svg>
        </div>

        <h2
          id="cta-heading"
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--text-h)]"
        >
          Your Placement Journey{' '}
          <span className="text-[var(--brand)]">Starts Today</span>
        </h2>

        <p className="mt-5 text-base sm:text-lg text-[var(--text)] max-w-2xl mx-auto leading-relaxed">
          Join thousands of students who are preparing smarter with PlacePrep AI.
          No fees. No coaching required. Just a structured path to your dream job.
        </p>

        {/* CTA buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[var(--brand)] hover:bg-[var(--brand-dark)] text-white font-bold text-base shadow-lg shadow-purple-300/40 hover:shadow-xl transition-all duration-200"
          >
            Create Free Account
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
              <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10z" clipRule="evenodd" />
            </svg>
          </Link>
          <Link
            to="/roadmaps"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl border border-[var(--border)] text-[var(--text-h)] font-semibold text-base hover:border-[var(--brand)] hover:text-[var(--brand)] transition-all duration-200"
          >
            Browse Roadmaps
          </Link>
        </div>

        {/* Trust badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-[var(--text)]">
          {['✅ 100% Free', '✅ No Sign-up Fee', '✅ No Ads', '✅ Student First'].map(item => (
            <span key={item} className="font-medium">{item}</span>
          ))}
        </div>

      </div>
    </section>
  )
}
