import api from './api'
import type { AptitudeQuestion, AptitudeStats, ApiResult } from '../types'

function extractError(err: unknown): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const d = (err as { response: { data: Record<string, unknown> } }).response?.data
    if (typeof d?.message === 'string') return d.message
  }
  return err instanceof Error ? err.message : 'An error occurred.'
}

export interface AptitudeFilters {
  category?: string; topic?: string; difficulty?: string; limit?: number; page?: number
}

export async function fetchAptitudeQuestions(filters: AptitudeFilters = {}): ApiResult<{ questions: AptitudeQuestion[]; total: number; topics: string[] }> {
  try {
    const params = new URLSearchParams()
    if (filters.category)   params.set('category',   filters.category)
    if (filters.topic)      params.set('topic',      filters.topic)
    if (filters.difficulty) params.set('difficulty', filters.difficulty)
    if (filters.limit)      params.set('limit',      String(filters.limit))
    if (filters.page)       params.set('page',       String(filters.page))
    const { data } = await api.get<{ data: { questions: AptitudeQuestion[]; total: number; topics: string[] } }>(`/aptitude/?${params}`)
    return { data: data.data, error: null }
  } catch (e) { return { data: null, error: extractError(e) } }
}

export async function fetchAptitudeQuestion(id: number): ApiResult<AptitudeQuestion> {
  try {
    const { data } = await api.get<{ data: { question: AptitudeQuestion } }>(`/aptitude/${id}`)
    return { data: data.data.question, error: null }
  } catch (e) { return { data: null, error: extractError(e) } }
}

export async function submitAttempt(id: number, selected: string): ApiResult<{ correct: boolean; answer: string; explanation: string }> {
  try {
    const { data } = await api.post<{ data: { correct: boolean; answer: string; explanation: string } }>(`/aptitude/${id}/attempt`, { selected })
    return { data: data.data, error: null }
  } catch (e) { return { data: null, error: extractError(e) } }
}

export async function fetchAptitudeStats(): ApiResult<AptitudeStats> {
  try {
    const { data } = await api.get<{ data: AptitudeStats }>('/aptitude/stats')
    return { data: data.data, error: null }
  } catch (e) { return { data: null, error: extractError(e) } }
}
