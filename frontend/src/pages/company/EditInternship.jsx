import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { useParams, useNavigate } from "react-router-dom";

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
    stipendAmount: ""
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
        stipendAmount: data.stipendAmount || ""
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

    setForm(prev => ({
      ...prev,
      [name]: value
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
        maxApplicants: form.maxApplicants
          ? Number(form.maxApplicants)
          : null,
        stipendAmount: form.stipendAmount
          ? Number(form.stipendAmount)
          : null
      };

      await API.patch(`/internships/${id}`, payload);

      alert("Internship updated successfully");

      navigate("/company/internships");
    } catch (err) {
      alert(err.response?.data?.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0B0F19]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-white/10 border-t-fuchsia-500 rounded-full animate-spin"></div>
          <p className="text-fuchsia-400 font-bold tracking-widest uppercase text-[10px] animate-pulse m-0">
            Loading Details
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0F19] p-4 md:p-8 font-sans box-border text-white selection:bg-fuchsia-500/30 selection:text-fuchsia-200 relative overflow-hidden">
      {/* Ambient Backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" aria-hidden="true"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" aria-hidden="true"></div>

      <div className="w-full max-w-2xl bg-white/5 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] border border-white/10 box-border relative z-10 transition-all duration-300 hover:border-white/20">
        
        <div className="flex flex-col gap-2 mb-10 text-center">
          <div className="text-[10px] font-bold text-violet-400 uppercase tracking-widest">
            Internship Management
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 m-0 tracking-tight">
            Edit Listing
          </h2>
        </div>

        {closed && (
          <div className="mb-8 px-5 py-4 text-[11px] font-bold text-red-300 bg-red-500/10 border border-red-500/30 rounded-xl uppercase tracking-widest leading-relaxed">
            This internship is closed and cannot be edited.
          </div>
        )}

        {locked && !closed && (
          <div className="mb-8 px-5 py-4 text-[11px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-xl uppercase tracking-widest leading-relaxed">
            Students have applied. Some fields are restricted. Positions cannot go below selected students ({selectedCount}). Stipend can only be increased.
          </div>
        )}

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              disabled={closed}
              className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-white/20 box-border"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              disabled={closed}
              rows={5}
              className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-300 resize-y disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-white/20 box-border"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Positions</label>
              <input
                type="number"
                min={selectedCount || 1}
                name="positions"
                value={form.positions}
                onChange={handleChange}
                disabled={closed}
                className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-white/20 box-border"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Max Applicants</label>
              <input
                type="number"
                min="1"
                name="maxApplicants"
                value={form.maxApplicants}
                onChange={handleChange}
                disabled={closed}
                className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-white/20 box-border"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Application Deadline</label>
            <input
              type="date"
              name="applicationDeadline"
              value={form.applicationDeadline}
              onChange={handleChange}
              disabled={closed}
              className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-white/20 box-border uppercase tracking-widest"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Mode</label>
              <select
                name="mode"
                value={form.mode}
                onChange={handleChange}
                disabled={locked || closed}
                className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed box-border cursor-pointer appearance-none [&>option]:bg-[#0B0F19]"
              >
                <option value="remote">Remote</option>
                <option value="onsite">Onsite</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Stipend Type</label>
              <select
                name="stipendType"
                value={form.stipendType}
                onChange={handleChange}
                disabled={locked || closed}
                className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed box-border cursor-pointer appearance-none [&>option]:bg-[#0B0F19]"
              >
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
                <option value="performance_based">Performance Based</option>
              </select>
            </div>
          </div>

          {form.stipendType === "paid" && (
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Stipend Amount (₹/mo)</label>
              <input
                type="number"
                min="0"
                name="stipendAmount"
                value={form.stipendAmount}
                onChange={handleChange}
                disabled={closed}
                className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-white/20 box-border"
              />
            </div>
          )}

          <div className="pt-8 border-t border-white/10 mt-2">
            <button
              disabled={saving || closed}
              className="w-full py-4 text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 border-none rounded-xl cursor-pointer transition-all duration-300 hover:shadow-[0_8px_20px_-6px_rgba(217,70,239,0.5)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest flex items-center justify-center gap-3 outline-none"
            >
              {saving && (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              )}
              {saving ? "Saving Changes..." : "Update Internship"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}