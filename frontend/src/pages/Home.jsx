import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import NavBar from "../components/NavBar";

export default function Home() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user?.user);

  useEffect(() => {
    if (user?.role) {
      navigate(`/${user.role}/dashboard`);
    }
  }, [user, navigate]);

  return (
    <>
      <NavBar />

      <div className="font-['Nunito'] bg-[#FFFFFF] text-[#2D3436] overflow-x-hidden selection:bg-[#6C5CE7]/30 selection:text-[#6C5CE7]">
        {/* HERO */}
        <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative pt-20">
          {/* Subtle background glow effects */}
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#6C5CE7]/10 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#6C5CE7]/5 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="max-w-4xl relative z-10 animate-fade-in-up">
            <p className="text-[13px] font-black tracking-[0.2em] text-[#6C5CE7] mb-6 uppercase drop-shadow-sm">
              Built for Students • Colleges • Companies
            </p>

            <h1 className="text-5xl md:text-7xl font-black leading-tight mb-8 tracking-tighter text-[#2D3436]">
              From Internship Search <br />
              to{" "}
              <span className="text-[#6C5CE7] relative inline-block">
                Completion
                <svg
                  className="absolute w-full h-3 -bottom-1 left-0 text-[#6C5CE7] opacity-30"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 5 Q 50 10 100 5"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                  />
                </svg>
              </span>
            </h1>

            <p className="text-lg md:text-xl font-bold text-[#2D3436] opacity-70 mb-12 max-w-2xl mx-auto leading-relaxed">
              Apply, hire, mentor, and complete internships — all in one
              seamless flow. No spreadsheets. No confusion. Just outcomes.
            </p>

            {/* CTA */}
            <div className="flex flex-wrap justify-center gap-5">
              <button
                onClick={() => navigate("/login")}
                className="px-8 py-4 rounded-[16px] bg-[#6C5CE7] text-[#FFFFFF] font-black uppercase tracking-widest shadow-[0_8px_30px_rgba(108,92,231,0.25)] hover:shadow-[0_8px_30px_rgba(108,92,231,0.4)] hover:-translate-y-1 transition-all duration-300"
              >
                Get Started
              </button>

              <button
                onClick={() => navigate("/college/register")}
                className="px-8 py-4 rounded-[16px] border-2 border-[#F5F6FA] bg-[#FFFFFF] text-[#2D3436] font-black uppercase tracking-widest hover:border-[#6C5CE7] hover:text-[#6C5CE7] hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                For Colleges
              </button>

              <button
                onClick={() => navigate("/company/register")}
                className="px-8 py-4 rounded-[16px] border-2 border-[#F5F6FA] bg-[#FFFFFF] text-[#2D3436] font-black uppercase tracking-widest hover:border-[#6C5CE7] hover:text-[#6C5CE7] hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                For Companies
              </button>
            </div>
          </div>
        </section>

        {/* VALUE SECTION */}
        <section className="py-24 px-6 bg-[#F5F6FA]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight text-[#2D3436]">
                Built Around Outcomes, Not Tools
              </h2>
              <p className="text-[#2D3436] opacity-60 font-bold text-lg">
                Everything is connected — nothing feels fragmented.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-[#FFFFFF] p-10 rounded-[24px] shadow-sm hover:shadow-[0_8px_30px_rgba(108,92,231,0.08)] transition-all duration-500 transform hover:-translate-y-2 border border-transparent hover:border-[#6C5CE7] hover:border-opacity-30 group">
                <div className="w-14 h-14 bg-[#F5F6FA] rounded-full flex items-center justify-center mb-6 group-hover:bg-[#6C5CE7] transition-colors duration-500">
                  <span className="text-[#6C5CE7] group-hover:text-[#FFFFFF] font-black text-xl transition-colors duration-500">
                    1
                  </span>
                </div>
                <h3 className="text-2xl font-black mb-4 text-[#2D3436] group-hover:text-[#6C5CE7] transition-colors duration-300">
                  Get Placed Faster
                </h3>
                <p className="text-[#2D3436] opacity-70 font-bold text-[15px] leading-relaxed">
                  Discover internships, apply instantly, and always know your
                  status — no more guessing or chasing updates.
                </p>
              </div>

              <div className="bg-[#FFFFFF] p-10 rounded-[24px] shadow-sm hover:shadow-[0_8px_30px_rgba(108,92,231,0.08)] transition-all duration-500 transform hover:-translate-y-2 border border-transparent hover:border-[#6C5CE7] hover:border-opacity-30 group">
                <div className="w-14 h-14 bg-[#F5F6FA] rounded-full flex items-center justify-center mb-6 group-hover:bg-[#6C5CE7] transition-colors duration-500">
                  <span className="text-[#6C5CE7] group-hover:text-[#FFFFFF] font-black text-xl transition-colors duration-500">
                    2
                  </span>
                </div>
                <h3 className="text-2xl font-black mb-4 text-[#2D3436] group-hover:text-[#6C5CE7] transition-colors duration-300">
                  Hire Without Chaos
                </h3>
                <p className="text-[#2D3436] opacity-70 font-bold text-[15px] leading-relaxed">
                  Review applicants, assign mentors, and onboard interns in a
                  structured, clean workflow.
                </p>
              </div>

              <div className="bg-[#FFFFFF] p-10 rounded-[24px] shadow-sm hover:shadow-[0_8px_30px_rgba(108,92,231,0.08)] transition-all duration-500 transform hover:-translate-y-2 border border-transparent hover:border-[#6C5CE7] hover:border-opacity-30 group">
                <div className="w-14 h-14 bg-[#F5F6FA] rounded-full flex items-center justify-center mb-6 group-hover:bg-[#6C5CE7] transition-colors duration-500">
                  <span className="text-[#6C5CE7] group-hover:text-[#FFFFFF] font-black text-xl transition-colors duration-500">
                    3
                  </span>
                </div>
                <h3 className="text-2xl font-black mb-4 text-[#2D3436] group-hover:text-[#6C5CE7] transition-colors duration-300">
                  One Continuous Flow
                </h3>
                <p className="text-[#2D3436] opacity-70 font-bold text-[15px] leading-relaxed">
                  From application to completion, every step is connected — no
                  switching tools, no broken processes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FLOW SECTION */}
        <section className="py-24 px-6 bg-[#FFFFFF]">
          <div className="max-w-6xl mx-auto text-center mb-20 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight text-[#2D3436]">
              A Complete Internship Lifecycle
            </h2>
            <p className="text-[#2D3436] opacity-60 font-bold text-lg">
              Not separate features — one continuous experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 text-center max-w-6xl mx-auto relative">
            {/* Connecting line for desktop */}
            <div className="hidden lg:block absolute top-10 left-[12%] right-[12%] h-1 bg-[#F5F6FA] -z-10"></div>

            <div className="flex flex-col items-center group cursor-default">
              <div className="w-20 h-20 rounded-full bg-[#F5F6FA] border-4 border-[#FFFFFF] text-[#6C5CE7] font-black text-2xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-[#6C5CE7] group-hover:text-[#FFFFFF] group-hover:-translate-y-2 group-hover:shadow-[0_8px_20px_rgba(108,92,231,0.3)] transition-all duration-500">
                01
              </div>
              <h4 className="text-xl font-black mb-3 text-[#2D3436]">
                Discover
              </h4>
              <p className="text-[15px] font-bold text-[#2D3436] opacity-60 max-w-[200px]">
                Students explore relevant internship opportunities.
              </p>
            </div>

            <div className="flex flex-col items-center group cursor-default">
              <div className="w-20 h-20 rounded-full bg-[#F5F6FA] border-4 border-[#FFFFFF] text-[#6C5CE7] font-black text-2xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-[#6C5CE7] group-hover:text-[#FFFFFF] group-hover:-translate-y-2 group-hover:shadow-[0_8px_20px_rgba(108,92,231,0.3)] transition-all duration-500">
                02
              </div>
              <h4 className="text-xl font-black mb-3 text-[#2D3436]">Apply</h4>
              <p className="text-[15px] font-bold text-[#2D3436] opacity-60 max-w-[200px]">
                Applications are submitted and tracked in real-time.
              </p>
            </div>

            <div className="flex flex-col items-center group cursor-default">
              <div className="w-20 h-20 rounded-full bg-[#F5F6FA] border-4 border-[#FFFFFF] text-[#6C5CE7] font-black text-2xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-[#6C5CE7] group-hover:text-[#FFFFFF] group-hover:-translate-y-2 group-hover:shadow-[0_8px_20px_rgba(108,92,231,0.3)] transition-all duration-500">
                03
              </div>
              <h4 className="text-xl font-black mb-3 text-[#2D3436]">Work</h4>
              <p className="text-[15px] font-bold text-[#2D3436] opacity-60 max-w-[200px]">
                Mentors guide interns while progress is continuously tracked.
              </p>
            </div>

            <div className="flex flex-col items-center group cursor-default">
              <div className="w-20 h-20 rounded-full bg-[#F5F6FA] border-4 border-[#FFFFFF] text-[#6C5CE7] font-black text-2xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-[#6C5CE7] group-hover:text-[#FFFFFF] group-hover:-translate-y-2 group-hover:shadow-[0_8px_20px_rgba(108,92,231,0.3)] transition-all duration-500">
                04
              </div>
              <h4 className="text-xl font-black mb-3 text-[#2D3436]">
                Complete
              </h4>
              <p className="text-[15px] font-bold text-[#2D3436] opacity-60 max-w-[200px]">
                Performance is evaluated and credits are assigned.
              </p>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-24 px-6 text-center bg-[#6C5CE7] relative overflow-hidden">
          {/* Decorative background circles */}
          <div className="absolute top-[-50%] left-[-10%] w-[400px] h-[400px] bg-[#FFFFFF]/10 rounded-full blur-[80px]"></div>
          <div className="absolute bottom-[-50%] right-[-10%] w-[400px] h-[400px] bg-[#FFFFFF]/10 rounded-full blur-[80px]"></div>

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-[#FFFFFF] tracking-tight">
              Stop Managing. Start Delivering Outcomes.
            </h2>

            <p className="mb-12 text-lg font-bold text-[#FFFFFF] opacity-90 leading-relaxed">
              One platform to run internships end-to-end — without friction.
            </p>

            <button
              onClick={() => navigate("/login")}
              className="px-10 py-5 bg-[#FFFFFF] text-[#6C5CE7] rounded-[16px] font-black uppercase tracking-widest shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              Enter Platform
            </button>
          </div>
        </section>
      </div>
    </>
  );
}
