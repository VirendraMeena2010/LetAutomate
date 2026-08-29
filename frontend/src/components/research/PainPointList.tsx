import { AlertTriangle } from 'lucide-react'

export function PainPointList({ painPoints }: { painPoints: string[] }) {
  return (
    <div className="space-y-3">
      {painPoints.map((point, index) => (
        <div key={index} className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">
              Pain Point {String(index + 1).padStart(2, '0')}
            </span>
            <p className="text-sm text-slate-700 mt-1">{point}</p>
          </div>
        </div>
      ))}
    </div>
  )
}


