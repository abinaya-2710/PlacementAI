import { useState, useEffect, useCallback } from 'react'
import { fetchPosts, createPost, toggleLike } from '../services/communityService'
import type { PostItem, PostTag } from '../types'

export function useCommunity() {
  const [posts,   setPosts]   = useState<PostItem[]>([])
  const [total,   setTotal]   = useState(0)
  const [tag,     setTag]     = useState<PostTag | 'All'>('All')
  const [search,  setSearch]  = useState('')
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)

  const load = useCallback(async (t: PostTag | 'All' = tag, s: string = search) => {
    setLoading(true); setError(null)
    const { data, error: err } = await fetchPosts({ tag: t === 'All' ? undefined : t, search: s || undefined })
    if (err || !data) { setError(err ?? 'Fetch failed'); setLoading(false); return }
    setPosts(data.posts); setTotal(data.total); setLoading(false)
  }, [tag, search])

  useEffect(() => { load() }, []) // eslint-disable-line

  const filterByTag = (t: PostTag | 'All') => { setTag(t); load(t, search) }
  const filterBySearch = (s: string) => { setSearch(s); load(tag, s) }

  const handleToggleLike = useCallback(async (id: number) => {
    setPosts(prev => prev.map(p => p.id === id
      ? { ...p, liked: !p.liked, like_count: p.liked ? p.like_count - 1 : p.like_count + 1 }
      : p))
    await toggleLike(id)
  }, [])

  const handleCreatePost = useCallback(async (payload: { title: string; body: string; tag: string }) => {
    const { data, error: err } = await createPost(payload)
    if (err || !data) return err ?? 'Failed to create post'
    setPosts(prev => [data, ...prev])
    return null
  }, [])

  return { posts, total, tag, search, loading, error, filterByTag, filterBySearch, handleToggleLike, handleCreatePost, refetch: load }
}
