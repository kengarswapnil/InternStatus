import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { useParams } from "react-router-dom";

export default function InternshipDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchData = async () => {
    try {
      const res = await API.get(`/internships/${id}`);
      setData(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const apply = async () => {
    try {
      setLoading(true);
      await API.post(`/applications/apply/${id}`);
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0B0F19]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-white/10 border-t-fuchsia-500 rounded-full animate-spin"></div>
          <p className="text-fuchsia-400 font-medium tracking-widest uppercase text-sm animate-pulse">
            Loading Details
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] p-4 md:p-8 font-sans text-white selection:bg-fuchsia-500/30 selection:text-fuchsia-200">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        <main className="flex-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] transition-all duration-300 hover:border-white/20 h-max">
          <header className="mb-10 border-b border-white/10 pb-8">
            <h1 className="text-4xl md:text-5xl font-black m-0 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 mb-3">
              {data.title}
            </h1>
            <p className="text-xl font-bold text-fuchsia-400 uppercase tracking-widest m-0">
              {data.company?.name}
            </p>
          </header>

          <section className="mb-10">
            <h2 className="text-sm font-bold uppercase tracking-widest text-violet-400 mb-6 border-b border-white/10 pb-4">
              About the Internship
            </h2>
            <div className="text-base text-white/80 leading-relaxed m-0 whitespace-pre-line bg-[#0B0F19]/30 p-6 rounded-2xl border border-white/5">
              {data.description}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-sm font-bold uppercase tracking-widest text-violet-400 mb-6 border-b border-white/10 pb-4">
              Skills Required
            </h2>
            <div className="flex flex-wrap gap-3">
              {data.skillsRequired?.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gradient-to-br from-white/5 to-white/10 border border-white/10 rounded-xl text-sm font-medium text-white/90 shadow-sm transition-all hover:-translate-y-0.5 hover:border-violet-500/50"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-violet-400 mb-6 border-b border-white/10 pb-4">
              Eligibility
            </h2>
            <div className="bg-[#0B0F19]/30 border border-white/5 rounded-2xl p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-2">
                  <span className="block text-xs font-bold text-white/40 uppercase tracking-widest">
                    Courses
                  </span>
                  <span className="text-base font-medium text-white/90">
                    {data.eligibility?.courses?.join(", ") || "Any"}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="block text-xs font-bold text-white/40 uppercase tracking-widest">
                    Specializations
                  </span>
                  <span className="text-base font-medium text-white/90">
                    {data.eligibility?.specializations?.join(", ") || "Any"}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="block text-xs font-bold text-white/40 uppercase tracking-widest">
                    Year of Study
                  </span>
                  <span className="text-base font-medium text-white/90">
                    Year {data.eligibility?.minYear} to {data.eligibility?.maxYear}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="block text-xs font-bold text-white/40 uppercase tracking-widest">
                    Total Positions
                  </span>
                  <span className="text-base font-medium text-white/90">
                    {data.positions} vacancies
                  </span>
                </div>
              </div>
            </div>
          </section>
        </main>

        <aside className="w-full lg:w-[380px] flex-shrink-0">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] sticky top-8 transition-all duration-300 hover:border-white/20">
            <div className="flex flex-col gap-8 mb-8">
              <div className="flex flex-col gap-2 bg-[#0B0F19]/30 p-6 rounded-2xl border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                  Stipend
                </span>
                <span className="text-3xl font-black text-white">
                  {data.stipendType === "paid"
                    ? `₹${data.stipendAmount}`
                    : data.stipendType}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2 bg-[#0B0F19]/30 p-5 rounded-2xl border border-white/5">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                    Duration
                  </span>
                  <span className="text-base font-bold text-white/90">
                    {data.durationMonths} Months
                  </span>
                </div>
                <div className="flex flex-col gap-2 bg-[#0B0F19]/30 p-5 rounded-2xl border border-white/5">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                    Mode
                  </span>
                  <span className="text-base font-bold text-white/90 capitalize">
                    {data.mode}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-4 pt-6 border-t border-white/10">
                <div className="flex justify-between items-center bg-[#0B0F19]/30 px-5 py-4 rounded-xl border border-white/5">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                    Start Date
                  </span>
                  <span className="text-sm font-medium text-white/80">
                    {new Date(data.startDate).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex justify-between items-center bg-[#0B0F19]/30 px-5 py-4 rounded-xl border border-white/5">
                  <span className="text-[10px] font-bold text-fuchsia-400 uppercase tracking-widest">
                    Apply By
                  </span>
                  <span className="text-sm font-bold text-fuchsia-300">
                    {new Date(data.applicationDeadline).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>

            <button
              disabled={data.alreadyApplied || loading}
              onClick={apply}
              className={`w-full py-4 text-sm font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 tracking-wide uppercase
                ${
                  data.alreadyApplied
                    ? "bg-white/5 border border-white/10 text-white/40 cursor-not-allowed"
                    : "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg hover:shadow-[0_8px_20px_-6px_rgba(217,70,239,0.5)] hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 border-none"
                }
              `}
            >
              {loading && (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              )}
              {data.alreadyApplied
                ? "Already Applied"
                : loading
                ? "Applying..."
                : "Apply Now"}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}