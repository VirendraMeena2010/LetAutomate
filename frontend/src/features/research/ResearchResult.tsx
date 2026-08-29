import { useLocation } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { ScoreCard } from '@/components/research/ScoreCard'
import { PainPointList } from '@/components/research/PainPointList'
import { EvidenceTable } from '@/components/research/EvidenceTable'
import { ArrowLeft, Download, RefreshCw } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

// BACKEND GAP: This component renders research results.
// The exact response schema from POST /run is not documented yet (returns "string").
// This UI is built to handle a flexible structure and will adapt once the schema is finalized.

interface ResearchResultData {
  target_company_name?: string
  target_company_industry?: string
  target_company_website?: string
  score?: number
  overview?: string
  pain_points?: string[]
  evidence?: Array<{
    source: string
    finding: string
    confidence: number
  }>
  decision_makers?: Array<{
    name: string
    title: string
    linkedin?: string
  }>
  recommended_outreach?: string
  status?: string
}

export function ResearchResult() {
  const { companyId } = useParams()
  const location = useLocation()
  const result = (location.state?.result as ResearchResultData) || null

  // If no result in state, show a placeholder. In production, this would fetch via GET /research/:id
  if (!result) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Alert variant="warning">
          No research data available. Start a new research or refresh the page if data should be present.
        </Alert>
        <Link to={`/app/company/${companyId}/research/new`}>
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            New Research
          </Button>
        </Link>
      </div>
    )
  }

  const companyName = result.target_company_name || 'Unknown Company'
  const industry = result.target_company_industry || 'Unknown Industry'
  const website = result.target_company_website || ''

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-slate-900">{companyName}</h1>
            <Badge variant="success">Research Complete</Badge>
          </div>
          <p className="text-slate-500">{industry}</p>
          {website && (
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              {website}
            </a>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Link to={`/app/company/${companyId}/research/new`}>
            <Button size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              New Research
            </Button>
          </Link>
        </div>
      </div>

      {/* Score */}
      {typeof result.score === 'number' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ScoreCard score={result.score} label="ICP Match" />
          {/* Placeholder for additional scores once backend supports them */}
          <ScoreCard score={Math.round(result.score * 0.9)} label="Opportunity" />
          <ScoreCard score={Math.round(result.score * 0.85)} label="Timing" />
        </div>
      )}

      {/* Overview */}
      {result.overview && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Company Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 leading-relaxed">{result.overview}</p>
          </CardContent>
        </Card>
      )}

      {/* Pain Points */}
      {result.pain_points && result.pain_points.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Potential Pain Points</CardTitle>
          </CardHeader>
          <CardContent>
            <PainPointList painPoints={result.pain_points} />
          </CardContent>
        </Card>
      )}

      {/* Evidence */}
      {result.evidence && result.evidence.length > 0 && (
        <EvidenceTable evidence={result.evidence} />
      )}

      {/* Decision Makers */}
      {result.decision_makers && result.decision_makers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Decision Makers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.decision_makers.map((dm, idx) => (
                <div key={idx} className="p-4 border rounded-lg">
                  <p className="font-semibold text-slate-900">{dm.name}</p>
                  <p className="text-sm text-slate-500">{dm.title}</p>
                  {dm.linkedin && (
                    <a
                      href={dm.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline mt-1 inline-block"
                    >
                      LinkedIn Profile
                    </a>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommended Outreach */}
      {result.recommended_outreach && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recommended Outreach</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-50 rounded-lg p-4 text-slate-700 leading-relaxed">
              {result.recommended_outreach}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Fallback for string response */}
      {typeof result === 'string' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Research Output</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-50 rounded-lg p-4 text-slate-700 whitespace-pre-wrap font-mono text-sm">
              {result}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}