import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { useNavigate } from "react-router-dom";

export default function MyApplications() {
  const [data, setData] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const res = await API.get("/applications/my");
      setData(res.data.data || []);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to load");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "applied":
        return "bg-white/10 text-white/90 border border-white/20";
      case "shortlisted":
        return "bg-violet-500/20 text-violet-300 border border-violet-500/30";
      case "selected":
        return "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]";
      case "offer_accepted":
        return "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]";
      case "rejected":
        return "bg-red-500/10 text-red-400 border border-red-500/20 opacity-80";
      case "withdrawn":
        return "bg-white/5 text-white/40 border border-white/10";
      case "ongoing":
        return "bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30";
      case "completed":
        return "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30";
      case "terminated":
        return "bg-red-500/10 text-red-400 border border-red-500/20 opacity-80";
      default:
        return "bg-white/5 text-white/50 border border-white/10";
    }
  };

  const formatStatus = (status) => status.replace("_", " ").toUpperCase();

  const actionHandler = async (id, action) => {
    try {
      setLoadingId(id);
      if (action === "withdraw") {
        await API.patch(`/applications/${id}/withdraw`);
      } else {
        await API.patch(`/applications/${id}/offer`, {
          decision: action,
        });
      }
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    } finally {
      setLoadingId(null);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] p-4 md:p-8 font-sans text-white selection:bg-fuchsia-500/30 selection:text-fuchsia-200">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-black m-0 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 mb-10 border-b border-white/10 pb-6">
          My Applications
        </h2>

        {data.length === 0 ? (
          <div className="bg-[#0B0F19]/50 border border-white/10 rounded-3xl p-16 text-center shadow-inner">
            <p className="text-white/40 m-0 text-lg font-medium">
              No applications yet
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {data.map((app) => {
              const internship = app.internship || {};
              const canWithdraw =
                app.status === "applied" || app.status === "shortlisted";
              const canAccept = app.status === "selected";
              const waitingStart = app.status === "offer_accepted";
              const isExpanded = expandedId === app._id;
              const canTrack = app.status === "ongoing" || app.status === "completed";

              return (
                <div
                  key={app._id}
                  className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden transition-all duration-300 hover:border-white/20"
                >
                  <div className="p-5 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white/90 mt-0 mb-1 leading-tight">
                        {internship.title}
                      </h3>
                      <p className="text-fuchsia-400 font-medium text-xs m-0 tracking-wide uppercase">
                        {internship.company?.name}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                      <span
                        className={`text-[10px] font-bold tracking-widest px-3 py-1.5 rounded-lg transition-all duration-300 ${getStatusStyle(
                          app.status
                        )}`}
                      >
                        {formatStatus(app.status)}
                      </span>
                      
                      <button
                        onClick={() => toggleExpand(app._id)}
                        className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white/70 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:text-white transition-all duration-300 cursor-pointer outline-none"
                      >
                        {isExpanded ? "Hide Details" : "Show Details"}
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="p-5 md:p-6 pt-0 border-t border-white/5 mt-2 transition-all duration-300">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 mt-6">
                        <div className="flex flex-col gap-1.5 bg-[#0B0F19]/30 p-4 rounded-xl border border-white/5">
                          <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest">
                            Mode
                          </span>
                          <span className="text-xs font-bold text-white/90 capitalize">
                            {internship.mode}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1.5 bg-[#0B0F19]/30 p-4 rounded-xl border border-white/5">
                          <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest">
                            Applied At
                          </span>
                          <span className="text-xs font-medium text-white/90">
                            {new Date(app.appliedAt).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row gap-4 mb-6">
                        {app.resumeSnapshot && (
                          <a
                            href={app.resumeSnapshot}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-block px-4 py-3 bg-white/5 border border-white/10 text-white/80 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all duration-300 hover:-translate-y-0.5 hover:border-fuchsia-500/30 hover:text-white no-underline text-center shadow-sm"
                          >
                            View Submitted Resume
                          </a>
                        )}
                        {app.mentor && (
                          <div className="flex items-center gap-3 bg-[#0B0F19]/30 px-4 py-3 rounded-xl border border-white/5 w-max">
                            <span className="text-[10px] font-bold text-fuchsia-400 uppercase tracking-widest">
                              Mentor
                            </span>
                            <span className="text-xs font-medium text-white/90">
                              {app.mentor?.fullName}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-4 pt-5 border-t border-white/10">
                        {canWithdraw && (
                          <button
                            disabled={loadingId === app._id}
                            onClick={() => actionHandler(app._id, "withdraw")}
                            className="px-5 py-3 text-[10px] tracking-widest font-bold text-white/80 bg-white/5 border border-white/10 rounded-lg hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase"
                          >
                            {loadingId === app._id
                              ? "Processing..."
                              : "Withdraw Application"}
                          </button>
                        )}

                        {canTrack && (
  <button
    onClick={() => navigate(`/student/intern/${app._id}/track`)}
    className="px-6 py-3 text-[10px] tracking-widest font-bold text-white bg-gradient-to-r from-fuchsia-600 to-violet-600 rounded-lg hover:shadow-[0_4px_15px_-3px_rgba(217,70,239,0.5)] transition-all duration-300 uppercase hover:-translate-y-0.5"
  >
    Track Internship
  </button>
)}

                        {canAccept && (
                          <>
                            <button
                              disabled={loadingId === app._id}
                              onClick={() => actionHandler(app._id, "accept")}
                              className="px-6 py-3 text-[10px] tracking-widest font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-lg hover:shadow-[0_4px_15px_-3px_rgba(217,70,239,0.5)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border-none uppercase hover:-translate-y-0.5"
                            >
                              {loadingId === app._id
                                ? "Processing..."
                                : "Accept Offer"}
                            </button>

                            <button
                              disabled={loadingId === app._id}
                              onClick={() => actionHandler(app._id, "decline")}
                              className="px-6 py-3 text-[10px] tracking-widest font-bold text-white/80 bg-white/5 border border-white/10 rounded-lg hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase hover:-translate-y-0.5"
                            >
                              {loadingId === app._id ? "Processing..." : "Decline"}
                            </button>
                          </>
                        )}

                        {waitingStart && (
                          <span className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                            Waiting for internship to start
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}