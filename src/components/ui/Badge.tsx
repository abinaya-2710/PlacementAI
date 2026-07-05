type BadgeVariant = 'brand' | 'success' | 'warning' | 'error' | 'info' | 'neutral'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  size?: 'sm' | 'md'
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  brand:   'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  success: 'bg-green-100  text-green-700  dark:bg-green-900/40  dark:text-green-300',
  warning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  error:   'bg-red-100    text-red-700    dark:bg-red-900/40    dark:text-red-300',
  info:    'bg-blue-100   text-blue-700   dark:bg-blue-900/40   dark:text-blue-300',
  neutral: 'bg-gray-100   text-gray-600   dark:bg-gray-800      dark:text-gray-300',
}

export default function Badge({ children, variant = 'neutral', size = 'sm' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full ${
        size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
      } ${VARIANT_CLASSES[variant]}`}
    >
      {children}
    </span>
  )
}
