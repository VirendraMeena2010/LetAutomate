import  { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Play, CheckCircle, Search, Zap, 
  Mail, Users, TrendingUp, ChevronDown, Bot
} from 'lucide-react';

export default function LandingPage() {
  // State to track which FAQ is open
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    { 
      q: "How accurate is the email verification?", 
      a: "We utilize multi-step SMTP verification to ensure a 98%+ deliverability rate, protecting your domain reputation." 
    },
    { 
      q: "Can I review emails before they send?", 
      a: "Absolutely. Agent Reach drafts the campaigns, but you have full human-in-the-loop control to approve, edit, or reject before sending." 
    },
    { 
      q: "Which CRM integrations do you support?", 
      a: "We natively integrate with HubSpot, Salesforce, Pipedrive, and offer webhooks for custom setups." 
    }
  ];

  const toggleFaq = (idx: number) => {
    if (openFaq === idx) {
      setOpenFaq(null); // Close if already open
    } else {
      setOpenFaq(idx); // Open the clicked one
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-indigo-500/30">
      
      {/* HEADER SECTION */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <nav className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer">
            <Bot className="w-8 h-8 text-indigo-500" />
            <span className="text-xl font-bold tracking-tight">Agent Reach</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            <a href="#docs" className="hover:text-white transition-colors">Documentation</a>
          </div>

          <div className="flex items-center gap-4">
            <Link to={"/login"} className="text-sm font-medium hover:text-white transition-colors hidden sm:block">
              Login
            </Link>
            <Link to={"/try-as-guest"} className="text-sm font-medium px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors hidden sm:block">
              Try as Guest
            </Link>
            <Link to={"/signup"} className="text-sm font-medium px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors shadow-[0_0_15px_rgba(79,70,229,0.3)]">
              Sign Up
            </Link>
             
            
          </div>
        </nav>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-8">
            <Zap className="w-4 h-4" />
            <span>Autonomous Multi-Agent B2B Intelligence</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
            Stop researching. <br/>
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-cyan-400">
              Start conversing.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            An AI-powered sales intelligence platform that researches companies, identifies decision-makers, and generates hyper-personalized outreach in 2 minutes, not 40.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to={"/try-as-guest"} className="flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-all shadow-lg shadow-indigo-500/25">
              Start Free Trial <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="flex items-center justify-center gap-2 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold transition-all border border-slate-700">
              <Play className="w-5 h-5" /> Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-slate-900/50" id="how-it-works">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">The Old Way vs. Agent Reach</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Why spend hours doing manual recon when a fleet of autonomous agents can do it instantly?</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* The Old Way */}
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 opacity-75">
              <h3 className="text-xl font-semibold text-slate-400 mb-6">
                Typical Workflow (40 mins)
              </h3>
              <ul className="space-y-4 text-sm text-slate-500 font-mono line-through decoration-slate-700">
                <li>1. Search Google</li>
                <li>2. Open Website & Read About Page</li>
                <li>3. Read Careers & News</li>
                <li>4. Search LinkedIn</li>
                <li>5. Find CEO & Email</li>
                <li>6. Study Technology Stack</li>
                <li>7. Identify Pain Points</li>
                <li>8. Write Cold Email</li>
              </ul>
            </div>

            {/* Agent Reach Way */}
            <div className="p-8 rounded-2xl bg-linear-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Bot className="w-32 h-32" />
              </div>
              <h3 className="text-xl font-semibold text-indigo-400 mb-6">
                Agent Reach Workflow (2 mins)
              </h3>
              <div className="space-y-4 text-slate-300 relative z-10">
                <p className="p-4 bg-slate-950/50 rounded-lg border border-slate-800">
                  <span className="text-indigo-400 font-semibold">Prompt:</span> "Analyze Company X."
                </p>
                <div className="flex flex-col gap-2 p-4 bg-indigo-500/10 rounded-lg border border-indigo-500/20 text-sm">
                  <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400"/> Raised Series A recently.</div>
                  <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400"/> Hiring AI Engineers.</div>
                  <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400"/> Stack: HubSpot, React, AWS.</div>
                  <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400"/> Pain point identified: Support Automation.</div>
                  <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400"/> CEO Email: verified & loaded.</div>
                </div>
                <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-medium transition-colors text-white mt-4 flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4" /> Review & Send Personalized Email
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE CARDS */}
      <section className="py-24" id="features">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Built for Conversion</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Everything you need to turn raw domains into highly personalized, high-converting pipeline.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: <Search className="w-6 h-6 text-cyan-400" />,
                title: "Deep Tech & News Recon",
                desc: "Agents autonomously scrape job boards, press releases, and tech stacks to find precise trigger events."
              },
              {
                icon: <Users className="w-6 h-6 text-indigo-400" />,
                title: "Decision-Maker ID",
                desc: "Instantly maps out the org chart, verifies email addresses, and flags the highest-probability buyer."
              },
              {
                icon: <TrendingUp className="w-6 h-6 text-emerald-400" />,
                title: "Hyper-Personalization",
                desc: "Drafts highly specific outreach tailored to their exact pain points, sounding strictly human."
              }
            ].map((feature, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-slate-900/50 border-y border-slate-800">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-12">Trusted by B2B Growth Leaders</h2>
          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800">
              <div className="flex gap-1 text-indigo-500 mb-4">★★★★★</div>
              <p className="text-slate-300 italic mb-6">"Our AI automation agency used to spend 20 hours a week just building lists and writing context. Agent Reach turned that into a 30-minute daily task."</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700"></div>
                <div>
                  <p className="font-semibold text-sm">Sarah Jenkins</p>
                  <p className="text-slate-500 text-xs">Founder, AI Transform</p>
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800">
              <div className="flex gap-1 text-indigo-500 mb-4">★★★★★</div>
              <p className="text-slate-300 italic mb-6">"The personalization is scary good. It found out a prospect was migrating to HubSpot and tailored the pitch perfectly. Booked the meeting."</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700"></div>
                <div>
                  <p className="font-semibold text-sm">David Chen</p>
                  <p className="text-slate-500 text-xs">Head of Sales, CloudSync</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FIXED FAQ WITH STATE & RENDERED ANSWERS */}
      <section className="py-24" id="faq">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                onClick={() => toggleFaq(idx)}
                className={`p-5 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900 transition-colors cursor-pointer group ${openFaq === idx ? 'ring-1 ring-indigo-500/50' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <h4 className={`font-medium ${openFaq === idx ? 'text-indigo-400' : ''}`}>{faq.q}</h4>
                  <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-200 ${openFaq === idx ? 'rotate-180 text-indigo-400' : 'group-hover:text-white'}`} />
                </div>
                {/* Condition to render the answer based on state */}
                {openFaq === idx && (
                  <div className="mt-4 text-slate-400 text-sm leading-relaxed pr-8 animate-in fade-in slide-in-from-top-2 duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
{/* COMPACT FOOTER */}
      <footer className="border-t border-slate-800 bg-slate-950 pt-10 pb-6 text-slate-400 text-sm">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
            <div className="col-span-2">
              <div className="flex items-center gap-2 text-white mb-3">
                <Bot className="w-5 h-5 text-indigo-500" />
                <span className="font-bold text-base">Agent Reach</span>
              </div>
              <p className="text-xs max-w-xs">Autonomous intelligence for modern B2B outreach. Stop researching, start conversing.</p>
            </div>
            
            <div>
              <h5 className="text-white font-medium mb-3 text-xs uppercase tracking-wider">Product</h5>
              <ul className="space-y-2 text-xs">
                <li><a href="#features" className="hover:text-indigo-400 transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-indigo-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="text-white font-medium mb-3 text-xs uppercase tracking-wider">Resources</h5>
              <ul className="space-y-2 text-xs">
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Docs</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="text-white font-medium mb-3 text-xs uppercase tracking-wider">Legal</h5>
              <ul className="space-y-2 text-xs">
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-6 border-t border-slate-800/50 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
            <p>© 2026 Agent Reach. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">Twitter</a>
              <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-white transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}