import React, { useState } from "react";
import API from "../../api/api";

export default function PostInternship() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    startDate: "",
    applicationDeadline: "",
    durationMonths: 1,
    mode: "remote",
    skillsRequired: "",
    locations: "",
    positions: 1,
    maxApplicants: "",
    stipendType: "paid",
    stipendAmount: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        ...form,
        durationMonths: Number(form.durationMonths),
        positions: Number(form.positions),
        maxApplicants: form.maxApplicants ? Number(form.maxApplicants) : null,
        skillsRequired: form.skillsRequired.split(",").map(s => s.trim()).filter(Boolean),
        locations: form.mode === "remote" ? [] : form.locations.split(",").map(l => l.trim()).filter(Boolean)
      };

      const res = await API.post("/internships", payload);
      setSuccess(res.data.message || "Internship deployed to the command center!");
      
      // Reset form on success
      setForm({
        title: "",
        description: "",
        startDate: "",
        applicationDeadline: "",
        durationMonths: 1,
        mode: "remote",
        skillsRequired: "",
        locations: "",
        positions: 1,
        maxApplicants: "",
        stipendType: "paid",
        stipendAmount: ""
      });

    } catch (err) {
      setError(err.response?.data?.message || "Deployment failed. Check your uplink.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0F19] p-4 md:p-12 font-sans box-border text-white selection:bg-fuchsia-500/30 selection:text-fuchsia-200 relative overflow-hidden">
      {/* Ambient Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" aria-hidden="true" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" aria-hidden="true" />

      <div className="w-full max-w-4xl bg-white/5 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] border border-white/10 box-border relative z-10 transition-all duration-300 hover:border-white/20">
        
        <header className="mb-12 text-center md:text-left">
          <div className="text-[10px] font-bold text-violet-400 uppercase tracking-[0.3em] mb-3">Recruitment Terminal</div>
          <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 m-0 tracking-tight">
            Post New Internship
          </h2>
        </header>

        {error && (
          <div className="mb-8 px-6 py-4 text-[11px] font-bold text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl uppercase tracking-widest animate-pulse">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-8 px-6 py-4 text-[11px] font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-xl uppercase tracking-widest animate-bounce">
            {success}
          </div>
        )}

        <form className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6" onSubmit={handleSubmit}>
          
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Opportunity Title</label>
            <input
              name="title"
              placeholder="e.g. Frontend Architecture Intern"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-300 placeholder:text-white/20"
            />
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Job Specification</label>
            <textarea
              name="description"
              placeholder="Outline the mission, tech stack, and expectations..."
              value={form.description}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-300 resize-none placeholder:text-white/20"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Commencement Date</label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              required
              className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-300 uppercase appearance-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Application Cutoff</label>
            <input
              type="date"
              name="applicationDeadline"
              value={form.applicationDeadline}
              onChange={handleChange}
              required
              className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-300 uppercase appearance-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Program Duration</label>
            <div className="relative">
              <select
                name="durationMonths"
                value={form.durationMonths}
                onChange={handleChange}
                className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none focus:border-violet-500 transition-all duration-300 cursor-pointer appearance-none [&>option]:bg-[#0B0F19]"
              >
                {[1, 2, 3, 4, 5, 6, 9, 12].map(m => (
                  <option key={m} value={m}>
                    {m} Month{m > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">▼</div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Work Mode</label>
            <div className="relative">
              <select 
                name="mode" 
                value={form.mode} 
                onChange={handleChange}
                className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none focus:border-violet-500 transition-all duration-300 cursor-pointer appearance-none [&>option]:bg-[#0B0F19]"
              >
                <option value="remote">Remote</option>
                <option value="onsite">Onsite</option>
                <option value="hybrid">Hybrid</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">▼</div>
            </div>
          </div>

          {form.mode !== "remote" && (
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Geographic Hubs</label>
              <input
                name="locations"
                placeholder="Comma separated: Pune, Mumbai, Bangalore"
                value={form.locations}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-300 placeholder:text-white/20"
              />
            </div>
          )}

          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Prerequisite Skills</label>
            <input
              name="skillsRequired"
              placeholder="e.g. React, TypeScript, TailwindCSS"
              value={form.skillsRequired}
              onChange={handleChange}
              required
              className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-300 placeholder:text-white/20"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Open Positions</label>
            <input
              type="number"
              name="positions"
              min="1"
              value={form.positions}
              onChange={handleChange}
              required
              className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-300"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Applicant Ceiling</label>
            <input
              type="number"
              name="maxApplicants"
              min="1"
              placeholder="Total capacity"
              value={form.maxApplicants}
              onChange={handleChange}
              className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-300 placeholder:text-white/20"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Compensation Model</label>
            <div className="relative">
              <select
                name="stipendType"
                value={form.stipendType}
                onChange={handleChange}
                className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none focus:border-violet-500 transition-all duration-300 cursor-pointer appearance-none [&>option]:bg-[#0B0F19]"
              >
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
                <option value="performance_based">Performance Based</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">▼</div>
            </div>
          </div>

          {form.stipendType === "paid" && (
            <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Monthly Stipend (₹)</label>
              <input
                type="number"
                name="stipendAmount"
                min="0"
                placeholder="e.g. 15000"
                value={form.stipendAmount}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-300 placeholder:text-white/20"
              />
            </div>
          )}

          <div className="md:col-span-2 mt-8 pt-8 border-t border-white/10">
            <button 
              type="submit"
              disabled={loading}
              className="w-full py-5 text-xs font-black text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 border-none rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-[0_12px_24px_-8px_rgba(217,70,239,0.6)] hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-[0.2em] flex items-center justify-center gap-4"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                "Deploy Internship"
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}