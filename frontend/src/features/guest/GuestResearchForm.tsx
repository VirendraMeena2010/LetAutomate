import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { researchApi } from '@/services/researchApi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormField } from '@/components/forms/FormField'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert } from '@/components/ui/alert'
import { Search, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

const guestSchema = z.object({
  target_company_name: z.string().min(1, 'Company name is required'),
  target_company_industry: z.string().min(1, 'Industry is required'),
  target_company_website: z.string().url('Valid URL required').optional().or(z.literal('')),
  your_services: z.string().min(1, 'Describe your services'),
})

type GuestFormValues = z.infer<typeof guestSchema>

export function GuestResearchForm() {
  const [result, setResult] = useState<unknown | null>(null)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GuestFormValues>({
    resolver: zodResolver(guestSchema),
    defaultValues: {
      target_company_name: '',
      target_company_industry: '',
      target_company_website: '',
      your_services: '',
    },
  })

  const guestMutation = useMutation({
    mutationFn: researchApi.runGuestResearch,
    onSuccess: (data) => {
      setResult(data)
      setError(null)
    },
    onError: (err: Error) => {
      setError(err.message)
      setResult(null)
    },
  })

  const onSubmit = (data: GuestFormValues) => {
    setError(null)
    guestMutation.mutate({
      target_company_name: data.target_company_name,
      target_company_industry: data.target_company_industry,
      target_company_website: data.target_company_website || '',
      your_services: data.your_services,
    })
  }

  if (result) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-600" />
              Guest Research Complete
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-slate-50 rounded-lg p-4 text-slate-700 whitespace-pre-wrap font-mono text-sm">
              {typeof result === 'string' ? result : JSON.stringify(result, null, 2)}
            </div>

            <div className="border-t pt-4">
              <p className="text-sm text-slate-600 mb-3">
                Create an account to save your research and unlock the full AgentReach workspace.
              </p>
              <div className="flex items-center gap-3">
                <Link to="/signup">
                  <Button>Create Account</Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline">Login</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>Try AgentReach</CardTitle>
        <p className="text-sm text-slate-500">
          Enter a target company and your services to see AI-generated prospect intelligence.
        </p>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-6">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <FormField label="Target Company Name" required error={errors.target_company_name?.message}>
            <Input {...register('target_company_name')} placeholder="ElevenLabs" />
          </FormField>

          <FormField label="Industry" required error={errors.target_company_industry?.message}>
            <Input {...register('target_company_industry')} placeholder="Artificial Intelligence" />
          </FormField>

          <FormField label="Website" error={errors.target_company_website?.message}>
            <Input {...register('target_company_website')} placeholder="https://elevenlabs.io" />
          </FormField>

          <FormField label="Your Services" required error={errors.your_services?.message}>
            <textarea
              {...register('your_services')}
              rows={4}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="We provide AI automation services for SaaS companies..."
            />
          </FormField>

          <Button type="submit" className="w-full" isLoading={guestMutation.isPending}>
            <Search className="mr-2 h-4 w-4" />
            {guestMutation.isPending ? 'Analyzing...' : 'Try AgentReach'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}


