import { useCompany } from '@/hooks/useAuth'

export function Header() {
  const company = useCompany()

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md flex items-center justify-between px-6 lg:px-8 sticky top-0 z-20 transition-all">
      <div className="flex flex-col justify-center ml-12 lg:ml-0">
        <h1 className="text-lg font-bold text-slate-100 tracking-tight leading-tight">
          {company.company?.company_name || 'AgentReach'}
        </h1>
        <p className="text-xs text-slate-400 font-medium">
          {company.company?.industry}
        </p>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Future: Notifications, profile, etc. */}
      </div>
    </header>
  )
}