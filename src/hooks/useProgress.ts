import { useState, useEffect, useCallback } from 'react'
import { fetchProgressSummary, fetchHeatmap, fetchRoadmapProgressList } from '../services/progressService'
import type { ProgressSummary, RoadmapProgressItem } from '../types'

export function useProgress() {
  const [summary,  setSummary]  = useState<ProgressSummary | null>(null)
  const [heatmap,  setHeatmap]  = useState<number[][]>([])
  const [roadmaps, setRoadmaps] = useState<RoadmapProgressItem[]>([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true); setError(null)
    const [s, h, r] = await Promise.all([
      fetchProgressSummary(),
      fetchHeatmap(16),
      fetchRoadmapProgressList(),
    ])
    if (s.error) setError(s.error)
    else setSummary(s.data)
    if (!h.error && h.data) setHeatmap(h.data)
    if (!r.error && r.data) setRoadmaps(r.data)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  return { summary, heatmap, roadmaps, loading, error, refetch: load }
}
