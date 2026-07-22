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
    company_business_signals: string;
    final_conclusion: string;
}

// Depending on how your FastAPI returns the LangGraph state, adjust this.
// Assuming it returns the final state dictionary where "output" holds the concluder result.
interface ApiResponse {
    output: ConcluderResult;
}

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
            const response = await fetch('http://127.0.0.1:8000/guestmode', {
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
            // Assuming your backend returns the graph state, the final result is in data.output
            setResult(data.output);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    // Helper for score color
    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]';
        if (score >= 50) return 'text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]';
        return 'text-rose-400 drop-shadow-[0_0_10px_rgba(251,113,133,0.8)]';
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30 overflow-x-hidden relative">
            {/* Background Glow Effects */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
                
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center p-3 bg-indigo-500/10 rounded-2xl mb-4 border border-indigo-500/20">
                        <Sparkles className="w-6 h-6 text-indigo-400 mr-2" />
                        <span className="text-indigo-300 font-semibold tracking-wide uppercase text-sm">AI Agent Analysis</span>
                    </div>
                    <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-white via-indigo-200 to-slate-400 mb-4">
                        Discover Your Ideal Customer
                    </h1>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                        Our multi-agent system deep-dives into company data, analyzes market signals, and calculates your perfect ICP match score in real-time.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    
                    {/* Left Column: The Form */}
                    <div className="bg-white/2 border border-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-500">
                        <div className="absolute inset-0 bg-linear-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        <h2 className="text-2xl font-bold mb-6 flex items-center text-white relative z-10">
                            <Target className="w-6 h-6 mr-3 text-indigo-400" />
                            Target Parameters
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                            {/* Company Name */}
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Company Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-5 w-5 text-slate-500" />
                                    </div>
                                    <input
                                        type="text"
                                        name="target_company_name"
                                        required
                                        value={formData.target_company_name}
                                        onChange={handleInputChange}
                                        className="block w-full pl-10 pr-3 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                                        placeholder="e.g. OpenAI"
                                    />
                                </div>
                            </div>

                            {/* Industry */}
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Industry</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Briefcase className="h-5 w-5 text-slate-500" />
                                    </div>
                                    <input
                                        type="text"
                                        name="target_company_industry"
                                        required
                                        value={formData.target_company_industry}
                                        onChange={handleInputChange}
                                        className="block w-full pl-10 pr-3 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                                        placeholder="e.g. Artificial Intelligence"
                                    />
                                </div>
                            </div>

                            {/* Website */}
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Company Website</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Globe className="h-5 w-5 text-slate-500" />
                                    </div>
                                    <input
                                        type="url"
                                        name="target_company_website"
                                        required
                                        value={formData.target_company_website}
                                        onChange={handleInputChange}
                                        className="block w-full pl-10 pr-3 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                                        placeholder="https://openai.com"
                                    />
                                </div>
                            </div>

                            {/* Your Services */}
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Your Services Offering</label>
                                <div className="relative">
                                    <div className="absolute top-3 left-3 pointer-events-none">
                                        <Cpu className="h-5 w-5 text-slate-500" />
                                    </div>
                                    <textarea
                                        name="your_services"
                                        required
                                        rows={4}
                                        value={formData.your_services}
                                        onChange={handleInputChange}
                                        className="block w-full pl-10 pr-3 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none resize-none"
                                        placeholder="Describe what you sell (e.g., Enterprise Cloud Architecture and Security Audits)"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full relative group overflow-hidden rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 p-px mt-4"
                            >
                                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="relative px-6 py-4 bg-linear-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center gap-2 transition-all group-hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                                    {isLoading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span className="font-semibold text-white">Agents Analyzing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="font-semibold text-white">Run ICP Analysis</span>
                                            <Sparkles className="w-5 h-5 text-white/80 group-hover:text-white group-hover:rotate-12 transition-transform" />
                                        </>
                                    )}
                                </div>
                            </button>
                        </form>
                    </div>

                    {/* Right Column: Output / State */}
                    <div className="h-full flex flex-col">
                        
                        {/* Empty State */}
                        {!isLoading && !result && !error && (
                            <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-3xl p-12 text-center bg-slate-900/20">
                                <Activity className="w-16 h-16 text-slate-700 mb-4" />
                                <h3 className="text-xl font-medium text-slate-300 mb-2">Ready to Analyze</h3>
                                <p className="text-slate-500">Fill in the target details and our LangGraph agents will web-scrape, analyze news, and generate business signals.</p>
                            </div>
                        )}

                        {/* Loading State */}
                        {isLoading && (
                            <div className="flex-1 flex flex-col items-center justify-center border border-white/5 bg-white/1 backdrop-blur-sm rounded-3xl p-12 text-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-linear-to-b from-indigo-500/10 to-transparent animate-pulse" />
                                <div className="relative z-10 flex flex-col items-center">
                                    <div className="w-20 h-20 relative mb-6">
                                        <div className="absolute inset-0 border-4 border-slate-800 rounded-full" />
                                        <div className="absolute inset-0 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin" />
                                        <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-indigo-400 animate-pulse" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Orchestrating Agents</h3>
                                    <p className="text-indigo-300/80 animate-pulse">Scraping web data & parsing latest news...</p>
                                </div>
                            </div>
                        )}

                        {/* Error State */}
                        {error && !isLoading && (
                            <div className="bg-rose-500/10 border border-rose-500/20 rounded-3xl p-8 flex flex-col items-center text-center">
                                <AlertCircle className="w-12 h-12 text-rose-400 mb-4" />
                                <h3 className="text-lg font-semibold text-rose-300 mb-2">Analysis Failed</h3>
                                <p className="text-rose-400/80">{error}</p>
                            </div>
                        )}

                        {/* Result State */}
                        {result && !isLoading && (
                            <div className="bg-slate-900/50 border border-slate-700 backdrop-blur-xl rounded-3xl p-8 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <div className="flex justify-between items-start mb-8 pb-8 border-b border-slate-800">
                                    <div>
                                        <h2 className="text-3xl font-bold text-white mb-2">{result.company_name}</h2>
                                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-sm font-medium border border-slate-700">
                                            {result.company_industry}
                                        </span>
                                    </div>
                                    <div className="text-center bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                                        <div className={`text-4xl font-black ${getScoreColor(result.company_icp_match_score)}`}>
                                            {result.company_icp_match_score}
                                        </div>
                                        <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">
                                            ICP Match Score
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-indigo-300 flex items-center mb-3">
                                            <Activity className="w-5 h-5 mr-2" />
                                            Business Signals
                                        </h3>
                                        <div className="bg-slate-950/50 p-5 rounded-xl border border-slate-800/50 text-slate-300 leading-relaxed text-sm">
                                            {result.company_business_signals}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-purple-300 flex items-center mb-3">
                                            <CheckCircle2 className="w-5 h-5 mr-2" />
                                            Final Conclusion
                                        </h3>
                                        <div className="bg-linear-to-r from-indigo-500/10 to-purple-500/10 p-5 rounded-xl border border-indigo-500/20 text-indigo-100 leading-relaxed text-sm">
                                            {result.final_conclusion}
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