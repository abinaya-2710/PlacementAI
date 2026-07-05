import { Link, Outlet } from 'react-router-dom'

/**
 * AuthLayout — wraps Login, Register, ForgotPassword pages.
 * Split layout: branding panel (left) + form panel (right).
 */
export default function AuthLayout() {
  return (
    <div className="min-h-screen flex">

      {/* ── Left branding panel (hidden on mobile) ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[var(--brand)] to-violet-700 flex-col justify-between p-12 relative overflow-hidden">
        {/* Background pattern */}
        <div aria-hidden="true" className="absolute inset-0 opacity-10">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-white"
              style={{
                width:  `${(i + 1) * 120}px`,
                height: `${(i + 1) * 120}px`,
                top:    '50%',
                left:   '50%',
                transform: 'translate(-50%, -50%)',
              }}
            />
          ))}
        </div>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 relative z-10">
          <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden="true">
              <path d="M12 3L4 8v8l8 5 8-5V8l-8-5z" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="2.5" fill="#fff"/>
            </svg>
          </span>
          <span className="text-white text-lg font-bold tracking-tight">PlacePrep AI</span>
        </Link>

        {/* Center copy */}
        <div className="relative z-10 space-y-6">
          <h2 className="text-3xl font-extrabold text-white leading-snug">
            Your placement success<br />starts here — for free.
          </h2>
          <p className="text-white/80 text-sm leading-relaxed">
            Structured roadmaps, coding practice, aptitude prep, mock interviews,
            resume builder, and company-specific guides — all in one platform.
          </p>

          {/* Social proof */}
          <div className="flex flex-wrap gap-4 pt-2">
            {[
              { value: '15+',   label: 'Roadmaps'     },
              { value: '500+',  label: 'Problems'      },
              { value: '16+',   label: 'Companies'     },
              { value: '100%',  label: 'Free forever'  },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col">
                <span className="text-2xl font-extrabold text-white">{value}</span>
                <span className="text-xs text-white/70">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom tagline */}
        <p className="text-white/50 text-xs relative z-10">
          © {new Date().getFullYear()} PlacePrep AI · 100% Free · No Paywalls
        </p>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex flex-col">
        {/* Mobile logo bar */}
        <div className="lg:hidden flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[var(--brand)]">
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" aria-hidden="true">
                <path d="M12 3L4 8v8l8 5 8-5V8l-8-5z" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="2.5" fill="#fff"/>
              </svg>
            </span>
            <span className="text-sm font-bold text-[var(--text-h)]">PlacePrep <span className="text-[var(--brand)]">AI</span></span>
          </Link>
          <Link to="/" className="text-xs text-[var(--text)] hover:text-[var(--brand)]">← Back to home</Link>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </div>
      </div>

    </div>
  )
}
