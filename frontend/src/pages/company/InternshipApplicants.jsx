import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { useParams } from "react-router-dom";

export default function InternshipApplicants() {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  const fetchData = async () => {
    try {
      const res = await API.get(`/applications/internship/${id}`);
      setData(res.data.data || []);
    } catch {
      alert("Failed to load applicants");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateStatus = async (appId, status) => {
    const confirmAction = window.confirm(
      `Are you sure you want to mark as ${status}?`
    );

    if (!confirmAction) return;

    setLoadingId(appId);

    try {
      await API.patch(`/applications/${appId}/status`, { status });
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setLoadingId(null);
    }
  };

  const renderActions = (app) => {
    const btnBase = "px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all duration-300 outline-none disabled:opacity-50 disabled:cursor-not-allowed";
    
    switch (app.status) {
      case "applied":
        return (
          <div className="flex gap-4 mt-6 pt-6 border-t border-white/10">
            <button
              onClick={() => updateStatus(app._id, "shortlisted")}
              disabled={loadingId === app._id}
              className={`${btnBase} bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:shadow-[0_8px_20px_-6px_rgba(217,70,239,0.5)] hover:-translate-y-0.5`}
            >
              {loadingId === app._id ? "Processing..." : "Shortlist"}
            </button>
            <button
              onClick={() => updateStatus(app._id, "rejected")}
              disabled={loadingId === app._id}
              className={`${btnBase} bg-white/5 text-red-400 border border-red-500/30 hover:bg-red-500/10`}
            >
              Reject
            </button>
          </div>
        );

      case "shortlisted":
        return (
          <div className="flex gap-4 mt-6 pt-6 border-t border-white/10">
            <button
              onClick={() => updateStatus(app._id, "selected")}
              disabled={loadingId === app._id}
              className={`${btnBase} bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:shadow-[0_8px_20px_-6px_rgba(16,185,129,0.4)] hover:-translate-y-0.5`}
            >
              {loadingId === app._id ? "Processing..." : "Select"}
            </button>
            <button
              onClick={() => updateStatus(app._id, "rejected")}
              disabled={loadingId === app._id}
              className={`${btnBase} bg-white/5 text-red-400 border border-red-500/30 hover:bg-red-500/10`}
            >
              Reject
            </button>
          </div>
        );

      case "selected":
        return (
          <div className="mt-6 pt-6 border-t border-white/10">
            <span className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              Waiting for student acceptance
            </span>
          </div>
        );

      case "offer_accepted":
        return (
          <div className="mt-6 pt-6 border-t border-white/10">
            <span className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
              Offer Accepted
            </span>
          </div>
        );

      case "rejected":
        return (
          <div className="mt-6 pt-6 border-t border-white/10">
            <span className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg">
              Rejected
            </span>
          </div>
        );

      case "withdrawn":
        return (
          <div className="mt-6 pt-6 border-t border-white/10">
            <span className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white/40 bg-white/5 border border-white/10 rounded-lg">
              Withdrawn
            </span>
          </div>
        );

      case "ongoing":
        return (
          <div className="mt-6 pt-6 border-t border-white/10">
            <span className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-fuchsia-300 bg-fuchsia-500/10 border border-fuchsia-500/30 rounded-lg">
              Internship Ongoing
            </span>
          </div>
        );

      default:
        return (
          <div className="mt-6 pt-6 border-t border-white/10">
            <span className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white/60 bg-white/5 border border-white/10 rounded-lg">
              {app.status}
            </span>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] p-4 md:p-8 font-sans box-border text-white selection:bg-fuchsia-500/30 relative overflow-hidden">
      {/* Ambient Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        <header className="mb-10 text-center md:text-left">
          <div className="text-[10px] font-bold text-violet-400 uppercase tracking-widest mb-2">Management Console</div>
          <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 m-0 tracking-tight">
            Applicants Pool
          </h2>
        </header>

        {data.length === 0 && (
          <div className="bg-white/5 backdrop-blur-xl p-16 rounded-3xl border border-white/10 text-center shadow-inner">
            <p className="text-white/40 m-0 text-sm font-medium tracking-wide">No applications received yet.</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6">
          {data.map(app => {
            const s = app.studentSnapshot || {};

            return (
              <div key={app._id} className="group bg-white/5 backdrop-blur-xl p-6 md:p-10 rounded-3xl border border-white/10 box-border transition-all duration-300 hover:border-white/20 hover:bg-white/[0.07] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]">
                
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-8 gap-4">
                  <div>
                    <h3 className="text-2xl font-black text-white m-0 tracking-tight group-hover:text-fuchsia-400 transition-colors">
                      {s.fullName}
                    </h3>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">Candidate Profile</p>
                  </div>
                  <div className={`px-4 py-1.5 text-[9px] font-black tracking-[0.2em] rounded-full uppercase border ${
                    app.status === 'rejected' ? 'border-red-500/40 text-red-400 bg-red-500/10' : 
                    app.status === 'shortlisted' ? 'border-violet-500/40 text-violet-400 bg-violet-500/10' :
                    'border-white/20 text-white/60 bg-white/5'
                  }`}>
                    {app.status}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                  <div className="space-y-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-bold text-violet-400 uppercase tracking-widest">Academic Institution</span>
                      <span className="text-sm font-medium text-white/90 leading-tight">{s.collegeName}</span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-bold text-violet-400 uppercase tracking-widest">Specialization</span>
                      <span className="text-sm font-medium text-white/80">{s.courseName} <span className="text-white/30 mx-1">/</span> {s.specialization}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-bold text-fuchsia-400 uppercase tracking-widest">Contact Channel</span>
                      <span className="text-sm font-medium text-white/90 flex flex-wrap gap-x-4">
                        <span className="break-all">{s.email}</span>
                        <span className="text-white/40">{s.phoneNo}</span>
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-bold text-fuchsia-400 uppercase tracking-widest">Technical Arsenal</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {app.skillsSnapshot?.length ? app.skillsSnapshot.map((skill, idx) => (
                          <span key={idx} className="px-2 py-0.5 text-[10px] font-medium bg-white/5 border border-white/10 rounded-md text-white/70">
                            {skill}
                          </span>
                        )) : <span className="text-white/30 text-xs italic">No skills listed</span>}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                   {app.resumeSnapshot && (
                      <a
                        href={app.resumeSnapshot}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-[11px] font-bold text-violet-400 uppercase tracking-widest hover:text-white transition-all group/link"
                      >
                        <svg className="w-4 h-4 transition-transform group-hover/link:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                        Analyze Resume
                      </a>
                   )}
                   {renderActions(app)}
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}