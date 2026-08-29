import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useAuth } from "@/features/auth/AuthContext"
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
import { ArrowLeft, Building2 } from "lucide-react"
import { Link } from "react-router-dom"
import { useCompanyRegister } from "@/hooks/useCompanyRegister"

const companySchema = z
  .object({
    company_name: z.string().min(1, "Company name is required"),
    company_email: z.string().email("Invalid email"),
    industry: z.string().min(1, "Industry is required"),
    company_website: z.string().url("Invalid URL"),
    country: z.string().min(1, "Country is required"),
    linkedin_company_page: z.string().optional(),
    services_description: z.string().optional(),
    target_industries: z.string().optional(),
    preferred_company_size: z.string().optional(),
    brand_voice: z.string().optional(),
    default_cta: z.string().optional(),
    email_signature: z.string().optional(),
    preferred_tone: z.string().optional(),
    company_password: z
      .string()
      .min(8, "Password must be at least 8 characters"),
    confirm_password: z
      .string()
      .min(8, "Confirm your password"),
  })
  .refine(
    (data) => data.company_password === data.confirm_password,
    {
      message: "Passwords don't match",
      path: ["confirm_password"],
    }
  )

type CompanyFormData = z.infer<typeof companySchema>

export default function CompanyCreatePage() {
  const { owner } = useAuth()
  const register = useCompanyRegister()
  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
  })

  const currentUserId = owner?.user?.user_id

  const onSubmit = (data: CompanyFormData) => {
    if (!currentUserId) {
      form.setError("root", {
        message: "You must be logged in as an owner to create a company",
      })
      return
    }

    const {
      confirm_password,
      target_industries,
      ...rest
    } = data

    const targetIndustries = target_industries
      ? target_industries
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      : []

    register.mutate({
      owner_id: currentUserId,
      ...rest,
      target_industries: targetIndustries,
    })
  }

  // Common input styling for reuse
  const inputClassName = "bg-slate-950/50 border-slate-800 text-slate-100 placeholder:text-slate-600 focus:border-blue-500 focus:ring-blue-500/20"

  return (
    <div className="mx-auto max-w-3xl text-slate-100">
      {/* Back to dashboard */}
      <div className="mb-6">
        <Link
          to="/app"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to dashboard
        </Link>
      </div>

      <Card className="bg-slate-900/60 border-slate-800/80 backdrop-blur-xl shadow-2xl shadow-black/40">
        <CardHeader className="border-b border-slate-800/80 pb-6 mb-6">
          <CardTitle className="flex items-center gap-3 text-2xl font-bold tracking-tight text-white">
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Building2 className="h-5 w-5" />
            </div>
            Create Service Provider Company
          </CardTitle>

          <CardDescription className="text-slate-400 text-base mt-2">
            Set up your company profile to start researching prospects.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {register.isError && (
            <Alert variant="destructive" className="mb-6 bg-rose-500/10 border-rose-500/30 text-rose-300">
              {register.error instanceof Error
                ? register.error.message
                : "Registration failed"}
            </Alert>
          )}

          {form.formState.errors.root && (
            <Alert variant="destructive" className="mb-6 bg-rose-500/10 border-rose-500/30 text-rose-300">
              {form.formState.errors.root.message}
            </Alert>
          )}

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-10"
          >
            {/* ============================= */}
            {/* Basic Information */}
            {/* ============================= */}
            <div className="space-y-5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-blue-400 flex items-center gap-2">
                <span className="h-px w-4 bg-blue-500/30"></span>
                Basic Information
                <span className="h-px flex-1 bg-gradient-to-r from-blue-500/30 to-transparent"></span>
              </h3>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="company_name" className="text-slate-300">Company Name *</Label>
                  <Input id="company_name" className={inputClassName} {...form.register("company_name")} />
                  {form.formState.errors.company_name && (
                    <p className="text-sm text-rose-400">{form.formState.errors.company_name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company_email" className="text-slate-300">Company Email *</Label>
                  <Input id="company_email" type="email" className={inputClassName} {...form.register("company_email")} />
                  {form.formState.errors.company_email && (
                    <p className="text-sm text-rose-400">{form.formState.errors.company_email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry" className="text-slate-300">Industry *</Label>
                  <Input id="industry" className={inputClassName} {...form.register("industry")} />
                  {form.formState.errors.industry && (
                    <p className="text-sm text-rose-400">{form.formState.errors.industry.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company_website" className="text-slate-300">Website *</Label>
                  <Input id="company_website" type="url" className={inputClassName} {...form.register("company_website")} />
                  {form.formState.errors.company_website && (
                    <p className="text-sm text-rose-400">{form.formState.errors.company_website.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country" className="text-slate-300">Country *</Label>
                  <Input id="country" className={inputClassName} {...form.register("country")} />
                  {form.formState.errors.country && (
                    <p className="text-sm text-rose-400">{form.formState.errors.country.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin_company_page" className="text-slate-300">LinkedIn Company Page</Label>
                  <Input id="linkedin_company_page" className={inputClassName} {...form.register("linkedin_company_page")} />
                </div>
              </div>
            </div>

            {/* ============================= */}
            {/* Services */}
            {/* ============================= */}
            <div className="space-y-5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                <span className="h-px w-4 bg-indigo-500/30"></span>
                Your Services
                <span className="h-px flex-1 bg-gradient-to-r from-indigo-500/30 to-transparent"></span>
              </h3>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="services_description" className="text-slate-300">Services Description</Label>
                  <Input id="services_description" className={inputClassName} {...form.register("services_description")} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="target_industries" className="text-slate-300">Target Industries</Label>
                  <Input id="target_industries" placeholder="AI voice, Healthcare, SaaS" className={inputClassName} {...form.register("target_industries")} />
                  <p className="text-xs text-slate-500">Separate multiple industries with commas.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferred_company_size" className="text-slate-300">Preferred Company Size</Label>
                  <Input id="preferred_company_size" className={inputClassName} {...form.register("preferred_company_size")} />
                </div>
              </div>
            </div>

            {/* ============================= */}
            {/* Outreach Preferences */}
            {/* ============================= */}
            <div className="space-y-5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-violet-400 flex items-center gap-2">
                <span className="h-px w-4 bg-violet-500/30"></span>
                Outreach Preferences
                <span className="h-px flex-1 bg-gradient-to-r from-violet-500/30 to-transparent"></span>
              </h3>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="brand_voice" className="text-slate-300">Brand Voice</Label>
                  <Input id="brand_voice" className={inputClassName} {...form.register("brand_voice")} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="default_cta" className="text-slate-300">Default CTA</Label>
                  <Input id="default_cta" className={inputClassName} {...form.register("default_cta")} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email_signature" className="text-slate-300">Email Signature</Label>
                  <Input id="email_signature" className={inputClassName} {...form.register("email_signature")} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferred_tone" className="text-slate-300">Preferred Tone</Label>
                  <Input id="preferred_tone" className={inputClassName} {...form.register("preferred_tone")} />
                </div>
              </div>
            </div>

            {/* ============================= */}
            {/* Account Security */}
            {/* ============================= */}
            <div className="space-y-5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                <span className="h-px w-4 bg-emerald-500/30"></span>
                Account Security
                <span className="h-px flex-1 bg-gradient-to-r from-emerald-500/30 to-transparent"></span>
              </h3>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="company_password" className="text-slate-300">Company Password *</Label>
                  <Input id="company_password" type="password" className={inputClassName} {...form.register("company_password")} />
                  {form.formState.errors.company_password && (
                    <p className="text-sm text-rose-400">{form.formState.errors.company_password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm_password" className="text-slate-300">Confirm Password *</Label>
                  <Input id="confirm_password" type="password" className={inputClassName} {...form.register("confirm_password")} />
                  {form.formState.errors.confirm_password && (
                    <p className="text-sm text-rose-400">{form.formState.errors.confirm_password.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* ============================= */}
            {/* Submit */}
            {/* ============================= */}
            <div className="flex justify-end pt-6 border-t border-slate-800/80">
              <Button
                type="submit"
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 border-0 h-11 px-8"
                isLoading={register.isPending}
              >
                Create Company
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}


