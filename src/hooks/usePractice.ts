import { useState, useEffect, useCallback } from 'react'
import { fetchProblems, toggleSolved, toggleBookmark, type ProblemFilters } from '../services/practiceService'
import type { Problem } from '../types'

export function usePractice(initialFilters: ProblemFilters = {}) {
  const [problems,   setProblems]   = useState<Problem[]>([])
  const [topics,     setTopics]     = useState<string[]>([])
  const [total,      setTotal]      = useState(0)
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState<string | null>(null)
  const [filters,    setFilters]    = useState<ProblemFilters>(initialFilters)

  const load = useCallback(async (f: ProblemFilters = filters) => {
    setLoading(true); setError(null)
    const { data, error: err } = await fetchProblems(f)
    if (err || !data) { setError(err ?? 'Fetch failed'); setLoading(false); return }
    setProblems(data.problems)
    setTopics(data.topics)
    setTotal(data.total)
    setLoading(false)
  }, [filters])

  useEffect(() => { load() }, []) // eslint-disable-line

  const applyFilters = useCallback((f: ProblemFilters) => {
    setFilters(f); load(f)
  }, [load])

  const handleToggleSolved = useCallback(async (id: number, solved: boolean) => {
    setProblems(prev => prev.map(p => p.id === id ? { ...p, solved: !solved } : p))
    const { error: err } = await toggleSolved(id, solved)
    if (err) setProblems(prev => prev.map(p => p.id === id ? { ...p, solved } : p))
  }, [])

  const handleToggleBookmark = useCallback(async (id: number, bookmarked: boolean) => {
    setProblems(prev => prev.map(p => p.id === id ? { ...p, bookmarked: !bookmarked } : p))
    const { error: err } = await toggleBookmark(id, bookmarked)
    if (err) setProblems(prev => prev.map(p => p.id === id ? { ...p, bookmarked } : p))
  }, [])

  return { problems, topics, total, loading, error, filters, applyFilters, handleToggleSolved, handleToggleBookmark, refetch: load }
}
