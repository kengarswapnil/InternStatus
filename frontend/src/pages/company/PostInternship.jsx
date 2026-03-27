import React, { useState } from "react";
import API from "../../api/api";

export default function PostInternship() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    startDate: "",
    applicationDeadline: "",
    durationMonths: "1",
    customDuration: "", // Logic for 'Other' duration
    mode: "remote",
    skillsRequired: "",
    locations: "",
    positions: 1,
    maxApplicants: "",
    stipendType: "paid",
    customStipendType: "", // Logic for 'Other' stipend
    stipendAmount: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Determine final values based on "Other" selections
      const finalDuration = form.durationMonths === "other" 
        ? Number(form.customDuration) 
        : Number(form.durationMonths);
      
      const finalStipendType = form.stipendType === "other" 
        ? form.customStipendType 
        : form.stipendType;

      const payload = {
        ...form,
        durationMonths: finalDuration,
        stipendType: finalStipendType,
        positions: Number(form.positions),
        maxApplicants: form.maxApplicants ? Number(form.maxApplicants) : null,
        skillsRequired: form.skillsRequired
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        locations:
          form.mode === "remote"
            ? []
            : form.locations
                .split(",")
                .map((l) => l.trim())
                .filter(Boolean),
      };

      const res = await API.post("/internships", payload);
      setSuccess(res.data.message || "Internship listing published.");

      setForm({
        title: "",
        description: "",
        startDate: "",
        applicationDeadline: "",
        durationMonths: "1",
        customDuration: "",
        mode: "remote",
        skillsRequired: "",
        locations: "",
        positions: 1,
        maxApplicants: "",
        stipendType: "paid",
        customStipendType: "",
        stipendAmount: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post internship.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#2D3436] flex flex-col font-['Nunito'] pb-12">
      <main className="max-w-4xl mx-auto w-full p-4 md:p-8 flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="bg-[#FFFFFF] border border-[#F5F6FA] p-8 md:p-12 rounded-[32px] shadow-[0_15px_40px_rgba(0,0,0,0.02)]">
          <header className="mb-10 border-b border-[#F5F6FA] pb-6 flex items-center justify-between">
            <div>
              <h2 className="text-[28px] font-black m-0 tracking-tight text-[#2D3436]">
                Post Internship
              </h2>
              <p className="text-[12px] font-black text-[#6C5CE7] m-0 mt-1 uppercase tracking-[0.2em]">
                Create New Opportunity
              </p>
            </div>
            <div className="hidden md:block w-12 h-12 bg-[#6C5CE7]/10 rounded-2xl flex items-center justify-center text-[#6C5CE7]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </header>

          {error && (
            <div className="mb-8 px-5 py-4 text-[12px] font-black text-[#FF7675] bg-[#FF7675]/10 border border-[#FF7675]/20 rounded-2xl uppercase tracking-widest text-center">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-8 px-5 py-4 text-[12px] font-black text-[#55EFC4] bg-[#55EFC4]/10 border border-[#55EFC4]/20 rounded-2xl uppercase tracking-widest text-center">
              {success}
            </div>
          )}

          <form className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6" onSubmit={handleSubmit}>
            {/* Title */}
            <div className="flex flex-col gap-2 md:col-span-2 group">
              <label className="text-[11px] font-black text-[#2D3436] opacity-40 uppercase tracking-widest ml-1 transition-opacity group-focus-within:opacity-100">
                Internship Title
              </label>
              <input
                name="title"
                placeholder="Software Development Intern"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 text-[14px] text-[#2D3436] bg-[#F5F6FA] border-2 border-transparent rounded-2xl outline-none transition-all focus:bg-white focus:border-[#6C5CE7]/30"
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2 md:col-span-2 group">
              <label className="text-[11px] font-black text-[#2D3436] opacity-40 uppercase tracking-widest ml-1 transition-opacity group-focus-within:opacity-100">
                Job Description
              </label>
              <textarea
                name="description"
                placeholder="Roles, responsibilities and expectations..."
                value={form.description}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-5 py-4 text-[14px] text-[#2D3436] bg-[#F5F6FA] border-2 border-transparent rounded-2xl outline-none resize-none transition-all focus:bg-white focus:border-[#6C5CE7]/30"
              />
            </div>

            {/* Start Date */}
            <div className="flex flex-col gap-2 group">
              <label className="text-[11px] font-black text-[#2D3436] opacity-40 uppercase tracking-widest ml-1 transition-opacity group-focus-within:opacity-100">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 text-[14px] text-[#2D3436] bg-[#F5F6FA] border-2 border-transparent rounded-2xl outline-none transition-all focus:bg-white focus:border-[#6C5CE7]/30"
              />
            </div>

            {/* Deadline */}
            <div className="flex flex-col gap-2 group">
              <label className="text-[11px] font-black text-[#2D3436] opacity-40 uppercase tracking-widest ml-1 transition-opacity group-focus-within:opacity-100">
                Application Deadline
              </label>
              <input
                type="date"
                name="applicationDeadline"
                value={form.applicationDeadline}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 text-[14px] text-[#2D3436] bg-[#F5F6FA] border-2 border-transparent rounded-2xl outline-none transition-all focus:bg-white focus:border-[#6C5CE7]/30"
              />
            </div>

            {/* Duration */}
            <div className="flex flex-col gap-2 group">
              <label className="text-[11px] font-black text-[#2D3436] opacity-40 uppercase tracking-widest ml-1">
                Duration
              </label>
              <div className="relative">
                <select
                  name="durationMonths"
                  value={form.durationMonths}
                  onChange={handleChange}
                  className="w-full px-5 py-4 text-[14px] text-[#2D3436] bg-[#F5F6FA] border-2 border-transparent rounded-2xl outline-none cursor-pointer appearance-none transition-all focus:bg-white focus:border-[#6C5CE7]/30"
                >
                  {[1, 2, 3, 4, 5, 6].map((m) => (
                    <option key={m} value={m}>{m} Month{m > 1 ? "s" : ""}</option>
                  ))}
                  <option value="other">Other (Specify Months)</option>
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-30">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="3"/></svg>
                </div>
              </div>
            </div>

            {/* Custom Duration (Conditional) */}
            {form.durationMonths === "other" && (
              <div className="flex flex-col gap-2 group animate-in slide-in-from-left-2 duration-300">
                <label className="text-[11px] font-black text-[#6C5CE7] uppercase tracking-widest ml-1">
                  Specify Months
                </label>
                <input
                  type="number"
                  name="customDuration"
                  placeholder="e.g. 8"
                  value={form.customDuration}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 text-[14px] text-[#2D3436] bg-[#F5F6FA] border-2 border-[#6C5CE7]/20 rounded-2xl outline-none transition-all focus:bg-white focus:border-[#6C5CE7]"
                />
              </div>
            )}

            {/* Mode */}
            <div className="flex flex-col gap-2 group">
              <label className="text-[11px] font-black text-[#2D3436] opacity-40 uppercase tracking-widest ml-1 transition-opacity group-focus-within:opacity-100">
                Mode
              </label>
              <div className="relative">
                <select
                  name="mode"
                  value={form.mode}
                  onChange={handleChange}
                  className="w-full px-5 py-4 text-[14px] text-[#2D3436] bg-[#F5F6FA] border-2 border-transparent rounded-2xl outline-none cursor-pointer appearance-none transition-all focus:bg-white focus:border-[#6C5CE7]/30"
                >
                  <option value="remote">Remote</option>
                  <option value="onsite">Onsite</option>
                  <option value="hybrid">Hybrid</option>
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-30">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="3"/></svg>
                </div>
              </div>
            </div>

            {/* Locations (Conditional) */}
            {form.mode !== "remote" && (
              <div className="flex flex-col gap-2 md:col-span-2 group animate-in slide-in-from-top-2 duration-300">
                <label className="text-[11px] font-black text-[#2D3436] opacity-40 uppercase tracking-widest ml-1">
                  Office Locations
                </label>
                <input
                  name="locations"
                  placeholder="Pune, Mumbai, Bangalore"
                  value={form.locations}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 text-[14px] text-[#2D3436] bg-[#F5F6FA] border-2 border-transparent rounded-2xl outline-none transition-all focus:bg-white focus:border-[#6C5CE7]/30"
                />
              </div>
            )}

            {/* Required Skills */}
            <div className="flex flex-col gap-2 md:col-span-2 group">
              <label className="text-[11px] font-black text-[#2D3436] opacity-40 uppercase tracking-widest ml-1 transition-opacity group-focus-within:opacity-100">
                Required Skills
              </label>
              <input
                name="skillsRequired"
                placeholder="React, Node.js, SQL (separated by comma)"
                value={form.skillsRequired}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 text-[14px] text-[#2D3436] bg-[#F5F6FA] border-2 border-transparent rounded-2xl outline-none transition-all focus:bg-white focus:border-[#6C5CE7]/30"
              />
            </div>

            {/* Positions */}
            <div className="flex flex-col gap-2 group">
              <label className="text-[11px] font-black text-[#2D3436] opacity-40 uppercase tracking-widest ml-1 transition-opacity group-focus-within:opacity-100">
                Positions
              </label>
              <input
                type="number"
                name="positions"
                min="1"
                value={form.positions}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 text-[14px] text-[#2D3436] bg-[#F5F6FA] border-2 border-transparent rounded-2xl outline-none transition-all focus:bg-white focus:border-[#6C5CE7]/30"
              />
            </div>

            {/* Max Applicants */}
            <div className="flex flex-col gap-2 group">
              <label className="text-[11px] font-black text-[#2D3436] opacity-40 uppercase tracking-widest ml-1 transition-opacity group-focus-within:opacity-100">
                Max Applicants
              </label>
              <input
                type="number"
                name="maxApplicants"
                min="1"
                placeholder="Unlimited if empty"
                value={form.maxApplicants}
                onChange={handleChange}
                className="w-full px-5 py-4 text-[14px] text-[#2D3436] bg-[#F5F6FA] border-2 border-transparent rounded-2xl outline-none transition-all focus:bg-white focus:border-[#6C5CE7]/30"
              />
            </div>

            {/* Stipend Type */}
            <div className="flex flex-col gap-2 group">
              <label className="text-[11px] font-black text-[#2D3436] opacity-40 uppercase tracking-widest ml-1">
                Stipend Type
              </label>
              <div className="relative">
                <select
                  name="stipendType"
                  value={form.stipendType}
                  onChange={handleChange}
                  className="w-full px-5 py-4 text-[14px] text-[#2D3436] bg-[#F5F6FA] border-2 border-transparent rounded-2xl outline-none cursor-pointer appearance-none transition-all focus:bg-white focus:border-[#6C5CE7]/30"
                >
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid</option>
                  <option value="performance_based">Performance Based</option>
                  <option value="other">Other (Custom Type)</option>
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-30">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="3"/></svg>
                </div>
              </div>
            </div>

            {/* Custom Stipend Type (Conditional) */}
            {form.stipendType === "other" && (
              <div className="flex flex-col gap-2 group animate-in slide-in-from-left-2 duration-300">
                <label className="text-[11px] font-black text-[#6C5CE7] uppercase tracking-widest ml-1">
                  Specify Stipend Type
                </label>
                <input
                  name="customStipendType"
                  placeholder="e.g. Travel Allowance Only"
                  value={form.customStipendType}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 text-[14px] text-[#2D3436] bg-[#F5F6FA] border-2 border-[#6C5CE7]/20 rounded-2xl outline-none transition-all focus:bg-white focus:border-[#6C5CE7]"
                />
              </div>
            )}

            {/* Stipend Amount (Only if Paid OR other is chosen) */}
            {(form.stipendType === "paid" || form.stipendType === "other") && (
              <div className="flex flex-col gap-2 group animate-in slide-in-from-top-2 duration-300 md:col-span-2">
                <label className="text-[11px] font-black text-[#2D3436] opacity-40 uppercase tracking-widest ml-1">
                  Monthly Stipend (INR)
                </label>
                <input
                  type="number"
                  name="stipendAmount"
                  min="0"
                  placeholder="15000"
                  value={form.stipendAmount}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 text-[14px] text-[#2D3436] bg-[#F5F6FA] border-2 border-transparent rounded-2xl outline-none transition-all focus:bg-white focus:border-[#6C5CE7]/30"
                />
              </div>
            )}

            {/* Submit */}
            <div className="md:col-span-2 pt-10 mt-4 border-t border-[#F5F6FA]">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 text-[14px] font-black text-[#FFFFFF] bg-[#6C5CE7] border-none rounded-[20px] cursor-pointer hover:shadow-[0_20px_40px_rgba(108,92,231,0.2)] hover:-translate-y-1 active:scale-95 transition-all duration-300 disabled:opacity-30 disabled:translate-y-0 uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-lg shadow-[#6C5CE7]/10"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Publish Internship
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}