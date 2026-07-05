import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import PageHeader from '../../components/ui/PageHeader'
import Badge from '../../components/ui/Badge'
import { fetchCompanies, fetchCompany } from '../../services/companyService'
import { fetchProblems } from '../../services/practiceService'
import type { CompanyItem, CompanyType, CompanyDifficulty, Problem } from '../../types'

const TYPE_COLORS: Record<CompanyType, string> = {
  product: 'bg-blue-600', service: 'bg-violet-600', finance: 'bg-emerald-600', startup: 'bg-orange-500',
}
const DIFF_VARIANT: Record<CompanyDifficulty, 'success'|'warning'|'error'> = { Easy:'success', Medium:'warning', Hard:'error' }
const TYPES = ['All','Product','Service','Finance','Startup']

const SKILL_TO_SLUG: Record<string, string> = {
  'dsa': 'dsa',
  'data structures': 'dsa',
  'algorithms': 'dsa',
  'oop': 'oops',
  'oops': 'oops',
  'object oriented': 'oops',
  'system design': 'system-design',
  'sql': 'dbms',
  'database': 'dbms',
  'databases': 'dbms',
  'networking': 'cn',
  'os': 'os',
  'operating systems': 'os',
  'java': 'java',
  'python': 'python',
  'c++': 'cpp',
  'aptitude': 'aptitude',
}

function CompanyDetail({ slug }: { slug: string }) {
  const navigate = useNavigate()
  const [company, setCompany] = useState<CompanyItem | null>(null)
  const [problems, setProblems] = useState<Problem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCompany(slug).then(({ data }) => {
      if (data) {
        setCompany(data)
        // Fetch sample questions asked by this company
        fetchProblems({ company: data.name }).then((pRes) => {
          if (pRes.data) {
            setProblems(pRes.data.problems)
          }
        })
      }
      setLoading(false)
    })
  }, [slug])

  if (loading) return <div className="animate-pulse h-64 rounded-xl bg-[var(--border)] m-8" />
  if (!company) return <div className="text-center py-20 text-[var(--text)]">Company not found.</div>

  const skillBadges = company.required_skills.split(',').map(s => s.trim()).filter(Boolean)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Prominent Back Button & Breadcrumbs */}
      <div>
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--brand)] hover:underline mb-3 cursor-pointer bg-transparent border-none p-0">
          &larr; Go Back
        </button>
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[var(--text)]">
          <Link to="/companies" className="hover:text-[var(--brand)]">Companies</Link>
          <span>/</span><span className="text-[var(--text-h)] font-medium">{company.name}</span>
        </nav>
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-[var(--brand)] to-violet-700 p-6 text-white flex items-start gap-4">
        <div className={`w-14 h-14 rounded-xl ${TYPE_COLORS[company.type]} flex items-center justify-center text-white text-xl font-bold flex-shrink-0`}>{company.logo_abbr}</div>
        <div>
          <h1 className="text-2xl font-extrabold">{company.name}</h1>
          <div className="flex flex-wrap gap-2 mt-2 text-xs text-white/80">
            <span>🔄 {company.interview_rounds} rounds</span>
            <span>💰 {company.ctc_range}</span>
            <span>👔 {company.roles}</span>
          </div>
          <p className="text-white/80 text-sm mt-2">{company.description}</p>
        </div>
      </div>

      {/* Hiring Process */}
      {company.hiring_process && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-5">
          <h2 className="font-bold text-[var(--text-h)] mb-3">🏢 Hiring Process</h2>
          <p className="text-sm text-[var(--text)] leading-relaxed">{company.hiring_process}</p>
        </div>
      )}

      {/* Concept Links (Required Skills) */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-5 space-y-3">
        <h2 className="font-bold text-[var(--text-h)]">💡 Required Skills & Concept Guides</h2>
        <p className="text-xs text-[var(--text)]">Click on concepts marked with 🗺️ to access step-by-step topic roadmaps.</p>
        <div className="flex flex-wrap gap-2">
          {skillBadges.map(skill => {
            const matchKey = Object.keys(SKILL_TO_SLUG).find(key => skill.toLowerCase().includes(key));
            const targetSlug = matchKey ? SKILL_TO_SLUG[matchKey] : null;
            if (targetSlug) {
              return (
                <Link key={skill} to={`/roadmaps/${targetSlug}`} className="px-3 py-1.5 rounded-full bg-[var(--brand)] hover:bg-[var(--brand-dark)] text-white text-xs font-semibold transition-colors flex items-center gap-1 shadow-sm">
                  <span>{skill}</span>
                  <span aria-hidden="true">🗺️</span>
                </Link>
              )
            }
            return (
              <span key={skill} className="px-3 py-1.5 rounded-full bg-[var(--bg-muted)] border border-[var(--border)] text-[var(--text-h)] text-xs font-semibold">
                {skill}
              </span>
            )
          })}
        </div>
      </div>

      {/* How to Crack Interview prep section */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-5 space-y-3">
        <h2 className="font-bold text-[var(--text-h)]">🔑 How to Crack the Interview</h2>
        <div className="text-sm text-[var(--text)] space-y-2 leading-relaxed">
          <p>
            To clear the evaluations at <strong>{company.name}</strong> (rated <strong>{company.difficulty}</strong> difficulty), keep these strategies in mind:
          </p>
          <ul className="list-disc pl-5 space-y-2.5">
            <li><strong>Complete core roadmaps:</strong> Build a strong command of the concepts marked above. Spend extra time resolving standard DSA algorithms.</li>
            <li><strong>Learn hiring specifics:</strong> {company.name}'s process spans {company.interview_rounds} rounds. Focus on optimal space and time complexities.</li>
            <li><strong>Practice mock simulation:</strong> Answer our practice list questions, analyze editorial sheets, and build a resume template to stand out.</li>
          </ul>
        </div>
      </div>

      {/* Sample Coding Questions Asked */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-5 space-y-4">
        <h2 className="font-bold text-[var(--text-h)]">💻 Sample Coding Questions Asked</h2>
        {problems.length === 0 ? (
          <p className="text-xs text-[var(--text)] italic">No database coding questions found for {company.name} yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {problems.map(prob => (
              <div key={prob.id} className="flex justify-between items-center gap-3 p-4 rounded-xl bg-[var(--bg-muted)] border border-[var(--border)] hover:border-[var(--brand)] transition-all">
                <div className="min-w-0">
                  <Link to={`/practice/${prob.id}`} className="text-sm font-bold text-[var(--text-h)] hover:text-[var(--brand)] transition-colors truncate block">
                    {prob.title}
                  </Link>
                  <span className="text-[10px] text-[var(--text)] block mt-0.5 uppercase font-semibold">{prob.topic}</span>
                </div>
                <Badge variant={prob.difficulty === 'Easy' ? 'success' : prob.difficulty === 'Medium' ? 'warning' : 'error'}>
                  {prob.difficulty}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function CompaniesPage() {
  const { slug } = useParams<{ slug?: string }>()
  const [companies, setCompanies] = useState<CompanyItem[]>([])
  const [loading,   setLoading]   = useState(true)
  const [search,    setSearch]    = useState('')
  const [type,      setType]      = useState('All')

  useEffect(() => {
    fetchCompanies().then(({ data }) => { if (data) setCompanies(data); setLoading(false) })
  }, [])

  if (slug) return <CompanyDetail slug={slug} />

  const filtered = companies.filter(c => {
    if (type !== 'All' && c.type.toLowerCase() !== type.toLowerCase()) return false
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <>
      <PageHeader title="Company Preparation" subtitle="Targeted prep for 16+ companies — hiring process, skills, and interview tips." />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1 max-w-sm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text)]" aria-hidden="true">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input type="search" placeholder="Search companies…" value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-sm text-[var(--text-h)] placeholder:text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {TYPES.map(t => (
              <button key={t} onClick={() => setType(t)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
                  type === t ? 'bg-[var(--brand)] text-white border-[var(--brand)]' : 'border-[var(--border)] text-[var(--text)] hover:border-[var(--brand)] hover:text-[var(--brand)]'
                }`}>{t}</button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
            {[...Array(8)].map((_,i) => <div key={i} className="h-40 rounded-xl bg-[var(--border)]" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map(c => (
              <Link key={c.slug} to={`/companies/${c.slug}`}
                className="group flex flex-col gap-4 p-5 rounded-xl border border-[var(--border)] bg-[var(--bg)] hover:border-[var(--brand)] hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl ${TYPE_COLORS[c.type]} flex items-center justify-center text-white text-sm font-bold`}>{c.logo_abbr}</div>
                  <Badge variant={DIFF_VARIANT[c.difficulty]}>{c.difficulty}</Badge>
                </div>
                <div>
                  <h3 className="font-bold text-[var(--text-h)] group-hover:text-[var(--brand)] transition-colors">{c.name}</h3>
                  <p className="text-xs text-[var(--text)] mt-0.5 capitalize">{c.type}</p>
                </div>
                <div className="flex items-center justify-between text-xs text-[var(--text)] border-t border-[var(--border)] pt-3 mt-auto">
                  <span>🔄 {c.interview_rounds} rounds</span>
                  <span>💰 {c.ctc_range}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
