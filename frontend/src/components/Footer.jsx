const Footer = () => (
  <footer className="w-full bg-[#0B0F19]/80 backdrop-blur-xl border-t border-white/5 py-8 px-6 mt-auto shrink-0 selection:bg-fuchsia-500/30">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
      
      {/* Copyright Matrix */}
      <div className="flex items-center gap-3 order-2 md:order-1">
        <div className="h-px w-8 bg-white/10 hidden md:block" />
        <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] m-0">
          © {new Date().getFullYear()} — Authorized Access Only
        </p>
      </div>

      {/* Brand & Tech Stack */}
      <div className="flex flex-col items-center md:items-end gap-1 order-1 md:order-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">
            Project:
          </span>
          <span className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 tracking-tighter">
            InternStatus
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-bold text-white/20 uppercase tracking-[0.3em]">
            System Uplinked
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
        </div>
      </div>

    </div>
  </footer>
);

export default Footer;