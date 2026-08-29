import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { AlertTriangle, Home } from 'lucide-react'

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 relative overflow-hidden selection:bg-blue-500/30">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-100 h-100 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-62.5 h-62.5 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="text-center max-w-md relative z-10">
        <div className="h-20 w-20 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-500/10">
          <AlertTriangle className="h-10 w-10 text-amber-400" />
        </div>
        
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-linear-to-br from-white to-slate-400 bg-clip-text text-transparent">
          404
        </h1>
        
        <p className="mt-4 text-xl font-semibold text-slate-200">
          Page not found
        </p>
        
        <p className="mt-2 text-base text-slate-400 leading-relaxed">
          The page you're looking for doesn't exist, has been moved, or you don't have access to it.
        </p>
        
        <Link to="/" className="inline-block mt-8">
          <Button className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium shadow-lg shadow-blue-500/25 border-0 h-11 px-8">
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}