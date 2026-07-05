import api from './api'
import type { LeaderboardEntry, ApiResult } from '../types'

function extractError(err: unknown): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const d = (err as { response: { data: Record<string, unknown> } }).response?.data
    if (typeof d?.message === 'string') return d.message
  }
  return err instanceof Error ? err.message : 'An error occurred.'
}

export async function fetchLeaderboard(period: 'weekly'|'monthly'|'all-time' = 'weekly', page = 1): ApiResult<{ leaderboard: LeaderboardEntry[]; total: number; period: string }> {
  try {
    const { data } = await api.get<{ data: { leaderboard: LeaderboardEntry[]; total: number; period: string } }>(`/leaderboard/?period=${period}&page=${page}`)
    return { data: data.data, error: null }
  } catch (e) { return { data: null, error: extractError(e) } }
}
