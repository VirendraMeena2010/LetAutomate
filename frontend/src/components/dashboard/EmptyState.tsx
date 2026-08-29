import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}) {
  return (
    <div className="relative flex flex-col items-center justify-center py-16 text-center overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Icon Container with glowing border */}
      <div className="relative h-14 w-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4 text-blue-400 shadow-lg shadow-blue-500/10">
        <Search className="h-6 w-6" />
      </div>

      <h3 className="text-lg font-semibold text-slate-100 tracking-tight">{title}</h3>
      <p className="text-sm text-slate-400 mt-1 max-w-sm leading-relaxed">{description}</p>

      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="mt-6 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium shadow-lg shadow-blue-500/20 border-0"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  )
}


