import { Link } from 'react-router-dom'

// ─── Stat badge data ───────────────────────────────────────────────────────────
const STATS = [
  { value: '15+',   label: 'Roadmaps'         },
  { value: '500+',  label: 'Practice Problems' },
  { value: '16+',   label: 'Companies'         },
  { value: '100%',  label: 'Free Forever'      },
]

// ─── Floating card data (decorative) ──────────────────────────────────────────
const FLOAT_CARDS = [
  { icon: '🎯', text: 'Placement Ready',  sub: 'Score: 92%',       pos: 'top-6 -left-4 sm:top-8 sm:-left-8'   },
  { icon: '🔥', text: 'Daily Streak',     sub: '14 days',           pos: 'top-6 -right-4 sm:top-8 sm:-right-8' },
  { icon: '✅', text: 'DSA Complete',     sub: '120 / 150 solved',  pos: 'bottom-16 -left-4 sm:-left-10'       },
  { icon: '🏆', text: 'Leaderboard',      sub: 'Rank #42',          pos: 'bottom-16 -right-4 sm:-right-10'     },
]

export default function HeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-[var(--bg)] pt-16 pb-24 sm:pt-20 sm:pb-32"
    >
      {/* ── Background gradient blobs ── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-purple-200/40 dark:bg-purple-900/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-violet-200/30 dark:bg-violet-900/15 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* ── Left: Copy ── */}
          <div className="flex-1 text-center lg:text-left max-w-2xl mx-auto lg:mx-0">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/40 mb-6">
              <span className="w-2 h-2 rounded-full bg-[var(--brand)] animate-pulse" aria-hidden="true" />
              <span className="text-xs font-semibold text-[var(--brand)] tracking-wide uppercase">
                100% Free · No Paywalls · No Coaching Fees
              </span>
            </div>

            {/* Heading */}
            <h1
              id="hero-heading"
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-[var(--text-h)]"
            >
              Crack Your{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-[var(--brand)]">Placement</span>
                {/* Underline decoration */}
                <svg
                  aria-hidden="true"
                  className="absolute -bottom-1 left-0 w-full"
                  viewBox="0 0 200 8"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 6 C40 2, 100 1, 198 5"
                    stroke="var(--brand)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    opacity="0.4"
                  />
                </svg>
              </span>{' '}
              Interview — For Free
            </h1>

            {/* Subheadline */}
            <p className="mt-5 text-lg sm:text-xl text-[var(--text)] leading-relaxed">
              PlacePrep AI gives every college student a structured path to placement success —
              DSA, aptitude, mock interviews, resume builder, and company-specific prep. All in one place.
            </p>

            {/* CTA buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--brand)] hover:bg-[var(--brand-dark)] text-white font-semibold text-base shadow-lg shadow-purple-300/40 dark:shadow-purple-900/40 hover:shadow-xl transition-all duration-200"
              >
                Start Preparing — It's Free
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                  <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10z" clipRule="evenodd"/>
                </svg>
              </Link>
              <Link
                to="/roadmaps"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-[var(--border)] text-[var(--text-h)] font-semibold text-base hover:border-[var(--brand)] hover:text-[var(--brand)] transition-all duration-200"
              >
                Explore Roadmaps
              </Link>
            </div>

            {/* Trust line */}
            <p className="mt-5 text-sm text-[var(--text)]">
              No credit card required. No hidden fees.{' '}
              <span className="font-medium text-[var(--text-h)]">Join thousands of students</span> preparing smarter.
            </p>

            {/* Stats row */}
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {STATS.map(({ value, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center lg:items-start p-3 rounded-xl bg-[var(--bg-muted)] border border-[var(--border)]"
                >
                  <span className="text-2xl font-extrabold text-[var(--brand)]">{value}</span>
                  <span className="text-xs text-[var(--text)] mt-0.5">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Visual ── */}
          <div className="flex-1 relative w-full max-w-md mx-auto lg:mx-0">
            {/* Main card */}
            <div className="relative z-10 rounded-2xl border border-[var(--border)] bg-[var(--bg)] shadow-2xl shadow-purple-200/30 dark:shadow-purple-900/20 overflow-hidden">
              {/* Card header bar */}
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-[var(--border)] bg-[var(--bg-muted)]">
                <span className="w-3 h-3 rounded-full bg-red-400"   aria-hidden="true" />
                <span className="w-3 h-3 rounded-full bg-yellow-400" aria-hidden="true" />
                <span className="w-3 h-3 rounded-full bg-green-400"  aria-hidden="true" />
                <span className="ml-3 text-xs text-[var(--text)] font-mono">placeprep.ai/dashboard</span>
              </div>

              {/* Card body */}
              <div className="p-6 space-y-4">
                {/* Welcome */}
                <div>
                  <p className="text-xs text-[var(--text)] uppercase tracking-wide font-semibold">Welcome back 👋</p>
                  <h2 className="text-lg font-bold text-[var(--text-h)] mt-0.5">Rahul's Dashboard</h2>
                </div>

                {/* Readiness score */}
                <div className="rounded-xl p-4 bg-gradient-to-br from-purple-500 to-violet-600 text-white">
                  <p className="text-xs font-semibold opacity-80 uppercase tracking-wide">Placement Readiness</p>
                  <div className="flex items-end justify-between mt-1">
                    <span className="text-4xl font-extrabold">74%</span>
                    <span className="text-sm opacity-80">↑ 6% this week</span>
                  </div>
                  {/* Progress bar */}
                  <div className="mt-3 h-2 rounded-full bg-white/30">
                    <div className="h-2 rounded-full bg-white w-[74%]" role="progressbar" aria-valuenow={74} aria-valuemin={0} aria-valuemax={100} aria-label="Placement readiness 74%" />
                  </div>
                </div>

                {/* Topic progress rows */}
                {[
                  { topic: 'DSA',            pct: 68, color: 'bg-blue-500'   },
                  { topic: 'Aptitude',       pct: 81, color: 'bg-emerald-500'},
                  { topic: 'System Design',  pct: 45, color: 'bg-orange-500' },
                ].map(({ topic, pct, color }) => (
                  <div key={topic}>
                    <div className="flex justify-between text-xs font-medium text-[var(--text-h)] mb-1">
                      <span>{topic}</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[var(--border)]">
                      <div
                        className={`h-1.5 rounded-full ${color}`}
                        style={{ width: `${pct}%` }}
                        role="progressbar"
                        aria-valuenow={pct}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${topic} ${pct}%`}
                      />
                    </div>
                  </div>
                ))}

                {/* Next task */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-muted)] border border-[var(--border)]">
                  <span className="text-xl" aria-hidden="true">📌</span>
                  <div>
                    <p className="text-xs font-semibold text-[var(--text-h)]">Next: Binary Trees — Level Order Traversal</p>
                    <p className="text-xs text-[var(--text)] mt-0.5">DSA Roadmap · Medium</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating accent cards */}
            {FLOAT_CARDS.map(({ icon, text, sub, pos }) => (
              <div
                key={text}
                aria-hidden="true"
                className={`absolute ${pos} z-20 hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--bg)] border border-[var(--border)] shadow-lg text-xs font-medium text-[var(--text-h)] whitespace-nowrap`}
              >
                <span className="text-base">{icon}</span>
                <span className="flex flex-col leading-tight">
                  <span>{text}</span>
                  <span className="text-[var(--text)] font-normal">{sub}</span>
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
