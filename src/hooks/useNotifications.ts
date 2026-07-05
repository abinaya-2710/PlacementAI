import { useState, useEffect, useCallback } from 'react'
import { fetchNotifications, markRead, markAllRead } from '../services/notificationService'
import type { NotificationItem } from '../types'

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [unreadCount,   setUnreadCount]   = useState(0)
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true); setError(null)
    const { data, error: err } = await fetchNotifications()
    if (err || !data) { setError(err ?? 'Fetch failed'); setLoading(false); return }
    setNotifications(data.notifications)
    setUnreadCount(data.unread_count)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const handleMarkRead = useCallback(async (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
    setUnreadCount(prev => Math.max(0, prev - 1))
    await markRead(id)
  }, [])

  const handleMarkAllRead = useCallback(async () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    setUnreadCount(0)
    await markAllRead()
  }, [])

  return { notifications, unreadCount, loading, error, handleMarkRead, handleMarkAllRead, refetch: load }
}
