import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { CompanySwitcher } from '@/features/companies/CompanySwitcher'
import { CompanyLoginForm } from '@/features/companies/CompanyLoginForm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Plus, User, Mail, Shield } from 'lucide-react'

export function OwnerDashboard() {
  const { owner } = useAuth()

  if (!owner.isAuthenticated || !owner.user) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Please log in as an owner to view your dashboard.</p>
        <Link to="/login">
          <Button className="mt-4">Go to Login</Button>
        </Link>
      </div>
    )
  }

  const user = owner.user

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back, {user.full_name}
        </h1>
        <p className="text-slate-500">Manage your account and service provider companies.</p>
      </div>

      {/* Owner Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <User className="h-4 w-4" />
              Full Name
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{user.full_name}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{user.email}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Account Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold capitalize">{user.account_status}</p>
            <p className="text-xs text-slate-500 mt-1">
              Verified: {user.email_verification_status}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Company Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Company Management</h2>
            <Link to="/app/companies/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Company
              </Button>
            </Link>
          </div>
          <CompanySwitcher />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Workspace Access</h2>
          <CompanyLoginForm />
        </div>
      </div>

      {/* Metadata */}
      <Card className="bg-slate-50 border-slate-200">
        <CardContent className="py-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-500">User ID:</span>
              <span className="ml-2 font-mono text-slate-700">{user.user_id}</span>
            </div>
            <div>
              <span className="text-slate-500">Member Since:</span>
              <span className="ml-2 text-slate-700">
                {new Date(user.created_at).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="text-slate-500">Last Login:</span>
              <span className="ml-2 text-slate-700">
                {new Date(user.last_login).toLocaleDateString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}