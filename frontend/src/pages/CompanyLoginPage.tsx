import { CompanyLoginForm } from '@/features/companies/CompanyLoginForm'
import { Building2, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default   function CompanyLoginPage() {
  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <Link to="/app">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <div className="text-center mb-6">
        <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-3">
          <Building2 className="h-6 w-6 text-blue-600" />
        </div>
        <h1 className="text-xl font-bold text-slate-900">Enter Company Workspace</h1>
        <p className="text-sm text-slate-500 mt-1">
          Log into one of your service-provider companies to start researching.
        </p>
      </div>

      <CompanyLoginForm />
    </div>
  )
}


