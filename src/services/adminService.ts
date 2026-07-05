import api from './api'
import type { User, ApiResult } from '../types'

function extractError(err: unknown): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const d = (err as { response: { data: Record<string, unknown> } }).response?.data
    if (typeof d?.message === 'string') return d.message
  }
  return err instanceof Error ? err.message : 'An error occurred.'
}

export interface AdminStats {
  users:             number
  active_users:      number
  problems:          number
  companies:         number
  resources:         number
  total_completions: number
}

export async function fetchAdminDashboard(): ApiResult<AdminStats> {
  try {
    const { data } = await api.get<{ data: AdminStats }>('/admin/dashboard')
    return { data: data.data, error: null }
  } catch (e) { return { data: null, error: extractError(e) } }
}

export async function fetchAdminUsers(filters: { search?: string; page?: number } = {}): ApiResult<{ users: User[]; total: number }> {
  try {
    const params = new URLSearchParams()
    if (filters.search) params.set('search', filters.search)
    if (filters.page)   params.set('page',   String(filters.page))
    const { data } = await api.get<{ data: { users: User[]; total: number } }>(`/admin/users?${params}`)
    return { data: data.data, error: null }
  } catch (e) { return { data: null, error: extractError(e) } }
}

export async function toggleUserActive(userId: number): ApiResult<boolean> {
  try {
    const { data } = await api.patch<{ data: { is_active: boolean } }>(`/admin/users/${userId}/toggle`)
    return { data: data.data.is_active, error: null }
  } catch (e) { return { data: null, error: extractError(e) } }
}
