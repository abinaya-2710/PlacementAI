import { Link } from 'react-router-dom'
import type { Company } from '../../types'

// ─── Data ──────────────────────────────────────────────────────────────────────
const COMPANIES: Company[] = [
  { name: 'Google',        type: 'product'  },
  { name: 'Microsoft',     type: 'product'  },
  { name: 'Amazon',        type: 'product'  },
  { name: 'Zoho',          type: 'product'  },
  { name: 'Freshworks',    type: 'startup'  },
  { name: 'JPMorgan',      type: 'finance'  },
  { name: 'Deloitte',      type: 'finance'  },
  { name: 'EY',            type: 'finance'  },
  { name: 'TCS',           type: 'service'  },
  { name: 'Infosys',       type: 'service'  },
  { name: 'Wipro',         type: 'service'  },
  { name: 'Accenture',     type: 'service'  },
  { name: 'Cognizant',     type: 'service'  },
  { name: 'Capgemini',     type: 'service'  },
  { name: 'HCL',           type: 'service'  },
  { name: 'Tech Mahindra', type: 'service'  },
]

const TYPE_CONFIG: Record<Company['type'], { label: string; color: string; abbr: (name: string) => string }> = {
  product: {
    label: 'Product',
    color: 'bg-blue-600',
    abbr: name => name.slice(0, 2).toUpperCase(),
  },
  service: {
    label: 'Service',
    color: 'bg-violet-600',
    abbr: name => name.slice(0, 2).toUpperCase(),
  },
  finance: {
    label: 'Finance',
    color: 'bg-emerald-600',
    abbr: name => name.slice(0, 2).toUpperCase(),
  },
  startup: {
    label: 'Startup',
    color: 'bg-orange-500',
    abbr: name => name.slice(0, 2).toUpperCase(),
  },
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function CompaniesSection() {
  return (
    <section
      aria-labelledby="companies-heading"
      className="py-20 sm:py-28 bg-[var(--bg-muted)] border-t border-[var(--border)]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section header ── */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[var(--brand)] mb-3">
            Company-specific prep
          </span>
          <h2
            id="companies-heading"
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-h)]"
          >
            Prepare for Top Companies
          </h2>
          <p className="mt-4 text-[var(--text)] text-base sm:text-lg">
            Targeted preparation for 16+ companies — test patterns, past questions, interview rounds, and insider tips.
          </p>
        </div>

        {/* ── Company cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {COMPANIES.map(({ name, type }) => {
            const cfg = TYPE_CONFIG[type]
            return (
              <Link
                key={name}
                to={`/companies/${name.toLowerCase().replace(/\s+/g, '-')}`}
                className="group flex flex-col items-center gap-2.5 p-4 rounded-xl border border-[var(--border)] bg-[var(--bg)] hover:border-[var(--brand)] hover:shadow-md transition-all duration-200 text-center"
              >
                {/* Avatar abbrev */}
                <div className={`w-10 h-10 rounded-xl ${cfg.color} flex items-center justify-center text-white text-sm font-bold shadow-sm`}>
                  {cfg.abbr(name)}
                </div>
                {/* Name */}
                <span className="text-xs font-semibold text-[var(--text-h)] group-hover:text-[var(--brand)] transition-colors leading-tight">
                  {name}
                </span>
                {/* Type badge */}
                <span className="text-[9px] font-medium text-[var(--text)] uppercase tracking-wide">
                  {cfg.label}
                </span>
              </Link>
            )
          })}
        </div>

        {/* ── CTA ── */}
        <div className="mt-10 text-center">
          <Link
            to="/companies"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand)] hover:underline"
          >
            Explore all company prep guides
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
              <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>

      </div>
    </section>
  )
}
