import { GuestResearchForm } from '@/features/guest/GuestResearchForm'
import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'

export default function GuestResearchPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden selection:bg-blue-500/30">
      {/* Background Glow Effects */}
      <div className="absolute top-[-10%] left-1/4 w-125 h-125 bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-100 h-100 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Nav */}
      <nav className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md relative z-20">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 group-hover:border-blue-500/40 transition-colors">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-linear-to-r from-white to-slate-300 bg-clip-text text-transparent">
              AgentReach
            </span>
          </Link>
          <div className="flex items-center gap-5">
            <Link 
              to="/login" 
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="text-sm font-medium bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-lg shadow-lg shadow-blue-500/25 transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="py-16 md:py-24 px-6 relative z-10">
        <div className="max-w-2xl mx-auto mb-12 text-center">
          {/* Accent Badge */}
          <div className="inline-flex items-center justify-center px-4 py-1.5 bg-blue-500/10 rounded-full mb-6 border border-blue-500/20 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-blue-400 mr-2" />
            <span className="text-blue-300 font-bold tracking-widest uppercase text-[11px]">Free Preview</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-linear-to-br from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Try AgentReach
          </h1>
          <p className="mt-5 text-lg text-slate-400 leading-relaxed max-w-lg mx-auto">
            Experience AI-powered prospect intelligence without signing up.
          </p>
        </div>
        
        {/* The form component sits above the background */}
        <div className="relative z-10">
          <GuestResearchForm />
        </div>
      </div>
    </div>
  )
}