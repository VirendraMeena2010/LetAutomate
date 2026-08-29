import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useMutation } from "@tanstack/react-query"
import { useNavigate, Link } from "react-router-dom"
import { researchApi } from "@/services/researchApi"
import { useAuth } from "@/features/auth/AuthContext"
import type { ResearchResponse } from "@/types/research"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert } from "@/components/ui/alert"
import { Search, ArrowLeft, Sparkles } from "lucide-react"

// ============================================================
// FORM VALIDATION
// ============================================================
const researchSchema = z.object({
  target_company_name: z
    .string()
    .min(1, "Company name is required"),
  target_company_website: z
    .string()
    .url("Invalid URL")
    .or(z.string().length(0)),
  target_company_industry: z
    .string()
    .min(1, "Industry is required"),
})

type ResearchFormData = z.infer<typeof researchSchema>

// Extended response type in case session_id is optional on ResearchResponse
type RunResearchResult = ResearchResponse & { session_id?: string }

// ============================================================
// PAGE
// ============================================================
export default function ResearchCreatePage() {
  const { company } = useAuth()
  const navigate = useNavigate()
  const companyId = company?.company?.company_id

  // ==========================================================
  // RESEARCH MUTATION
  // ==========================================================
  const researchMutation = useMutation<RunResearchResult, Error, ResearchFormData>({
    mutationFn: (data: ResearchFormData) =>
      researchApi.runResearch(data) as Promise<RunResearchResult>,
    onSuccess: (data) => {
      const sessionId = data.session_id

      if (!sessionId) {
        console.error("Backend did not return session_id", data)
        return
      }

      if (!companyId) {
        console.error("Company ID is missing", company)
        return
      }

      // ======================================================
      // NAVIGATE TO RESEARCH RESULT
      // ======================================================
      navigate(`/app/company/${companyId}/research/${sessionId}`)
    },
  })

  // ==========================================================
  // FORM
  // ==========================================================
  const form = useForm<ResearchFormData>({
    resolver: zodResolver(researchSchema),
    defaultValues: {
      target_company_name: "",
      target_company_website: "",
      target_company_industry: "",
    },
  })

  // ==========================================================
  // SUBMIT
  // ==========================================================
  const onSubmit = (data: ResearchFormData) => {
    researchMutation.mutate(data)
  }

  // Common input styling for reuse
  const inputClassName = "bg-slate-950/50 border-slate-800 text-slate-100 placeholder:text-slate-600 focus:border-blue-500 focus:ring-blue-500/20"

  // ==========================================================
  // RENDER
  // ==========================================================
  return (
    <div className="mx-auto max-w-2xl p-6 relative text-slate-100">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* ======================================================
          BACK
      ====================================================== */}
      <div className="mb-8 relative z-10">
        <Link
          to={`/app/company/${companyId}`}
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to dashboard
        </Link>
      </div>

      {/* ======================================================
          CARD
      ====================================================== */}
      <Card className="relative z-10 bg-slate-900/60 border-slate-800/80 backdrop-blur-xl shadow-2xl shadow-black/40">
        <CardHeader className="border-b border-slate-800/80 pb-6 mb-6">
          <CardTitle className="flex items-center gap-3 text-2xl font-bold tracking-tight text-white">
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Search className="h-5 w-5" />
            </div>
            Research a Company
          </CardTitle>

          <CardDescription className="text-slate-400 text-base mt-2">
            Enter a target company and AgentReach will analyze it for potential
            business opportunities.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* ==================================================
              ERROR
          ================================================== */}
          {researchMutation.isError && (
            <Alert variant="destructive" className="mb-6 bg-rose-500/10 border-rose-500/30 text-rose-300">
              {researchMutation.error instanceof Error
                ? researchMutation.error.message
                : "Research failed"}
            </Alert>
          )}

          {/* ==================================================
              FORM
          ================================================== */}
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* ==================================================
                COMPANY NAME
            ================================================== */}
            <div className="space-y-2">
              <Label htmlFor="target_company_name" className="text-slate-300">
                Target Company Name *
              </Label>

              <Input
                id="target_company_name"
                placeholder="ElevenLabs"
                className={inputClassName}
                {...form.register("target_company_name")}
              />

              {form.formState.errors.target_company_name && (
                <p className="text-sm text-rose-400">
                  {form.formState.errors.target_company_name.message}
                </p>
              )}
            </div>

            {/* ==================================================
                WEBSITE
            ================================================== */}
            <div className="space-y-2">
              <Label htmlFor="target_company_website" className="text-slate-300">
                Website
              </Label>

              <Input
                id="target_company_website"
                type="url"
                placeholder="https://elevenlabs.io"
                className={inputClassName}
                {...form.register("target_company_website")}
              />

              {form.formState.errors.target_company_website && (
                <p className="text-sm text-rose-400">
                  {form.formState.errors.target_company_website.message}
                </p>
              )}
            </div>

            {/* ==================================================
                INDUSTRY
            ================================================== */}
            <div className="space-y-2">
              <Label htmlFor="target_company_industry" className="text-slate-300">
                Industry *
              </Label>

              <Input
                id="target_company_industry"
                placeholder="Artificial Intelligence"
                className={inputClassName}
                {...form.register("target_company_industry")}
              />

              {form.formState.errors.target_company_industry && (
                <p className="text-sm text-rose-400">
                  {form.formState.errors.target_company_industry.message}
                </p>
              )}
            </div>

            {/* ==================================================
                SUBMIT
            ================================================== */}
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium shadow-lg shadow-blue-500/25 border-0 transition-all"
                disabled={researchMutation.isPending}
              >
                {researchMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 animate-spin" />
                    Initializing Research Agents...
                  </span>
                ) : (
                  "Start AI Research"
                )}
              </Button>
            </div>
          </form>

          {/* ==================================================
              PROCESSING MESSAGE
          ================================================== */}
          {researchMutation.isPending && (
            <div className="mt-8 rounded-xl border border-blue-500/20 bg-blue-500/10 p-5 shadow-inner">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 mt-0.5">
                  <Search className="h-4 w-4 animate-pulse" />
                </div>
                <div>
                  <p className="font-semibold text-blue-300">
                    AgentReach is researching the company
                  </p>
                  <p className="mt-1 text-sm text-blue-400/80 leading-relaxed">
                    This may take a little while. Our AI agents are currently scraping the web, analyzing news signals, and building the intelligence profile.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


