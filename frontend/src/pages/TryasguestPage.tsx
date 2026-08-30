import React, { useState } from 'react';
import { 
    Search, 
    Briefcase, 
    Globe, 
    Cpu, 
    Sparkles, 
    Activity,
    Target,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';

// --- Types ---
interface GuestModeInput {
    target_company_name: string;
    target_company_industry: string;
    target_company_website: string;
    your_services: string;
}

interface ConcluderResult {
    company_name: string;
    company_industry: string;
    company_icp_match_score: number;
    company_icp_match_level: string; 
    company_business_signals: string;
    final_conclusion: string;
}

interface ApiResponse {
    output: ConcluderResult;
}

// --- Markdown Formatter Helper ---
// Parses raw markdown from the AI into beautifully styled React elements
const formatOutputText = (text: string) => {
    if (!text) return null;
    
    return text.split('\n').map((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={index} className="h-3" />;

        // Helper to parse bold (**text**)
        const parseBold = (str: string) => {
            const parts = str.split(/(\*\*.*?\*\*)/g);
            return parts.map((part, i) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={i} className="font-semibold text-white drop-shadow-sm">{part.slice(2, -2)}</strong>;
                }
                return part;
            });
        };

        // Headers (e.g. ### Signal)
        if (trimmed.startsWith('#')) {
            const content = trimmed.replace(/^#+\s*/, '');
            return (
                <h4 key={index} className="font-bold text-white mt-6 mb-2 text-base tracking-wide">
                    {parseBold(content)}
                </h4>
            );
        }

        // Bullet points (- text or * text)
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            const content = trimmed.substring(2).trim();
            return (
                <div key={index} className="flex items-start gap-3 mt-3 ml-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-current opacity-60 mt-2 shrink-0" />
                    <div className="flex-1 leading-relaxed opacity-90">{parseBold(content)}</div>
                </div>
            );
        }

        // Numbered lists (1. text)
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
            return (
                <div key={index} className="flex items-start gap-3 mt-3 ml-1">
                    <div className="font-bold shrink-0 mt-0.5 opacity-70">{numMatch[1]}.</div>
                    <div className="flex-1 leading-relaxed opacity-90">{parseBold(numMatch[2])}</div>
                </div>
            );
        }

        // Normal paragraph
        return (
            <div key={index} className="mt-3 leading-relaxed opacity-90">
                {parseBold(trimmed)}
            </div>
        );
    });
};

export default function GuestPage() {
    const [formData, setFormData] = useState<GuestModeInput>({
        target_company_name: '',
        target_company_industry: '',
        target_company_website: '',
        your_services: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<ConcluderResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch('https://agentreach-api.onrender.com/guestmode', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to analyze company. Please try again.');
            }

            const data: ApiResponse = await response.json();
            setResult(data.output);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    // Helper for score text color
    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.4)]';
        if (score >= 50) return 'text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.4)]';
        return 'text-rose-400 drop-shadow-[0_0_15px_rgba(251,113,133,0.4)]';
    };

    // Helper for match level badge styling
    const getLevelColor = (level: string) => {
        const lowerLevel = level?.toLowerCase() || '';
        if (lowerLevel.includes('high') || lowerLevel.includes('strong')) {
            return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
        }
        if (lowerLevel.includes('medium') || lowerLevel.includes('moderate')) {
            return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
        }
        if (lowerLevel.includes('low') || lowerLevel.includes('weak')) {
            return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
        }
        return 'bg-slate-800 text-slate-300 border-slate-700';
    };

    // Shared input styling
    const inputClasses = "block w-full pl-11 pr-4 py-3.5 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none shadow-inner";

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30 overflow-x-hidden relative">
            {/* Background Glow Effects */}
            <div className="absolute top-[0%] left-[-5%] w-125 h-125 rounded-full bg-blue-600/15 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[0%] right-[-5%] w-125 h-125 rounded-full bg-indigo-600/15 blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
                
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center px-4 py-1.5 bg-blue-500/10 rounded-full mb-6 border border-blue-500/20 backdrop-blur-md">
                        <Sparkles className="w-4 h-4 text-blue-400 mr-2" />
                        <span className="text-blue-300 font-bold tracking-widest uppercase text-[11px]">AI Agent Analysis</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight bg-linear-to-br from-white via-slate-200 to-slate-400 bg-clip-text text-transparent mb-6">
                        Discover Your Ideal Customer
                    </h1>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
                        Our multi-agent system deep-dives into company data, analyzes market signals, and calculates your perfect ICP match score in real-time.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                    
                    {/* Left Column: The Form */}
                    <div className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl shadow-black/50 relative overflow-hidden group hover:border-slate-700/80 transition-all duration-500">
                        {/* Subtle hover gradient */}
                        <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        <h2 className="text-2xl font-bold mb-8 flex items-center text-white relative z-10">
                            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 mr-3">
                                <Target className="w-5 h-5 text-blue-400" />
                            </div>
                            Target Parameters
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                            {/* Company Name */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-300">Company Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Search className="h-4 w-4 text-slate-500" />
                                    </div>
                                    <input
                                        type="text"
                                        name="target_company_name"
                                        required
                                        value={formData.target_company_name}
                                        onChange={handleInputChange}
                                        className={inputClasses}
                                        placeholder="e.g. OpenAI"
                                    />
                                </div>
                            </div>

                            {/* Industry */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-300">Industry</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Briefcase className="h-4 w-4 text-slate-500" />
                                    </div>
                                    <input
                                        type="text"
                                        name="target_company_industry"
                                        required
                                        value={formData.target_company_industry}
                                        onChange={handleInputChange}
                                        className={inputClasses}
                                        placeholder="e.g. Artificial Intelligence"
                                    />
                                </div>
                            </div>

                            {/* Website */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-300">Company Website</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Globe className="h-4 w-4 text-slate-500" />
                                    </div>
                                    <input
                                        type="url"
                                        name="target_company_website"
                                        required
                                        value={formData.target_company_website}
                                        onChange={handleInputChange}
                                        className={inputClasses}
                                        placeholder="https://openai.com"
                                    />
                                </div>
                            </div>

                            {/* Your Services */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-300">Your Services Offering</label>
                                <div className="relative">
                                    <div className="absolute top-4 left-4 pointer-events-none">
                                        <Cpu className="h-4 w-4 text-slate-500" />
                                    </div>
                                    <textarea
                                        name="your_services"
                                        required
                                        rows={4}
                                        value={formData.your_services}
                                        onChange={handleInputChange}
                                        className={`${inputClasses} resize-none`}
                                        placeholder="Describe what you sell (e.g., Enterprise Cloud Architecture and Security Audits)"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full relative group overflow-hidden rounded-xl mt-4 bg-linear-to-r from-blue-600 to-indigo-600 p-px border-0 shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="relative px-6 py-4 bg-linear-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center gap-2 transition-all">
                                    {isLoading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span className="font-semibold text-white">Agents Analyzing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="font-bold text-white tracking-wide">Run ICP Analysis</span>
                                            <Sparkles className="w-5 h-5 text-white/80 group-hover:text-white group-hover:rotate-12 transition-transform" />
                                        </>
                                    )}
                                </div>
                            </button>
                        </form>
                    </div>

                    {/* Right Column: Output / State */}
                    <div className="h-full flex flex-col min-h-125">
                        
                        {/* Empty State */}
                        {!isLoading && !result && !error && (
                            <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-800/80 rounded-3xl p-12 text-center bg-slate-900/30 relative overflow-hidden">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
                                <div className="h-16 w-16 bg-slate-800/50 rounded-2xl flex items-center justify-center mb-6 border border-slate-700/50 shadow-inner relative z-10">
                                    <Activity className="w-8 h-8 text-slate-500" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-200 mb-2 relative z-10">Ready to Analyze</h3>
                                <p className="text-slate-400 max-w-sm relative z-10 leading-relaxed">
                                    Fill in the target details and our LangGraph agents will web-scrape, analyze news, and generate business signals.
                                </p>
                            </div>
                        )}

                        {/* Loading State */}
                        {isLoading && (
                            <div className="flex-1 flex flex-col items-center justify-center border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl rounded-3xl p-12 text-center relative overflow-hidden shadow-2xl shadow-black/50">
                                <div className="absolute inset-0 bg-linear-to-b from-blue-500/5 to-transparent animate-pulse" />
                                <div className="relative z-10 flex flex-col items-center">
                                    <div className="w-20 h-20 relative mb-8">
                                        <div className="absolute inset-0 border-4 border-slate-800/80 rounded-full" />
                                        <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                                        <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-blue-400 animate-pulse" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Orchestrating Agents</h3>
                                    <p className="text-blue-400/80 animate-pulse font-medium">Scraping web data & parsing latest news...</p>
                                </div>
                            </div>
                        )}

                        {/* Error State */}
                        {error && !isLoading && (
                            <div className="bg-rose-500/10 border border-rose-500/20 rounded-3xl p-10 flex flex-col items-center text-center backdrop-blur-xl">
                                <div className="p-4 bg-rose-500/10 rounded-2xl border border-rose-500/20 mb-5">
                                    <AlertCircle className="w-10 h-10 text-rose-400" />
                                </div>
                                <h3 className="text-xl font-bold text-rose-300 mb-3">Analysis Failed</h3>
                                <p className="text-rose-400/80 leading-relaxed">{error}</p>
                            </div>
                        )}

                        {/* Result State */}
                        {result && !isLoading && (
                            <div className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl shadow-black/50 animate-in fade-in slide-in-from-bottom-4 duration-700 h-full flex flex-col">
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-8 pb-8 border-b border-slate-800/80">
                                    <div className="flex-1">
                                        <h2 className="text-3xl font-extrabold text-white mb-3 tracking-tight">{result.company_name}</h2>
                                        <span className="inline-flex items-center px-3 py-1 rounded-lg bg-slate-800/80 text-slate-300 text-xs font-bold uppercase tracking-wider border border-slate-700 shadow-sm">
                                            {result.company_industry}
                                        </span>
                                    </div>
                                    
                                    {/* Score & Match Level Block */}
                                    <div className="flex flex-col items-center bg-slate-950/80 p-5 rounded-2xl border border-slate-800/80 shadow-inner min-w-35 shrink-0 relative overflow-hidden">
                                        <div className={`text-5xl font-black tracking-tighter ${getScoreColor(result.company_icp_match_score)}`}>
                                            {result.company_icp_match_score}
                                        </div>
                                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">
                                            ICP Score
                                        </div>
                                        {result.company_icp_match_level && (
                                            <div className={`mt-3 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border shadow-sm ${getLevelColor(result.company_icp_match_level)}`}>
                                                {result.company_icp_match_level}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-6 flex-1">
                                    {/* Formatted Business Signals */}
                                    <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800/50 shadow-inner">
                                        <h3 className="text-sm font-bold uppercase tracking-widest text-blue-400 flex items-center mb-2">
                                            <Activity className="w-4 h-4 mr-2" />
                                            Business Signals
                                        </h3>
                                        <div className="text-slate-300 text-sm">
                                            {formatOutputText(result.company_business_signals)}
                                        </div>
                                    </div>

                                    {/* Formatted Final Conclusion */}
                                    <div className="bg-linear-to-br from-indigo-500/10 to-purple-500/5 p-6 rounded-2xl border border-indigo-500/20 shadow-inner relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                                            <CheckCircle2 className="w-24 h-24 text-indigo-400" />
                                        </div>
                                        <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-300 flex items-center mb-2 relative z-10">
                                            <CheckCircle2 className="w-4 h-4 mr-2" />
                                            Final Conclusion
                                        </h3>
                                        <div className="text-indigo-200 text-sm relative z-10">
                                            {formatOutputText(result.final_conclusion)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}