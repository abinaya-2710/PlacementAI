import PageHeader from '../../components/ui/PageHeader'
import Badge from '../../components/ui/Badge'
import { useNotifications } from '../../hooks/useNotifications'
import type { NotifType } from '../../types'

const TYPE_VARIANT: Record<NotifType, 'brand'|'warning'|'success'|'neutral'> = {
  streak:'warning', achievement:'success', reminder:'brand', system:'neutral',
}
const TYPE_ICON: Record<NotifType, string> = {
  streak:'🔥', achievement:'🏆', reminder:'📖', system:'🆕',
}

function Skeleton() {
  return (
    <div className="space-y-2 animate-pulse">
      {[...Array(5)].map((_,i) => <div key={i} className="h-20 rounded-xl bg-[var(--border)]" />)}
    </div>
  )
}

export default function NotificationsPage() {
  const { notifications, unreadCount, loading, error, handleMarkRead, handleMarkAllRead } = useNotifications()

  return (
    <>
      <PageHeader title="Notifications" subtitle="Stay updated with your progress, achievements, and reminders.">
        {unreadCount > 0 && (
          <button onClick={handleMarkAllRead}
            className="text-xs font-semibold text-[var(--brand)] hover:underline">
            Mark all as read
          </button>
        )}
      </PageHeader>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {unreadCount > 0 && (
          <p className="text-sm text-[var(--text)] mb-4">
            <span className="font-semibold text-[var(--text-h)]">{unreadCount} unread</span> notification{unreadCount > 1 ? 's' : ''}
          </p>
        )}

        {error && <div className="text-center py-12 text-[var(--text)]">{error}</div>}
        {loading && <Skeleton />}

        {!loading && !error && notifications.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <span className="text-4xl" aria-hidden="true">🔔</span>
            <p className="text-[var(--text-h)] font-semibold">No notifications yet</p>
            <p className="text-sm text-[var(--text)]">You'll see streak alerts, achievements, and reminders here.</p>
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-2">
            {notifications.map(n => (
              <div key={n.id}
                className={`flex gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                  n.is_read ? 'border-[var(--border)] bg-[var(--bg)]' : 'border-purple-200 dark:border-purple-900/50 bg-purple-50/50 dark:bg-purple-950/20'
                }`}
                onClick={() => !n.is_read && handleMarkRead(n.id)}
                role="button" tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && !n.is_read && handleMarkRead(n.id)}
                aria-label={`${n.is_read ? 'Read' : 'Unread'}: ${n.title}`}>
                <span className="text-2xl flex-shrink-0 mt-0.5" aria-hidden="true">{TYPE_ICON[n.type]}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-sm font-semibold text-[var(--text-h)]">{n.title}</p>
                    {!n.is_read && <span className="w-2 h-2 rounded-full bg-[var(--brand)] flex-shrink-0 mt-1.5" aria-label="Unread" />}
                  </div>
                  <p className="text-xs text-[var(--text)] leading-relaxed">{n.body}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] text-[var(--text)]">{new Date(n.created_at).toLocaleDateString()}</span>
                    <Badge variant={TYPE_VARIANT[n.type]}>{n.type}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
