import api from './api'
import type { CompanyItem, ApiResult } from '../types'

function extractError(err: unknown): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const d = (err as { response: { data: Record<string, unknown> } }).response?.data
    if (typeof d?.message === 'string') return d.message
  }
  return err instanceof Error ? err.message : 'An error occurred.'
}

export async function fetchCompanies(filters: { type?: string; difficulty?: string; search?: string } = {}): ApiResult<CompanyItem[]> {
  try {
    const params = new URLSearchParams()
    if (filters.type)       params.set('type',       filters.type)
    if (filters.difficulty) params.set('difficulty', filters.difficulty)
    if (filters.search)     params.set('search',     filters.search)
    const { data } = await api.get<{ data: { companies: CompanyItem[] } }>(`/companies/?${params}`)
    return { data: data.data.companies, error: null }
  } catch (e) { return { data: null, error: extractError(e) } }
}

export async function fetchCompany(slug: string): ApiResult<CompanyItem> {
  try {
    const { data } = await api.get<{ data: { company: CompanyItem } }>(`/companies/${slug}`)
    return { data: data.data.company, error: null }
  } catch (e) { return { data: null, error: extractError(e) } }
}
