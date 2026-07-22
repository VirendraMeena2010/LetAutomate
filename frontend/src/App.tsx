import AppRouter from "./router/AppRouter";
export default function App() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-zinc-950 text-zinc-50 selection:bg-indigo-500/30">      
      {/* AI Ambient Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] h-125 w-125 animate-pulse rounded-full bg-indigo-500/10 blur-[120px] mix-blend-screen pointer-events-none duration-6000" />
      <div className="absolute bottom-[-10%] right-[-10%] h-125 w-125 animate-pulse rounded-full bg-purple-500/10 blur-[120px] mix-blend-screen pointer-events-none duration-8000" />
      <div 
        className="absolute inset-0 bg-size-[24px_24px] opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] pointer-events-none" 
        style={{ maskImage: 'radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)', WebkitMaskImage: 'radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)' }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_80%_at_50%_50%,transparent_20%,#09090b_100%)] pointer-events-none" />
      {/* Full Webpage Layout Wrapper (Removed max-w-md and center restrictions) */}
      <div className="relative flex w-full grow flex-col z-10">
        <AppRouter />
      </div>
    </div>
  );
}