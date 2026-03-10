import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const linkClass = ({ isActive }) =>
    `group flex flex-col items-stretch px-5 py-4 rounded-2xl transition-all duration-300 border mb-1 no-underline ${
      isActive
        ? "bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border-fuchsia-500/40 text-fuchsia-300 shadow-[0_0_20px_rgba(217,70,239,0.1)]"
        : "bg-transparent border-transparent text-white/40 hover:bg-white/5 hover:text-white/90 hover:border-white/10 hover:-translate-y-0.5"
    }`;

  return (
    <aside className="w-64 h-screen sticky top-0 bg-[#0B0F19] border-r border-white/10 flex flex-col flex-none z-50 overflow-hidden selection:bg-fuchsia-500/30">
      
      {/* Static Header */}
      <div className="h-24 flex items-center px-8 border-b border-white/5 shrink-0">
        <div className="flex flex-col">
          <h2 className="text-xl font-black m-0 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-white">
            NAVIGATOR
          </h2>
          <span className="text-[9px] font-bold text-violet-500/60 uppercase tracking-[0.4em] mt-1">
            Main Interface
          </span>
        </div>
      </div>

      {/* Navigation Matrix */}
      <nav className="flex-1 overflow-y-auto no-scrollbar p-6 flex flex-col gap-1">
        
        <NavLink to="/" className={linkClass} end>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">
            Home Baseline
          </span>
        </NavLink>

        <NavLink to="/dashboard" className={linkClass}>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">
            Data Dashboard
          </span>
        </NavLink>

        <NavLink to="/profile" className={linkClass}>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">
            User Profile
          </span>
        </NavLink>

        {/* Decorative Separator */}
        <div className="h-px bg-white/5 my-6 mx-2" />
        
        <div className="px-5 mb-4">
          <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em]">
            External Uplinks
          </span>
        </div>

        <a 
          href="https://github.com" 
          target="_blank" 
          rel="noreferrer"
          className="px-5 py-3 text-[9px] font-bold text-white/30 uppercase tracking-widest no-underline hover:text-violet-400 transition-colors"
        >
          Source Repository ↗
        </a>

      </nav>

      {/* Static Footer Section */}
      <div className="p-6 border-t border-white/5 shrink-0 bg-[#0B0F19]/50">
        <div className="flex items-center gap-3 px-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)] animate-pulse" />
          <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">
            System Online
          </span>
        </div>
      </div>

    </aside>
  );
}