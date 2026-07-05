import { useState, useEffect, useCallback } from 'react'
import PageHeader from '../../components/ui/PageHeader'
import Badge from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'
import { fetchResources, toggleBookmark } from '../../services/resourceService'
import { useAuth } from '../../context/AuthContext'
import type { ResourceItem, ResourceType } from '../../types'

const RESOURCE_TYPES: { key: 'all' | ResourceType; label: string }[] = [
  { key: 'all', label: 'All Resources' },
  { key: 'video', label: 'Videos' },
  { key: 'notes', label: 'Notes' },
  { key: 'cheatsheet', label: 'Cheatsheets' },
  { key: 'link', label: 'External Links' },
  { key: 'pdf', label: 'PDFs' },
]

const TYPE_ICONS: Record<ResourceType, string> = {
  video: '📺',
  notes: '📝',
  cheatsheet: '⚡',
  link: '🔗',
  pdf: '📕',
}

const TYPE_BADGE: Record<ResourceType, 'brand' | 'success' | 'info' | 'warning' | 'neutral'> = {
  video: 'brand',
  notes: 'success',
  cheatsheet: 'warning',
  link: 'info',
  pdf: 'neutral',
}

function Skeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-pulse">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-32 rounded-xl bg-[var(--border)]" />
      ))}
    </div>
  )
}

export default function ResourcesPage() {
  const { isAuthenticated } = useAuth()
  const [resources, setResources] = useState<ResourceItem[]>([])
  const [topics, setTopics] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters
  const [activeType, setActiveType] = useState<'all' | ResourceType>('all')
  const [activeTopic, setActiveTopic] = useState('All')
  const [search, setSearch] = useState('')

  // Bookmarks track state locally on frontend
  const [bookmarks, setBookmarks] = useState<Set<number>>(new Set())

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error: err } = await fetchResources({
      type: activeType === 'all' ? undefined : activeType,
      topic: activeTopic === 'All' ? undefined : activeTopic,
      search: search || undefined,
    })
    if (err) {
      setError(err)
    } else if (data) {
      setResources(data.resources)
      setTopics(data.topics)
    }
    setLoading(false)
  }, [activeType, activeTopic, search])

  useEffect(() => {
    load()
  }, [load])

  const handleToggleBookmark = async (id: number) => {
    if (!isAuthenticated) {
      alert('Please login to bookmark resources.')
      return
    }
    const isBookmarked = bookmarks.has(id)
    setBookmarks(prev => {
      const copy = new Set(prev)
      if (isBookmarked) copy.delete(id)
      else copy.add(id)
      return copy
    })
    await toggleBookmark(id, isBookmarked)
  }

  return (
    <>
      <PageHeader title="Placement Resources" subtitle="Handpicked video courses, cheatsheets, notes, and references.">
        <span className="text-sm text-[var(--text)]">
          {resources.length} resource{resources.length !== 1 ? 's' : ''} available
        </span>
      </PageHeader>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Search & Select Topic filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text)]" aria-hidden="true">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="search"
              placeholder="Search resource title or description…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-sm text-[var(--text-h)] placeholder:text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
            />
          </div>
          <select
            value={activeTopic}
            onChange={e => setActiveTopic(e.target.value)}
            className="px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-sm text-[var(--text-h)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
          >
            <option value="All">All Topics</option>
            {topics.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-[var(--border)] overflow-x-auto gap-1">
          {RESOURCE_TYPES.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveType(key)}
              className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                activeType === key
                  ? 'border-[var(--brand)] text-[var(--brand)]'
                  : 'border-transparent text-[var(--text)] hover:text-[var(--text-h)]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {error && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <span className="text-4xl" aria-hidden="true">⚠️</span>
            <p className="text-[var(--text-h)] font-semibold">Failed to load resources</p>
            <p className="text-sm text-[var(--text)]">{error}</p>
            <button onClick={load} className="px-4 py-2 rounded-lg bg-[var(--brand)] text-white text-sm font-semibold hover:bg-[var(--brand-dark)] transition-colors">Retry</button>
          </div>
        )}

        {loading && <Skeleton />}

        {!loading && !error && resources.length === 0 && (
          <EmptyState icon="📕" title="No resources found" description="Try broadening your filters or keyword query." />
        )}

        {!loading && !error && resources.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {resources.map(res => {
              const isBookmarked = bookmarks.has(res.id)
              return (
                <div
                  key={res.id}
                  className="group flex flex-col gap-3 p-5 rounded-xl border border-[var(--border)] bg-[var(--bg)] hover:border-[var(--brand)] hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl" aria-hidden="true">{TYPE_ICONS[res.type]}</span>
                      <div>
                        <Badge variant={TYPE_BADGE[res.type]}>{res.type}</Badge>
                        <span className="text-[10px] text-[var(--text)] ml-2 uppercase font-bold">{res.source}</span>
                      </div>
                    </div>
                    {isAuthenticated && (
                      <button
                        onClick={() => handleToggleBookmark(res.id)}
                        className={`text-lg transition-colors ${
                          isBookmarked ? 'text-yellow-500' : 'text-[var(--text)] hover:text-yellow-500'
                        }`}
                        aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark resource'}
                      >
                        {isBookmarked ? '★' : '☆'}
                      </button>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-bold text-sm text-[var(--text-h)] group-hover:text-[var(--brand)] transition-colors line-clamp-1">
                      <a href={res.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {res.title}
                      </a>
                    </h3>
                    <p className="text-xs text-[var(--text)] mt-1 line-clamp-2 leading-relaxed">
                      {res.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-[var(--border)] pt-3 mt-2 text-xs">
                    <span className="font-semibold text-[var(--brand)]">{res.topic}</span>
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-bold text-[var(--brand)] hover:underline"
                    >
                      Open Link ↗
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
