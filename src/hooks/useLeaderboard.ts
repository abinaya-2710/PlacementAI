import { useState, useEffect, useCallback } from 'react'
import { fetchLeaderboard } from '../services/leaderboardService'
import type { LeaderboardEntry } from '../types'

type Period = 'weekly' | 'monthly' | 'all-time'

export function useLeaderboard() {
  const [entries,  setEntries]  = useState<LeaderboardEntry[]>([])
  const [period,   setPeriod]   = useState<Period>('weekly')
  const [total,    setTotal]    = useState(0)
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState<string | null>(null)

  const load = useCallback(async (p: Period = period) => {
    setLoading(true); setError(null)
    const { data, error: err } = await fetchLeaderboard(p)
    if (err || !data) { setError(err ?? 'Fetch failed'); setLoading(false); return }
    setEntries(data.leaderboard)
    setTotal(data.total)
    setLoading(false)
  }, [period])

  useEffect(() => { load() }, [load])

  const changePeriod = (p: Period) => { setPeriod(p); load(p) }

  return { entries, period, total, loading, error, changePeriod, refetch: load }
}
