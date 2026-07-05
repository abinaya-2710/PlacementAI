interface PageHeaderProps {
  title: string
  subtitle?: string
  children?: React.ReactNode
}

export default function PageHeader({ title, subtitle, children }: PageHeaderProps) {
  return (
    <div className="bg-[var(--bg-muted)] border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text-h)]">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-1 text-sm text-[var(--text)] max-w-2xl">{subtitle}</p>
            )}
          </div>
          {children && <div className="flex items-center gap-3">{children}</div>}
        </div>
      </div>
    </div>
  )
}
