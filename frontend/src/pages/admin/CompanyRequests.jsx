import React, { useEffect, useState } from "react";
import API from "../../api/api";

export default function CompanyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await API.get("/onboarding/company");
      setRequests(res.data.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, status) => {
    try {
      await API.patch(`/onboarding/company/${id}/status`, { status });
      setRequests((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status } : r))
      );
    } catch (err) {
      console.error(err);
      alert("Action failed");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0B0F19]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-white/10 border-t-fuchsia-500 rounded-full animate-spin"></div>
          <p className="text-fuchsia-400 font-bold tracking-widest uppercase text-[10px] animate-pulse m-0">
            Loading Requests
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] p-4 md:p-8 font-sans text-white selection:bg-fuchsia-500/30 selection:text-fuchsia-200">
      <div className="max-w-6xl mx-auto flex flex-col gap-6 md:gap-8">
        <header className="mb-6 border-b border-white/10 pb-6">
          <h2 className="text-3xl md:text-4xl font-black m-0 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
            Company Onboarding Requests
          </h2>
        </header>

        {requests.length === 0 && (
          <div className="bg-[#0B0F19]/50 border border-white/10 rounded-3xl p-16 text-center shadow-inner">
            <p className="text-white/40 m-0 text-base font-medium">
              No requests found
            </p>
          </div>
        )}

        <div className="flex flex-col gap-6">
          {requests.map((req) => {
            const companyName =
              req.selectedCompany?.name || req.companyName || "—";
            const isExisting = !!req.selectedCompany;

            return (
              <div
                key={req._id}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] p-6 md:p-8 flex flex-col gap-6 box-border transition-all duration-300 hover:border-white/20 group hover:-translate-y-1"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-4 flex-wrap">
                      <h3 className="text-2xl font-bold text-white/90 m-0 group-hover:text-fuchsia-300 transition-colors">
                        {companyName}
                      </h3>
                      {isExisting && (
                        <span className="px-3 py-1.5 text-[10px] font-bold text-violet-300 bg-violet-500/20 border border-violet-500/30 uppercase tracking-widest rounded-lg">
                          Existing Company
                        </span>
                      )}
                    </div>
                  </div>
                  <span
                    className={`inline-block px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${
                      req.status === "approved"
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                        : req.status === "rejected"
                        ? "bg-red-500/10 text-red-400 border-red-500/20 opacity-80"
                        : "bg-white/10 text-white/80 border-white/20"
                    }`}
                  >
                    {req.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-4">
                    <h4 className="text-[11px] font-bold text-fuchsia-400 uppercase tracking-widest m-0">
                      Requester Details
                    </h4>
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col gap-1 bg-[#0B0F19]/30 p-4 rounded-xl border border-white/5 transition-all hover:border-white/10">
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                          Name
                        </span>
                        <span className="text-sm font-bold text-white/90">
                          {req.requesterName}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1 bg-[#0B0F19]/30 p-4 rounded-xl border border-white/5 transition-all hover:border-white/10">
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                          Email
                        </span>
                        <span className="text-sm font-medium text-white/90 break-all">
                          {req.requesterEmail}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <h4 className="text-[11px] font-bold text-fuchsia-400 uppercase tracking-widest m-0">
                      Company Details
                    </h4>
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col gap-1 bg-[#0B0F19]/30 p-4 rounded-xl border border-white/5 transition-all hover:border-white/10">
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                          Industry
                        </span>
                        <span className="text-sm font-medium text-white/90">
                          {req.industry || "N/A"}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1 bg-[#0B0F19]/30 p-4 rounded-xl border border-white/5 transition-all hover:border-white/10">
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                          Company Size
                        </span>
                        <span className="text-sm font-medium text-white/90">
                          {req.companySize || "N/A"}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1 bg-[#0B0F19]/30 p-4 rounded-xl border border-white/5 transition-all hover:border-white/10">
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                          Website
                        </span>
                        <span className="text-sm font-medium text-fuchsia-400 break-all">
                          {req.website || "N/A"}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1 bg-[#0B0F19]/30 p-4 rounded-xl border border-white/5 transition-all hover:border-white/10">
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                          Email Domain
                        </span>
                        <span className="text-sm font-medium text-white/90">
                          {req.emailDomain || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {req.locations?.length > 0 && (
                    <div className="flex flex-col gap-3 md:col-span-2 mt-2">
                      <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                        Locations
                      </span>
                      <div className="flex flex-wrap gap-2.5">
                        {req.locations.map((loc, i) => (
                          <span
                            key={i}
                            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white/80 font-medium tracking-wide transition-all hover:bg-white/10"
                          >
                            {[loc.city, loc.state, loc.country].filter(Boolean).join(", ")}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                  <div className="flex items-center gap-4">
                    <span className="text-[11px] font-bold text-violet-400 uppercase tracking-widest hidden sm:inline">
                      Verification Document
                    </span>
                    <a
                      href={req.verificationDocumentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full sm:w-auto text-center px-5 py-3 text-[10px] font-bold text-white/80 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 no-underline cursor-pointer uppercase tracking-widest hover:-translate-y-0.5"
                    >
                      View Document
                    </a>
                  </div>

                  {req.status === "pending" && (
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <button
                        onClick={() => handleAction(req._id, "approved")}
                        className="flex-1 sm:flex-none px-8 py-3 text-[10px] font-bold text-white bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl hover:shadow-[0_4px_15px_-3px_rgba(16,185,129,0.5)] transition-all duration-300 cursor-pointer border-none uppercase tracking-widest hover:-translate-y-0.5 outline-none"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(req._id, "rejected")}
                        className="flex-1 sm:flex-none px-8 py-3 text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl hover:bg-red-500/20 transition-all duration-300 cursor-pointer uppercase tracking-widest hover:-translate-y-0.5 outline-none"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}