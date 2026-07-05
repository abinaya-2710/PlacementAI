import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useProgress } from '../../hooks/useProgress'
import StatCard from '../../components/ui/StatCard'
import Badge from '../../components/ui/Badge'

const ACTIVITY_ICONS: Record<string, string> = {
  topic_completed:   '✅',
  topic_uncompleted: '↩️',
  roadmap_started:   '🗺️',
  roadmap_completed: '🏆',
}

function Skeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-36 rounded-2xl bg-[var(--border)]" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_,i) => <div key={i} className="h-20 rounded-xl bg-[var(--border)]" />)}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user }                            = useAuth()
  const { summary, loading, error, refetch } = useProgress()

  const firstName = user?.full_name?.split(' ')[0] ?? 'there'

  if (loading) return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><Skeleton /></div>

  if (error) return (
    <div className="flex flex-col items-center gap-4 py-20 text-center px-4">
      <span className="text-4xl" aria-hidden="true">⚠️</span>
      <p className="font-semibold text-[var(--text-h)]">Failed to load dashboard</p>
      <p className="text-sm text-[var(--text)]">{error}</p>
      <button onClick={refetch} className="px-4 py-2 rounded-lg bg-[var(--brand)] text-white text-sm font-semibold hover:bg-[var(--brand-dark)] transition-colors">Retry</button>
    </div>
  )

  const stats   = summary?.stats
  const streak  = summary?.streak
  const roadmaps = (summary?.roadmap_progress ?? []).filter(r => r.completed_count > 0).slice(0, 3)
  const allRoadmaps = summary?.roadmap_progress ?? []
  const activity = summary?.recent_activity ?? []

  const readiness = stats?.readiness_score ?? 0
  const readinessBg = readiness >= 70 ? 'from-emerald-500 to-teal-600' : readiness >= 40 ? 'from-[var(--brand)] to-violet-700' : 'from-orange-500 to-red-600'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Welcome banner */}
      <div className={`rounded-2xl bg-gradient-to-br ${readinessBg} p-6 sm:p-8 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
        <div>
          <p className="text-white/70 text-sm font-medium">Good day 👋</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">Welcome back, {firstName}!</h1>
          <p className="text-white/80 text-sm mt-1">
            {streak?.current_streak ? `You're on a ${streak.current_streak}-day streak. Keep it up!` : 'Start studying today to build your streak!'}
          </p>
        </div>
        <div className="flex-shrink-0 bg-white/15 rounded-xl px-5 py-4 text-center">
          <p className="text-4xl font-extrabold">{readiness}%</p>
          <p className="text-xs text-white/80 mt-0.5">Placement Readiness</p>
          <div className="mt-2 h-1.5 rounded-full bg-white/30">
            <div className="h-1.5 rounded-full bg-white transition-all" style={{ width: `${readiness}%` }}
              role="progressbar" aria-valuenow={readiness} aria-valuemin={0} aria-valuemax={100} />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="🔥" label="Day Streak"       value={String(streak?.current_streak ?? 0)} sub={`Best: ${streak?.best_streak ?? 0} days`} />
        <StatCard icon="✅" label="Topics Completed" value={String(stats?.topics_completed ?? 0)} sub={`of ${stats?.total_topics ?? 0} total`} />
        <StatCard icon="🎯" label="Readiness Score"  value={`${readiness}%`}                sub="Overall" />
        <StatCard icon="🏆" label="Best Streak"      value={`${streak?.best_streak ?? 0}d`}  sub="All time" />
      </div>

      {/* Placement Toolkit (Quick Links) */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-5">
        <h2 className="font-bold text-[var(--text-h)] mb-4">Placement Preparation Kit</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[
            { title: 'Roadmaps', icon: '🗺️', to: '/roadmaps', desc: 'Step-by-step topics' },
            { title: 'Coding Practice', icon: '💻', to: '/practice', desc: 'Solve DSA questions' },
            { title: 'Aptitude Tests', icon: '🔢', to: '/aptitude', desc: 'Quantitative & logical' },
            { title: 'Interview Prep', icon: '🤝', to: '/interview', desc: 'Q&As and experiences' },
            { title: 'Resume Builder', icon: '📄', to: '/resume', desc: 'ATS-friendly CVs' },
            { title: 'Company Guide', icon: '🏢', to: '/companies', desc: 'Explore hiring rounds' },
            { title: 'Community Forum', icon: '💬', to: '/community', desc: 'Student discussions' },
            { title: 'Resources Library', icon: '📕', to: '/resources', desc: 'Video guides & notes' },
            ...(user?.role === 'admin' ? [{ title: 'Admin Panel', icon: '🔑', to: '/admin', desc: 'Manage users & stats' }] : [])
          ].map(tool => (
            <Link key={tool.to} to={tool.to} className="flex flex-col items-center text-center p-4 rounded-xl border border-[var(--border)] hover:border-[var(--brand)] hover:bg-[var(--bg-muted)] transition-all group">
              <span className="text-2xl mb-2 group-hover:scale-110 transition-transform" aria-hidden="true">{tool.icon}</span>
              <p className="text-xs font-bold text-[var(--text-h)] group-hover:text-[var(--brand)] transition-colors">{tool.title}</p>
              <p className="text-[10px] text-[var(--text)] mt-1 leading-snug">{tool.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Continue Learning */}
        <div className="lg:col-span-2 rounded-xl border border-[var(--border)] bg-[var(--bg)] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-[var(--text-h)]">Continue Learning</h2>
            <Link to="/roadmaps" className="text-xs text-[var(--brand)] hover:underline font-medium">View all →</Link>
          </div>
          {roadmaps.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <span className="text-3xl" aria-hidden="true">📚</span>
              <p className="text-sm text-[var(--text)]">You haven't started any roadmaps yet.</p>
              <Link to="/roadmaps" className="px-4 py-2 rounded-lg bg-[var(--brand)] text-white text-xs font-semibold hover:bg-[var(--brand-dark)] transition-colors">Browse Roadmaps</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {roadmaps.map(rm => (
                <Link key={rm.slug} to={`/roadmaps/${rm.slug}`} className="flex items-center gap-3 group">
                  <span className="text-xl flex-shrink-0" aria-hidden="true">{rm.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-[var(--text-h)] group-hover:text-[var(--brand)] truncate">{rm.title}</span>
                      <span className="text-[var(--text)] flex-shrink-0 ml-2">{rm.progress_pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[var(--border)]">
                      <div className="h-1.5 rounded-full bg-[var(--brand)] transition-all" style={{ width: `${rm.progress_pct}%` }}
                        role="progressbar" aria-valuenow={rm.progress_pct} aria-valuemin={0} aria-valuemax={100} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick stats / recommended */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-5">
          <h2 className="font-bold text-[var(--text-h)] mb-4">Your Roadmaps</h2>
          <div className="space-y-2">
            {allRoadmaps.slice(0, 5).map(rm => (
              <div key={rm.slug} className="flex items-center justify-between gap-2">
                <span className="text-xs text-[var(--text-h)] truncate">{rm.title}</span>
                <Badge variant={rm.progress_pct === 100 ? 'success' : rm.progress_pct > 0 ? 'brand' : 'neutral'}>
                  {rm.progress_pct === 100 ? 'Done' : rm.progress_pct > 0 ? `${rm.progress_pct}%` : 'New'}
                </Badge>
              </div>
            ))}
            {allRoadmaps.length > 5 && (
              <Link to="/roadmaps" className="text-xs text-[var(--brand)] hover:underline">+{allRoadmaps.length - 5} more</Link>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-[var(--text-h)]">Recent Activity</h2>
          <Link to="/progress" className="text-xs text-[var(--brand)] hover:underline font-medium">Full history →</Link>
        </div>
        {activity.length === 0 ? (
          <p className="text-sm text-[var(--text)] text-center py-6">No activity yet. Start a roadmap to begin tracking!</p>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {activity.map(a => (
              <div key={a.id} className="flex items-center gap-3 py-3">
                <span className="text-lg flex-shrink-0" aria-hidden="true">{ACTIVITY_ICONS[a.activity_type] ?? '📌'}</span>
                <p className="flex-1 text-sm text-[var(--text-h)]">{a.description}</p>
                <span className="text-xs text-[var(--text)] flex-shrink-0">
                  {new Date(a.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
