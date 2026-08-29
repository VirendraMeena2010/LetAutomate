import { Outlet, Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden selection:bg-blue-500/30">
      {/* Background Glowing Effects */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-indigo-500/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Brand Header */}
      <div className="p-6 relative z-10">
        <Link to="/" className="flex items-center gap-3 w-fit group">
          <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 group-hover:border-blue-500/40 transition-colors">
            <Sparkles className="h-6 w-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            AgentReach
          </span>
        </Link>
      </div>

      {/* Auth Content Area */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  )
}


