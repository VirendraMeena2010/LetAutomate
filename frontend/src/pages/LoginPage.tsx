import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '@/services/authApi'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { FormField } from '@/components/forms/FormField'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Alert } from '@/components/ui/Alert'
import { LogIn, Sparkles } from 'lucide-react'

const ownerSchema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(1, 'Password is required'),
})

type OwnerForm = z.infer<typeof ownerSchema>

export function LoginPage() {
  const navigate = useNavigate()
  const { loginOwner } = useAuth()
  const [error, setError] = useState<string | null>(null)

  const form = useForm<OwnerForm>({
    resolver: zodResolver(ownerSchema),
    defaultValues: { email: '', password: '' },
  })

  const mutation = useMutation({
    mutationFn: authApi.loginOwner,
    onSuccess: (data) => {
      loginOwner(data.access_token, data.user)
      navigate('/app')
    },
    onError: (err: Error) => setError(err.message),
  })

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Glowing background blurs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-112.5 h-112.5 bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-75 h-75 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />

      <Card className="w-full max-w-md bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-2xl shadow-black/50 relative z-10">
        <CardHeader className="text-center pb-2">
          {/* Brand Icon Accent */}
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Sparkles className="h-6 w-6" />
          </div>

          <CardTitle className="text-2xl font-bold tracking-tight text-white">
            Welcome back
          </CardTitle>
          <p className="text-sm text-slate-400 mt-1">
            Sign in to your AgentReach owner account
          </p>
        </CardHeader>

        <CardContent className="pt-4">
          {error && (
            <Alert
              variant="destructive"
              className="mb-6 bg-rose-500/10 border-rose-500/30 text-rose-300"
            >
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
            <FormField
              label="Email"
              required
              error={form.formState.errors.email?.message}
            >
              <Input
                {...form.register('email')}
                type="email"
                placeholder="you@example.com"
                className="bg-slate-950/60 border-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
              />
            </FormField>

            <FormField
              label="Password"
              required
              error={form.formState.errors.password?.message}
            >
              <Input
                {...form.register('password')}
                type="password"
                placeholder="••••••••"
                className="bg-slate-950/60 border-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
              />
            </FormField>

            <Button
              type="submit"
              className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium shadow-lg shadow-blue-500/25 border-0 h-10 mt-2"
              isLoading={mutation.isPending}
            >
              <LogIn className="mr-2 h-4 w-4" />
              {mutation.isPending ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-blue-400 hover:text-blue-300 hover:underline font-medium transition-colors"
            >
              Get Started
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}