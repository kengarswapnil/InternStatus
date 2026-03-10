import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import API from "../../api/api";

export default function AdminSidebar() {
  const [counts, setCounts] = useState({
    all: 0,
    college: 0,
    company: 0
  });

  const fetchCounts = async () => {
    try {
      const res = await API.get("/admin/onboarding/pending?type=all");
      const colleges = res.data?.data?.colleges || [];
      const companies = res.data?.data?.companies || [];

      setCounts({
        all: colleges.length + companies.length,
        college: colleges.length,
        company: companies.length
      });
    } catch (err) {
      console.error("Sidebar count error:", err);
    }
  };

  useEffect(() => {
    fetchCounts();
    const interval = setInterval(fetchCounts, 30000);
    return () => clearInterval(interval);
  }, []);

  // Optimized stable link classes
  const linkClass = ({ isActive }) =>
    `group flex flex-col items-stretch px-5 py-4 rounded-2xl transition-all duration-300 border mb-1 no-underline ${
      isActive
        ? "bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border-fuchsia-500/40 text-fuchsia-300 shadow-[0_0_20px_rgba(217,70,239,0.1)]"
        : "bg-transparent border-transparent text-white/40 hover:bg-white/5 hover:text-white/90 hover:border-white/10"
    }`;

  return (
    <aside className="w-72 h-screen sticky top-0 bg-[#0B0F19] border-r border-white/10 flex flex-col flex-none z-50 overflow-hidden">
      {/* Static Header - Never Moves */}
      <div className="h-24 flex items-center px-8 border-b border-white/5 shrink-0">
        <div className="flex flex-col">
          <h2 className="text-xl font-black m-0 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-white">
            CORE ADMIN
          </h2>
          <span className="text-[9px] font-bold text-fuchsia-500/60 uppercase tracking-[0.4em] mt-1">
            Command Center
          </span>
        </div>
      </div>

      {/* Scrollable Navigation Area */}
      <nav className="flex-1 overflow-y-auto no-scrollbar p-6 flex flex-col gap-1">
        
        <NavLink to="/admin" className={linkClass} end>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Dashboard</span>
        </NavLink>

        <NavLink to="/admin/users" className={linkClass}>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">User Matrix</span>
        </NavLink>

        {/* Stable Request Link */}
        <NavLink to="/admin/onboarding/pending" className={linkClass}>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Pending Requests</span>
            {counts.all > 0 && (
              <span className="bg-fuchsia-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(217,70,239,0.5)]">
                {counts.all}
              </span>
            )}
          </div>
          
          {/* Sub-counts with fixed height to prevent layout jumps */}
          <div className={`overflow-hidden transition-all duration-500 ${counts.all > 0 ? "max-h-20 mt-4 opacity-100" : "max-h-0 opacity-0"}`}>
            <div className="flex flex-col gap-2 pl-3 border-l-2 border-white/10 ml-1">
              <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest text-white/30">
                Colleges <span className="text-violet-400 font-black">{counts.college}</span>
              </div>
              <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest text-white/30">
                Companies <span className="text-fuchsia-400 font-black">{counts.company}</span>
              </div>
            </div>
          </div>
        </NavLink>

        <NavLink to="/admin/onboarding/verified" className={linkClass}>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Verified Onboarding</span>
        </NavLink>

        <div className="h-px bg-white/5 my-4 mx-2" />

        <NavLink to="/admin/colleges" className={linkClass}>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Colleges</span>
        </NavLink>

        <NavLink to="/admin/companies" className={linkClass}>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Companies</span>      
        </NavLink>
      </nav>

      {/* Static Footer */}
      <div className="p-6 border-t border-white/5 shrink-0 bg-[#0B0F19]/50">
        <button className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black text-white/40 uppercase tracking-widest hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all duration-300">
          System Logout
        </button>
      </div>

    </aside>
  );
}