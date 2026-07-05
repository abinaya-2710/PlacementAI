// ─── Feature data ─────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: '🗺️',
    title: 'Structured Roadmaps',
    description:
      'Step-by-step learning paths for DSA, System Design, OOP, DBMS, OS, SQL, and more — built for placement success.',
    color: 'from-purple-500 to-violet-600',
    bg: 'bg-purple-50 dark:bg-purple-950/30',
    border: 'border-purple-100 dark:border-purple-900/50',
  },
  {
    icon: '💻',
    title: 'Coding Practice',
    description:
      'Hundreds of problems organized by topic and difficulty. Filter, search, bookmark, and track your progress as you solve.',
    color: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    border: 'border-blue-100 dark:border-blue-900/50',
  },
  {
    icon: '🧮',
    title: 'Aptitude Practice',
    description:
      'Quantitative, logical, and verbal reasoning — with timed mock tests that mirror actual company assessments.',
    color: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    border: 'border-emerald-100 dark:border-emerald-900/50',
  },
  {
    icon: '🏢',
    title: 'Company Preparation',
    description:
      'Curated prep for 16+ top companies — TCS, Infosys, Amazon, Google, and more. Know exactly what to expect.',
    color: 'from-orange-500 to-amber-500',
    bg: 'bg-orange-50 dark:bg-orange-950/30',
    border: 'border-orange-100 dark:border-orange-900/50',
  },
  {
    icon: '📄',
    title: 'Resume Builder',
    description:
      'Build an ATS-friendly resume with guided sections for education, skills, projects, and experience. Preview instantly.',
    color: 'from-pink-500 to-rose-500',
    bg: 'bg-pink-50 dark:bg-pink-950/30',
    border: 'border-pink-100 dark:border-pink-900/50',
  },
  {
    icon: '🎤',
    title: 'Interview Preparation',
    description:
      'HR, technical, and behavioral questions with model answers. Learn from real interview experiences shared by peers.',
    color: 'from-indigo-500 to-purple-500',
    bg: 'bg-indigo-50 dark:bg-indigo-950/30',
    border: 'border-indigo-100 dark:border-indigo-900/50',
  },
]

// ─── Component ────────────────────────────────────────────────────────────────
export default function FeaturesSection() {
  return (
    <section
      aria-labelledby="features-heading"
      className="py-20 sm:py-28 bg-[var(--bg-muted)] border-y border-[var(--border)]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section header ── */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[var(--brand)] mb-3">
            Everything you need
          </span>
          <h2
            id="features-heading"
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-h)]"
          >
            One Platform. Complete Preparation.
          </h2>
          <p className="mt-4 text-[var(--text)] text-base sm:text-lg leading-relaxed">
            No more juggling multiple websites. PlacePrep AI covers every aspect of
            placement preparation — structured, guided, and completely free.
          </p>
        </div>

        {/* ── Feature cards grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(({ icon, title, description, color, bg, border }) => (
            <article
              key={title}
              className={`group relative rounded-2xl p-6 border ${bg} ${border} hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5`}
            >
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${color} text-2xl shadow-sm mb-4`}>
                <span role="img" aria-hidden="true">{icon}</span>
              </div>

              {/* Text */}
              <h3 className="text-base font-bold text-[var(--text-h)] mb-2">{title}</h3>
              <p className="text-sm text-[var(--text)] leading-relaxed">{description}</p>

              {/* Hover arrow */}
              <span
                aria-hidden="true"
                className="absolute bottom-5 right-5 text-[var(--brand)] opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-lg"
              >
                →
              </span>
            </article>
          ))}
        </div>

      </div>
    </section>
  )
}
