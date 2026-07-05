import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../../components/ui/PageHeader'
import StatCard from '../../components/ui/StatCard'
import { useAuth } from '../../context/AuthContext'
import { fetchAdminDashboard, fetchAdminUsers, toggleUserActive, type AdminStats } from '../../services/adminService'
import type { User } from '../../types'

function Skeleton() {
  return (
    <div className="space-y-6 animate-pulse max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-20 rounded-xl bg-[var(--border)]" />
        ))}
      </div>
      <div className="h-64 rounded-xl bg-[var(--border)]" />
    </div>
  )
}

export default function AdminDashboardPage() {
  const { user: authUser } = useAuth()
  const isAdmin = authUser?.role === 'admin'

  const [stats, setStats] = useState<AdminStats | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [totalUsers, setTotalUsers] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const loadData = useCallback(async () => {
    if (!isAdmin) return
    setLoading(true)
    setError(null)

    const [statsRes, usersRes] = await Promise.all([
      fetchAdminDashboard(),
      fetchAdminUsers({ search: search || undefined, page }),
    ])

    if (statsRes.error) {
      setError(statsRes.error)
    } else if (usersRes.error) {
      setError(usersRes.error)
    } else {
      if (statsRes.data) setStats(statsRes.data)
      if (usersRes.data) {
        setUsers(usersRes.data.users)
        setTotalUsers(usersRes.data.total)
      }
    }
    setLoading(false)
  }, [isAdmin, search, page])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleToggleStatus = async (userId: number, currentActive: boolean) => {
    // Optimistic toggle
    setUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, is_active: !currentActive } : u))
    )
    const { data: nextActive, error: toggleErr } = await toggleUserActive(userId)
    if (toggleErr) {
      alert(toggleErr)
      // Rollback
      setUsers(prev =>
        prev.map(u => (u.id === userId ? { ...u, is_active: currentActive } : u))
      )
    } else if (nextActive !== null && stats) {
      // Recalculate active users count
      setStats({
        ...stats,
        active_users: nextActive ? stats.active_users + 1 : stats.active_users - 1,
      })
    }
  }

  // Check admin role
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <span className="text-5xl" aria-hidden="true">🔒</span>
        <h1 className="text-xl font-extrabold text-[var(--text-h)]">Access Denied</h1>
        <p className="text-sm text-[var(--text)]">
          You do not have administrative permissions to view this dashboard page.
        </p>
        <Link
          to="/dashboard"
          className="inline-block px-5 py-2.5 rounded-lg bg-[var(--brand)] text-white text-xs font-semibold hover:bg-[var(--brand-dark)] transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>
    )
  }

  if (loading) return <Skeleton />

  return (
    <>
      <PageHeader title="Admin Command Center" subtitle="Track user engagement, content count, and toggle user statuses." />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {error && (
          <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-400 text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon="👥" label="Total Registered" value={String(stats.users)} />
            <StatCard icon="🟢" label="Active Users" value={String(stats.active_users)} />
            <StatCard icon="💻" label="Practice Questions" value={String(stats.problems)} />
            <StatCard icon="🏆" label="Total Solved Keys" value={String(stats.total_completions)} />
          </div>
        )}

        {/* User Management table list */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="font-bold text-[var(--text-h)]">User Directory ({totalUsers})</h2>
            <div className="relative w-full sm:w-64">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text)]" aria-hidden="true">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="search"
                placeholder="Search user email..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1) }}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-xs text-[var(--text-h)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
              />
            </div>
          </div>

          <div className="rounded-lg border border-[var(--border)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[var(--bg-muted)] border-b border-[var(--border)] font-bold text-[var(--text)]">
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Full Name</th>
                    <th className="px-4 py-3">Email Address</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Joined Date</th>
                    <th className="px-4 py-3 text-right">Status / Toggle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)] text-[var(--text-h)]">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-[var(--text)]">
                        No registered users match your query.
                      </td>
                    </tr>
                  ) : (
                    users.map(u => (
                      <tr key={u.id} className="hover:bg-[var(--bg-muted)] transition-colors">
                        <td className="px-4 py-3 font-semibold">#{u.id}</td>
                        <td className="px-4 py-3 font-semibold">{u.full_name}</td>
                        <td className="px-4 py-3 text-[var(--text)]">{u.email}</td>
                        <td className="px-4 py-3 capitalize">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            u.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/30' : 'bg-gray-100 text-gray-700 dark:bg-gray-800'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[var(--text)]">
                          {new Date(u.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {u.id === authUser.id ? (
                            <span className="text-[10px] text-[var(--text)] italic pr-2">Your Profile</span>
                          ) : (
                            <button
                              onClick={() => handleToggleStatus(u.id, u.is_active)}
                              className={`px-3 py-1 rounded font-bold cursor-pointer transition-colors ${
                                u.is_active
                                  ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                                  : 'bg-green-50 text-green-600 border border-green-200 hover:bg-green-100'
                              }`}
                            >
                              {u.is_active ? 'Block Account' : 'Activate'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Simple pagination */}
          {totalUsers > 20 && (
            <div className="flex justify-between items-center pt-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1 text-xs border rounded hover:border-[var(--brand)] disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-xs text-[var(--text)]">Page {page} of {Math.ceil(totalUsers / 20)}</span>
              <button
                disabled={page * 20 >= totalUsers}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1 text-xs border rounded hover:border-[var(--brand)] disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
