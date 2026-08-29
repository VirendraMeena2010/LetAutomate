import { Link } from "react-router-dom"
import { useAuth } from "@/features/auth/AuthContext"
import { Button } from "@/components/ui/Button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card"
import { Skeleton } from "@/components/ui/Skeleton"
import { Alert } from "@/components/ui/Alert"
import { Plus, Building2, ArrowRight } from "lucide-react"
import { useOwnerCompanies } from "@/hooks/useOwner"

export default function OwnerDashboardPage() {
  const { owner } = useAuth()
  const user = owner.user

  const { data: companies, isLoading, isError, error } = useOwnerCompanies()

  return (
    <div className="space-y-8 text-slate-100">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between relative">
        <div className="relative z-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent">
            Welcome back, {user?.full_name?.split(" ")[0] || "Owner"}
          </h1>
          <p className="mt-2 text-slate-400 text-lg">
            Manage your companies and research workspace.
          </p>
        </div>
        <Link to="/app/companies/new" className="relative z-10 shrink-0">
          <Button className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 border-0 h-11 px-6">
            <Plus className="h-4 w-4" /> Create Company
          </Button>
        </Link>
      </div>

      {/* Companies Section */}
      <div className="relative z-10">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white tracking-tight">
            Your Companies
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Select a company to open its research workspace.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="bg-slate-900/60 border-slate-800/80">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 bg-slate-800/50 rounded-lg" />
                  <Skeleton className="mt-3 h-4 w-1/2 bg-slate-800/50 rounded-lg" />
                </CardHeader>
                <CardContent className="space-y-4 pt-2">
                  <Skeleton className="h-4 w-full bg-slate-800/50 rounded-lg" />
                  <Skeleton className="h-4 w-2/3 bg-slate-800/50 rounded-lg" />
                  <Skeleton className="h-10 w-full mt-4 bg-slate-800/50 rounded-lg" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && !isLoading && (
          <Alert variant="destructive" className="mb-6 bg-rose-500/10 border-rose-500/30 text-rose-300">
            <strong>Failed to load companies:</strong>{" "}
            <span className="opacity-90">
              {error instanceof Error ? error.message : "Unable to retrieve your companies."}
            </span>
          </Alert>
        )}

        {/* Company Cards Grid */}
        {!isLoading && !isError && companies && companies.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {companies.map((company) => (
              <Card
                key={company.company_id}
                className="flex flex-col bg-slate-900/60 border-slate-800/80 backdrop-blur-xl transition-all duration-300 hover:bg-slate-800/50 hover:border-slate-700 hover:shadow-xl hover:shadow-black/20 group relative overflow-hidden"
              >
                {/* Subtle top glow on hover */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/0 to-transparent group-hover:via-blue-500/40 transition-all duration-500" />
                
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                      <Building2 className="h-6 w-6" />
                    </div>
                    <span className="rounded-full bg-slate-800/80 border border-slate-700 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-300 shadow-sm">
                      {company.account_status}
                    </span>
                  </div>
                  <CardTitle className="mt-5 text-xl font-bold text-slate-100 group-hover:text-blue-400 transition-colors line-clamp-1">
                    {company.company_name}
                  </CardTitle>
                  <CardDescription className="text-slate-400 font-medium">
                    {company.industry}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col justify-between pt-0">
                  <div className="space-y-2.5 text-sm text-slate-400 mt-2">
                    <p className="flex items-center truncate">
                      <span className="font-semibold text-slate-300 w-20 shrink-0">Email:</span>{" "}
                      <span className="truncate">{company.company_email}</span>
                    </p>
                    <p className="flex items-center truncate">
                      <span className="font-semibold text-slate-300 w-20 shrink-0">Country:</span>{" "}
                      <span className="truncate">{company.country}</span>
                    </p>
                    <p className="flex items-center truncate">
                      <span className="font-semibold text-slate-300 w-20 shrink-0">Website:</span>{" "}
                      <span className="truncate">{company.company_website}</span>
                    </p>
                  </div>
                  
                  <Link
                    to={`/app/company/${company.company_id}/login`}
                    className="mt-8 block w-full"
                  >
                    <Button 
                      variant="outline" 
                      className="w-full gap-2 border-slate-700 bg-slate-800/50 hover:bg-blue-500/10 hover:text-blue-400 hover:border-blue-500/30 transition-all h-10"
                    >
                      Open Workspace <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && companies && companies.length === 0 && (
          <Card className="flex flex-col items-center justify-center border-dashed border-slate-800 bg-slate-900/30 py-16 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800/50 border border-slate-700/50 mb-5 shadow-inner">
                <Building2 className="h-8 w-8 text-slate-500" />
              </div>
              <p className="text-lg font-semibold text-slate-200">
                No companies yet
              </p>
              <p className="mt-2 text-center text-sm text-slate-400 max-w-sm">
                Create your first company to set up a workspace and start researching prospects.
              </p>
              <Link to="/app/companies/new" className="mt-6 block">
                <Button className="gap-2 bg-slate-800 hover:bg-slate-700 text-white border-0 shadow-lg px-6">
                  <Plus className="h-4 w-4" /> Create Company
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}