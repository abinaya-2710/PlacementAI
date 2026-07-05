/**
 * hooks/useRoadmapDetail.ts
 * Fetches one roadmap with topics + user progress.
 * Exposes toggleTopic() to mark/unmark a topic complete optimistically.
 */

import { useState, useEffect, useCallback } from 'react'
import {
  fetchRoadmapDetail,
  markTopicComplete,
  unmarkTopicComplete,
} from '../services/roadmapService'
import { useAuth } from '../context/AuthContext'
import type { RoadmapDetail } from '../types'

interface UseRoadmapDetailReturn {
  roadmap:     RoadmapDetail | null
  loading:     boolean
  error:       string | null
  toggling:    Set<number>          // topic IDs currently being toggled
  toggleTopic: (topicId: number, currentlyDone: boolean) => Promise<void>
  refetch:     () => void
}

export function useRoadmapDetail(slug: string | undefined): UseRoadmapDetailReturn {
  const { isAuthenticated } = useAuth()
  const [roadmap,  setRoadmap]  = useState<RoadmapDetail | null>(null)
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState<string | null>(null)
  const [toggling, setToggling] = useState<Set<number>>(new Set())

  const load = useCallback(async () => {
    if (!slug) return
    setLoading(true)
    setError(null)
    const { data, error: err } = await fetchRoadmapDetail(slug)
    if (err) setError(err)
    else     setRoadmap(data)
    setLoading(false)
  }, [slug])

  useEffect(() => { load() }, [load, isAuthenticated])

  // Optimistic toggle: flip UI immediately, revert on failure
  const toggleTopic = useCallback(
    async (topicId: number, currentlyDone: boolean) => {
      if (!isAuthenticated) return

      // Optimistic update
      setRoadmap(prev => {
        if (!prev) return prev
        const topics = prev.topics.map(t =>
          t.id === topicId ? { ...t, completed: !currentlyDone } : t
        )
        const completedCount = topics.filter(t => t.completed).length
        return {
          ...prev,
          topics,
          completed_count: completedCount,
          progress_pct: Math.round((completedCount / topics.length) * 100),
        }
      })

      setToggling(prev => new Set(prev).add(topicId))

      let err: string | null
      if (currentlyDone) {
        const res = await unmarkTopicComplete(topicId)
        err = res.error
      } else {
        const res = await markTopicComplete(topicId)
        err = res.error
      }

      setToggling(prev => {
        const next = new Set(prev)
        next.delete(topicId)
        return next
      })

      // If API failed, revert optimistic change
      if (err) {
        setRoadmap(prev => {
          if (!prev) return prev
          const topics = prev.topics.map(t =>
            t.id === topicId ? { ...t, completed: currentlyDone } : t
          )
          const completedCount = topics.filter(t => t.completed).length
          return {
            ...prev,
            topics,
            completed_count: completedCount,
            progress_pct: Math.round((completedCount / topics.length) * 100),
          }
        })
      }
    },
    [isAuthenticated],
  )

  return { roadmap, loading, error, toggling, toggleTopic, refetch: load }
}
