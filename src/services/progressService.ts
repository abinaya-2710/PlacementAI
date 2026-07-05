import api from './api'
import type { ProgressSummary, ActivityItem, RoadmapProgressItem, ApiResult } from '../types'

function extractError(err: unknown): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const d = (err as { response: { data: Record<string, unknown> } }).response?.data
    if (typeof d?.message === 'string') return d.message
  }
  return err instanceof Error ? err.message : 'An error occurred.'
}

export async function fetchProgressSummary(): ApiResult<ProgressSummary> {
  try {
    const { data } = await api.get<{ data: ProgressSummary }>('/progress/summary')
    return { data: data.data, error: null }
  } catch (e) { return { data: null, error: extractError(e) } }
}

export async function fetchActivityLog(limit = 20): ApiResult<ActivityItem[]> {
  try {
    const { data } = await api.get<{ data: { activity: ActivityItem[] } }>(`/progress/activity?limit=${limit}`)
    return { data: data.data.activity, error: null }
  } catch (e) { return { data: null, error: extractError(e) } }
}

export async function fetchHeatmap(weeks = 16): ApiResult<number[][]> {
  try {
    const { data } = await api.get<{ data: { heatmap: number[][] } }>(`/progress/heatmap?weeks=${weeks}`)
    return { data: data.data.heatmap, error: null }
  } catch (e) { return { data: null, error: extractError(e) } }
}

export async function fetchRoadmapProgressList(): ApiResult<RoadmapProgressItem[]> {
  try {
    const { data } = await api.get<{ data: { roadmaps: RoadmapProgressItem[] } }>('/progress/roadmaps')
    return { data: data.data.roadmaps, error: null }
  } catch (e) { return { data: null, error: extractError(e) } }
}
