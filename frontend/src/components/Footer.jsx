const Footer = () => (
  <footer className="w-full bg-[#FFFFFF] border-t border-[#F5F6FA] py-8 px-6 mt-auto shrink-0 font-['Nunito'] transition-all duration-300">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex items-center gap-3 order-2 md:order-1">
        <div className="h-px w-8 bg-[#F5F6FA] hidden md:block" />
        <p className="text-[10px] font-bold text-[#2D3436] opacity-60 uppercase tracking-[0.2em] m-0 transition-opacity hover:opacity-100">
          © {new Date().getFullYear()} — Authorized Access Only
        </p>
      </div>

      <div className="flex flex-col items-center md:items-end gap-1 order-1 md:order-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-[#2D3436] opacity-60 uppercase tracking-widest">
            Project:
          </span>
          <span className="text-sm font-black text-[#6C5CE7] tracking-tighter">
            InternStatus
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[9px] font-bold text-[#2D3436] opacity-50 uppercase tracking-[0.3em]">
            System Uplinked
          </span>
          {/* Maintained the semantic green color for the status indicator as requested */}
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
