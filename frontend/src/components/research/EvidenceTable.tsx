import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import type { EvidenceItem } from '@/types/research'

export function EvidenceTable({ evidence }: { evidence: EvidenceItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Evidence</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2 font-medium text-slate-500">Source</th>
                <th className="text-left py-3 px-2 font-medium text-slate-500">Finding</th>
                <th className="text-left py-3 px-2 font-medium text-slate-500">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {evidence.map((item, index) => (
                <tr key={index} className="border-b last:border-0">
                  <td className="py-3 px-2 font-medium text-slate-900">{item.source}</td>
                  <td className="py-3 px-2 text-slate-600">{item.finding}</td>
                  <td className="py-3 px-2">
                    <Badge variant={item.confidence >= 80 ? 'success' : item.confidence >= 60 ? 'default' : 'secondary'}>
                      {item.confidence}%
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}