import api from './api'
import type { Problem, ProblemListResponse, ApiResult } from '../types'

function extractError(err: unknown): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const d = (err as { response: { data: Record<string, unknown> } }).response?.data
    if (typeof d?.message === 'string') return d.message
  }
  return err instanceof Error ? err.message : 'An error occurred.'
}

export interface ProblemFilters {
  topic?: string; difficulty?: string; search?: string; page?: number; per_page?: number; company?: string
}

export async function fetchProblems(filters: ProblemFilters = {}): ApiResult<ProblemListResponse> {
  try {
    const params = new URLSearchParams()
    if (filters.topic)      params.set('topic', filters.topic)
    if (filters.difficulty) params.set('difficulty', filters.difficulty)
    if (filters.search)     params.set('search', filters.search)
    if (filters.company)    params.set('company', filters.company)
    if (filters.page)       params.set('page', String(filters.page))
    if (filters.per_page)   params.set('per_page', String(filters.per_page))
    const { data } = await api.get<{ data: ProblemListResponse }>(`/practice/?${params}`)
    return { data: data.data, error: null }
  } catch (e) { return { data: null, error: extractError(e) } }
}

export async function fetchProblem(id: number): ApiResult<Problem> {
  try {
    const { data } = await api.get<{ data: { problem: Problem } }>(`/practice/${id}`)
    return { data: data.data.problem, error: null }
  } catch (e) { return { data: null, error: extractError(e) } }
}

export async function toggleSolved(id: number, solved: boolean): ApiResult<null> {
  try {
    if (solved) await api.delete(`/practice/${id}/solve`)
    else        await api.post(`/practice/${id}/solve`)
    return { data: null, error: null }
  } catch (e) { return { data: null, error: extractError(e) } }
}

export async function toggleBookmark(id: number, bookmarked: boolean): ApiResult<null> {
  try {
    if (bookmarked) await api.delete(`/practice/${id}/bookmark`)
    else            await api.post(`/practice/${id}/bookmark`)
    return { data: null, error: null }
  } catch (e) { return { data: null, error: extractError(e) } }
}
