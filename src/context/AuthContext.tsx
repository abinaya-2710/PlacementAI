/**
 * context/AuthContext.tsx — Global authentication state.
 *
 * Provides:
 *   user          — the currently logged-in User or null
 *   isLoading     — true while the initial session is being restored
 *   isAuthenticated — derived boolean
 *   login()       — call API, store tokens, set user
 *   register()    — call API, store tokens, set user
 *   logout()      — call API, clear tokens, clear user
 *   refreshUser() — re-fetch /me and update user in state
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import { useNavigate } from 'react-router-dom'
import {
  login   as apiLogin,
  register as apiRegister,
  logout  as apiLogout,
  getMe,
  type User,
  type LoginPayload,
  type RegisterPayload,
} from '../services/authService'
import { tokenStorage } from '../services/api'

// ── Context shape ──────────────────────────────────────────────────────────────

interface AuthContextValue {
  user:              User | null
  isLoading:         boolean
  isAuthenticated:   boolean
  login:             (payload: LoginPayload)    => Promise<string | null>
  register:          (payload: RegisterPayload) => Promise<string | null>
  logout:            () => Promise<void>
  refreshUser:       () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

// ── Provider ───────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,      setUser]      = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  // ── Restore session on mount ─────────────────────────────────────────────
  useEffect(() => {
    async function restoreSession() {
      const token = tokenStorage.getAccess()
      if (!token) {
        setIsLoading(false)
        return
      }
      const { data, error } = await getMe()
      if (!error && data) setUser(data)
      else tokenStorage.clearAll()          // token invalid — wipe it
      setIsLoading(false)
    }
    restoreSession()
  }, [])

  // ── Listen for forced logout (token refresh failed) ──────────────────────
  useEffect(() => {
    function handleForcedLogout() {
      setUser(null)
      navigate('/login', { replace: true })
    }
    window.addEventListener('auth:logout', handleForcedLogout)
    return () => window.removeEventListener('auth:logout', handleForcedLogout)
  }, [navigate])

  // ── login ────────────────────────────────────────────────────────────────
  const login = useCallback(
    async (payload: LoginPayload): Promise<string | null> => {
      const { data, error } = await apiLogin(payload)
      if (error || !data) return error ?? 'Login failed.'
      setUser(data.user)
      return null
    },
    [],
  )

  // ── register ─────────────────────────────────────────────────────────────
  const register = useCallback(
    async (payload: RegisterPayload): Promise<string | null> => {
      const { data, error } = await apiRegister(payload)
      if (error || !data) return error ?? 'Registration failed.'
      setUser(data.user)
      return null
    },
    [],
  )

  // ── logout ───────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    await apiLogout()
    setUser(null)
    navigate('/', { replace: true })
  }, [navigate])

  // ── refreshUser ──────────────────────────────────────────────────────────
  const refreshUser = useCallback(async () => {
    const { data, error } = await getMe()
    if (!error && data) setUser(data)
  }, [])

  const value: AuthContextValue = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// ── useAuth hook ───────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>.')
  }
  return ctx
}
