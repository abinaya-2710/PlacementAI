import { Link } from 'react-router-dom'

interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  action?: { label: string; to: string }
}

export default function EmptyState({ icon = '📭', title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <span className="text-5xl mb-4" aria-hidden="true">{icon}</span>
      <h3 className="text-lg font-bold text-[var(--text-h)] mb-2">{title}</h3>
      {description && <p className="text-sm text-[var(--text)] max-w-sm">{description}</p>}
      {action && (
        <Link
          to={action.to}
          className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--brand)] text-white text-sm font-semibold hover:bg-[var(--brand-dark)] transition-colors"
        >
          {action.label}
        </Link>
      )}
    </div>
  )
}
