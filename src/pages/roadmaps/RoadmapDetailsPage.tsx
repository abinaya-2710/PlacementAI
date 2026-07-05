import { useParams, Link, useNavigate } from 'react-router-dom'
import Badge from '../../components/ui/Badge'
import { useRoadmapDetail } from '../../hooks/useRoadmapDetail'
import { useAuth } from '../../context/AuthContext'
import type { TopicDifficulty, TopicLevel } from '../../types'

// ── Static config ─────────────────────────────────────────────────────────────

const DIFF_VARIANT: Record<TopicDifficulty, 'success' | 'warning' | 'error'> = {
  Easy: 'success', Medium: 'warning', Hard: 'error',
}

const LEVEL_LABEL: Record<TopicLevel, string> = {
  beginner:     'Beginner',
  intermediate: 'Intermediate',
  advanced:     'Advanced',
}

const LEVEL_COLOR: Record<TopicLevel, string> = {
  beginner:     'bg-blue-100   text-blue-700   dark:bg-blue-900/40   dark:text-blue-300',
  intermediate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  advanced:     'bg-red-100    text-red-700    dark:bg-red-900/40    dark:text-red-300',
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      <div className="h-4 w-40 rounded bg-[var(--border)] mb-6" />
      <div className="rounded-2xl bg-[var(--border)] h-36 mb-8" />
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-16 rounded-xl bg-[var(--border)]" />
        ))}
      </div>
    </div>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function RoadmapDetailsPage() {
  const navigate = useNavigate()
  const { slug } = useParams<{ slug: string }>()
  const { roadmap, loading, error, toggling, toggleTopic, refetch } =
    useRoadmapDetail(slug)
  const { isAuthenticated } = useAuth()

  // Group topics by level
  const grouped = roadmap
    ? (['beginner', 'intermediate', 'advanced'] as TopicLevel[]).map(level => ({
        level,
        topics: roadmap.topics.filter(t => t.level === level),
      })).filter(g => g.topics.length > 0)
    : []

  if (loading) return <Skeleton />

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center px-4">
        <span className="text-4xl" aria-hidden="true">⚠️</span>
        <p className="text-[var(--text-h)] font-semibold">Failed to load roadmap</p>
        <p className="text-sm text-[var(--text)]">{error}</p>
        <div className="flex gap-3">
          <Link to="/roadmaps" className="px-4 py-2 rounded-lg border border-[var(--border)] text-sm font-semibold text-[var(--text-h)] hover:border-[var(--brand)] hover:text-[var(--brand)] transition-colors">
            ← All Roadmaps
          </Link>
          <button onClick={refetch} className="px-4 py-2 rounded-lg bg-[var(--brand)] text-white text-sm font-semibold hover:bg-[var(--brand-dark)] transition-colors">
            Try again
          </button>
        </div>
      </div>
    )
  }

  if (!roadmap) return null

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Back Link & Breadcrumb */}
      <div>
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--brand)] hover:underline mb-3 cursor-pointer bg-transparent border-none p-0">
          &larr; Go Back
        </button>
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[var(--text)] mb-6">
          <Link to="/roadmaps" className="hover:text-[var(--brand)] transition-colors">Roadmaps</Link>
          <span aria-hidden="true">/</span>
          <span className="text-[var(--text-h)] font-medium">{roadmap.title}</span>
        </nav>
      </div>

      {/* Header banner */}
      <div className="rounded-2xl bg-gradient-to-br from-[var(--brand)] to-violet-700 p-6 sm:p-8 text-white mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl" aria-hidden="true">{roadmap.icon}</span>
              <h1 className="text-2xl font-extrabold leading-tight">{roadmap.title}</h1>
            </div>
            <p className="text-white/80 text-sm mb-3 leading-relaxed">{roadmap.description}</p>
            <div className="flex flex-wrap gap-3 text-xs text-white/70">
              <span>📚 {roadmap.topic_count} topics</span>
              <span>⏱️ ~{roadmap.estimated_hours} hours</span>
              {isAuthenticated && (
                <span>✅ {roadmap.completed_count} completed</span>
              )}
            </div>
          </div>

          {/* Progress ring / circle */}
          <div className="flex-shrink-0 flex flex-col items-center bg-white/15 rounded-2xl px-6 py-4 text-center min-w-[100px]">
            <span className="text-4xl font-extrabold leading-none">{roadmap.progress_pct}%</span>
            <span className="text-xs text-white/80 mt-1">
              {isAuthenticated ? 'Completed' : 'Progress'}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-5 h-2.5 rounded-full bg-white/30">
          <div
            className="h-2.5 rounded-full bg-white transition-all duration-500"
            style={{ width: `${roadmap.progress_pct}%` }}
            role="progressbar"
            aria-valuenow={roadmap.progress_pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${roadmap.progress_pct}% complete`}
          />
        </div>
        <p className="mt-2 text-xs text-white/60">
          {isAuthenticated
            ? `${roadmap.completed_count} of ${roadmap.topic_count} topics completed`
            : 'Login to track your progress'}
        </p>
      </div>

      {/* Guest login prompt */}
      {!isAuthenticated && (
        <div className="mb-6 flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-purple-200 dark:border-purple-900/50 bg-purple-50/50 dark:bg-purple-950/20">
          <p className="text-sm text-[var(--text-h)]">🎯 Login to track your progress and mark topics complete</p>
          <Link
            to="/login"
            className="flex-shrink-0 px-4 py-1.5 rounded-lg bg-[var(--brand)] text-white text-xs font-semibold hover:bg-[var(--brand-dark)] transition-colors"
          >
            Login
          </Link>
        </div>
      )}

      {/* Level-grouped topic list */}
      <div className="space-y-8">
        {grouped.map(({ level, topics }) => (
          <section key={level}>
            {/* Level heading */}
            <div className="flex items-center gap-3 mb-3">
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${LEVEL_COLOR[level]}`}>
                {LEVEL_LABEL[level]}
              </span>
              <span className="text-xs text-[var(--text)]">{topics.length} topics</span>
              {isAuthenticated && (
                <span className="text-xs text-[var(--text)]">
                  · {topics.filter(t => t.completed).length} done
                </span>
              )}
            </div>

            {/* Topics */}
            <div className="space-y-2.5">
              {topics.map((topic, idx) => {
                const isToggling = toggling.has(topic.id)
                return (
                  <div
                    key={topic.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 ${
                      topic.completed
                        ? 'border-green-200 bg-green-50/60 dark:border-green-900/40 dark:bg-green-950/20'
                        : 'border-[var(--border)] bg-[var(--bg)] hover:border-[var(--brand)]/50 hover:shadow-sm'
                    }`}
                  >
                    {/* Step number / check button */}
                    <button
                      type="button"
                      disabled={!isAuthenticated || isToggling}
                      onClick={() => toggleTopic(topic.id, topic.completed)}
                      aria-label={topic.completed ? `Mark "${topic.title}" incomplete` : `Mark "${topic.title}" complete`}
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isToggling
                          ? 'bg-[var(--border)] text-[var(--text)]'
                          : topic.completed
                            ? 'bg-green-500 text-white hover:bg-green-600 cursor-pointer'
                            : isAuthenticated
                              ? 'bg-[var(--bg-muted)] text-[var(--text)] border border-[var(--border)] hover:border-[var(--brand)] hover:text-[var(--brand)] cursor-pointer'
                              : 'bg-[var(--bg-muted)] text-[var(--text)] border border-[var(--border)] cursor-not-allowed opacity-60'
                      }`}
                    >
                      {isToggling ? (
                        <span className="w-3 h-3 border-2 border-[var(--text)] border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                      ) : topic.completed ? (
                        '✓'
                      ) : (
                        idx + 1
                      )}
                    </button>

                    {/* Title + meta */}
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-sm font-semibold truncate ${
                        topic.completed ? 'text-green-700 dark:text-green-400 line-through decoration-green-500/50' : 'text-[var(--text-h)]'
                      }`}>
                        {topic.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-[var(--text)]">⏱️ ~{topic.estimated_minutes} min</span>
                      </div>
                    </div>

                    {/* Difficulty badge */}
                    <Badge variant={DIFF_VARIANT[topic.difficulty]}>
                      {topic.difficulty}
                    </Badge>

                    {/* Practice link */}
                    <Link
                      to={`/practice?topic=${roadmap.slug}`}
                      className="flex-shrink-0 text-xs font-semibold text-[var(--brand)] hover:underline hidden sm:block"
                    >
                      Practice →
                    </Link>
                  </div>
                )
              })}
            </div>
          </section>
        ))}
      </div>

      {/* Completion banner */}
      {isAuthenticated && roadmap.progress_pct === 100 && (
        <div className="mt-10 flex flex-col items-center gap-3 p-8 rounded-2xl border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-950/30 text-center">
          <span className="text-5xl" aria-hidden="true">🎉</span>
          <h2 className="text-xl font-extrabold text-green-800 dark:text-green-300">
            Roadmap Complete!
          </h2>
          <p className="text-sm text-green-700 dark:text-green-400">
            You've completed the <strong>{roadmap.title}</strong> roadmap. Time to move to the next one!
          </p>
          <Link
            to="/roadmaps"
            className="mt-2 px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold text-sm transition-colors"
          >
            Explore more roadmaps →
          </Link>
        </div>
      )}

    </div>
  )
}
