import { useQuery } from "@tanstack/react-query"
import { Link, useParams } from "react-router-dom"
import { researchApi } from "@/services/researchApi"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert } from "@/components/ui/alert"
import {
  ArrowLeft,
  Building2,
  Globe,
  Tag,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
} from "lucide-react"

// ============================================================
// TYPES
// ============================================================
type ResearchRecord = Record<string, unknown>

// ============================================================
// HELPERS
// ============================================================
function formatLabel(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

// ============================================================
// GENERIC OBJECT RENDERER
// ============================================================
function ResearchObject({
  data,
}: {
  data: unknown
}) {
  if (!data || typeof data !== "object") {
    return <p className="text-sm text-slate-400">No information available.</p>
  }

  const entries = Object.entries(data as ResearchRecord)
  if (entries.length === 0) {
    return <p className="text-sm text-slate-400">No information available.</p>
  }

  return (
    <div className="space-y-5">
      {entries.map(([key, value]) => (
        <div key={key} className="border-b border-slate-800/50 pb-4 last:border-b-0">
          <span className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">
            {formatLabel(key)}
          </span>
          <div className="text-sm leading-relaxed text-slate-300">
            {typeof value === "string" && (
              <p className="whitespace-pre-wrap">{value}</p>
            )}

            {typeof value === "number" && <p className="text-white font-medium">{value}</p>}

            {typeof value === "boolean" && (
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${value ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                {value ? "Yes" : "No"}
              </span>
            )}

            {Array.isArray(value) && (
              <ul className="mt-3 space-y-3">
                {value.map((item, index) => (
                  <li key={index} className="rounded-lg bg-slate-900/50 border border-slate-800/50 p-4">
                    {typeof item === "object" && item !== null ? (
                      <ResearchObject data={item} />
                    ) : (
                      <span className="text-slate-300">{String(item ?? "")}</span>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {typeof value === "object" &&
              value !== null &&
              !Array.isArray(value) && (
                <div className="mt-3 rounded-lg bg-slate-900/50 border border-slate-800/50 p-4">
                  <ResearchObject data={value as ResearchRecord} />
                </div>
              )}
          </div>
        </div>
      ))}
    </div>
  )
}

// ============================================================
// STATUS BADGE
// ============================================================
function ResearchStatus({ status }: { status: unknown }) {
  const currentStatus = typeof status === "string" ? status : ""

  if (currentStatus === "completed") {
    return (
      <Badge className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)] transition-colors">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Research Complete
      </Badge>
    )
  }

  if (currentStatus === "processing" || currentStatus === "running") {
    return (
      <Badge className="flex items-center gap-1.5 bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.1)] transition-colors">
        <Clock className="h-3.5 w-3.5 animate-spin" />
        Processing
      </Badge>
    )
  }

  if (currentStatus === "failed") {
    return (
      <Badge variant="destructive" className="flex items-center gap-1.5 bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20 transition-colors">
        <AlertCircle className="h-3.5 w-3.5" />
        Failed
      </Badge>
    )
  }

  return (
    <Badge variant="outline" className="flex items-center gap-1.5 bg-slate-800/50 text-slate-400 border-slate-700 hover:bg-slate-800 transition-colors">
      <Clock className="h-3.5 w-3.5" />
      Pending
    </Badge>
  )
}

// ============================================================
// PAGE
// ============================================================
export default function ResearchResultPage() {
  const { companyId, researchId } = useParams<{
    companyId: string
    researchId: string
  }>()

  // ==========================================================
  // GET RESEARCH
  // ==========================================================
  const researchQuery = useQuery({
    queryKey: ["research", researchId],
    queryFn: () => researchApi.getResearchById(researchId!),
    enabled: Boolean(researchId),
    refetchInterval: (query) => {
      const status = (query.state.data as Record<string, unknown> | undefined)?.status
      if (status === "completed" || status === "failed") {
        return false
      }
      return 3000
    },
  })

  // ==========================================================
  // LOADING
  // ==========================================================
  if (researchQuery.isLoading) {
    return (
      <div className="mx-auto max-w-5xl space-y-6 p-6">
        <Skeleton className="h-32 w-full bg-slate-800/50 rounded-2xl" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-40 w-full bg-slate-800/50 rounded-2xl" />
          <Skeleton className="h-40 w-full bg-slate-800/50 rounded-2xl" />
        </div>
        <Skeleton className="h-64 w-full bg-slate-800/50 rounded-2xl" />
      </div>
    )
  }

  // ==========================================================
  // ERROR
  // ==========================================================
  if (researchQuery.isError) {
    return (
      <div className="mx-auto max-w-5xl space-y-6 p-6">
        <Link
          to={`/app/company/${companyId}`}
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to dashboard
        </Link>

        <Alert variant="destructive" className="bg-rose-500/10 border-rose-500/30 text-rose-300">
          <strong>Unable to load research</strong>
          <p className="mt-1">
            {researchQuery.error instanceof Error
              ? researchQuery.error.message
              : "Research could not be loaded."}
          </p>
        </Alert>
      </div>
    )
  }

  const research = researchQuery.data as Record<string, unknown> | undefined

  // ==========================================================
  // NOT FOUND
  // ==========================================================
  if (!research) {
    return (
      <div className="p-6">
        <p className="text-slate-400">Research not found.</p>
      </div>
    )
  }

  // ==========================================================
  // COMPANY DATA
  // ==========================================================
  const companyResearch = research.company_research as Record<string, unknown> | undefined
  const companyName = String(
    research.target_company_name ||
    companyResearch?.company_name ||
    "Company Research"
  )
  const companyWebsite =
    research.target_company_website || companyResearch?.website
  const companyIndustry =
    research.target_company_industry || companyResearch?.industry

  // Reusable card class for modern AI SaaS feel
  const cardClass = "bg-slate-900/60 border-slate-800/80 backdrop-blur-xl shadow-xl shadow-black/20"

  // ==========================================================
  // PAGE RENDER
  // ==========================================================
  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6 text-slate-100">
      {/* Top Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          to={`/app/company/${companyId}`}
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 transition-colors group font-medium"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to dashboard
        </Link>

        <ResearchStatus status={research.status} />
      </div>

      {/* Processing Alert */}
      {research.status === "processing" && (
        <Alert className="bg-blue-500/10 border-blue-500/30 text-blue-300">
          <strong className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 animate-pulse" />
            Research in progress
          </strong>
          <p className="mt-1 text-blue-400/80">
            AgentReach has completed {String(research.progress ?? 0)}% of the research pipeline.
          </p>
        </Alert>
      )}

      {/* Company Header */}
      <div className="relative overflow-hidden flex flex-col gap-6 rounded-2xl border border-slate-800/80 bg-slate-900/80 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold text-white tracking-tight bg-linear-to-br from-white to-slate-400 bg-clip-text">
            {companyName}
          </h1>

          <div className="mt-4 flex flex-wrap gap-3 text-sm font-medium">
            {Boolean(companyIndustry) && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700/50 shadow-sm">
                <Tag className="h-3.5 w-3.5 text-slate-400" />
                {String(companyIndustry)}
              </span>
            )}

            {Boolean(companyWebsite) && (
              <a
                href={String(companyWebsite)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 hover:border-blue-500/30 transition-all shadow-sm"
              >
                <Globe className="h-3.5 w-3.5" />
                Website
              </a>
            )}
          </div>
        </div>

        <div className="relative z-10 flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-slate-800/50 border border-slate-700/50 shadow-inner">
          <Building2 className="h-10 w-10 text-slate-500" />
        </div>
      </div>

      {/* Progress Bar */}
      {research.status === "processing" && (
        <Card className={cardClass}>
          <CardHeader className="border-b border-slate-800/80 pb-4">
            <CardTitle className="text-white">Research Progress</CardTitle>
            <CardDescription className="text-slate-400">
              AgentReach is analyzing the target company.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-2 overflow-hidden rounded-full bg-slate-800/80 shadow-inner">
              <div
                className="h-full rounded-full bg-linear-to-r from-blue-500 to-indigo-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-700 ease-out"
                style={{
                  width: `${Number(research.progress ?? 0)}%`,
                }}
              />
            </div>
            <p className="mt-3 text-sm font-medium text-slate-400 flex justify-between">
              <span>Analyzing data points...</span>
              <span className="text-blue-400">{String(research.progress ?? 0)}% complete</span>
            </p>
          </CardContent>
        </Card>
      )}

      {/* Final Report */}
      {Boolean(research.final_report) && (
        <Card className={cardClass}>
          <CardHeader className="border-b border-slate-800/80 pb-4">
            <CardTitle className="flex items-center gap-2 text-white">
              <div className="p-1.5 rounded bg-blue-500/10 text-blue-400">
                <Sparkles className="h-4 w-4" />
              </div>
              Executive Research Report
            </CardTitle>
            <CardDescription className="text-slate-400">
              AI-generated summary of the target company.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ResearchObject data={research.final_report} />
          </CardContent>
        </Card>
      )}

      {/* Company Research */}
      {Boolean(research.company_research) && (
        <Card className={cardClass}>
          <CardHeader className="border-b border-slate-800/80 pb-4">
            <CardTitle className="text-white">Company Research</CardTitle>
            <CardDescription className="text-slate-400">
              Core information discovered about the company.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ResearchObject data={research.company_research} />
          </CardContent>
        </Card>
      )}

      {/* Website Analysis */}
      {Boolean(research.website_analysis) && (
        <Card className={cardClass}>
          <CardHeader className="border-b border-slate-800/80 pb-4">
            <CardTitle className="text-white">Website Analysis</CardTitle>
            <CardDescription className="text-slate-400">
              Analysis of the target company&apos;s website.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ResearchObject data={research.website_analysis} />
          </CardContent>
        </Card>
      )}

      {/* News Intelligence */}
      {Boolean(research.news_intelligence) && (
        <Card className={cardClass}>
          <CardHeader className="border-b border-slate-800/80 pb-4">
            <CardTitle className="text-white">News Intelligence</CardTitle>
            <CardDescription className="text-slate-400">
              Recent news and business signals.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ResearchObject data={research.news_intelligence} />
          </CardContent>
        </Card>
      )}

      {/* Hiring Intelligence */}
      {Boolean(research.hiring_intelligence) && (
        <Card className={cardClass}>
          <CardHeader className="border-b border-slate-800/80 pb-4">
            <CardTitle className="text-white">Hiring Intelligence</CardTitle>
            <CardDescription className="text-slate-400">
              Hiring activity and workforce signals.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ResearchObject data={research.hiring_intelligence} />
          </CardContent>
        </Card>
      )}

      {/* Demand Intelligence */}
      {Boolean(research.demand_intelligence) && (
        <Card className={cardClass}>
          <CardHeader className="border-b border-slate-800/80 pb-4">
            <CardTitle className="text-white">Demand Intelligence</CardTitle>
            <CardDescription className="text-slate-400">
              Potential demand and business opportunity signals.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ResearchObject data={research.demand_intelligence} />
          </CardContent>
        </Card>
      )}

      {/* Company Intelligence */}
      {Boolean(research.company_intelligence) && (
        <Card className={cardClass}>
          <CardHeader className="border-b border-slate-800/80 pb-4">
            <CardTitle className="text-white">Company Intelligence</CardTitle>
            <CardDescription className="text-slate-400">
              Higher-level business intelligence generated by AgentReach.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ResearchObject data={research.company_intelligence} />
          </CardContent>
        </Card>
      )}

      {/* Completed Alert */}
      {research.status === "completed" && (
        <Alert className="bg-emerald-500/10 border-emerald-500/30 text-emerald-400 mt-8">
          <strong className="flex items-center gap-2 text-emerald-300">
            <CheckCircle2 className="h-5 w-5" />
            Research completed successfully
          </strong>
          <p className="mt-1.5 text-emerald-500/80">
            This research has been saved to your company workspace.
          </p>
        </Alert>
      )}
    </div>
  )
}


