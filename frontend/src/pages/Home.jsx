import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Home() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user?.user);

  useEffect(() => {
    if (user?.role) {
      navigate(`/${user.role}/dashboard`);
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white font-sans overflow-hidden relative selection:bg-fuchsia-500/30 selection:text-fuchsia-200">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-violet-600/30 rounded-full blur-[150px] pointer-events-none mix-blend-screen animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-fuchsia-600/20 rounded-full blur-[150px] pointer-events-none mix-blend-screen"></div>

      <div className="relative z-10 w-full flex flex-col items-center justify-center pt-24 pb-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto w-full flex flex-col items-center text-center mb-20 md:mb-28">
          <div className="inline-block px-5 py-2 mb-8 bg-white/5 border border-white/10 rounded-full backdrop-blur-md animate-bounce">
            <span className="text-xs font-bold uppercase tracking-widest text-fuchsia-400">
              Welcome to the Future of Placements
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight max-w-4xl leading-[1.1]">
            Internship Management <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400 animate-gradient-x">
              Simplified
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/50 max-w-2xl leading-relaxed font-medium m-0">
            A unified platform connecting Colleges, Students, Companies, Mentors,
            and Faculty to manage the complete internship lifecycle — from
            onboarding to completion.
          </p>
        </div>

        <div className="max-w-7xl mx-auto w-full border-t border-white/5 pt-16 md:pt-24">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-white/90 mb-4 tracking-tight">
              One Platform. Every Role.
            </h2>
            <p className="text-white/40 font-medium text-lg m-0">
              Tailored experiences for everyone involved in the placement process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-3xl transition-all duration-500 hover:-translate-y-2 hover:border-violet-500/30 group shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] flex flex-col">
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-violet-400 transition-colors">
                For Students
              </h3>
              <p className="text-white/50 leading-relaxed text-sm m-0">
                Discover opportunities, track your application status in real-time,
                and manage your profile and resumes all in one sleek dashboard.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-3xl transition-all duration-500 hover:-translate-y-2 hover:border-fuchsia-500/30 group shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] flex flex-col">
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-fuchsia-400 transition-colors">
                For Companies
              </h3>
              <p className="text-white/50 leading-relaxed text-sm m-0">
                Post internship drives, filter top talent based on precise skill
                matching, and extend offers effortlessly with streamlined workflows.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-3xl transition-all duration-500 hover:-translate-y-2 hover:border-emerald-500/30 group shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] flex flex-col">
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors">
                For Colleges
              </h3>
              <p className="text-white/50 leading-relaxed text-sm m-0">
                Monitor student progress, assign dedicated mentors, and maintain a
                comprehensive overview of placement statistics and success rates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}