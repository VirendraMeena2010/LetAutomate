import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Building2, Plus, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// BACKEND GAP: This component currently only shows the active company.
// When GET /owner/companies is available, replace with real data.

export function CompanySwitcher() {
  const { company } = useAuth()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Your Companies</h2>
        <Link to="/app/companies/new">
          <Button size="sm" variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Add Company
          </Button>
        </Link>
      </div>

      {company.isAuthenticated && company.company ? (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-base">{company.company.company_name}</CardTitle>
                <p className="text-xs text-slate-500">{company.company.industry}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Currently active</span>
              <Link to={`/app/company/${company.company.company_id}`}>
                <Button size="sm" variant="outline">
                  Open
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-8 text-center">
            <Building2 className="h-8 w-8 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500">No companies yet.</p>
            <Link to="/app/companies/new" className="text-sm text-blue-600 hover:underline mt-1 inline-block">
              Create your first company
            </Link>
          </CardContent>
        </Card>
      )}

      {/* BACKEND GAP: Company list will render here once GET /owner/companies exists */}
      <div className="hidden">
        <p className="text-xs text-slate-400 text-center py-4">
          Additional companies will appear here when the backend supports listing owner companies.
        </p>
      </div>
    </div>
  )
}


