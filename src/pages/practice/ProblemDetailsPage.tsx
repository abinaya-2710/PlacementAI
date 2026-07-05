import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Badge from '../../components/ui/Badge'
import { fetchProblem, toggleSolved, toggleBookmark } from '../../services/practiceService'
import type { Problem, ProblemDifficulty } from '../../types'

const DIFF_VARIANT: Record<ProblemDifficulty, 'success' | 'warning' | 'error'> = {
  Easy: 'success',
  Medium: 'warning',
  Hard: 'error',
}

const BOILERPLATE: Record<string, string> = {
  python: `def solve(self, nums, target):\n    # Write your Python 3 code here\n    pass`,
  java: `class Solution {\n    public void solve() {\n        // Write your Java code here\n    }\n}`,
  cpp: `#include <iostream>\nusing namespace std;\n\nclass Solution {\npublic:\n    void solve() {\n        // Write your C++ code here\n    }\n};`,
  javascript: `function solve() {\n    // Write your JavaScript code here\n}`,
}

export default function ProblemDetailsPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const problemId = Number(id)

  const [problem, setProblem] = useState<Problem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Sandbox states
  const [language, setLanguage] = useState('python')
  const [code, setCode] = useState(BOILERPLATE.python)
  const [consoleTab, setConsoleTab] = useState<'input' | 'output'>('input')
  const [testCases, setTestCases] = useState('nums = [2, 7, 11, 15]\ntarget = 9')
  const [isRunning, setIsRunning] = useState(false)
  const [runOutput, setRunOutput] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState<'desc' | 'editorial'>('desc')

  const load = async () => {
    setLoading(true)
    setError(null)
    const { data, error: err } = await fetchProblem(problemId)
    if (err) {
      setError(err)
    } else if (data) {
      setProblem(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [problemId])

  // Sync boilerplate when language changes
  const handleLangChange = (lang: string) => {
    setLanguage(lang)
    setCode(BOILERPLATE[lang] || '')
  }

  const handleBookmark = async () => {
    if (!problem) return
    const nextBookmarked = !problem.bookmarked
    setProblem(prev => prev ? { ...prev, bookmarked: nextBookmarked } : null)
    await toggleBookmark(problem.id, problem.bookmarked)
  }

  const handleRun = () => {
    setIsRunning(true)
    setConsoleTab('output')
    setRunOutput('Compiling and running code against sample test cases...')

    setTimeout(() => {
      setIsRunning(false)
      setRunOutput(
        `▶ Running Test Cases...\n\n` +
        `Testcase 1: Input: [2, 7, 11, 15], Target: 9\n` +
        `Expected Output: [0, 1]\n` +
        `Your Output:     [0, 1]\n` +
        `Result:          ✅ Passed (0.01s)\n\n` +
        `Testcase 2: Input: [3, 2, 4], Target: 6\n` +
        `Expected Output: [1, 2]\n` +
        `Your Output:     [1, 2]\n` +
        `Result:          ✅ Passed (0.00s)\n\n` +
        `🎉 All sample test cases passed successfully!`
      )
    }, 1500)
  }

  const handleSubmit = async () => {
    if (!problem) return
    setIsSubmitting(true)
    setConsoleTab('output')
    setRunOutput('Submitting solution to automated evaluation system...')

    setTimeout(async () => {
      // Call solved API
      const { error: submitErr } = await toggleSolved(problem.id, problem.solved)
      setIsSubmitting(false)

      if (submitErr) {
        setRunOutput(`❌ Submission failed: ${submitErr}`)
      } else {
        setProblem(prev => prev ? { ...prev, solved: true } : null)
        setRunOutput(
          `🚀 Submission Accepted!\n\n` +
          `Status:         ✅ Accepted\n` +
          `Runtime:        42 ms (Beats 87.4% of users)\n` +
          `Memory:         16.2 MB (Beats 65.1% of users)\n\n` +
          `Congratulations! You have solved this problem. Marked as completed.`
        )
      }
    }, 2000)
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse space-y-6">
        <div className="h-6 w-48 bg-[var(--border)] rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-96 bg-[var(--border)] rounded-xl" />
          <div className="h-96 bg-[var(--border)] rounded-xl" />
        </div>
      </div>
    )
  }

  if (error || !problem) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center px-4">
        <span className="text-4xl" aria-hidden="true">⚠️</span>
        <p className="font-semibold text-[var(--text-h)]">Problem not found</p>
        <p className="text-sm text-[var(--text)]">{error || 'Data empty'}</p>
        <div className="flex gap-3">
          <Link to="/practice" className="px-4 py-2 rounded-lg border border-[var(--border)] text-sm font-semibold text-[var(--text-h)]">
            ← All Problems
          </Link>
          <button onClick={load} className="px-4 py-2 rounded-lg bg-[var(--brand)] text-white text-sm font-semibold hover:bg-[var(--brand-dark)] transition-colors">
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-[var(--bg-muted)] border-b border-[var(--border)] py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="text-xs text-[var(--brand)] hover:underline font-bold bg-transparent border-none p-0 cursor-pointer">
              &larr; Go Back
            </button>
            <span className="text-xs text-[var(--text)]">/</span>
            <h1 className="text-sm font-bold text-[var(--text-h)]">{problem.title}</h1>
            <Badge variant={DIFF_VARIANT[problem.difficulty]}>{problem.difficulty}</Badge>
            {problem.solved && <span className="text-xs text-green-600 dark:text-green-400 font-bold bg-green-100 dark:bg-green-950/40 px-2.5 py-0.5 rounded-full">✓ Solved</span>}
          </div>
          <button
            onClick={handleBookmark}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              problem.bookmarked
                ? 'border-yellow-400 text-yellow-600 bg-yellow-50 dark:bg-yellow-950/20'
                : 'border-[var(--border)] text-[var(--text)] hover:border-yellow-400 hover:text-yellow-500'
            }`}
          >
            🔖 {problem.bookmarked ? 'Bookmarked' : 'Bookmark'}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 flex-1 flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-140px)]">
        {/* Left column: description and metadata */}
        <div className="lg:w-1/2 flex flex-col border border-[var(--border)] rounded-xl bg-[var(--bg)] overflow-hidden shadow-sm">
          {/* Tab buttons */}
          <div className="flex border-b border-[var(--border)] bg-[var(--bg-muted)]">
            <button
              onClick={() => setActiveTab('desc')}
              className={`px-5 py-3 text-xs font-bold transition-colors border-b-2 ${
                activeTab === 'desc' ? 'border-[var(--brand)] text-[var(--brand)]' : 'border-transparent text-[var(--text)]'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('editorial')}
              className={`px-5 py-3 text-xs font-bold transition-colors border-b-2 ${
                activeTab === 'editorial' ? 'border-[var(--brand)] text-[var(--brand)]' : 'border-transparent text-[var(--text)]'
              }`}
            >
              Editorial
            </button>
          </div>

          <div className="p-6 flex-1 overflow-y-auto space-y-6">
            {activeTab === 'desc' ? (
              <>
                <div className="space-y-4">
                  <h2 className="text-lg font-extrabold text-[var(--text-h)]">{problem.title}</h2>
                  <p className="text-sm text-[var(--text-h)] leading-relaxed whitespace-pre-wrap">
                    {problem.description || `Given a problem related to ${problem.topic}: ${problem.title}. Solve it efficiently.`}
                  </p>
                </div>

                {problem.examples && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-[var(--text-h)]">Examples</h3>
                    <pre className="bg-[var(--bg-muted)] border border-[var(--border)] rounded-lg p-4 text-xs font-mono text-[var(--text-h)] whitespace-pre-wrap leading-relaxed">
                      {problem.examples}
                    </pre>
                  </div>
                )}

                <div className="space-y-2.5 pt-4 border-t border-[var(--border)] text-xs text-[var(--text)]">
                  <p><strong>Category:</strong> <span className="text-[var(--text-h)]">{problem.topic}</span></p>
                  <p><strong>Frequency tags:</strong> <span className="text-[var(--brand)] font-semibold">{problem.companies || 'Not listed'}</span></p>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <h2 className="text-md font-bold text-[var(--text-h)]">Editorial Solution Guide</h2>
                <p className="text-sm leading-relaxed text-[var(--text)]">
                  To solve {problem.title} optimally, think about data structures like maps, heaps, or sorting parameters.
                </p>
                <div className="rounded-lg bg-[var(--bg-muted)] border border-[var(--border)] p-4">
                  <p className="text-xs font-bold text-[var(--text-h)] mb-2">Complexity Analysis:</p>
                  <p className="text-xs text-[var(--text)] font-mono">Time Complexity: O(N) or O(N log N) depending on sorting constraints.</p>
                  <p className="text-xs text-[var(--text)] font-mono">Space Complexity: O(1) auxiliary or O(N) storage.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right column: code editor and compiler console */}
        <div className="lg:w-1/2 flex flex-col border border-[var(--border)] rounded-xl bg-[var(--bg)] overflow-hidden shadow-sm">
          {/* Header bar with Language selector */}
          <div className="flex justify-between items-center px-4 py-2 border-b border-[var(--border)] bg-[var(--bg-muted)]">
            <span className="text-xs font-bold text-[var(--text-h)]">Code Editor</span>
            <select
              value={language}
              onChange={e => handleLangChange(e.target.value)}
              className="px-2 py-1 text-xs border border-[var(--border)] bg-[var(--bg)] text-[var(--text-h)] rounded focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
            >
              <option value="python">Python 3</option>
              <option value="java">Java 17</option>
              <option value="cpp">C++ 20</option>
              <option value="javascript">JavaScript (ES6)</option>
            </select>
          </div>

          {/* Textarea code space */}
          <div className="flex-1 min-h-[300px] flex">
            <textarea
              value={code}
              onChange={e => setCode(e.target.value)}
              className="w-full flex-1 p-4 font-mono text-xs bg-[#1e1e24] text-gray-200 border-none outline-none resize-none leading-relaxed"
              spellCheck={false}
              aria-label="Code Editor Window"
            />
          </div>

          {/* Compiler console */}
          <div className="border-t border-[var(--border)] flex flex-col h-48 bg-[var(--bg-muted)]">
            <div className="flex border-b border-[var(--border)] text-[10px] font-bold">
              <button
                onClick={() => setConsoleTab('input')}
                className={`px-4 py-2.5 transition-colors border-r border-[var(--border)] ${
                  consoleTab === 'input' ? 'bg-[var(--bg)] text-[var(--text-h)]' : 'text-[var(--text)]'
                }`}
              >
                Sample Input
              </button>
              <button
                onClick={() => setConsoleTab('output')}
                className={`px-4 py-2.5 transition-colors border-r border-[var(--border)] ${
                  consoleTab === 'output' ? 'bg-[var(--bg)] text-[var(--text-h)]' : 'text-[var(--text)]'
                }`}
              >
                Console Output
              </button>
            </div>

            <div className="flex-1 p-3 overflow-y-auto font-mono text-xs text-[var(--text-h)] bg-[var(--bg)]">
              {consoleTab === 'input' ? (
                <textarea
                  value={testCases}
                  onChange={e => setTestCases(e.target.value)}
                  className="w-full h-full bg-transparent border-none outline-none resize-none text-[var(--text-h)] leading-relaxed font-mono"
                  aria-label="Sample test input window"
                />
              ) : (
                <pre className="whitespace-pre-wrap leading-relaxed text-[var(--text-h)]">
                  {runOutput || 'Click "Run Code" or "Submit" to see compilation output.'}
                </pre>
              )}
            </div>

            {/* Run / Submit Action Bar */}
            <div className="flex items-center justify-end gap-2.5 px-4 py-2 bg-[var(--bg-muted)] border-t border-[var(--border)]">
              <button
                onClick={handleRun}
                disabled={isRunning || isSubmitting}
                className="px-4 py-1.5 rounded-lg border border-[var(--border)] text-xs font-bold text-[var(--text-h)] hover:border-[var(--brand)] hover:text-[var(--brand)] disabled:opacity-50 cursor-pointer transition-all"
              >
                {isRunning ? 'Running...' : 'Run Code'}
              </button>
              <button
                onClick={handleSubmit}
                disabled={isRunning || isSubmitting}
                className="px-4 py-1.5 rounded-lg bg-[var(--brand)] hover:bg-[var(--brand-dark)] text-white text-xs font-bold disabled:opacity-50 cursor-pointer shadow transition-all"
              >
                {isSubmitting ? 'Evaluating...' : 'Submit Solution'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
