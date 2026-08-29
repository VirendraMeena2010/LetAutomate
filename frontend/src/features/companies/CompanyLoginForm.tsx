import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authApi } from '@/services/authApi'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { FormField } from '@/components/forms/FormField'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Alert } from '@/components/ui/Alert'
import { LogIn, Building2 } from 'lucide-react'

const companySchema = z.object({
  company_email: z.string().email('Valid email required'),
  company_password: z.string().min(1, 'Password is required'),
})

type CompanyForm = z.infer<typeof companySchema>

export function CompanyLoginForm() {
  const navigate = useNavigate()
  const { loginCompany } = useAuth()
  const [error, setError] = useState<string | null>(null)

  const form = useForm<CompanyForm>({
    resolver: zodResolver(companySchema),
    defaultValues: { company_email: '', company_password: '' },
  })

  const mutation = useMutation({
    mutationFn: authApi.loginCompany,
    onSuccess: (data) => {
      loginCompany(data.access_token, data.company)
      navigate(`/app/company/${data.company.company_id}`)
    },
    onError: (err: Error) => setError(err.message),
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-base">Enter Company Workspace</CardTitle>
        </div>
        <p className="text-xs text-slate-500">
          Log into an existing company to access its research workspace.
        </p>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            {error}
          </Alert>
        )}
        <form
          onSubmit={form.handleSubmit((data) => {
            setError(null)
            mutation.mutate(data)
          })}
          className="space-y-4"
        >
          <FormField label="Company Email" required error={form.formState.errors.company_email?.message}>
            <Input {...form.register('company_email')} type="email" placeholder="company@example.com" />
          </FormField>
          <FormField label="Password" required error={form.formState.errors.company_password?.message}>
            <Input {...form.register('company_password')} type="password" placeholder="••••••••" />
          </FormField>
          <Button type="submit" className="w-full" isLoading={mutation.isPending}>
            <LogIn className="mr-2 h-4 w-4" />
            {mutation.isPending ? 'Entering...' : 'Enter Workspace'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}