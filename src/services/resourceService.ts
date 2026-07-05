import api from './api'
import type { ResourceItem, ApiResult } from '../types'

function extractError(err: unknown): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const d = (err as { response: { data: Record<string, unknown> } }).response?.data
    if (typeof d?.message === 'string') return d.message
  }
  return err instanceof Error ? err.message : 'An error occurred.'
}

export async function fetchResources(filters: { type?: string; topic?: string; search?: string } = {}): ApiResult<{ resources: ResourceItem[]; topics: string[] }> {
  try {
    const params = new URLSearchParams()
    if (filters.type)   params.set('type',   filters.type)
    if (filters.topic)  params.set('topic',  filters.topic)
    if (filters.search) params.set('search', filters.search)
    const { data } = await api.get<{ data: { resources: ResourceItem[]; topics: string[] } }>(`/resources/?${params}`)
    return { data: data.data, error: null }
  } catch (e) { return { data: null, error: extractError(e) } }
}

export async function toggleBookmark(id: number, bookmarked: boolean): ApiResult<null> {
  try {
    if (bookmarked) await api.delete(`/resources/${id}/bookmark`)
    else            await api.post(`/resources/${id}/bookmark`)
    return { data: null, error: null }
  } catch (e) { return { data: null, error: extractError(e) } }
}
