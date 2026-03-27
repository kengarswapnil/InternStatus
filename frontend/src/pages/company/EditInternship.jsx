import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/api";

export default function EditInternship() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [locked, setLocked] = useState(false);
  const [closed, setClosed] = useState(false);
  const [selectedCount, setSelectedCount] = useState(0);

  const [form, setForm] = useState({
    title: "",
    description: "",
    positions: "",
    maxApplicants: "",
    applicationDeadline: "",
    mode: "remote",
    stipendType: "paid",
    stipendAmount: "",
  });

  const fetchInternship = async () => {
    try {
      const res = await API.get(`/internships/${id}`);
      const data = res.data.data;

      setForm({
        title: data.title || "",
        description: data.description || "",
        positions: data.positions || "",
        maxApplicants: data.maxApplicants || "",
        applicationDeadline: data.applicationDeadline
          ? data.applicationDeadline.substring(0, 10)
          : "",
        mode: data.mode || "remote",
        stipendType: data.stipendType || "paid",
        stipendAmount: data.stipendAmount || "",
      });

      setSelectedCount(data.selectedCount || 0);

      if (data.applicationsCount > 0) {
        setLocked(true);
      }

      if (data.status === "closed") {
        setClosed(true);
      }
    } catch (err) {
      alert(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternship();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (closed) {
      alert("Cannot edit closed internship");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        ...form,
        positions: Number(form.positions),
        maxApplicants: form.maxApplicants ? Number(form.maxApplicants) : null,
        stipendAmount: form.stipendAmount ? Number(form.stipendAmount) : null,
      };

      await API.patch(`/internships/${id}`, payload);
      alert("Internship updated successfully");
      navigate("/company/company-internships");
    } catch (err) {
      alert(err.response?.data?.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center font-['Nunito']">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#6C5CE7]/20 border-t-[#6C5CE7] rounded-full animate-spin" />
          <p className="text-[14px] font-black text-[#2D3436] tracking-widest uppercase">
            Fetching Details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#2D3436] font-['Nunito'] pb-12 transition-all duration-500">
      <main className="max-w-4xl mx-auto w-full px-4 md:px-8 py-10 flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
        <div className="bg-[#FFFFFF] border border-[#F5F6FA] p-8 md:p-12 rounded-[32px] shadow-[0_20px_50px_rgba(108,92,231,0.04)]">
          <header className="mb-10 border-b border-[#F5F6FA] pb-6 flex items-center justify-between">
            <div>
              <h2 className="text-[28px] font-black m-0 tracking-tight text-[#2D3436]">
                Edit Internship Listing
              </h2>
              <p className="text-[12px] font-black text-[#6C5CE7] m-0 mt-1 uppercase tracking-[0.2em]">
                Modify Active Opportunity
              </p>
            </div>
            <div className="hidden md:flex w-12 h-12 bg-[#6C5CE7]/10 rounded-2xl items-center justify-center text-[#6C5CE7]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
          </header>

          {closed && (
            <div className="mb-8 px-6 py-4 text-[12px] font-black text-[#FF7675] bg-[#FF7675]/10 border border-[#FF7675]/20 rounded-2xl uppercase tracking-widest text-center animate-pulse">
              This internship is closed and cannot be edited.
            </div>
          )}

          {locked && !closed && (
            <div className="mb-8 px-6 py-4 text-[12px] font-black text-[#fdcb6e] bg-[#fdcb6e]/10 border border-[#fdcb6e]/20 rounded-2xl uppercase tracking-widest text-center leading-loose">
              Applications active. Restricted fields: Positions must be at least{" "}
              <span className="text-[#e17055]">{selectedCount}</span>. Stipend cannot be decreased.
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
                value={form.title}
                onChange={handleChange}
                required
                disabled={closed}
                className="w-full px-5 py-4 text-[14px] text-[#2D3436] bg-[#F5F6FA] border-2 border-transparent rounded-2xl outline-none transition-all focus:bg-white focus:border-[#6C5CE7]/30 disabled:opacity-30 disabled:cursor-not-allowed"
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2 md:col-span-2 group">
              <label className="text-[11px] font-black text-[#2D3436] opacity-40 uppercase tracking-widest ml-1 transition-opacity group-focus-within:opacity-100">
                Detailed Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                disabled={closed}
                rows={5}
                className="w-full px-5 py-4 text-[14px] text-[#2D3436] bg-[#F5F6FA] border-2 border-transparent rounded-2xl outline-none resize-none transition-all focus:bg-white focus:border-[#6C5CE7]/30 disabled:opacity-30 disabled:cursor-not-allowed"
              />
            </div>

            {/* Positions */}
            <div className="flex flex-col gap-2 group">
              <label className="text-[11px] font-black text-[#2D3436] opacity-40 uppercase tracking-widest ml-1 transition-opacity group-focus-within:opacity-100">
                Positions Available
              </label>
              <input
                type="number"
                min={selectedCount || 1}
                name="positions"
                value={form.positions}
                onChange={handleChange}
                disabled={closed}
                className="w-full px-5 py-4 text-[14px] text-[#2D3436] bg-[#F5F6FA] border-2 border-transparent rounded-2xl outline-none transition-all focus:bg-white focus:border-[#6C5CE7]/30 disabled:opacity-30"
              />
            </div>

            {/* Max Applicants */}
            <div className="flex flex-col gap-2 group">
              <label className="text-[11px] font-black text-[#2D3436] opacity-40 uppercase tracking-widest ml-1 transition-opacity group-focus-within:opacity-100">
                Max Applicants Cap
              </label>
              <input
                type="number"
                min="1"
                name="maxApplicants"
                value={form.maxApplicants}
                onChange={handleChange}
                disabled={closed}
                className="w-full px-5 py-4 text-[14px] text-[#2D3436] bg-[#F5F6FA] border-2 border-transparent rounded-2xl outline-none transition-all focus:bg-white focus:border-[#6C5CE7]/30 disabled:opacity-30"
              />
            </div>

            {/* Deadline */}
            <div className="flex flex-col gap-2 md:col-span-2 group">
              <label className="text-[11px] font-black text-[#2D3436] opacity-40 uppercase tracking-widest ml-1 transition-opacity group-focus-within:opacity-100">
                New Application Deadline
              </label>
              <input
                type="date"
                name="applicationDeadline"
                value={form.applicationDeadline}
                onChange={handleChange}
                disabled={closed}
                className="w-full px-5 py-4 text-[14px] text-[#2D3436] bg-[#F5F6FA] border-2 border-transparent rounded-2xl outline-none transition-all focus:bg-white focus:border-[#6C5CE7]/30 disabled:opacity-30"
              />
            </div>

            {/* Mode */}
            <div className="flex flex-col gap-2 group">
              <label className="text-[11px] font-black text-[#2D3436] opacity-40 uppercase tracking-widest ml-1 transition-opacity group-focus-within:opacity-100">
                Work Mode
              </label>
              <div className="relative">
                <select
                  name="mode"
                  value={form.mode}
                  onChange={handleChange}
                  disabled={locked || closed}
                  className="w-full px-5 py-4 text-[14px] text-[#2D3436] bg-[#F5F6FA] border-2 border-transparent rounded-2xl outline-none cursor-pointer appearance-none transition-all focus:bg-white focus:border-[#6C5CE7]/30 disabled:opacity-30"
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

            {/* Stipend Type */}
            <div className="flex flex-col gap-2 group">
              <label className="text-[11px] font-black text-[#2D3436] opacity-40 uppercase tracking-widest ml-1 transition-opacity group-focus-within:opacity-100">
                Compensation Type
              </label>
              <div className="relative">
                <select
                  name="stipendType"
                  value={form.stipendType}
                  onChange={handleChange}
                  disabled={locked || closed}
                  className="w-full px-5 py-4 text-[14px] text-[#2D3436] bg-[#F5F6FA] border-2 border-transparent rounded-2xl outline-none cursor-pointer appearance-none transition-all focus:bg-white focus:border-[#6C5CE7]/30 disabled:opacity-30"
                >
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid</option>
                  <option value="performance_based">Performance Based</option>
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-30">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="3"/></svg>
                </div>
              </div>
            </div>

            {/* Stipend Amount */}
            {form.stipendType === "paid" && (
              <div className="flex flex-col gap-2 md:col-span-2 group animate-in slide-in-from-top-2 duration-300">
                <label className="text-[11px] font-black text-[#2D3436] opacity-40 uppercase tracking-widest ml-1 transition-opacity group-focus-within:opacity-100">
                  Monthly Stipend (INR)
                </label>
                <input
                  type="number"
                  min="0"
                  name="stipendAmount"
                  value={form.stipendAmount}
                  onChange={handleChange}
                  disabled={closed}
                  className="w-full px-5 py-4 text-[14px] text-[#2D3436] bg-[#F5F6FA] border-2 border-transparent rounded-2xl outline-none transition-all focus:bg-white focus:border-[#6C5CE7]/30 disabled:opacity-30"
                />
              </div>
            )}

            {/* Actions */}
            <div className="md:col-span-2 pt-10 mt-6 border-t border-[#F5F6FA] flex flex-col-reverse md:flex-row gap-4 justify-between items-center">
              <button
                type="button"
                onClick={() => navigate("/company/company-internships")}
                className="w-full md:w-auto px-8 py-4 text-[13px] font-black text-[#2D3436] bg-[#F5F6FA] border-none rounded-2xl hover:bg-[#6C5CE7]/5 transition-all uppercase tracking-widest cursor-pointer active:scale-95"
              >
                Cancel Changes
              </button>
              
              <button
                disabled={saving || closed}
                className="w-full md:w-auto px-10 py-4 text-[13px] font-black text-[#FFFFFF] bg-[#6C5CE7] border-none rounded-2xl cursor-pointer hover:shadow-[0_20px_40px_rgba(108,92,231,0.25)] hover:-translate-y-1 active:scale-95 transition-all duration-300 disabled:opacity-30 disabled:translate-y-0 uppercase tracking-widest flex items-center justify-center gap-3"
              >
                {saving ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Update Listing
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
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