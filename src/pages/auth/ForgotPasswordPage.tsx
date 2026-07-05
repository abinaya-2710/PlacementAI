import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <div>
      {!submitted ? (
        <>
          <div className="mb-8">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-[var(--brand)]">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h1 className="text-2xl font-extrabold text-[var(--text-h)]">Forgot your password?</h1>
            <p className="mt-1 text-sm text-[var(--text)]">
              Enter your email and we'll send you a reset link.
            </p>
          </div>

          <form className="space-y-5" onSubmit={e => { e.preventDefault(); setSubmitted(true) }}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--text-h)] mb-1.5">
                Email address
              </label>
              <input id="email" type="email" autoComplete="email" placeholder="you@college.edu"
                className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text-h)] text-sm placeholder:text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:border-transparent transition" />
            </div>

            <button type="submit"
              className="w-full py-3 rounded-lg bg-[var(--brand)] hover:bg-[var(--brand-dark)] text-white font-semibold text-sm transition-all">
              Send reset link
            </button>
          </form>
        </>
      ) : (
        /* Success state */
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8 text-green-600">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h2 className="text-xl font-extrabold text-[var(--text-h)] mb-2">Check your inbox</h2>
          <p className="text-sm text-[var(--text)] mb-6">
            We've sent a password reset link. It expires in 15 minutes.
          </p>
          <button type="button" onClick={() => setSubmitted(false)}
            className="text-sm text-[var(--brand)] hover:underline font-medium">
            Send again
          </button>
        </div>
      )}

      <div className="mt-8 text-center">
        <Link to="/login" className="inline-flex items-center gap-1 text-sm text-[var(--text)] hover:text-[var(--brand)] transition-colors">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
            <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10z" clipRule="evenodd"/>
          </svg>
          Back to login
        </Link>
      </div>
    </div>
  )
}
