import { Card, CardContent,   } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/dashboard/EmptyState'
import { Search, ArrowRight } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

// BACKEND GAP: No GET /research endpoint documented yet.
// This component is a UI shell ready for real data.

interface ResearchItem {
  research_id: string
  target_company_name: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  score?: number
  created_at: string
}

export function ResearchHistory() {
  const { companyId } = useParams()

  // BACKEND GAP: Replace with useResearchHistory(companyId) when available
  const researches: ResearchItem[] = []

  if (researches.length === 0) {
    return (
      <EmptyState
        title="No research yet"
        description="Start your first company research to see results here."
        actionLabel="Start Research"
        onAction={() => {
          window.location.href = `/app/company/${companyId}/research/new`
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Research History</h2>
        <Link to={`/app/company/${companyId}/research/new`}>
          <Button>
            <Search className="mr-2 h-4 w-4" />
            New Research
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        {researches.map((research) => (
          <Card key={research.research_id} className="hover:shadow-sm transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-medium text-slate-900">{research.target_company_name}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(research.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge
                    variant={
                      research.status === 'completed'
                        ? 'success'
                        : research.status === 'failed'
                        ? 'destructive'
                        : 'default'
                    }
                  >
                    {research.status}
                  </Badge>
                  {typeof research.score === 'number' && (
                    <span className="text-sm font-semibold text-slate-700">
                      {research.score}/100
                    </span>
                  )}
                  <Link to={`/app/company/${companyId}/research/${research.research_id}`}>
                    <Button size="sm" variant="ghost">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}


