import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '@/services/authApi'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormField } from '@/components/forms/FormField'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert } from '@/components/ui/alert'
import { UserPlus } from 'lucide-react'

const ownerSchema = z.object({
  full_name: z.string().min(1, 'Full name is required'),
  email: z.string().email('Valid email required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Confirm password is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords must match',
  path: ['confirmPassword'],
})

type OwnerForm = z.infer<typeof ownerSchema>

export function SignupPage() {
  const navigate = useNavigate()
  const { loginOwner } = useAuth()
  const [error, setError] = useState<string | null>(null)

  const ownerForm = useForm<OwnerForm>({
    resolver: zodResolver(ownerSchema),
    defaultValues: { full_name: '', email: '', password: '', confirmPassword: '' },
  })

  const ownerMutation = useMutation({
    mutationFn: authApi.registerOwner,
    onSuccess: (data) => {
      loginOwner(data.access_token, data.user)
      navigate('/app')
    },
    onError: (err: Error) => setError(err.message),
  })

  // Common input styling for reuse
  const inputClassName = "bg-slate-950/60 border-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"

  return (
    <Card className="w-full bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-2xl shadow-black/50 text-slate-100">
      <CardHeader className="text-center pb-2">
        {/* Glowing Icon Accent */}
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
          <UserPlus className="h-6 w-6" />
        </div>

        <CardTitle className="text-2xl font-bold tracking-tight text-white">
          Create your account
        </CardTitle>
        <p className="text-sm text-slate-400 mt-1">
          Start with an owner account to manage your companies
        </p>
      </CardHeader>

      <CardContent className="pt-4">
        {error && (
          <Alert variant="destructive" className="mb-6 bg-rose-500/10 border-rose-500/30 text-rose-300">
            {error}
          </Alert>
        )}

        <form
          onSubmit={ownerForm.handleSubmit((data) => {
            setError(null)
            ownerMutation.mutate({
              full_name: data.full_name,
              email: data.email,
              password: data.password,
            })
          })}
          className="space-y-4"
        >
          {/* Using plain strings for labels to fix the TypeScript error */}
          <FormField label="Full Name" required error={ownerForm.formState.errors.full_name?.message}>
            <Input 
              {...ownerForm.register('full_name')} 
              placeholder="John Doe" 
              className={inputClassName}
            />
          </FormField>
          
          <FormField label="Email" required error={ownerForm.formState.errors.email?.message}>
            <Input 
              {...ownerForm.register('email')} 
              type="email" 
              placeholder="you@example.com" 
              className={inputClassName}
            />
          </FormField>
          
          <FormField label="Password" required error={ownerForm.formState.errors.password?.message}>
            <Input 
              {...ownerForm.register('password')} 
              type="password" 
              placeholder="Min 8 characters" 
              className={inputClassName}
            />
          </FormField>
          
          <FormField label="Confirm Password" required error={ownerForm.formState.errors.confirmPassword?.message}>
            <Input 
              {...ownerForm.register('confirmPassword')} 
              type="password" 
              placeholder="Repeat password" 
              className={inputClassName}
            />
          </FormField>
          
          <Button 
            type="submit" 
            className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium shadow-lg shadow-blue-500/25 border-0 h-10 mt-2" 
            isLoading={ownerMutation.isPending}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            {ownerMutation.isPending ? 'Creating account...' : 'Create Owner Account'}
          </Button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:text-blue-300 hover:underline font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}


