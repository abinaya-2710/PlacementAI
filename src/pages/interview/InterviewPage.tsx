import { useState, useEffect, useCallback } from 'react'
import PageHeader from '../../components/ui/PageHeader'
import Badge from '../../components/ui/Badge'
import { fetchQuestions, fetchExperiences, toggleBookmark, submitExperience } from '../../services/interviewService'
import { useAuth } from '../../context/AuthContext'
import type { InterviewQuestion, InterviewExperience, InterviewCategory } from '../../types'

const TABS = ['HR Questions', 'Technical', 'Behavioral', 'Experiences'] as const
type Tab = typeof TABS[number]
const CAT_MAP: Record<Tab, InterviewCategory | null> = {
  'HR Questions': 'hr', 'Technical': 'technical', 'Behavioral': 'behavioral', 'Experiences': null,
}

export default function InterviewPage() {
  const { isAuthenticated } = useAuth()
  const [tab,         setTab]         = useState<Tab>('HR Questions')
  const [questions,   setQuestions]   = useState<InterviewQuestion[]>([])
  const [experiences, setExperiences] = useState<InterviewExperience[]>([])
  const [open,        setOpen]        = useState<number | null>(null)
  const [loading,     setLoading]     = useState(false)
  const [showForm,    setShowForm]    = useState(false)
  const [bookmarked,  setBookmarked]  = useState<Set<number>>(new Set())
  const [newExp, setNewExp] = useState({ company_name:'', role:'', rounds:3, result:'Pending', experience:'', year: new Date().getFullYear() })

  const loadTab = useCallback(async (t: Tab) => {
    setTab(t); setOpen(null); setLoading(true)
    if (t === 'Experiences') {
      const { data } = await fetchExperiences()
      if (data) setExperiences(data.experiences)
    } else {
      const cat = CAT_MAP[t]!
      const { data } = await fetchQuestions({ category: cat, per_page: 30 })
      if (data) setQuestions(data.questions)
    }
    setLoading(false)
  }, [])

  useEffect(() => { loadTab('HR Questions') }, [loadTab])

  const handleBookmark = async (id: number) => {
    const isMarked = bookmarked.has(id)
    setBookmarked(prev => { const n = new Set(prev); isMarked ? n.delete(id) : n.add(id); return n })
    await toggleBookmark(id, isMarked)
  }

  const handleSubmitExp = async () => {
    const { data, error } = await submitExperience(newExp)
    if (!error && data) { setExperiences(prev => [data, ...prev]); setShowForm(false) }
  }

  const currentQs = questions

  return (
    <>
      <PageHeader title="Interview Preparation" subtitle="HR, technical, and behavioral questions with model answers." />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex border-b border-[var(--border)] mb-6 overflow-x-auto">
          {TABS.map(t => (
            <button key={t} onClick={() => loadTab(t)}
              className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                tab === t ? 'border-[var(--brand)] text-[var(--brand)]' : 'border-transparent text-[var(--text)] hover:text-[var(--text-h)]'
              }`}>{t}</button>
          ))}
        </div>

        {loading && <div className="space-y-3 animate-pulse">{[...Array(5)].map((_,i) => <div key={i} className="h-16 rounded-xl bg-[var(--border)]" />)}</div>}

        {!loading && tab !== 'Experiences' && (
          <div className="space-y-2">
            {currentQs.map(q => (
              <div key={q.id} className="rounded-xl border border-[var(--border)] bg-[var(--bg)] overflow-hidden">
                <button onClick={() => setOpen(open === q.id ? null : q.id)} aria-expanded={open === q.id}
                  className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-[var(--bg-muted)] transition-colors">
                  <div className="flex items-center gap-2 min-w-0">
                    {q.is_starred && <span className="text-yellow-500 flex-shrink-0" aria-label="Frequently asked">⭐</span>}
                    <span className="font-medium text-[var(--text-h)] text-sm">{q.question}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant="neutral">{q.topic}</Badge>
                    {isAuthenticated && (
                      <button onClick={e => { e.stopPropagation(); handleBookmark(q.id) }}
                        className={`text-sm ${bookmarked.has(q.id) ? 'text-yellow-500' : 'text-[var(--text)] hover:text-yellow-500'} transition-colors`}
                        aria-label="Bookmark">{bookmarked.has(q.id) ? '🔖' : '☆'}</button>
                    )}
                    <span className={`text-[var(--text)] transition-transform ${open === q.id ? 'rotate-180' : ''}`} aria-hidden="true">▾</span>
                  </div>
                </button>
                {open === q.id && q.model_answer && (
                  <div className="px-5 pb-4 border-t border-[var(--border)] bg-[var(--bg-muted)]">
                    <p className="text-sm text-[var(--text)] mt-3 leading-relaxed">
                      <span className="font-semibold text-[var(--text-h)]">Model Answer: </span>{q.model_answer}
                    </p>
                    {q.tips && <p className="text-xs text-[var(--brand)] mt-2">💡 Tip: {q.tips}</p>}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {!loading && tab === 'Experiences' && (
          <div className="space-y-4">
            {isAuthenticated && (
              <div className="flex justify-end mb-2">
                <button onClick={() => setShowForm(f => !f)}
                  className="px-4 py-2 rounded-lg bg-[var(--brand)] text-white text-sm font-semibold hover:bg-[var(--brand-dark)] transition-colors">
                  + Share Experience
                </button>
              </div>
            )}
            {showForm && (
              <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-5 space-y-3">
                <h3 className="font-bold text-[var(--text-h)]">Share Your Interview Experience</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[['company_name','Company Name','TCS'],['role','Role','Software Engineer']].map(([k,l,p]) => (
                    <div key={k}>
                      <label className="block text-xs font-semibold text-[var(--text-h)] mb-1">{l}</label>
                      <input type="text" placeholder={p} value={(newExp as Record<string,unknown>)[k] as string}
                        onChange={e => setNewExp(prev => ({ ...prev, [k]: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-sm text-[var(--text-h)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]" />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-h)] mb-1">Rounds</label>
                    <input type="number" min={1} max={10} value={newExp.rounds}
                      onChange={e => setNewExp(prev => ({ ...prev, rounds: Number(e.target.value) }))}
                      className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-sm text-[var(--text-h)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-h)] mb-1">Result</label>
                    <select value={newExp.result} onChange={e => setNewExp(prev => ({ ...prev, result: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-sm text-[var(--text-h)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]">
                      {['Selected','Rejected','Pending'].map(r => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-h)] mb-1">Your Experience</label>
                  <textarea rows={4} placeholder="Describe the interview process, questions asked, tips for others…"
                    value={newExp.experience} onChange={e => setNewExp(prev => ({ ...prev, experience: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-sm text-[var(--text-h)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)] resize-none" />
                </div>
                <div className="flex gap-2">
                  <button onClick={handleSubmitExp} className="px-4 py-2 rounded-lg bg-[var(--brand)] text-white text-sm font-semibold hover:bg-[var(--brand-dark)] transition-colors">Submit</button>
                  <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-[var(--border)] text-sm font-semibold text-[var(--text)] hover:text-[var(--text-h)] transition-colors">Cancel</button>
                </div>
              </div>
            )}
            {experiences.map(exp => (
              <div key={exp.id} className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="font-bold text-[var(--text-h)]">{exp.company_name} — {exp.role}</h3>
                    <p className="text-xs text-[var(--text)] mt-0.5">🔄 {exp.rounds} rounds · {exp.year}</p>
                  </div>
                  <Badge variant={exp.result === 'Selected' ? 'success' : exp.result === 'Rejected' ? 'error' : 'warning'}>{exp.result}</Badge>
                </div>
                <p className="text-sm text-[var(--text)] leading-relaxed">{exp.experience}</p>
              </div>
            ))}
            {experiences.length === 0 && <div className="text-center py-12 text-[var(--text)]">No experiences shared yet. Be the first!</div>}
          </div>
        )}
      </div>
    </>
  )
}
