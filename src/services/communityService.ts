import api from './api'
import type { PostItem, CommentItem, ApiResult } from '../types'

function extractError(err: unknown): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const d = (err as { response: { data: Record<string, unknown> } }).response?.data
    if (typeof d?.message === 'string') return d.message
  }
  return err instanceof Error ? err.message : 'An error occurred.'
}

export async function fetchPosts(filters: { tag?: string; search?: string; page?: number } = {}): ApiResult<{ posts: PostItem[]; total: number }> {
  try {
    const params = new URLSearchParams()
    if (filters.tag)    params.set('tag',    filters.tag)
    if (filters.search) params.set('search', filters.search)
    if (filters.page)   params.set('page',   String(filters.page))
    const { data } = await api.get<{ data: { posts: PostItem[]; total: number } }>(`/community/posts?${params}`)
    return { data: data.data, error: null }
  } catch (e) { return { data: null, error: extractError(e) } }
}

export async function fetchPost(id: number): ApiResult<PostItem> {
  try {
    const { data } = await api.get<{ data: { post: PostItem } }>(`/community/posts/${id}`)
    return { data: data.data.post, error: null }
  } catch (e) { return { data: null, error: extractError(e) } }
}

export async function createPost(payload: { title: string; body: string; tag: string }): ApiResult<PostItem> {
  try {
    const { data } = await api.post<{ data: { post: PostItem } }>('/community/posts', payload)
    return { data: data.data.post, error: null }
  } catch (e) { return { data: null, error: extractError(e) } }
}

export async function toggleLike(id: number): ApiResult<null> {
  try {
    await api.post(`/community/posts/${id}/like`)
    return { data: null, error: null }
  } catch (e) { return { data: null, error: extractError(e) } }
}

export async function addComment(postId: number, body: string): ApiResult<CommentItem> {
  try {
    const { data } = await api.post<{ data: { comment: CommentItem } }>(`/community/posts/${postId}/comments`, { body })
    return { data: data.data.comment, error: null }
  } catch (e) { return { data: null, error: extractError(e) } }
}
