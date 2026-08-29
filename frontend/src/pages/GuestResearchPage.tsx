import { GuestResearchForm } from '@/features/guest/GuestResearchForm'
import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'

export default function GuestResearchPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Nav */}
      <nav className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-slate-900">AgentReach</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">
              Login
            </Link>
            <Link
              to="/signup"
              className="text-sm font-medium bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="py-12 px-6">
        <div className="max-w-2xl mx-auto mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900">Try AgentReach</h1>
          <p className="mt-2 text-slate-500">
            Experience AI-powered prospect intelligence without signing up.
          </p>
        </div>
        <GuestResearchForm />
      </div>
    </div>
  )
}


