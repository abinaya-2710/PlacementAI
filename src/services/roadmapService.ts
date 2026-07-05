/**
 * services/roadmapService.ts — All roadmap API calls.
 * All functions return { data, error } — callers never need try/catch.
 */

import api from './api'
import type {
  RoadmapSummary,
  RoadmapDetail,
  RoadmapProgress,
  ApiResult,
} from '../types'

// ── Helper ────────────────────────────────────────────────────────────────────

function extractError(err: unknown): string {
  if (
    err &&
    typeof err === 'object' &&
    'response' in err &&
    err.response &&
    typeof err.response === 'object' &&
    'data' in err.response
  ) {
    const d = (err.response as { data: Record<string, unknown> }).data
    if (typeof d?.message === 'string') return d.message
  }
  if (err instanceof Error) return err.message
  return 'An unexpected error occurred.'
}

// ── GET /api/roadmaps/ ────────────────────────────────────────────────────────

export async function fetchRoadmaps(): ApiResult<RoadmapSummary[]> {
  try {
    const { data } = await api.get<{
      success: boolean
      data: { roadmaps: RoadmapSummary[]; count: number }
    }>('/roadmaps/')
    return { data: data.data.roadmaps, error: null }
  } catch (err) {
    return { data: null, error: extractError(err) }
  }
}

// ── GET /api/roadmaps/:slug ───────────────────────────────────────────────────

export async function fetchRoadmapDetail(slug: string): ApiResult<RoadmapDetail> {
  try {
    const { data } = await api.get<{
      success: boolean
      data: { roadmap: RoadmapDetail }
    }>(`/roadmaps/${slug}`)
    return { data: data.data.roadmap, error: null }
  } catch (err) {
    return { data: null, error: extractError(err) }
  }
}

// ── GET /api/roadmaps/:slug/progress ─────────────────────────────────────────

export async function fetchRoadmapProgress(slug: string): ApiResult<RoadmapProgress> {
  try {
    const { data } = await api.get<{
      success: boolean
      data: { progress: RoadmapProgress }
    }>(`/roadmaps/${slug}/progress`)
    return { data: data.data.progress, error: null }
  } catch (err) {
    return { data: null, error: extractError(err) }
  }
}

// ── POST /api/roadmaps/topics/:id/complete ───────────────────────────────────

export async function markTopicComplete(
  topicId: number,
): ApiResult<{ topic_id: number; completed: boolean; already_done: boolean }> {
  try {
    const { data } = await api.post<{
      success: boolean
      data: { topic_id: number; completed: boolean; already_done: boolean }
    }>(`/roadmaps/topics/${topicId}/complete`)
    return { data: data.data, error: null }
  } catch (err) {
    return { data: null, error: extractError(err) }
  }
}

// ── DELETE /api/roadmaps/topics/:id/complete ─────────────────────────────────

export async function unmarkTopicComplete(topicId: number): ApiResult<null> {
  try {
    await api.delete(`/roadmaps/topics/${topicId}/complete`)
    return { data: null, error: null }
  } catch (err) {
    return { data: null, error: extractError(err) }
  }
}
