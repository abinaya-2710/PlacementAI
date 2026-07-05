/**
 * components/auth/ProtectedRoute.tsx
 *
 * Wraps any route that requires authentication.
 *
 * Behaviour:
 *   - While session is being restored → shows a full-page spinner
 *   - Not authenticated              → redirects to /login (with `from` state)
 *   - Authenticated                  → renders <Outlet /> (or children)
 *   - adminOnly=true                 → also requires role === 'admin'
 */

import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

interface ProtectedRouteProps {
  adminOnly?: boolean
}

export default function ProtectedRoute({ adminOnly = false }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const location = useLocation()

  // ── Loading state — restoring session from localStorage ─────────────────
  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen bg-[var(--bg)]"
        aria-busy="true"
        aria-label="Loading"
      >
        <div className="flex flex-col items-center gap-4">
          {/* Spinner */}
          <div
            className="w-10 h-10 rounded-full border-4 border-[var(--border)] border-t-[var(--brand)] animate-spin"
            aria-hidden="true"
          />
          <p className="text-sm text-[var(--text)]">Loading your session…</p>
        </div>
      </div>
    )
  }

  // ── Not authenticated → redirect to /login ───────────────────────────────
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // ── Admin-only guard ─────────────────────────────────────────────────────
  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
