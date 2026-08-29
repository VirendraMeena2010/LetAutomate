import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

export function StatCard({
  title,
  value,
  description,
}: {
  title: string
  value: string | number
  description?: string
}) {
  return (
    <Card className="relative overflow-hidden bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-xl shadow-black/20 hover:border-slate-700/80 transition-all duration-300 group">
      {/* Top accent glow line */}
      <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-blue-500/40 to-transparent" />

      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-slate-400 tracking-wide">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-extrabold text-white tracking-tight bg-linear-to-r from-white via-slate-100 to-slate-300 bg-clip-text">
          {value}
        </div>
        {description && (
          <p className="text-xs text-slate-400 mt-1.5 font-normal leading-relaxed">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  )
}