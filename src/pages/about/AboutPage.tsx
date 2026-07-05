import { Link } from 'react-router-dom'

const TEAM = [
  { name: 'Arjun Krishnamurthy', role: 'Founder & Full Stack Dev', avatar: 'AK' },
  { name: 'Priya Nair',          role: 'Content Lead',             avatar: 'PN' },
  { name: 'Karthik Suresh',      role: 'UI/UX Designer',           avatar: 'KS' },
]

const VALUES = [
  { icon: '🆓', title: 'Always Free',       desc: 'No paywalls, no subscriptions, no hidden fees. Ever.' },
  { icon: '🎯', title: 'Student First',      desc: 'Every feature is designed with college students in mind.' },
  { icon: '📚', title: 'Quality Content',   desc: 'Curated roadmaps and questions verified by industry experts.' },
  { icon: '🤝', title: 'Community Driven',  desc: 'Built with feedback from thousands of students across India.' },
]

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

      {/* Hero */}
      <div className="text-center mb-16">
        <span className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--brand)] to-violet-700 text-3xl mb-6 shadow-lg shadow-purple-300/30">
          <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" aria-hidden="true">
            <path d="M12 3L4 8v8l8 5 8-5V8l-8-5z" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round"/>
            <circle cx="12" cy="12" r="2.5" fill="#fff"/>
          </svg>
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-h)] mb-4">
          About PlacePrep AI
        </h1>
        <p className="text-lg text-[var(--text)] max-w-2xl mx-auto leading-relaxed">
          We built PlacePrep AI because we've seen too many talented students fail placements simply because
          they couldn't afford expensive coaching. We decided to change that.
        </p>
      </div>

      {/* Mission */}
      <div className="rounded-2xl bg-gradient-to-br from-[var(--brand)] to-violet-700 text-white p-8 mb-12 text-center">
        <h2 className="text-xl font-bold mb-3">Our Mission</h2>
        <p className="text-white/90 leading-relaxed max-w-xl mx-auto">
          To make world-class placement preparation accessible to every college student in India —
          regardless of their college tier, background, or financial situation. Completely free. Forever.
        </p>
      </div>

      {/* Values */}
      <div className="mb-12">
        <h2 className="text-2xl font-extrabold text-[var(--text-h)] text-center mb-8">What We Stand For</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {VALUES.map(({ icon, title, desc }) => (
            <div key={title} className="flex gap-4 p-5 rounded-xl border border-[var(--border)] bg-[var(--bg)]">
              <span className="text-3xl flex-shrink-0" aria-hidden="true">{icon}</span>
              <div>
                <h3 className="font-bold text-[var(--text-h)] mb-1">{title}</h3>
                <p className="text-sm text-[var(--text)]">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div className="mb-12">
        <h2 className="text-2xl font-extrabold text-[var(--text-h)] text-center mb-8">Built by Students, for Students</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {TEAM.map(({ name, role, avatar }) => (
            <div key={name} className="flex flex-col items-center gap-3 p-6 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--brand)] to-violet-700 flex items-center justify-center text-white text-lg font-bold">
                {avatar}
              </div>
              <div>
                <p className="font-bold text-[var(--text-h)]">{name}</p>
                <p className="text-xs text-[var(--text)] mt-0.5">{role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link to="/register"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--brand)] hover:bg-[var(--brand-dark)] text-white font-bold transition-all shadow-lg shadow-purple-300/30">
          Join PlacePrep AI — It's Free
        </Link>
        <p className="mt-3 text-xs text-[var(--text)]">
          Questions?{' '}
          <Link to="/contact" className="text-[var(--brand)] hover:underline font-medium">Contact us</Link>
        </p>
      </div>

    </div>
  )
}
