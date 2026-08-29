import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Sparkles,
  Search,
  Brain,
  Target,
  BarChart3,
  Users,
  Zap,
  Clock,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-500/30 selection:text-blue-200">
      {/* Navigation */}
      <nav className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:border-blue-500/40 transition-colors">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">AgentReach</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#product" className="hover:text-white transition-colors">Product</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-800/60">
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/20 border-0">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-24 md:py-36 px-6 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-75 h-75 bg-indigo-500/20 rounded-full blur-[80px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-8">
            <Sparkles className="h-3.5 w-3.5" /> Next-Gen AI Prospecting
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
            Turn company research into{' '}
            <span className="bg-linear-to-r from-blue-400 via-indigo-300 to-violet-400 bg-clip-text text-transparent">
              qualified prospects
            </span>
          </h1>
          <p className="mt-8 text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            AgentReach uses AI to research companies, identify opportunities, and help you find the prospects worth contacting.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium shadow-lg shadow-blue-500/25 border-0 h-12 px-8">
                Start Researching
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/guest-research" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-slate-800 bg-slate-900/50 hover:bg-slate-800 text-slate-300 hover:text-white h-12 px-8">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-slate-900/50 border-y border-slate-800/80 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-200">
            Manual prospect research takes too long
          </h2>
          <div className="mt-8 inline-flex items-center gap-3 bg-slate-950 border border-slate-800 rounded-full px-6 py-3.5 shadow-inner">
            <Clock className="h-5 w-5 text-rose-500 animate-pulse" />
            <span className="text-2xl font-bold bg-linear-to-r from-rose-400 to-red-500 bg-clip-text text-transparent">
              20–40 minutes
            </span>
            <span className="text-slate-400 font-medium">per company</span>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16 tracking-tight">
            The AgentReach solution
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Search, label: 'Research', desc: 'Deep company analysis' },
              { icon: Brain, label: 'Analyze', desc: 'AI-driven insights' },
              { icon: Target, label: 'Match', desc: 'ICP alignment scoring' },
              { icon: BarChart3, label: 'Prioritize', desc: 'Ranked opportunities' },
            ].map((step, i) => (
              <div key={i} className="text-center group p-6 rounded-2xl bg-slate-900/40 border border-slate-800/60 hover:border-slate-700/80 transition-all duration-300">
                <div className="h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <step.icon className="h-6 w-6" />
                </div>
                <p className="font-semibold text-white text-base mb-1">{step.label}</p>
                <p className="text-sm text-slate-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-900/30 border-t border-slate-800/80 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16 tracking-tight">
            Everything you need for prospect intelligence
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Search, title: 'AI Company Research', desc: 'Automated deep-dive into any target company.' },
              { icon: Target, title: 'ICP Matching', desc: 'Score prospects against your ideal customer profile.' },
              { icon: CheckCircle2, title: 'Evidence-Based Insights', desc: 'Every claim backed by real data sources.' },
              { icon: Zap, title: 'Pain Point Discovery', desc: 'Surface business challenges you can solve.' },
              { icon: Users, title: 'Decision Maker Intelligence', desc: 'Identify the right people to contact.' },
              { icon: BarChart3, title: 'Research History', desc: 'Track and compare all your research runs.' },
            ].map((feature, i) => (
              <Card key={i} className="bg-slate-900/60 border-slate-800/80 hover:border-blue-500/30 transition-all duration-300 shadow-xl shadow-black/20">
                <CardContent className="p-6">
                  <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 w-fit mb-4">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-slate-100 text-lg">{feature.title}</h3>
                  <p className="text-sm text-slate-400 mt-2 leading-relaxed">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16 tracking-tight">
            How it works
          </h2>
          <div className="space-y-6">
            {[
              'Create your company profile',
              'Define your services and ICP',
              'Enter a target company',
              'Let AgentReach research',
              'Review intelligence and reach out',
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-5 p-4 rounded-xl bg-slate-900/40 border border-slate-800/60">
                <div className="h-9 w-9 rounded-lg bg-linear-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-sm font-bold shrink-0 shadow-md shadow-blue-500/20">
                  {i + 1}
                </div>
                <p className="text-lg font-medium text-slate-200">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden px-6 border-t border-slate-800/80">
        <div className="absolute inset-0 bg-linear-to-b from-blue-950/20 to-slate-950 pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Ready to find better prospects?</h2>
          <p className="mt-4 text-slate-400 text-lg">
            Start using AgentReach today and turn research into revenue.
          </p>
          <div className="mt-10">
            <Link to="/signup">
              <Button size="lg" className="bg-white hover:bg-slate-100 text-slate-950 font-semibold shadow-xl shadow-white/10 h-12 px-8">
                Start using AgentReach
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 px-6 bg-slate-950">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-400" />
            <span className="font-semibold text-white tracking-tight">AgentReach</span>
          </div>
          <p className="text-sm text-slate-500">AI Prospect Intelligence</p>
        </div>
      </footer>
    </div>
  )
}


