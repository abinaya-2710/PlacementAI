import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../../components/ui/PageHeader'
import Badge from '../../components/ui/Badge'
import { useRoadmaps } from '../../hooks/useRoadmaps'
import { useAuth } from '../../context/AuthContext'
import type { RoadmapCategory } from '../../types'

// ── Static display config ─────────────────────────────────────────────────────

const CATEGORIES: { key: 'all' | RoadmapCategory; label: string }[] = [
  { key: 'all',         label: 'All'         },
  { key: 'programming', label: 'Programming' },
  { key: 'cs-core',     label: 'CS Core'     },
  { key: 'aptitude',    label: 'Aptitude'    },
  { key: 'interview',   label: 'Interview'   },
]

const CAT_BADGE: Record<string, 'brand' | 'info' | 'success' | 'warning'> = {
  programming: 'info',
  'cs-core':   'brand',
  aptitude:    'success',
  interview:   'warning',
}

const CAT_LABEL: Record<string, string> = {
  programming: 'Programming',
  'cs-core':   'CS Core',
  aptitude:    'Aptitude',
  interview:   'Interview',
}

// ── Skeleton card ─────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="flex flex-col gap-4 p-5 rounded-xl border border-[var(--border)] bg-[var(--bg)] animate-pulse">
      <div className="flex items-start justify-between">
        <div className="w-8 h-8 rounded-lg bg-[var(--border)]" />
        <div className="w-20 h-5 rounded-full bg-[var(--border)]" />
      </div>
      <div className="space-y-2">
        <div className="w-3/4 h-4 rounded bg-[var(--border)]" />
        <div className="w-full h-3 rounded bg-[var(--border)]" />
        <div className="w-2/3 h-3 rounded bg-[var(--border)]" />
      </div>
      <div className="space-y-1.5">
        <div className="flex justify-between">
          <div className="w-16 h-3 rounded bg-[var(--border)]" />
          <div className="w-20 h-3 rounded bg-[var(--border)]" />
        </div>
        <div className="h-1.5 rounded-full bg-[var(--border)]" />
      </div>
    </div>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function RoadmapsPage() {
  const { roadmaps, loading, error, refetch } = useRoadmaps()
  const { isAuthenticated } = useAuth()
  const [active, setActive] = useState<'all' | RoadmapCategory>('all')
  const [search, setSearch] = useState('')

  const filtered = roadmaps.filter(r => {
    if (active !== 'all' && r.category !== active) return false
    if (search && !r.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  // Summary stats for authenticated users
  const totalRoadmaps    = roadmaps.length
  const startedRoadmaps  = roadmaps.filter(r => r.completed_count > 0).length
  const completedRoadmaps = roadmaps.filter(r => r.progress_pct === 100).length

  return (
    <>
      <PageHeader
        title="Learning Roadmaps"
        subtitle="Structured, topic-by-topic paths to master every subject needed for placements."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Stats row — only shown to logged-in users with data */}
        {isAuthenticated && !loading && roadmaps.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Total Roadmaps',  value: totalRoadmaps,     color: 'text-[var(--text-h)]' },
              { label: 'In Progress',     value: startedRoadmaps,   color: 'text-blue-600 dark:text-blue-400' },
              { label: 'Completed',       value: completedRoadmaps, color: 'text-green-600 dark:text-green-400' },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex flex-col items-center justify-center p-4 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-center">
                <span className={`text-2xl font-extrabold ${color}`}>{value}</span>
                <span className="text-xs text-[var(--text)] mt-0.5">{label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Search + category filter row */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          {/* Search */}
          <div className="relative">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text)]" aria-hidden="true">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="search"
              placeholder="Search roadmaps…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-sm text-[var(--text-h)] placeholder:text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:border-transparent w-full sm:w-56"
            />
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by category">
            {CATEGORIES.map(({ key, label }) => (
              <button
                key={key}
                role="tab"
                aria-selected={active === key}
                onClick={() => setActive(key)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
                  active === key
                    ? 'bg-[var(--brand)] text-white border-[var(--brand)]'
                    : 'border-[var(--border)] text-[var(--text)] hover:border-[var(--brand)] hover:text-[var(--brand)]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Error state */}
        {error && !loading && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <span className="text-4xl" aria-hidden="true">⚠️</span>
            <p className="text-[var(--text-h)] font-semibold">Failed to load roadmaps</p>
            <p className="text-sm text-[var(--text)]">{error}</p>
            <button
              onClick={refetch}
              className="px-4 py-2 rounded-lg bg-[var(--brand)] text-white text-sm font-semibold hover:bg-[var(--brand-dark)] transition-colors"
            >
              Try again
            </button>
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Empty search result */}
        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <span className="text-4xl" aria-hidden="true">🔍</span>
            <p className="text-[var(--text-h)] font-semibold">No roadmaps found</p>
            <p className="text-sm text-[var(--text)]">Try a different search or category.</p>
          </div>
        )}

        {/* Roadmap cards grid */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(rm => (
              <Link
                key={rm.slug}
                to={`/roadmaps/${rm.slug}`}
                className="group flex flex-col gap-4 p-5 rounded-xl border border-[var(--border)] bg-[var(--bg)] hover:border-[var(--brand)] hover:shadow-md transition-all duration-200"
              >
                {/* Top row: icon + badge */}
                <div className="flex items-start justify-between gap-2">
                  <span className="text-3xl" role="img" aria-hidden="true">{rm.icon}</span>
                  <Badge variant={CAT_BADGE[rm.category] ?? 'neutral'}>
                    {CAT_LABEL[rm.category] ?? rm.category}
                  </Badge>
                </div>

                {/* Text */}
                <div className="flex-1">
                  <h3 className="font-bold text-[var(--text-h)] group-hover:text-[var(--brand)] transition-colors mb-1">
                    {rm.title}
                  </h3>
                  <p className="text-xs text-[var(--text)] leading-relaxed line-clamp-2">{rm.description}</p>
                </div>

                {/* Meta row */}
                <div className="flex items-center gap-3 text-[10px] text-[var(--text)]">
                  <span>📚 {rm.topic_count} topics</span>
                  <span>⏱️ ~{rm.estimated_hours}h</span>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-xs text-[var(--text)] mb-1">
                    <span>{rm.topic_count} topics</span>
                    <span>
                      {isAuthenticated
                        ? rm.completed_count > 0
                          ? `${rm.progress_pct}% complete`
                          : 'Not started'
                        : 'Login to track'}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[var(--border)]">
                    <div
                      className="h-1.5 rounded-full bg-[var(--brand)] transition-all duration-500"
                      style={{ width: `${isAuthenticated ? rm.progress_pct : 0}%` }}
                      role="progressbar"
                      aria-valuenow={rm.progress_pct}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${rm.progress_pct}% complete`}
                    />
                  </div>
                </div>

                {/* Completed badge */}
                {isAuthenticated && rm.progress_pct === 100 && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-950/40 px-2 py-0.5 rounded-full self-start">
                    ✓ Completed
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}

        {/* Guest CTA */}
        {!isAuthenticated && !loading && !error && (
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 p-6 rounded-2xl border border-purple-200 dark:border-purple-900/50 bg-purple-50/50 dark:bg-purple-950/20 text-center">
            <p className="text-sm text-[var(--text-h)] font-medium">
              🎯 Login to track your progress across all roadmaps
            </p>
            <Link
              to="/login"
              className="px-5 py-2 rounded-lg bg-[var(--brand)] text-white text-sm font-semibold hover:bg-[var(--brand-dark)] transition-colors flex-shrink-0"
            >
              Get started free
            </Link>
          </div>
        )}

      </div>
    </>
  )
}
