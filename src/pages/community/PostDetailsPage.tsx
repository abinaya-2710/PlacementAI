import { useState, useEffect, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Badge from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'
import { fetchPost, addComment, toggleLike } from '../../services/communityService'
import { useAuth } from '../../context/AuthContext'
import type { PostItem } from '../../types'

const TAG_VARIANT: Record<string, 'brand' | 'info' | 'success' | 'warning' | 'neutral'> = {
  DSA: 'info',
  Placement: 'brand',
  Resume: 'success',
  Aptitude: 'warning',
  Interview: 'neutral',
  General: 'neutral',
}

const AVATAR_BG = ['bg-purple-500', 'bg-blue-500', 'bg-emerald-500', 'bg-orange-500', 'bg-pink-500', 'bg-cyan-500']

function Skeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse space-y-6">
      <div className="h-6 w-32 bg-[var(--border)] rounded" />
      <div className="h-44 bg-[var(--border)] rounded-xl" />
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 rounded-xl bg-[var(--border)]" />
        ))}
      </div>
    </div>
  )
}

interface EnrichedComment {
  id: number
  post_id: number
  user_id: number
  body: string
  created_at: string
  author?: string
}

export default function PostDetailsPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { isAuthenticated } = useAuth()
  const postId = Number(id)

  const [post, setPost] = useState<PostItem | null>(null)
  const [comments, setComments] = useState<EnrichedComment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Write comment state
  const [newComment, setNewComment] = useState('')
  const [posting, setPosting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error: err } = await fetchPost(postId)
    if (err) {
      setError(err)
    } else if (data) {
      setPost(data)
      setComments((data.comments || []) as EnrichedComment[])
    }
    setLoading(false)
  }, [postId])

  useEffect(() => {
    load()
  }, [load])

  const handleLike = async () => {
    if (!post || !isAuthenticated) {
      alert('Please login to like posts.')
      return
    }
    const nextLiked = !post.liked
    const nextCount = nextLiked ? post.like_count + 1 : post.like_count - 1
    setPost(prev => prev ? { ...prev, liked: nextLiked, like_count: nextCount } : null)
    await toggleLike(post.id)
  }

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !post) return

    setPosting(true)
    const { data, error: err } = await addComment(post.id, newComment.trim())
    setPosting(false)

    if (err) {
      alert(err)
    } else if (data) {
      setComments(prev => [...prev, data as EnrichedComment])
      setPost(prev => prev ? { ...prev, comment_count: prev.comment_count + 1 } : null)
      setNewComment('')
    }
  }

  if (loading) return <Skeleton />

  if (error || !post) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center px-4">
        <span className="text-4xl" aria-hidden="true">⚠️</span>
        <p className="font-semibold text-[var(--text-h)]">Post not found</p>
        <p className="text-sm text-[var(--text)]">{error || 'Data empty'}</p>
        <div className="flex gap-3">
          <Link to="/community" className="px-4 py-2 rounded-lg border border-[var(--border)] text-sm font-semibold text-[var(--text-h)]">
            ← Back to Forum
          </Link>
          <button onClick={load} className="px-4 py-2 rounded-lg bg-[var(--brand)] text-white text-sm font-semibold hover:bg-[var(--brand-dark)] transition-colors">
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Back Link & Breadcrumb */}
        <div>
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--brand)] hover:underline mb-3 cursor-pointer bg-transparent border-none p-0">
            &larr; Go Back
          </button>
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[var(--text)]">
            <Link to="/community" className="hover:text-[var(--brand)]">Community Forum</Link>
            <span aria-hidden="true">/</span>
            <span className="text-[var(--text-h)] font-medium truncate max-w-[200px]">{post.title}</span>
          </nav>
        </div>

        {/* Full Post Card */}
        <article className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-6 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold">
                {post.author.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--text-h)]">{post.author}</p>
                <p className="text-[10px] text-[var(--text)]">{new Date(post.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {post.is_pinned && <Badge variant="brand">Pinned</Badge>}
              <Badge variant={TAG_VARIANT[post.tag] ?? 'neutral'}>{post.tag}</Badge>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-extrabold text-[var(--text-h)]">{post.title}</h1>
            <p className="text-sm text-[var(--text-h)] leading-relaxed whitespace-pre-wrap">{post.body}</p>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-[var(--border)] text-xs text-[var(--text)]">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 font-bold transition-colors cursor-pointer ${
                post.liked ? 'text-[var(--brand)]' : 'hover:text-[var(--brand)]'
              }`}
            >
              👍 {post.liked ? 'Liked' : 'Like'} ({post.like_count})
            </button>
            <span>💬 {post.comment_count} comment{post.comment_count !== 1 ? 's' : ''}</span>
          </div>
        </article>

        {/* Discussion comments Section */}
        <section className="space-y-4">
          <h2 className="text-md font-bold text-[var(--text-h)]">Discussion</h2>

          {/* Comments List */}
          <div className="space-y-3">
            {comments.length === 0 ? (
              <EmptyState icon="💬" title="No replies yet" description="Start the conversation by posting a reply below." />
            ) : (
              comments.map((comment, idx) => {
                const cAuthor = comment.author || 'Student'
                const cInitials = cAuthor.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
                return (
                  <div key={comment.id} className="flex gap-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--bg)]">
                    <div className={`w-8 h-8 rounded-full ${AVATAR_BG[idx % AVATAR_BG.length]} flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0`}>
                      {cInitials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline gap-2 mb-1">
                        <span className="text-xs font-semibold text-[var(--text-h)]">{cAuthor}</span>
                        <span className="text-[10px] text-[var(--text)]">{new Date(comment.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-[var(--text-h)] leading-relaxed whitespace-pre-wrap">{comment.body}</p>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Add Comment Form */}
          {isAuthenticated ? (
            <form onSubmit={handlePostComment} className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4 space-y-3">
              <label htmlFor="reply" className="block text-xs font-semibold text-[var(--text-h)]">Post a reply</label>
              <textarea
                id="reply"
                rows={3}
                placeholder="Share your advice or ask a follow-up question..."
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-xs text-[var(--text-h)] placeholder:text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)] resize-none"
              />
              <button
                type="submit"
                disabled={posting || !newComment.trim()}
                className="px-4 py-2 rounded-lg bg-[var(--brand)] hover:bg-[var(--brand-dark)] text-white text-xs font-bold disabled:opacity-50 cursor-pointer transition-colors"
              >
                {posting ? 'Posting...' : 'Post Reply'}
              </button>
            </form>
          ) : (
            <div className="p-4 rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg-muted)] text-center text-xs">
              🔒 <Link to="/login" className="text-[var(--brand)] hover:underline font-bold">Login</Link> to join the discussion and post replies.
            </div>
          )}
        </section>
      </div>
    </>
  )
}
