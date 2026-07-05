import PageHeader from '../../components/ui/PageHeader'
import Badge from '../../components/ui/Badge'
import { useLeaderboard } from '../../hooks/useLeaderboard'
import type { LeaderboardEntry } from '../../types'

const MEDAL = ['🥇','🥈','🥉']
const AVATAR_BG = ['bg-purple-500','bg-blue-500','bg-emerald-500','bg-orange-500','bg-pink-500','bg-cyan-500','bg-red-500','bg-teal-500','bg-violet-500','bg-yellow-500']

type Period = 'weekly'|'monthly'|'all-time'

function PodiumCard({ entry, position }: { entry: LeaderboardEntry; position: number }) {
  return (
    <div className={`flex flex-col items-center gap-2 p-4 rounded-xl border ${
      entry.rank === 1 ? 'border-yellow-300 bg-yellow-50 dark:border-yellow-700 dark:bg-yellow-950/20' : 'border-[var(--border)] bg-[var(--bg)]'
    }`}>
      <span className="text-2xl" aria-hidden="true">{MEDAL[position]}</span>
      <div className={`w-10 h-10 rounded-full ${AVATAR_BG[entry.rank % AVATAR_BG.length]} flex items-center justify-center text-white text-xs font-bold`}>{entry.initials}</div>
      <div className="text-center">
        <p className="text-xs font-bold text-[var(--text-h)] truncate max-w-[80px]">{entry.full_name.split(' ')[0]}</p>
        <p className="text-[10px] text-[var(--text)]">{entry.score.toLocaleString()} pts</p>
      </div>
    </div>
  )
}

function Skeleton() {
  return <div className="space-y-2 animate-pulse">{[...Array(10)].map((_,i) => <div key={i} className="h-14 rounded-xl bg-[var(--border)]" />)}</div>
}

export default function LeaderboardPage() {
  const { entries, period, loading, error, changePeriod } = useLeaderboard()

  const top3 = entries.slice(0, 3)
  const podiumOrder: LeaderboardEntry[] = top3.length >= 3 ? [top3[1], top3[0], top3[2]] : top3

  return (
    <>
      <PageHeader title="Leaderboard" subtitle="See how you rank against students preparing on PlacePrep AI." />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Period tabs */}
        <div className="flex gap-1 border-b border-[var(--border)] mb-8">
          {(['weekly','monthly','all-time'] as Period[]).map(p => (
            <button key={p} onClick={() => changePeriod(p)}
              className={`px-5 py-2.5 text-sm font-semibold capitalize border-b-2 transition-colors ${
                period === p ? 'border-[var(--brand)] text-[var(--brand)]' : 'border-transparent text-[var(--text)] hover:text-[var(--text-h)]'
              }`}>{p}</button>
          ))}
        </div>

        {error && <div className="text-center py-12 text-[var(--text)]">{error}</div>}
        {loading && <Skeleton />}

        {!loading && !error && entries.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <span className="text-4xl" aria-hidden="true">🏆</span>
            <p className="font-semibold text-[var(--text-h)]">No rankings yet</p>
            <p className="text-sm text-[var(--text)]">Complete roadmap topics to appear on the leaderboard!</p>
          </div>
        )}

        {!loading && !error && entries.length > 0 && (
          <>
            {/* Podium */}
            {podiumOrder.length === 3 && (
              <div className="grid grid-cols-3 gap-3 mb-8">
                {podiumOrder.map((e, i) => <PodiumCard key={e.user_id} entry={e} position={i === 0 ? 1 : i === 1 ? 0 : 2} />)}
              </div>
            )}

            {/* Table */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[var(--bg-muted)] border-b border-[var(--border)]">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold text-[var(--text)] w-14">Rank</th>
                      <th className="text-left px-4 py-3 font-semibold text-[var(--text)]">Student</th>
                      <th className="text-left px-4 py-3 font-semibold text-[var(--text)]">Score</th>
                      <th className="text-left px-4 py-3 font-semibold text-[var(--text)] hidden md:table-cell">Streak</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {entries.map(e => (
                      <tr key={e.user_id} className={`transition-colors ${e.is_me ? 'bg-purple-50/70 dark:bg-purple-950/20' : 'hover:bg-[var(--bg-muted)]'}`}>
                        <td className="px-4 py-3 font-bold text-[var(--text-h)]">
                          {e.rank <= 3 ? MEDAL[e.rank - 1] : `#${e.rank}`}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-7 h-7 rounded-full ${AVATAR_BG[e.rank % AVATAR_BG.length]} flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0`}>{e.initials}</div>
                            <span className="font-semibold text-[var(--text-h)]">{e.full_name}</span>
                            {e.is_me && <Badge variant="brand">You</Badge>}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-bold text-[var(--brand)]">{e.score.toLocaleString()}</td>
                        <td className="px-4 py-3 text-[var(--text)] hidden md:table-cell">🔥 {e.streak}d</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}
