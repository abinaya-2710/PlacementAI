import { Link } from 'react-router-dom'
import PageHeader from '../../components/ui/PageHeader'
import StatCard from '../../components/ui/StatCard'
import { useProgress } from '../../hooks/useProgress'

const INTENSITY = ['bg-[var(--border)]', 'bg-purple-200 dark:bg-purple-800', 'bg-purple-400 dark:bg-purple-600', 'bg-purple-600', 'bg-[var(--brand)]']
const ACTIVITY_ICONS: Record<string, string> = {
  topic_completed: '✅', topic_uncompleted: '↩️', roadmap_started: '🗺️', roadmap_completed: '🏆',
}

function Skeleton() {
  return (
    <div className="animate-pulse space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_,i) => <div key={i} className="h-20 rounded-xl bg-[var(--border)]" />)}
      </div>
      <div className="h-64 rounded-xl bg-[var(--border)]" />
    </div>
  )
}

export default function ProgressPage() {
  const { summary, heatmap, roadmaps, loading, error, refetch } = useProgress()

  if (loading) return <><PageHeader title="Progress Tracker" /><Skeleton /></>
  if (error) return (
    <><PageHeader title="Progress Tracker" />
    <div className="flex flex-col items-center gap-4 py-20 text-center px-4">
      <span className="text-4xl" aria-hidden="true">⚠️</span>
      <p className="font-semibold text-[var(--text-h)]">Failed to load progress</p>
      <p className="text-sm text-[var(--text)]">{error}</p>
      <button onClick={refetch} className="px-4 py-2 rounded-lg bg-[var(--brand)] text-white text-sm font-semibold hover:bg-[var(--brand-dark)] transition-colors">Retry</button>
    </div></>
  )

  const stats   = summary?.stats
  const streak  = summary?.streak
  const activity = summary?.recent_activity ?? []

  return (
    <>
      <PageHeader title="Progress Tracker" subtitle="Track your learning journey, streaks, and placement readiness." />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon="🔥" label="Current Streak"   value={`${streak?.current_streak ?? 0} days`} sub={`Best: ${streak?.best_streak ?? 0} days`} />
          <StatCard icon="✅" label="Topics Completed" value={String(stats?.topics_completed ?? 0)} sub={`of ${stats?.total_topics ?? 0} total`} />
          <StatCard icon="📖" label="Readiness Score"  value={`${stats?.readiness_score ?? 0}%`} sub="Overall placement readiness" />
          <StatCard icon="🏆" label="Last Active"      value={streak?.last_active ? new Date(streak.last_active).toLocaleDateString() : 'N/A'} sub="Last study date" />
        </div>

        {/* Subject progress bars */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-6">
          <h2 className="font-bold text-[var(--text-h)] mb-5">Subject-wise Progress</h2>
          {roadmaps.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-[var(--text)] mb-3">No progress yet. Start a roadmap!</p>
              <Link to="/roadmaps" className="text-sm text-[var(--brand)] hover:underline font-medium">Browse Roadmaps →</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {roadmaps.map(rm => (
                <Link key={rm.slug} to={`/roadmaps/${rm.slug}`} className="block group">
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium text-[var(--text-h)] group-hover:text-[var(--brand)] flex items-center gap-1.5">
                      <span aria-hidden="true">{rm.icon}</span>{rm.title}
                    </span>
                    <span className="text-[var(--text)]">{rm.completed_count}/{rm.topic_count} ({rm.progress_pct}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-[var(--border)]">
                    <div className="h-2 rounded-full bg-[var(--brand)] transition-all" style={{ width: `${rm.progress_pct}%` }}
                      role="progressbar" aria-valuenow={rm.progress_pct} aria-valuemin={0} aria-valuemax={100} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Heatmap */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-6">
            <h2 className="font-bold text-[var(--text-h)] mb-1">Activity Heatmap</h2>
            <p className="text-xs text-[var(--text)] mb-4">Last 16 weeks — topics completed per day</p>
            {heatmap.length === 0 ? (
              <p className="text-sm text-[var(--text)] text-center py-6">No activity data yet.</p>
            ) : (
              <>
                <div className="flex gap-1 overflow-x-auto pb-2">
                  {heatmap.map((week, wi) => (
                    <div key={wi} className="flex flex-col gap-1">
                      {week.map((val, di) => (
                        <div key={di}
                          className={`w-3 h-3 rounded-sm ${INTENSITY[val]} transition-colors`}
                          title={`${val} topic${val !== 1 ? 's' : ''}`}
                          aria-hidden="true" />
                      ))}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-1.5 mt-3 text-xs text-[var(--text)]">
                  <span>Less</span>
                  {INTENSITY.map((c, i) => <div key={i} className={`w-3 h-3 rounded-sm ${c}`} aria-hidden="true" />)}
                  <span>More</span>
                </div>
              </>
            )}
          </div>

          {/* Activity log */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-6">
            <h2 className="font-bold text-[var(--text-h)] mb-4">Recent Activity</h2>
            {activity.length === 0 ? (
              <p className="text-sm text-[var(--text)] text-center py-6">No activity yet.</p>
            ) : (
              <div className="divide-y divide-[var(--border)]">
                {activity.map(a => (
                  <div key={a.id} className="flex items-center gap-3 py-3">
                    <span className="text-base flex-shrink-0" aria-hidden="true">{ACTIVITY_ICONS[a.activity_type] ?? '📌'}</span>
                    <p className="flex-1 text-sm text-[var(--text-h)] min-w-0 truncate">{a.description}</p>
                    <span className="text-xs text-[var(--text)] flex-shrink-0">{new Date(a.created_at).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
