import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const NAV_LINKS = [
  { label: 'Home',      to: '/'          },
  { label: 'Roadmaps',  to: '/roadmaps'  },
  { label: 'Practice',  to: '/practice'  },
  { label: 'Companies', to: '/companies' },
]

const AUTH_NAV_LINKS = [
  { label: 'Dashboard',  to: '/dashboard'  },
  { label: 'Roadmaps',   to: '/roadmaps'   },
  { label: 'Practice',   to: '/practice'   },
  { label: 'Companies',  to: '/companies'  },
]

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const [menuOpen,    setMenuOpen]    = useState(false)
  const [scrolled,    setScrolled]    = useState(false)
  const [dropOpen,    setDropOpen]    = useState(false)
  const dropRef = useRef<HTMLDivElement>(null)

  // Shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on resize
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Close user dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const links = isAuthenticated ? AUTH_NAV_LINKS : NAV_LINKS

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium px-3 py-1.5 rounded-lg transition-colors duration-150 ${
      isActive
        ? 'text-[var(--brand)] bg-purple-50 dark:bg-purple-950/30'
        : 'text-[var(--text)] hover:text-[var(--text-h)] hover:bg-gray-100 dark:hover:bg-white/5'
    }`

  // User avatar — initials from full_name
  const initials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  async function handleLogout() {
    setDropOpen(false)
    setMenuOpen(false)
    await logout()
    navigate('/', { replace: true })
  }

  return (
    <header
      role="banner"
      className={`sticky top-0 z-50 w-full bg-[var(--bg)] border-b border-[var(--border)] transition-shadow duration-200 ${
        scrolled ? 'shadow-md' : 'shadow-none'
      }`}
    >
      <nav
        aria-label="Main navigation"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6"
      >
        {/* ── Logo ── */}
        <Link
          to={isAuthenticated ? '/dashboard' : '/'}
          className="flex items-center gap-2.5 flex-shrink-0 group"
          aria-label="PlacePrep AI home"
        >
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--brand)] shadow-sm group-hover:shadow-md transition-shadow">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden="true">
              <path d="M12 3L4 8v8l8 5 8-5V8l-8-5z" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="2.5" fill="#fff"/>
            </svg>
          </span>
          <span className="text-[17px] font-bold tracking-tight text-[var(--text-h)]">
            PlacePrep<span className="text-[var(--brand)]"> AI</span>
          </span>
        </Link>

        {/* ── Desktop nav links ── */}
        <ul className="hidden md:flex items-center gap-1 list-none m-0 p-0" role="list">
          {links.map(({ label, to }) => (
            <li key={to}>
              <NavLink to={to} className={linkClass} end={to === '/'}>
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* ── Desktop: auth buttons OR user menu ── */}
        <div className="hidden md:flex items-center gap-3 ml-auto">
          {isAuthenticated ? (
            /* ── Logged-in: avatar + dropdown ── */
            <div className="relative" ref={dropRef}>
              <button
                type="button"
                onClick={() => setDropOpen(o => !o)}
                aria-haspopup="true"
                aria-expanded={dropOpen}
                aria-label="User menu"
                className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-[var(--bg-muted)] transition-colors"
              >
                {/* Avatar circle */}
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--brand)] to-violet-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {initials}
                </span>
                <span className="text-sm font-medium text-[var(--text-h)] max-w-[120px] truncate">
                  {user?.full_name?.split(' ')[0]}
                </span>
                <svg viewBox="0 0 20 20" fill="currentColor" className={`w-4 h-4 text-[var(--text)] transition-transform ${dropOpen ? 'rotate-180' : ''}`} aria-hidden="true">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06z" clipRule="evenodd"/>
                </svg>
              </button>

              {/* Dropdown */}
              {dropOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl border border-[var(--border)] bg-[var(--bg)] shadow-xl shadow-black/10 py-1.5 z-50">
                  {/* User info */}
                  <div className="px-4 py-2.5 border-b border-[var(--border)]">
                    <p className="text-sm font-semibold text-[var(--text-h)] truncate">{user?.full_name}</p>
                    <p className="text-xs text-[var(--text)] truncate">{user?.email}</p>
                  </div>

                  {[
                    { label: 'Dashboard',     to: '/dashboard'     },
                    { label: 'My Progress',   to: '/progress'      },
                    { label: 'Community',     to: '/community'     },
                    { label: 'Leaderboard',   to: '/leaderboard'   },
                    { label: 'Resources',     to: '/resources'     },
                    { label: 'Profile',       to: '/profile'       },
                    { label: 'Settings',      to: '/settings'      },
                    { label: 'Notifications', to: '/notifications' },
                    ...(user?.role === 'admin' ? [{ label: 'Admin Panel', to: '/admin' }] : []),
                  ].map(({ label, to }) => (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setDropOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-[var(--text-h)] hover:bg-[var(--bg-muted)] hover:text-[var(--brand)] transition-colors"
                    >
                      {label}
                    </Link>
                  ))}

                  <div className="border-t border-[var(--border)] mt-1 pt-1">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                    >
                      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                        <path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 0 1 5.25 2h5.5A2.25 2.25 0 0 1 13 4.25v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 0-.75-.75h-5.5a.75.75 0 0 0-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 0 0 .75-.75v-2a.75.75 0 0 1 1.5 0v2A2.25 2.25 0 0 1 10.75 18h-5.5A2.25 2.25 0 0 1 3 15.75V4.25z" clipRule="evenodd"/>
                        <path fillRule="evenodd" d="M19 10a.75.75 0 0 0-.75-.75H8.704l1.048-1.07a.75.75 0 1 0-1.08-1.04l-2.25 2.3a.75.75 0 0 0 0 1.04l2.25 2.3a.75.75 0 1 0 1.08-1.04l-1.048-1.07h9.546A.75.75 0 0 0 19 10z" clipRule="evenodd"/>
                      </svg>
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ── Logged-out: Login + Register ── */
            <>
              <Link
                to="/login"
                className="text-sm font-semibold px-4 py-2 rounded-lg border border-[var(--border)] text-[var(--text-h)] hover:border-[var(--brand)] hover:text-[var(--brand)] transition-colors duration-150"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm font-semibold px-4 py-2 rounded-lg bg-[var(--brand)] text-white hover:bg-[var(--brand-dark)] transition-colors duration-150 shadow-sm hover:shadow-md"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* ── Hamburger (mobile) ── */}
        <button
          type="button"
          onClick={() => setMenuOpen(prev => !prev)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          className="md:hidden ml-auto flex flex-col justify-center items-center w-10 h-10 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors focus-visible:outline-2 focus-visible:outline-[var(--brand)] focus-visible:outline-offset-2"
        >
          <span className={`block w-5 h-0.5 bg-[var(--text-h)] rounded transition-transform duration-250 ${menuOpen ? 'translate-y-1.5 rotate-45' : ''}`} />
          <span className={`block w-5 h-0.5 bg-[var(--text-h)] rounded my-1 transition-opacity duration-250 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-[var(--text-h)] rounded transition-transform duration-250 ${menuOpen ? '-translate-y-1.5 -rotate-45' : ''}`} />
        </button>
      </nav>

      {/* ── Mobile menu ── */}
      <div
        id="mobile-menu"
        aria-hidden={!menuOpen}
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        } border-t border-[var(--border)] bg-[var(--bg)]`}
      >
        {/* User info bar (authenticated) */}
        {isAuthenticated && (
          <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)] bg-[var(--bg-muted)]">
            <span className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--brand)] to-violet-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {initials}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[var(--text-h)] truncate">{user?.full_name}</p>
              <p className="text-xs text-[var(--text)] truncate">{user?.email}</p>
            </div>
          </div>
        )}

        <ul className="flex flex-col px-4 py-3 gap-1 list-none m-0 p-4" role="list">
          {links.map(({ label, to }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={linkClass}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-2 px-4 pb-4">
          {isAuthenticated ? (
            <>
              <Link to="/profile"   onClick={() => setMenuOpen(false)} className="w-full text-center text-sm font-semibold px-4 py-2.5 rounded-lg border border-[var(--border)] text-[var(--text-h)] hover:border-[var(--brand)] hover:text-[var(--brand)] transition-colors">Profile</Link>
              <button type="button" onClick={handleLogout} className="w-full text-center text-sm font-semibold px-4 py-2.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors">Log out</button>
            </>
          ) : (
            <>
              <Link to="/login"    onClick={() => setMenuOpen(false)} className="w-full text-center text-sm font-semibold px-4 py-2.5 rounded-lg border border-[var(--border)] text-[var(--text-h)] hover:border-[var(--brand)] hover:text-[var(--brand)] transition-colors">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="w-full text-center text-sm font-semibold px-4 py-2.5 rounded-lg bg-[var(--brand)] text-white hover:bg-[var(--brand-dark)] transition-colors">Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
