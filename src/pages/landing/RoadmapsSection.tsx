import { Link } from 'react-router-dom'
import type { Roadmap } from '../../types'

// ─── Data ──────────────────────────────────────────────────────────────────────
const ROADMAPS: Roadmap[] = [
  { title: 'Data Structures & Algorithms', icon: '🌳', category: 'programming', topicCount: 18 },
  { title: 'Java Programming',             icon: '☕', category: 'programming', topicCount: 14 },
  { title: 'Python Programming',           icon: '🐍', category: 'programming', topicCount: 12 },
  { title: 'C++ Programming',              icon: '⚡', category: 'programming', topicCount: 13 },
  { title: 'SQL & Databases',              icon: '🗄️', category: 'cs-core',    topicCount: 10 },
  { title: 'DBMS',                         icon: '📦', category: 'cs-core',    topicCount: 8  },
  { title: 'Operating Systems',            icon: '🖥️', category: 'cs-core',    topicCount: 9  },
  { title: 'Computer Networks',            icon: '🌐', category: 'cs-core',    topicCount: 8  },
  { title: 'OOP Concepts',                 icon: '🔷', category: 'cs-core',    topicCount: 7  },
  { title: 'System Design Basics',         icon: '🏗️', category: 'cs-core',    topicCount: 6  },
  { title: 'Quantitative Aptitude',        icon: '🔢', category: 'aptitude',   topicCount: 15 },
  { title: 'Logical Reasoning',            icon: '🧩', category: 'aptitude',   topicCount: 12 },
  { title: 'Verbal Ability',               icon: '📝', category: 'aptitude',   topicCount: 10 },
  { title: 'HR Interview',                 icon: '🤝', category: 'interview',  topicCount: 8  },
  { title: 'Technical Interview',          icon: '💡', category: 'interview',  topicCount: 11 },
]

const CATEGORY_LABELS: Record<Roadmap['category'], string> = {
  'programming': 'Programming',
  'cs-core':     'CS Core',
  'aptitude':    'Aptitude',
  'interview':   'Interview',
}

const CATEGORY_COLORS: Record<Roadmap['category'], string> = {
  'programming': 'bg-blue-100   text-blue-700   dark:bg-blue-900/40   dark:text-blue-300',
  'cs-core':     'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  'aptitude':    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  'interview':   'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function RoadmapsSection() {
  return (
    <section
      aria-labelledby="roadmaps-heading"
      className="py-20 sm:py-28 bg-[var(--bg)]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[var(--brand)] mb-3">
              Structured learning paths
            </span>
            <h2
              id="roadmaps-heading"
              className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-h)]"
            >
              15+ Roadmaps to Guide You
            </h2>
            <p className="mt-3 text-[var(--text)] max-w-xl">
              Every roadmap is broken into focused topics with resources, practice problems, and checkpoints.
            </p>
          </div>
          <Link
            to="/roadmaps"
            className="flex-shrink-0 inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand)] hover:underline"
          >
            View all roadmaps
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
              <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>

        {/* ── Roadmap cards grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {ROADMAPS.map(({ title, icon, category, topicCount }) => (
            <Link
              key={title}
              to={`/roadmaps/${title.toLowerCase().replace(/\s+/g, '-')}`}
              className="group flex flex-col gap-3 p-4 rounded-xl border border-[var(--border)] bg-[var(--bg)] hover:border-[var(--brand)] hover:shadow-md transition-all duration-200"
            >
              {/* Icon */}
              <span className="text-3xl" role="img" aria-hidden="true">{icon}</span>

              {/* Title */}
              <h3 className="text-sm font-semibold text-[var(--text-h)] leading-snug group-hover:text-[var(--brand)] transition-colors">
                {title}
              </h3>

              {/* Footer row */}
              <div className="flex items-center justify-between mt-auto">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[category]}`}>
                  {CATEGORY_LABELS[category]}
                </span>
                <span className="text-[10px] text-[var(--text)]">{topicCount} topics</span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  )
}
