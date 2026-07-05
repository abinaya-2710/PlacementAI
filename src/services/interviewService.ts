import api from './api'
import type { InterviewQuestion, InterviewExperience, ApiResult } from '../types'

function extractError(err: unknown): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const d = (err as { response: { data: Record<string, unknown> } }).response?.data
    if (typeof d?.message === 'string') return d.message
  }
  return err instanceof Error ? err.message : 'An error occurred.'
}

export async function fetchQuestions(filters: { category?: string; topic?: string; search?: string; page?: number; per_page?: number } = {}): ApiResult<{ questions: InterviewQuestion[]; total: number }> {
  try {
    const params = new URLSearchParams()
    if (filters.category) params.set('category', filters.category)
    if (filters.topic)    params.set('topic',    filters.topic)
    if (filters.search)   params.set('search',   filters.search)
    if (filters.page)     params.set('page',     String(filters.page))
    if (filters.per_page) params.set('per_page', String(filters.per_page))
    const { data } = await api.get<{ data: { questions: InterviewQuestion[]; total: number } }>(`/interview/questions?${params}`)
    return { data: data.data, error: null }
  } catch (e) { return { data: null, error: extractError(e) } }
}

export async function toggleBookmark(id: number, bookmarked: boolean): ApiResult<null> {
  try {
    if (bookmarked) await api.delete(`/interview/questions/${id}/bookmark`)
    else            await api.post(`/interview/questions/${id}/bookmark`)
    return { data: null, error: null }
  } catch (e) { return { data: null, error: extractError(e) } }
}

export async function fetchExperiences(filters: { company?: string; page?: number } = {}): ApiResult<{ experiences: InterviewExperience[]; total: number }> {
  try {
    const params = new URLSearchParams()
    if (filters.company) params.set('company', filters.company)
    if (filters.page)    params.set('page',    String(filters.page))
    const { data } = await api.get<{ data: { experiences: InterviewExperience[]; total: number } }>(`/interview/experiences?${params}`)
    return { data: data.data, error: null }
  } catch (e) { return { data: null, error: extractError(e) } }
}

export async function submitExperience(payload: { company_name: string; role: string; rounds: number; result: string; experience: string; year?: number }): ApiResult<InterviewExperience> {
  try {
    const { data } = await api.post<{ data: { experience: InterviewExperience } }>('/interview/experiences', payload)
    return { data: data.data.experience, error: null }
  } catch (e) { return { data: null, error: extractError(e) } }
}
