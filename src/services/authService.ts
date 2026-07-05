/**
 * services/authService.ts — Auth API calls.
 *
 * All functions return { data, error } so callers never need try/catch.
 */

import api, { tokenStorage } from './api'

// ── Types ──────────────────────────────────────────────────────────────────────

export interface User {
  id:         number
  full_name:  string
  email:      string
  role:       'student' | 'admin'
  is_active:  boolean
  created_at: string
  updated_at: string
}

export interface AuthResponse {
  user:          User
  access_token:  string
  refresh_token: string
}

export interface RegisterPayload {
  full_name: string
  email:     string
  password:  string
  role?:     'student' | 'admin'
}

export interface LoginPayload {
  email:    string
  password: string
}

export interface UpdateProfilePayload {
  full_name?: string
  password?:  string
}

type Result<T> = Promise<{ data: T; error: null } | { data: null; error: string }>

// ── Helper — extract a readable error message from Axios errors ────────────────
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

// ── Register ───────────────────────────────────────────────────────────────────

export async function register(payload: RegisterPayload): Result<AuthResponse> {
  try {
    const { data } = await api.post<{ success: boolean; data: AuthResponse }>(
      '/auth/register',
      payload,
    )
    tokenStorage.setTokens(data.data.access_token, data.data.refresh_token)
    return { data: data.data, error: null }
  } catch (err) {
    return { data: null, error: extractError(err) }
  }
}

// ── Login ──────────────────────────────────────────────────────────────────────

export async function login(payload: LoginPayload): Result<AuthResponse> {
  try {
    const { data } = await api.post<{ success: boolean; data: AuthResponse }>(
      '/auth/login',
      payload,
    )
    tokenStorage.setTokens(data.data.access_token, data.data.refresh_token)
    return { data: data.data, error: null }
  } catch (err) {
    return { data: null, error: extractError(err) }
  }
}

// ── Logout ─────────────────────────────────────────────────────────────────────

export async function logout(): Promise<void> {
  try {
    await api.post('/auth/logout')
  } finally {
    // Always clear tokens, even if the server call fails
    tokenStorage.clearAll()
  }
}

// ── Get current user ───────────────────────────────────────────────────────────

export async function getMe(): Result<User> {
  try {
    const { data } = await api.get<{ success: boolean; data: { user: User } }>(
      '/auth/me',
    )
    return { data: data.data.user, error: null }
  } catch (err) {
    return { data: null, error: extractError(err) }
  }
}

// ── Update profile ─────────────────────────────────────────────────────────────

export async function updateProfile(payload: UpdateProfilePayload): Result<User> {
  try {
    const { data } = await api.patch<{ success: boolean; data: { user: User } }>(
      '/auth/me',
      payload,
    )
    return { data: data.data.user, error: null }
  } catch (err) {
    return { data: null, error: extractError(err) }
  }
}
