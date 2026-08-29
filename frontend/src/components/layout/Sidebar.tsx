import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useAuth, useCompany } from '@/hooks/useAuth'
import {
  LayoutDashboard,
  Search,
  Building2,
  Settings,
  LogOut,
  ChevronDown,
  Plus,
  Menu,
  X,
  Sparkles,
  MessageSquare,
  Send,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function Sidebar() {
  const { company, logoutCompany } = useAuth()
  const activeCompany = useCompany()
  const navigate = useNavigate()
  const { companyId } = useParams()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showCompanyMenu, setShowCompanyMenu] = useState(false)

  const handleLogout = () => {
    logoutCompany()
    navigate('/login')
  }

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: `/app/company/${companyId}` },
    { label: 'Research', icon: Search, href: `/app/company/${companyId}/research/new` },
    // BACKEND GAP: Research history page - hide until backend supports GET /research
    // { label: 'History', icon: Clock, href: `/app/company/${companyId}/research` },
  ]

  // Future features - hidden or marked as coming soon
  const futureItems = [
    { label: 'AI Assistant', icon: MessageSquare, href: '#', comingSoon: true },
    { label: 'Outreach', icon: Send, href: '#', comingSoon: true },
    { label: 'Settings', icon: Settings, href: '#', comingSoon: true },
  ]

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-slate-900 border border-slate-800 text-slate-300 rounded-md lg:hidden shadow-lg shadow-black/50"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-30 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-40 h-screen w-64 bg-slate-950 border-r border-slate-800/80 text-slate-100 flex flex-col transition-transform lg:translate-x-0 shadow-2xl shadow-black/50',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-800/80 flex-shrink-0">
          <Link to="/app" className="flex items-center gap-3 group">
            <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 group-hover:border-blue-500/40 transition-colors">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              AgentReach
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-2 mt-2">
            Workspace
          </div>
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                'hover:bg-blue-500/10 hover:text-blue-400 text-slate-400'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}

          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-8 mb-3 px-2">
            Intelligence
          </div>
          {futureItems.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 cursor-not-allowed"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
              <span className="ml-auto text-[9px] font-bold uppercase tracking-wider bg-slate-900 border border-slate-800 text-slate-500 px-2 py-0.5 rounded-full">
                Soon
              </span>
            </div>
          ))}
        </nav>

        {/* Company Switcher */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/50">
          {activeCompany.isAuthenticated && activeCompany.company && (
            <div className="relative">
              <button
                onClick={() => setShowCompanyMenu(!showCompanyMenu)}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-800 transition-all shadow-sm"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20 text-blue-400">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div className="text-left truncate">
                    <p className="text-sm font-semibold text-slate-200 truncate">{activeCompany.company.company_name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{activeCompany.company.industry}</p>
                  </div>
                </div>
                <ChevronDown className={cn('h-4 w-4 text-slate-400 shrink-0 transition-transform', showCompanyMenu && 'rotate-180')} />
              </button>

              {showCompanyMenu && (
                <div className="absolute bottom-[calc(100%+0.5rem)] left-0 w-full bg-slate-900 rounded-xl border border-slate-800 shadow-xl shadow-black/40 overflow-hidden backdrop-blur-xl">
                  <div className="p-1.5">
                    <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Current company
                    </div>
                    <div className="px-3 py-1.5 text-sm font-medium text-white mb-2">
                      {activeCompany.company.company_name}
                    </div>
                    <div className="h-px bg-slate-800/80 mx-2 my-1" />
                    <Link
                      to="/app/companies"
                      onClick={() => setShowCompanyMenu(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                    >
                      <Building2 className="h-4 w-4" />
                      All Companies
                    </Link>
                    <Link
                      to="/app/companies/new"
                      onClick={() => setShowCompanyMenu(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      Add Company
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full mt-3 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 justify-start transition-colors"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>
    </>
  )
}