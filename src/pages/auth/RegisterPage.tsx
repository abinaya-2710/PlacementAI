import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [firstName,    setFirstName]    = useState('')
  const [lastName,     setLastName]     = useState('')
  const [email,        setEmail]        = useState('')
  const [password,     setPassword]     = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [agreed,       setAgreed]       = useState(false)
  const [error,        setError]        = useState<string | null>(null)
  const [loading,      setLoading]      = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    const full_name = `${firstName.trim()} ${lastName.trim()}`.trim()

    if (!firstName.trim())  { setError('First name is required.');          return }
    if (!lastName.trim())   { setError('Last name is required.');           return }
    if (!email.trim())      { setError('Email is required.');               return }
    if (!password)          { setError('Password is required.');            return }
    if (!agreed)            { setError('You must accept the Terms of Service to continue.'); return }

    setLoading(true)
    const err = await register({ full_name, email: email.trim().toLowerCase(), password })
    setLoading(false)

    if (err) { setError(err); return }
    navigate('/dashboard', { replace: true })
  }

  const inputClass =
    'w-full px-3 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text-h)] text-sm placeholder:text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:border-transparent transition disabled:opacity-50'

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-[var(--text-h)]">Create your account</h1>
        <p className="mt-1 text-sm text-[var(--text)]">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[var(--brand)] hover:underline">
            Log in
          </Link>
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div role="alert" className="flex items-start gap-2 mb-5 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 flex-shrink-0 mt-0.5" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd"/>
          </svg>
          {error}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        {/* Name row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="first-name" className="block text-sm font-medium text-[var(--text-h)] mb-1.5">
              First name
            </label>
            <input
              id="first-name" type="text" autoComplete="given-name" placeholder="Rahul"
              value={firstName} onChange={e => setFirstName(e.target.value)}
              disabled={loading} required className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="last-name" className="block text-sm font-medium text-[var(--text-h)] mb-1.5">
              Last name
            </label>
            <input
              id="last-name" type="text" autoComplete="family-name" placeholder="Kumar"
              value={lastName} onChange={e => setLastName(e.target.value)}
              disabled={loading} required className={inputClass}
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[var(--text-h)] mb-1.5">
            Email address
          </label>
          <input
            id="email" type="email" autoComplete="email" placeholder="you@college.edu"
            value={email} onChange={e => setEmail(e.target.value)}
            disabled={loading} required className={inputClass}
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-[var(--text-h)] mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Min. 8 characters, include a number"
              value={password} onChange={e => setPassword(e.target.value)}
              disabled={loading} required
              className={inputClass + ' pr-11'}
            />
            <button
              type="button"
              onClick={() => setShowPassword(p => !p)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text)] hover:text-[var(--text-h)] transition-colors"
            >
              {showPassword
                ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              }
            </button>
          </div>
          {/* Password strength hint */}
          {password && (
            <p className={`mt-1.5 text-xs ${password.length >= 8 && /\d/.test(password) ? 'text-green-600' : 'text-[var(--text)]'}`}>
              {password.length >= 8 && /\d/.test(password)
                ? '✓ Password looks good'
                : 'Use at least 8 characters including a number'}
            </p>
          )}
        </div>

        {/* Terms */}
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={e => setAgreed(e.target.checked)}
            disabled={loading}
            className="mt-0.5 w-4 h-4 rounded border-[var(--border)] accent-[var(--brand)]"
          />
          <span className="text-xs text-[var(--text)]">
            I agree to the{' '}
            <Link to="/terms" className="text-[var(--brand)] hover:underline font-medium">Terms of Service</Link>
            {' '}and{' '}
            <Link to="/privacy" className="text-[var(--brand)] hover:underline font-medium">Privacy Policy</Link>
          </span>
        </label>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-[var(--brand)] hover:bg-[var(--brand-dark)] text-white font-semibold text-sm shadow-md shadow-purple-300/30 hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading && (
            <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" aria-hidden="true" />
          )}
          {loading ? 'Creating account…' : 'Create free account'}
        </button>
      </form>

      <p className="mt-4 text-center text-[10px] text-[var(--text)]">
        🔒 No credit card. No fees. Free forever.
      </p>
    </div>
  )
}
