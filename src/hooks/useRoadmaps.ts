/**
 * hooks/useRoadmaps.ts
 * Fetches and caches the full roadmap list.
 * Re-fetches automatically when the user logs in/out (auth changes).
 */

import { useState, useEffect, useCallback } from 'react'
import { fetchRoadmaps } from '../services/roadmapService'
import { useAuth } from '../context/AuthContext'
import type { RoadmapSummary } from '../types'

interface UseRoadmapsReturn {
  roadmaps:  RoadmapSummary[]
  loading:   boolean
  error:     string | null
  refetch:   () => void
}

export function useRoadmaps(): UseRoadmapsReturn {
  const { isAuthenticated } = useAuth()
  const [roadmaps, setRoadmaps] = useState<RoadmapSummary[]>([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error: err } = await fetchRoadmaps()
    if (err) setError(err)
    else     setRoadmaps(data ?? [])
    setLoading(false)
  }, [])

  // Reload when auth state changes (logged-in users get progress data)
  useEffect(() => { load() }, [load, isAuthenticated])

  return { roadmaps, loading, error, refetch: load }
}
