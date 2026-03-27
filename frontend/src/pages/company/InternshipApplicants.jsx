import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { useParams } from "react-router-dom";

export default function InternshipApplicants() {
  const { id } = useParams();

  const [data, setData] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const fetchData = async () => {
    try {
      const res = await API.get(`/applications/internship/${id}`);
      setData(res.data?.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load applicants");
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

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

  // 🔍 FILTER LOGIC
  const filteredData = data.filter((app) => {
    const name = app.studentSnapshot?.fullName || "";
    const matchesSearch = name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus ? app.status === filterStatus : true;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#FFFFFF] p-4 md:p-10 font-['Nunito'] text-[#2D3436] transition-all">
      <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700">
        
        {/* HEADER & CONTROLS */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-12 border-b border-[#F5F6FA] pb-10">
          <div>
            <h2 className="text-[36px] font-black tracking-tight leading-none mb-2">
              Applicants <span className="text-[#6C5CE7]">Portal</span>
            </h2>
            <p className="text-[12px] font-black text-[#6C5CE7] uppercase tracking-[0.3em] opacity-70">
              Review and Manage Candidate Pipeline
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto">
            {/* SEARCH */}
            <div className="relative group flex-1">
              <input
                type="text"
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-[#F5F6FA] border-2 border-transparent rounded-2xl text-[14px] outline-none transition-all focus:bg-white focus:border-[#6C5CE7]/30 focus:shadow-[0_10px_25px_rgba(108,92,231,0.05)]"
              />
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>

            <div className="relative group">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full md:w-[200px] px-6 py-4 bg-[#F5F6FA] border-2 border-transparent rounded-2xl text-[12px] font-black uppercase tracking-widest outline-none appearance-none transition-all cursor-pointer focus:bg-white focus:border-[#6C5CE7]/30"
              >
                <option value="">All Statuses</option>
                <option value="applied">Applied</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="selected">Selected</option>
                <option value="offer_accepted">Accepted</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="terminated">Terminated</option>
                <option value="rejected">Rejected</option>
              </select>
              <svg className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="3"/></svg>
            </div>
          </div>
        </div>

        {/* DATA DISPLAY */}
        {filteredData.length === 0 ? (
          <div className="bg-[#F5F6FA]/50 border-4 border-dashed border-[#F5F6FA] rounded-[40px] py-32 text-center">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6">
               <svg className="w-8 h-8 text-[#6C5CE7] opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" strokeWidth="2"/></svg>
            </div>
            <p className="text-[14px] font-black text-[#2D3436] opacity-30 uppercase tracking-[0.3em]">
              No matching applicants found
            </p>
          </div>
        ) : (
          <div className="bg-[#F5F6FA]/30 border border-[#F5F6FA] rounded-[32px] p-2 md:p-6 shadow-[0_40px_80px_rgba(108,92,231,0.03)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-y-3">
                
                <thead className="text-[11px] font-black text-[#6C5CE7] uppercase tracking-[0.2em] opacity-60">
                  <tr>
                    <th className="px-6 py-4">Candidate</th>
                    <th className="px-6 py-4">Contact Info</th>
                    <th className="px-6 py-4">Documents</th>
                    <th className="px-6 py-4">Current Flow</th>
                    <th className="px-6 py-4 text-right">Decision Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredData.map((app, index) => {
                    const s = app.studentSnapshot || {};
                    const isUpdating = loadingId === app._id;

                    return (
                      <tr
                        key={app._id}
                        className="group bg-white rounded-2xl shadow-sm transition-all duration-300 hover:shadow-[0_20px_40px_rgba(108,92,231,0.08)] hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-2"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        {/* NAME */}
                        <td className="px-6 py-6 rounded-l-2xl border-y border-l border-transparent group-hover:border-[#6C5CE7]/10 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-[#F5F6FA] text-[#6C5CE7] rounded-xl flex items-center justify-center font-black text-[14px] border border-transparent group-hover:border-[#6C5CE7]/20 transition-all">
                              {s.fullName?.charAt(0) || "?"}
                            </div>
                            <span className="text-[15px] font-black tracking-tight text-[#2D3436]">
                              {s.fullName || "—"}
                            </span>
                          </div>
                        </td>

                        {/* EMAIL */}
                        <td className="px-6 py-6 border-y border-transparent group-hover:border-[#6C5CE7]/10 transition-colors">
                          <span className="text-[13px] font-bold text-[#2D3436]/60 break-all">
                            {s.email || "—"}
                          </span>
                        </td>

                        {/* RESUME */}
                        <td className="px-6 py-6 border-y border-transparent group-hover:border-[#6C5CE7]/10 transition-colors">
                          {app.resumeSnapshot ? (
                            <a
                              href={app.resumeSnapshot}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 bg-[#F5F6FA] text-[11px] font-black uppercase tracking-widest text-[#2D3436] rounded-xl hover:bg-[#6C5CE7] hover:text-white transition-all shadow-sm"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth="2.5"/></svg>
                              View CV
                            </a>
                          ) : (
                            <span className="text-[#cc0000]/40 text-[10px] font-black uppercase tracking-widest">
                              Missing
                            </span>
                          )}
                        </td>

                        {/* STATUS */}
                        <td className="px-6 py-6 border-y border-transparent group-hover:border-[#6C5CE7]/10 transition-colors">
                          <span className="inline-block px-3 py-1.5 bg-[#F5F6FA] border-2 border-[#2D3436]/5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] text-[#2D3436]/80">
                            {app.status}
                          </span>
                        </td>

                        {/* ACTIONS */}
                        <td className="px-6 py-6 rounded-r-2xl border-y border-r border-transparent group-hover:border-[#6C5CE7]/10 transition-colors text-right">
                          <div className="flex gap-2 justify-end items-center min-h-[40px]">
                            
                            {/* ACTIVE PIPELINE */}
                            {app.status === "applied" && (
                              <div className="flex gap-2 animate-in fade-in scale-in-95 duration-300">
                                <button
                                  onClick={() => updateStatus(app._id, "shortlisted")}
                                  disabled={isUpdating}
                                  className="px-5 py-2.5 bg-[#6C5CE7] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:shadow-[0_10px_20px_rgba(108,92,231,0.2)] transition-all active:scale-95 disabled:opacity-50"
                                >
                                  {isUpdating ? "..." : "Shortlist"}
                                </button>
                                <button
                                  onClick={() => updateStatus(app._id, "rejected")}
                                  className="px-5 py-2.5 border-2 border-[#cc0000]/20 text-[#cc0000] text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#cc0000] hover:text-white transition-all active:scale-95"
                                >
                                  Reject
                                </button>
                              </div>
                            )}

                            {app.status === "shortlisted" && (
                              <div className="flex gap-2 animate-in fade-in scale-in-95 duration-300">
                                <button
                                  onClick={() => updateStatus(app._id, "selected")}
                                  className="px-5 py-2.5 bg-[#2D3436] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#6C5CE7] transition-all active:scale-95 shadow-md"
                                >
                                  Final Select
                                </button>
                                <button
                                  onClick={() => updateStatus(app._id, "rejected")}
                                  className="px-5 py-2.5 border-2 border-[#cc0000]/20 text-[#cc0000] text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#cc0000] hover:text-white transition-all active:scale-95"
                                >
                                  Reject
                                </button>
                              </div>
                            )}

                            {/* MID STATE */}
                            {app.status === "selected" && (
                              <span className="px-4 py-2 bg-yellow-50 text-yellow-700 text-[10px] font-black uppercase tracking-widest rounded-xl border border-yellow-200">
                                Pending Student
                              </span>
                            )}

                            {app.status === "offer_accepted" && (
                              <span className="px-4 py-2 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-xl border border-blue-200">
                                Offer Secured
                              </span>
                            )}

                            {app.status === "ongoing" && (
                              <div className="flex items-center gap-2 text-blue-700 text-[11px] font-black uppercase tracking-widest">
                                <span className="w-2 h-2 bg-blue-700 rounded-full animate-ping" />
                                Working
                              </div>
                            )}

                            {/* FINAL STATES */}
                            {app.status === "completed" && (
                              <span className="text-[#008000] text-[11px] font-black uppercase tracking-widest">
                                ✓ Finished
                              </span>
                            )}

                            {app.status === "terminated" && (
                              <span className="text-orange-600 text-[11px] font-black uppercase tracking-widest">
                                ! Terminated
                              </span>
                            )}

                            {app.status === "rejected" && (
                              <span className="text-red-500 text-[11px] font-black uppercase tracking-widest opacity-40">
                                No Match
                              </span>
                            )}

                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}