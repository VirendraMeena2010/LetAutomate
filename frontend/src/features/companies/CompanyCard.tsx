import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Building2, ArrowRight } from 'lucide-react'
import type { Company } from '@/types/auth'

export function CompanyCard({ company }: { company: Company }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <Building2 className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-lg">{company.company_name}</CardTitle>
            <CardDescription>{company.industry}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm text-slate-600">
          <p>{company.company_website}</p>
          <p>{company.country}</p>
        </div>
        <div className="mt-4 pt-4 border-t flex items-center justify-between">
          {/* BACKEND GAP: Research count not available yet */}
          <span className="text-xs text-slate-500">Researches: --</span>
          <Link to={`/app/company/${company.company_id}`}>
            <Button size="sm" variant="outline">
              Open Company
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}


