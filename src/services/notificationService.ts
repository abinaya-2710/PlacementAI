import api from './api'
import type { NotificationItem, ApiResult } from '../types'

function extractError(err: unknown): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const d = (err as { response: { data: Record<string, unknown> } }).response?.data
    if (typeof d?.message === 'string') return d.message
  }
  return err instanceof Error ? err.message : 'An error occurred.'
}

export async function fetchNotifications(page = 1): ApiResult<{ notifications: NotificationItem[]; total: number; unread_count: number }> {
  try {
    const { data } = await api.get<{ data: { notifications: NotificationItem[]; total: number; unread_count: number } }>(`/notifications/?page=${page}`)
    return { data: data.data, error: null }
  } catch (e) { return { data: null, error: extractError(e) } }
}

export async function fetchUnreadCount(): ApiResult<number> {
  try {
    const { data } = await api.get<{ data: { count: number } }>('/notifications/unread-count')
    return { data: data.data.count, error: null }
  } catch (e) { return { data: null, error: extractError(e) } }
}

export async function markRead(id: number): ApiResult<null> {
  try {
    await api.post(`/notifications/${id}/read`)
    return { data: null, error: null }
  } catch (e) { return { data: null, error: extractError(e) } }
}

export async function markAllRead(): ApiResult<null> {
  try {
    await api.post('/notifications/read-all')
    return { data: null, error: null }
  } catch (e) { return { data: null, error: extractError(e) } }
}
