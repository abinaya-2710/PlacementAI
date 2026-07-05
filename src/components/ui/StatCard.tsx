interface StatCardProps {
  icon: string
  label: string
  value: string
  sub?: string
  color?: string
}

export default function StatCard({ icon, label, value, sub, color = 'text-[var(--brand)]' }: StatCardProps) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--bg)]">
      <span className="text-2xl flex-shrink-0" aria-hidden="true">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-[var(--text)] font-medium truncate">{label}</p>
        <p className={`text-xl font-extrabold leading-tight ${color}`}>{value}</p>
        {sub && <p className="text-xs text-[var(--text)] mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}
