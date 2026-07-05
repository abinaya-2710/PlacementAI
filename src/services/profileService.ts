import api from './api'
import type { User, UserProfileData, ProfileStats, ApiResult } from '../types'

function extractError(err: unknown): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const d = (err as { response: { data: Record<string, unknown> } }).response?.data
    if (typeof d?.message === 'string') return d.message
  }
  return err instanceof Error ? err.message : 'An error occurred.'
}

export interface FullProfile { user: User; profile: UserProfileData; stats: ProfileStats }

export async function fetchProfile(): ApiResult<FullProfile> {
  try {
    const { data } = await api.get<{ data: FullProfile }>('/profile/')
    return { data: data.data, error: null }
  } catch (e) { return { data: null, error: extractError(e) } }
}

export async function updateProfile(payload: Partial<UserProfileData & { full_name: string }>): ApiResult<FullProfile> {
  try {
    const { data } = await api.patch<{ data: { user: User; profile: UserProfileData } }>('/profile/', payload)
    return { data: data.data as unknown as FullProfile, error: null }
  } catch (e) { return { data: null, error: extractError(e) } }
}
