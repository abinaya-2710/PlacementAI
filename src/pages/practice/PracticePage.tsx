import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../../components/ui/PageHeader'
import Badge from '../../components/ui/Badge'
import { usePractice } from '../../hooks/usePractice'
import { useAuth } from '../../context/AuthContext'
import type { ProblemDifficulty } from '../../types'

const DIFF_VARIANT: Record<ProblemDifficulty, 'success'|'warning'|'error'> = {
  Easy: 'success', Medium: 'warning', Hard: 'error',
}
const DIFFS    = ['All', 'Easy', 'Medium', 'Hard']
const STATUSES = ['All', 'Solved', 'Unsolved', 'Bookmarked']

function Skeleton() {
  return (
    <div className="animate-pulse space-y-3">
      {[...Array(8)].map((_,i) => <div key={i} className="h-12 rounded-lg bg-[var(--border)]" />)}
    </div>
  )
}

export default function PracticePage() {
  const { isAuthenticated } = useAuth()
  const { problems, topics, total, loading, error, applyFilters, handleToggleSolved, handleToggleBookmark, refetch } = usePractice({ per_page: 40 })
  const [search,  setSearch]  = useState('')
  const [diff,    setDiff]    = useState('All')
  const [topic,   setTopic]   = useState('All')
  const [status,  setStatus]  = useState('All')

  const applyAll = (overrides: { search?: string; diff?: string; topic?: string; status?: string }) => {
    const s = overrides.search ?? search
    const d = overrides.diff   ?? diff
    const t = overrides.topic  ?? topic
    applyFilters({
      search: s || undefined,
      difficulty: d !== 'All' ? d : undefined,
      topic: t !== 'All' ? t : undefined,
      per_page: 40,
    })
  }

  const displayed = problems.filter(p => {
    if (status === 'Solved'     && !p.solved)    return false
    if (status === 'Unsolved'   &&  p.solved)    return false
    if (status === 'Bookmarked' && !p.bookmarked)return false
    return true
  })

  return (
    <>
      <PageHeader title="Coding Practice" subtitle="Solve DSA problems filtered by topic, difficulty, and status.">
        <span className="text-sm text-[var(--text)]">
          <span className="font-bold text-[var(--brand)]">{problems.filter(p => p.solved).length}</span> / {total} solved
        </span>
      </PageHeader>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text)]" aria-hidden="true">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input type="search" placeholder="Search problems…" value={search}
              onChange={e => { setSearch(e.target.value); applyAll({ search: e.target.value }) }}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-sm text-[var(--text-h)] placeholder:text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:border-transparent" />
          </div>
          <select value={topic} onChange={e => { setTopic(e.target.value); applyAll({ topic: e.target.value }) }}
            className="px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-sm text-[var(--text-h)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]">
            <option value="All">All Topics</option>
            {topics.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={diff} onChange={e => { setDiff(e.target.value); applyAll({ diff: e.target.value }) }}
            className="px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-sm text-[var(--text-h)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]">
            {DIFFS.map(d => <option key={d}>{d}</option>)}
          </select>
          {isAuthenticated && (
            <select value={status} onChange={e => setStatus(e.target.value)}
              className="px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-sm text-[var(--text-h)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]">
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          )}
        </div>

        {/* Error */}
        {error && !loading && (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <span className="text-3xl" aria-hidden="true">⚠️</span>
            <p className="text-sm text-[var(--text)]">{error}</p>
            <button onClick={() => refetch()} className="px-4 py-2 rounded-lg bg-[var(--brand)] text-white text-sm font-semibold hover:bg-[var(--brand-dark)] transition-colors">Retry</button>
          </div>
        )}

        {loading && <Skeleton />}

        {/* Table */}
        {!loading && !error && (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[var(--bg-muted)] border-b border-[var(--border)]">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-[var(--text)] w-8">#</th>
                    <th className="text-left px-4 py-3 font-semibold text-[var(--text)]">Title</th>
                    <th className="text-left px-4 py-3 font-semibold text-[var(--text)] hidden sm:table-cell">Topic</th>
                    <th className="text-left px-4 py-3 font-semibold text-[var(--text)]">Difficulty</th>
                    <th className="text-left px-4 py-3 font-semibold text-[var(--text)] hidden md:table-cell">Companies</th>
                    {isAuthenticated && <th className="text-left px-4 py-3 font-semibold text-[var(--text)]">Status</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {displayed.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-12 text-[var(--text)]">No problems match your filters.</td></tr>
                  ) : displayed.map((p, i) => (
                    <tr key={p.id} className="hover:bg-[var(--bg-muted)] transition-colors group">
                      <td className="px-4 py-3 text-[var(--text)]">{i + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Link to={`/practice/${p.id}`} className="font-medium text-[var(--text-h)] group-hover:text-[var(--brand)] transition-colors">
                            {p.title}
                          </Link>
                          {p.bookmarked && <span className="text-yellow-500 text-xs" aria-label="Bookmarked">🔖</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell"><Badge variant="neutral">{p.topic}</Badge></td>
                      <td className="px-4 py-3"><Badge variant={DIFF_VARIANT[p.difficulty]}>{p.difficulty}</Badge></td>
                      <td className="px-4 py-3 hidden md:table-cell text-xs text-[var(--text)]">{p.companies || '—'}</td>
                      {isAuthenticated && (
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button onClick={() => handleToggleSolved(p.id, p.solved)}
                              className={`text-xs font-semibold px-2 py-0.5 rounded-full transition-colors ${p.solved ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-[var(--border)] text-[var(--text)] hover:bg-green-100 hover:text-green-700'}`}>
                              {p.solved ? '✅ Solved' : 'Mark Done'}
                            </button>
                            <button onClick={() => handleToggleBookmark(p.id, p.bookmarked)}
                              className="text-[var(--text)] hover:text-yellow-500 transition-colors"
                              aria-label={p.bookmarked ? 'Remove bookmark' : 'Bookmark'}>
                              {p.bookmarked ? '🔖' : '☆'}
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
