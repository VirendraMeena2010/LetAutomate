import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { authApi } from '@/services/authApi'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { FormField } from '@/components/forms/FormField'
import { Stepper } from '@/components/ui/Stepper'
import { Alert } from '@/components/ui/Alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { ArrowLeft, ArrowRight, Building2 } from 'lucide-react'

const steps = [
  { label: 'Basic Info', description: 'Company details' },
  { label: 'Services', description: 'What you offer' },
  { label: 'Outreach', description: 'Communication style' },
  { label: 'Account', description: 'Security' },
]

const companySchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  companyEmail: z.string().email('Valid email required'),
  industry: z.string().min(1, 'Industry is required'),
  website: z.string().url('Valid URL required'),
  country: z.string().min(1, 'Country is required'),
  linkedinPage: z.string().url('Valid URL required').optional().or(z.literal('')),
  servicesDescription: z.string().optional(),
  targetIndustries: z.string().optional(),
  preferredCompanySize: z.string().optional(),
  brandVoice: z.string().optional(),
  defaultCta: z.string().optional(),
  emailSignature: z.string().optional(),
  preferredTone: z.string().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Confirm password is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords must match',
  path: ['confirmPassword'],
})

type CompanyFormValues = z.infer<typeof companySchema>

export function CompanyCreateForm() {
  const navigate = useNavigate()
  const { owner, loginCompany } = useAuth()
  const [step, setStep] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      companyName: '',
      companyEmail: '',
      industry: '',
      website: '',
      country: '',
      linkedinPage: '',
      servicesDescription: '',
      targetIndustries: '',
      preferredCompanySize: '',
      brandVoice: '',
      defaultCta: '',
      emailSignature: '',
      preferredTone: '',
      password: '',
      confirmPassword: '',
    },
  })

  const registerMutation = useMutation({
    mutationFn: authApi.registerCompany,
    onSuccess: (data) => {
      loginCompany(data.access_token, data.company)
      navigate(`/app/company/${data.company.company_id}`)
    },
    onError: (err: Error) => {
      setError(err.message)
    },
  })

  const onSubmit = (data: CompanyFormValues) => {
    if (!owner.user?.user_id) {
      setError('Owner session required. Please log in as an owner first.')
      return
    }

    registerMutation.mutate({
      company_email: data.companyEmail,
      company_name: data.companyName,
      industry: data.industry,
      company_website: data.website,
      country: data.country,
      linkedin_company_page: data.linkedinPage || undefined,
      services_description: data.servicesDescription || undefined,
      target_industries: data.targetIndustries
  ? data.targetIndustries
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  : [],
      preferred_company_size: data.preferredCompanySize || undefined,
      brand_voice: data.brandVoice || undefined,
      default_cta: data.defaultCta || undefined,
      email_signature: data.emailSignature || undefined,
      preferred_tone: data.preferredTone || undefined,
      owner_id: owner.user.user_id,
      company_password: data.password,
    })
  }

  const handleNext = async () => {
    const fieldsToValidate: (keyof CompanyFormValues)[][] = [
      ['companyName', 'companyEmail', 'industry', 'website', 'country'],
      ['servicesDescription', 'targetIndustries', 'preferredCompanySize'],
      ['brandVoice', 'defaultCta', 'emailSignature', 'preferredTone'],
      ['password', 'confirmPassword'],
    ]

    const valid = await trigger(fieldsToValidate[step])
    if (valid) setStep((s) => Math.min(s + 1, steps.length - 1))
  }

  const handleBack = () => setStep((s) => Math.max(s - 1, 0))

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <Stepper steps={steps} currentStep={step} />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle>Create Service Provider Company</CardTitle>
              <p className="text-sm text-slate-500">Step {step + 1} of {steps.length}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {step === 0 && (
              <div className="space-y-4">
                <FormField label="Company Name" required error={errors.companyName?.message}>
                  <Input {...register('companyName')} placeholder="Acme AI Solutions" />
                </FormField>
                <FormField label="Company Email" required error={errors.companyEmail?.message}>
                  <Input {...register('companyEmail')} type="email" placeholder="contact@acme.ai" />
                </FormField>
                <FormField label="Industry" required error={errors.industry?.message}>
                  <Input {...register('industry')} placeholder="Artificial Intelligence" />
                </FormField>
                <FormField label="Website" required error={errors.website?.message}>
                  <Input {...register('website')} placeholder="https://acme.ai" />
                </FormField>
                <FormField label="Country" required error={errors.country?.message}>
                  <Input {...register('country')} placeholder="United States" />
                </FormField>
                <FormField label="LinkedIn Company Page" error={errors.linkedinPage?.message}>
                  <Input {...register('linkedinPage')} placeholder="https://linkedin.com/company/acme-ai" />
                </FormField>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <FormField label="Services Description" error={errors.servicesDescription?.message}>
                  <textarea
                    {...register('servicesDescription')}
                    rows={4}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Describe the services your company offers..."
                  />
                </FormField>
                <FormField label="Target Industries" error={errors.targetIndustries?.message}>
                  <Input {...register('targetIndustries')} placeholder="SaaS, Fintech, Healthcare" />
                </FormField>
                <FormField label="Preferred Company Size" error={errors.preferredCompanySize?.message}>
                  <Select
                    {...register('preferredCompanySize')}
                    options={[
                      { value: '', label: 'Select size...' },
                      { value: 'startup', label: 'Startup (1-50)' },
                      { value: 'midmarket', label: 'Mid-Market (51-500)' },
                      { value: 'enterprise', label: 'Enterprise (500+)' },
                    ]}
                  />
                </FormField>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <FormField label="Brand Voice" error={errors.brandVoice?.message}>
                  <Input {...register('brandVoice')} placeholder="Professional, friendly, technical" />
                </FormField>
                <FormField label="Default CTA" error={errors.defaultCta?.message}>
                  <Input {...register('defaultCta')} placeholder="Book a 15-minute discovery call" />
                </FormField>
                <FormField label="Email Signature" error={errors.emailSignature?.message}>
                  <textarea
                    {...register('emailSignature')}
                    rows={3}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Best regards,&#10;John Doe&#10;CEO, Acme AI"
                  />
                </FormField>
                <FormField label="Preferred Tone" error={errors.preferredTone?.message}>
                  <Select
                    {...register('preferredTone')}
                    options={[
                      { value: '', label: 'Select tone...' },
                      { value: 'formal', label: 'Formal' },
                      { value: 'casual', label: 'Casual' },
                      { value: 'consultative', label: 'Consultative' },
                      { value: 'direct', label: 'Direct' },
                    ]}
                  />
                </FormField>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <FormField label="Company Password" required error={errors.password?.message}>
                  <Input {...register('password')} type="password" placeholder="Min 8 characters" />
                </FormField>
                <FormField label="Confirm Password" required error={errors.confirmPassword?.message}>
                  <Input {...register('confirmPassword')} type="password" placeholder="Repeat password" />
                </FormField>
                <p className="text-xs text-slate-500">
                  This password will be used by your team to log into this company's workspace.
                </p>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={step === 0}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>

              {step < steps.length - 1 ? (
                <Button type="button" onClick={handleNext}>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  isLoading={registerMutation.isPending}
                >
                  Create Company
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}