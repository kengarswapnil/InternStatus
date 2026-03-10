import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full bg-[#0B0F19]/80 backdrop-blur-xl border-b border-white/5 shrink-0 selection:bg-fuchsia-500/30">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Brand Uplink */}
        <Link
          to="/"
          className="text-xl font-black tracking-tighter no-underline group flex items-center gap-2"
        >

          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 group-hover:to-white transition-all">
            InternStatus
          </span>
        </Link>

        {/* Navigation Matrix */}
        <div className="flex items-center gap-3 md:gap-6">


          

          <Link
            to="/login"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-[10px] font-black uppercase tracking-[0.1em] no-underline hover:shadow-[0_8px_20px_-6px_rgba(217,70,239,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 shadow-lg"
          >
            Authenticate
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;