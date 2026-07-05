import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../../components/ui/PageHeader'
import Badge from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'
import { useCommunity } from '../../hooks/useCommunity'
import { useAuth } from '../../context/AuthContext'
import type { PostTag } from '../../types'

const TAGS: (PostTag | 'All')[] = ['All','DSA','Placement','Resume','Aptitude','Interview','General']
const TAG_VARIANT: Record<string, 'brand'|'info'|'success'|'warning'|'neutral'> = {
  DSA:'info', Placement:'brand', Resume:'success', Aptitude:'warning', Interview:'neutral', General:'neutral',
}
const AVATAR_BG = ['bg-purple-500','bg-blue-500','bg-emerald-500','bg-orange-500','bg-pink-500','bg-cyan-500']

function Skeleton() {
  return <div className="space-y-3 animate-pulse">{[...Array(5)].map((_,i) => <div key={i} className="h-24 rounded-xl bg-[var(--border)]" />)}</div>
}

export default function CommunityPage() {
  const { isAuthenticated } = useAuth()
  const { posts, tag, loading, error, filterByTag, filterBySearch, handleToggleLike, handleCreatePost } = useCommunity()
  const [showForm, setShowForm] = useState(false)
  const [newPost, setNewPost]   = useState({ title:'', body:'', tag:'General' })
  const [search, setSearch]     = useState('')

  const submitPost = async () => {
    if (!newPost.title.trim() || !newPost.body.trim()) return
    const err = await handleCreatePost(newPost)
    if (!err) { setNewPost({ title:'', body:'', tag:'General' }); setShowForm(false) }
  }

  return (
    <>
      <PageHeader title="Community" subtitle="Ask questions, share experiences, and help fellow students.">
        {isAuthenticated && (
          <button onClick={() => setShowForm(f => !f)}
            className="px-4 py-2 rounded-lg bg-[var(--brand)] text-white text-sm font-semibold hover:bg-[var(--brand-dark)] transition-colors">
            + New Post
          </button>
        )}
      </PageHeader>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* New post form */}
        {showForm && (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-5 space-y-3">
            <h3 className="font-bold text-[var(--text-h)]">Create a Post</h3>
            <input type="text" placeholder="Post title…" value={newPost.title}
              onChange={e => setNewPost(p => ({ ...p, title: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-sm text-[var(--text-h)] placeholder:text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]" />
            <textarea rows={4} placeholder="Share your question, experience, or tip…" value={newPost.body}
              onChange={e => setNewPost(p => ({ ...p, body: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-sm text-[var(--text-h)] placeholder:text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)] resize-none" />
            <div className="flex items-center gap-3">
              <select value={newPost.tag} onChange={e => setNewPost(p => ({ ...p, tag: e.target.value }))}
                className="px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-sm text-[var(--text-h)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]">
                {TAGS.slice(1).map(t => <option key={t}>{t}</option>)}
              </select>
              <button onClick={submitPost} className="px-4 py-2 rounded-lg bg-[var(--brand)] text-white text-sm font-semibold hover:bg-[var(--brand-dark)] transition-colors">Post</button>
              <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-[var(--border)] text-sm font-semibold text-[var(--text)] hover:text-[var(--text-h)] transition-colors">Cancel</button>
            </div>
          </div>
        )}

        {/* Search + Tag filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text)]" aria-hidden="true">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input type="search" placeholder="Search posts…" value={search}
              onChange={e => { setSearch(e.target.value); filterBySearch(e.target.value) }}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-sm text-[var(--text-h)] placeholder:text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]" />
          </div>
          <div className="flex flex-wrap gap-2">
            {TAGS.map(t => (
              <button key={t} onClick={() => filterByTag(t)}
                className={`px-3 py-1 rounded-full text-sm font-semibold border transition-colors ${
                  tag === t ? 'bg-[var(--brand)] text-white border-[var(--brand)]' : 'border-[var(--border)] text-[var(--text)] hover:border-[var(--brand)] hover:text-[var(--brand)]'
                }`}>{t}</button>
            ))}
          </div>
        </div>

        {error && <div className="text-center py-12 text-[var(--text)]">{error}</div>}
        {loading && <Skeleton />}

        {!loading && !error && posts.length === 0 && (
          <EmptyState icon="💬" title="No posts yet" description="Be the first to start a discussion!" />
        )}

        {!loading && !error && posts.length > 0 && (
          <div className="space-y-3">
            {posts.map((p, i) => (
              <div key={p.id}
                className={`flex gap-4 p-5 rounded-xl border bg-[var(--bg)] hover:border-[var(--brand)] hover:shadow-sm transition-all ${
                  p.is_pinned ? 'border-purple-200 dark:border-purple-900/50' : 'border-[var(--border)]'
                }`}>
                <div className={`w-9 h-9 rounded-full ${AVATAR_BG[i % AVATAR_BG.length]} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                  {p.author.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {p.is_pinned && <span className="text-[10px] font-bold text-[var(--brand)] uppercase tracking-wide">📌 Pinned</span>}
                      <Badge variant={TAG_VARIANT[p.tag] ?? 'neutral'}>{p.tag}</Badge>
                    </div>
                    <span className="text-[10px] text-[var(--text)] flex-shrink-0">{new Date(p.created_at).toLocaleDateString()}</span>
                  </div>
                  <h3 className="font-semibold text-[var(--text-h)] text-sm mb-1">
                    <Link to={`/community/${p.id}`} className="hover:text-[var(--brand)] transition-colors">
                      {p.title}
                    </Link>
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-[var(--text)]">
                    <span>by {p.author}</span>
                    <button onClick={() => isAuthenticated && handleToggleLike(p.id)}
                      className={`flex items-center gap-1 hover:text-[var(--brand)] transition-colors ${p.liked ? 'text-[var(--brand)]' : ''}`}>
                      👍 {p.like_count}
                    </button>
                    <span>💬 {p.comment_count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
