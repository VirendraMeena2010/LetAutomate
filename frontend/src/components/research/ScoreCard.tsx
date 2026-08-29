import { Card, CardContent } from '@/components/ui/Card'

export function ScoreCard({ score, label }: { score: number; label: string }) {
  const getColor = () => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getBg = () => {
    if (score >= 80) return 'bg-green-50 border-green-200'
    if (score >= 60) return 'bg-yellow-50 border-yellow-200'
    return 'bg-red-50 border-red-200'
  }

  return (
    <Card className={getBg()}>
      <CardContent className="p-6 text-center">
        <div className={cn('text-5xl font-bold', getColor())}>{score}</div>
        <div className="text-sm text-slate-600 mt-2 font-medium uppercase tracking-wide">{label}</div>
        <div className="text-xs text-slate-500 mt-1">
          {score >= 80 ? 'Excellent Fit' : score >= 60 ? 'Good Fit' : 'Low Fit'}
        </div>
      </CardContent>
    </Card>
  )
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}