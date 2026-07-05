import { useState } from 'react'
import PageHeader from '../../components/ui/PageHeader'
import Badge from '../../components/ui/Badge'
import StatCard from '../../components/ui/StatCard'
import { fetchAptitudeQuestions, fetchAptitudeStats, submitAttempt } from '../../services/aptitudeService'
import { useAuth } from '../../context/AuthContext'
import type { AptitudeQuestion, AptitudeCategory, TopicDifficulty } from '../../types'

const TABS = ['quant', 'logical', 'verbal'] as const
const TAB_LABELS: Record<AptitudeCategory, string> = { quant: 'Quantitative', logical: 'Logical Reasoning', verbal: 'Verbal Ability' }
const DIFF_VARIANT: Record<TopicDifficulty, 'success'|'warning'|'error'> = { Easy:'success', Medium:'warning', Hard:'error' }

type RevealMap = Record<number, { correct: string; explanation: string; selected: string } | null>

export default function AptitudePage() {
  const { isAuthenticated } = useAuth()
  const [tab,      setTab]      = useState<AptitudeCategory>('quant')
  const [loading,  setLoading]  = useState(false)
  const [questions,setQuestions]= useState<AptitudeQuestion[]>([])
  const [reveal,   setReveal]   = useState<RevealMap>({})
  const [stats,    setStats]    = useState<{ total_attempts: number; correct: number; accuracy: number } | null>(null)
  const [loaded,   setLoaded]   = useState<Set<AptitudeCategory>>(new Set())

  const loadTab = async (t: AptitudeCategory) => {
    setTab(t)
    if (loaded.has(t)) return
    setLoading(true)
    const { data } = await fetchAptitudeQuestions({ category: t, limit: 20 })
    if (data) setQuestions(prev => {
      const ids = new Set(prev.map(q => q.id))
      return [...prev, ...data.questions.filter(q => !ids.has(q.id))]
    })
    if (isAuthenticated) {
      const { data: s } = await fetchAptitudeStats()
      if (s) setStats(s)
    }
    setLoaded(prev => new Set(prev).add(t))
    setLoading(false)
  }

  // Load first tab on first render
  useState(() => { loadTab('quant') })

  const handleAnswer = async (qid: number, selected: string) => {
    if (reveal[qid]) return
    if (!isAuthenticated) {
      // Guest: just fetch the answer from question detail
      const q = questions.find(x => x.id === qid)
      if (q) setReveal(prev => ({ ...prev, [qid]: { correct: '?', explanation: 'Login to see the answer.', selected } }))
      return
    }
    const { data } = await submitAttempt(qid, selected)
    if (data) setReveal(prev => ({ ...prev, [qid]: { correct: data.answer, explanation: data.explanation, selected } }))
  }

  const tabQs = questions.filter(q => q.category === tab)

  return (
    <>
      <PageHeader title="Aptitude Practice" subtitle="Master quantitative, logical, and verbal reasoning for placement tests." />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {isAuthenticated && stats && (
          <div className="grid grid-cols-3 gap-4">
            <StatCard icon="📝" label="Total Attempts" value={String(stats.total_attempts)} />
            <StatCard icon="✅" label="Correct"        value={String(stats.correct)} />
            <StatCard icon="🎯" label="Accuracy"       value={`${stats.accuracy}%`} />
          </div>
        )}

        {/* Category tabs */}
        <div className="flex border-b border-[var(--border)] gap-1 overflow-x-auto">
          {TABS.map(t => (
            <button key={t} onClick={() => loadTab(t)}
              className={`px-5 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                tab === t ? 'border-[var(--brand)] text-[var(--brand)]' : 'border-transparent text-[var(--text)] hover:text-[var(--text-h)]'
              }`}>
              {TAB_LABELS[t]}
            </button>
          ))}
        </div>

        {loading && (
          <div className="space-y-4 animate-pulse">
            {[...Array(5)].map((_,i) => <div key={i} className="h-28 rounded-xl bg-[var(--border)]" />)}
          </div>
        )}

        {!loading && tabQs.length === 0 && (
          <div className="text-center py-12 text-[var(--text)]">No questions loaded yet.</div>
        )}

        {!loading && tabQs.map(q => {
          const r = reveal[q.id]
          return (
            <div key={q.id} className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium text-[var(--text-h)]">{q.question}</p>
                <div className="flex gap-2 flex-shrink-0">
                  <Badge variant={DIFF_VARIANT[q.difficulty]}>{q.difficulty}</Badge>
                  <Badge variant="neutral">{q.topic}</Badge>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(['A','B','C','D'] as const).map(opt => {
                  const text = q[`option_${opt.toLowerCase()}` as keyof AptitudeQuestion] as string
                  const isCorrect = r?.correct === opt
                  const isSelected = r?.selected === opt
                  const isWrong = isSelected && !isCorrect
                  return (
                    <button key={opt} onClick={() => handleAnswer(q.id, opt)} disabled={!!r}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-left border transition-all ${
                        !r ? 'border-[var(--border)] hover:border-[var(--brand)] hover:bg-purple-50 dark:hover:bg-purple-950/20'
                          : isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400'
                          : isWrong   ? 'border-red-500   bg-red-50   dark:bg-red-950/30   text-red-700   dark:text-red-400'
                          : 'border-[var(--border)] opacity-60'
                      }`}>
                      <span className="font-bold w-5 flex-shrink-0">{opt}.</span>{text}
                    </button>
                  )
                })}
              </div>
              {r && (
                <div className={`rounded-lg p-3 text-sm ${r.correct === r.selected ? 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400' : 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400'}`}>
                  <span className="font-semibold">{r.correct === r.selected ? '✅ Correct! ' : `❌ Wrong. Answer: ${r.correct}. `}</span>
                  {r.explanation}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}
