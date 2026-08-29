import { Link, Navigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@/features/auth/AuthContext"
import { researchApi } from "@/services/researchApi"
import { Button } from "@/components/ui/Button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card"
import { Alert } from "@/components/ui/Alert"
import { Skeleton } from "@/components/ui/Skeleton"
import {
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  Activity
} from "lucide-react"

interface DashboardResearchItem {
  session_id: string
  target_company: {
    name: string
    website?: string | null
    industry?: string | null
  }
  status: "pending" | "processing" | "completed" | "failed"
  progress: number
  start_time: string | null
  completion_time?: string | null
}

export default function CompanyDashboardPage() {
  const { company: companyState } = useAuth()
  const company = companyState?.company
  const companyId = company?.company_id

  const researchQuery = useQuery<DashboardResearchItem[], Error>({
    queryKey: ["research-history", companyId],
    queryFn: async () => {
      const data = await researchApi.getResearchHistory()
      return data as unknown as DashboardResearchItem[]
    },
    enabled: Boolean(companyId),
  })

  if (!companyId) {
    return <Navigate to="/app/companies" replace />
  }

  const researches = researchQuery.data ?? []
  const totalResearches = researches.length
  const completedResearches = researches.filter(
    (research) => research.status === "completed"
  ).length

  return (
    <div className="space-y-8 text-slate-100">
      {/* ======================================================
          COMPANY HEADER
      ====================================================== */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between relative">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Activity className="h-3.5 w-3.5" /> Dashboard
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {company.company_name}
          </h1>
          <p className="mt-2 text-slate-400 text-lg">
            {company.industry}
            {company.company_website && (
              <>
                <span className="text-slate-700 mx-2">•</span>
                <span className="text-blue-400 hover:underline cursor-pointer">{company.company_website}</span>
              </>
            )}
          </p>
        </div>

        <Link to={`/app/company/${companyId}/research/new`} className="relative z-10 shrink-0">
          <Button className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 border-0 h-11 px-6">
            <Plus className="h-4 w-4" />
            New Research
          </Button>
        </Link>
      </div>

      {/* ======================================================
          STATS
      ====================================================== */}
      <div className="grid gap-6 sm:grid-cols-2">
        {/* TOTAL */}
        <Card className="relative overflow-hidden bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-xl shadow-black/20 hover:border-slate-700/80 transition-all">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
          <CardHeader className="pb-2">
            <CardDescription className="text-slate-400 font-medium tracking-wide">Total Researches</CardDescription>
          </CardHeader>
          <CardContent>
            {researchQuery.isLoading ? (
              <Skeleton className="h-10 w-16 bg-slate-800" />
            ) : (
              <p className="text-4xl font-extrabold bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent">
                {totalResearches}
              </p>
            )}
          </CardContent>
        </Card>

        {/* COMPLETED */}
        <Card className="relative overflow-hidden bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-xl shadow-black/20 hover:border-slate-700/80 transition-all">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
          <CardHeader className="pb-2">
            <CardDescription className="text-slate-400 font-medium tracking-wide">Completed</CardDescription>
          </CardHeader>
          <CardContent>
            {researchQuery.isLoading ? (
              <Skeleton className="h-10 w-16 bg-slate-800" />
            ) : (
              <p className="text-4xl font-extrabold bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent">
                {completedResearches}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ======================================================
          API ERROR
      ====================================================== */}
      {researchQuery.isError && (
        <Alert variant="destructive" className="bg-rose-500/10 border-rose-500/30 text-rose-300">
          <strong>Unable to load research history</strong>
          <p className="mt-1">
            {researchQuery.error instanceof Error
              ? researchQuery.error.message
              : "Research history could not be loaded."}
          </p>
        </Alert>
      )}

      {/* ======================================================
          RECENT RESEARCH
      ====================================================== */}
      <Card className="bg-slate-900/60 border-slate-800/80 backdrop-blur-xl shadow-xl shadow-black/20">
        <CardHeader className="border-b border-slate-800/80 pb-5">
          <CardTitle className="flex items-center gap-3 text-xl font-bold tracking-tight text-white">
            <div className="p-1.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Search className="h-5 w-5" />
            </div>
            Recent Research
          </CardTitle>
          <CardDescription className="text-slate-400">
            Your latest company research runs
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          {/* ==================================================
              LOADING
          ================================================== */}
          {researchQuery.isLoading && (
            <div className="space-y-4">
              <Skeleton className="h-24 w-full bg-slate-800 rounded-xl" />
              <Skeleton className="h-24 w-full bg-slate-800 rounded-xl" />
              <Skeleton className="h-24 w-full bg-slate-800 rounded-xl" />
            </div>
          )}

          {/* ==================================================
              EMPTY STATE
          ================================================== */}
          {!researchQuery.isLoading &&
            !researchQuery.isError &&
            researches.length === 0 && (
              <div className="relative flex flex-col items-center justify-center py-16 text-center overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 border border-blue-500/20 shadow-lg shadow-blue-500/10">
                  <Search className="h-6 w-6 text-blue-400" />
                </div>

                <h3 className="text-lg font-semibold text-slate-100 tracking-tight">
                  No research yet
                </h3>
                <p className="mt-1 text-sm text-slate-400 max-w-sm">
                  Start your first company research to see results here.
                </p>

                <Link
                  to={`/app/company/${companyId}/research/new`}
                  className="mt-6 block relative z-10"
                >
                  <Button className="gap-2 bg-slate-800 hover:bg-slate-700 text-white border-0 shadow-lg">
                    <Plus className="h-4 w-4" />
                    Start Research
                  </Button>
                </Link>
              </div>
            )}

          {/* ==================================================
              RESEARCH LIST
          ================================================== */}
          {!researchQuery.isLoading &&
            !researchQuery.isError &&
            researches.length > 0 && (
              <div className="space-y-4">
                {researches.map((research) => {
                  const sessionId = research.session_id
                  const companyName = research.target_company?.name || "Unknown Company"
                  const industry = research.target_company?.industry
                  const startTime = research.start_time

                  return (
                    <Link
                      key={sessionId}
                      to={`/app/company/${companyId}/research/${sessionId}`}
                      className="block group"
                    >
                      <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-5 transition-all duration-300 hover:bg-slate-800/50 hover:border-slate-700 hover:shadow-lg hover:shadow-black/20">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          {/* LEFT */}
                          <div className="min-w-0">
                            <div className="flex items-center gap-3">
                              <h3 className="truncate text-lg font-semibold text-slate-100 group-hover:text-blue-400 transition-colors">
                                {companyName}
                              </h3>

                              {/* COMPLETED */}
                              {research.status === "completed" && (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                                  <CheckCircle2 className="h-3 w-3" />
                                  Completed
                                </span>
                              )}

                              {/* PROCESSING */}
                              {(research.status === "processing" ||
                                research.status === "pending") && (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 text-xs font-medium text-blue-400">
                                  <Clock className="h-3 w-3" />
                                  Processing
                                </span>
                              )}

                              {/* FAILED */}
                              {research.status === "failed" && (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 text-xs font-medium text-rose-400">
                                  <AlertCircle className="h-3 w-3" />
                                  Failed
                                </span>
                              )}
                            </div>

                            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-400">
                              {industry && <span>{industry}</span>}
                              {industry && startTime && <span className="text-slate-700">•</span>}
                              {startTime && (
                                <span>
                                  {new Date(startTime).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* RIGHT */}
                          <div className="flex items-center gap-5">
                            {(research.status === "processing" ||
                              research.status === "pending") && (
                              <div className="text-right w-32">
                                <p className="text-sm font-medium text-slate-300 mb-1.5">
                                  {research.progress ?? 0}%
                                </p>

                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                                  <div
                                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                    style={{
                                      width: `${Math.min(
                                        Math.max(research.progress ?? 0, 0),
                                        100
                                      )}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            )}

                            <div className="h-8 w-8 rounded-full bg-slate-800/50 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  )
}