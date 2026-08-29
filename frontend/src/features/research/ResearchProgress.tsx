import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, Check, Circle } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

// BACKEND GAP: This is a UI placeholder for research progress.
// The backend does not currently expose a status/progress endpoint.
// Once GET /research/:id/status or similar is available, connect real data.

interface ProgressStep {
  label: string
  status: 'pending' | 'processing' | 'completed'
}

const defaultSteps: ProgressStep[] = [
  { label: 'Initializing', status: 'completed' },
  { label: 'Company Research', status: 'completed' },
  { label: 'Website Analysis', status: 'processing' },
  { label: 'Intelligence Analysis', status: 'pending' },
  { label: 'ICP Matching', status: 'pending' },
  { label: 'Final Report', status: 'pending' },
]

export function ResearchProgress() {
  const { companyId } = useParams()
  const [steps, setSteps] = useState<ProgressStep[]>(defaultSteps)
  const [currentStep, setCurrentStep] = useState(2)

  // Simulate progress for demo purposes. Remove once backend provides real status.
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(interval)
          return prev
        }
        const next = prev + 1
        setSteps((s) =>
          s.map((step, idx) => ({
            ...step,
            status: idx < next ? 'completed' : idx === next ? 'processing' : 'pending',
          }))
        )
        return next
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const allComplete = currentStep >= steps.length - 1

  return (
    <div className="max-w-xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Researching Company</CardTitle>
          <p className="text-sm text-slate-500">
            AgentReach is analyzing the target company. This may take a few moments.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  {step.status === 'completed' && (
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                  )}
                  {step.status === 'processing' && (
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
                    </div>
                  )}
                  {step.status === 'pending' && (
                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                      <Circle className="h-4 w-4 text-slate-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium ${
                      step.status === 'pending' ? 'text-slate-400' : 'text-slate-900'
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {allComplete && (
            <div className="text-center pt-4 border-t">
              <p className="text-sm text-green-600 font-medium mb-3">Research complete!</p>
              <Link to={`/app/company/${companyId}/research/result`}>
                <Button>View Results</Button>
              </Link>
            </div>
          )}

          {!allComplete && (
            <div className="text-center pt-4 border-t">
              <p className="text-xs text-slate-400">
                Processing... Please do not close this window.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <p className="text-xs text-center text-slate-400 mt-4">
        BACKEND GAP: Real-time progress requires a status endpoint. Currently simulated.
      </p>
    </div>
  )
}


