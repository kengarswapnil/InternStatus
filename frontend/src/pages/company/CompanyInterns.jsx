import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { useNavigate } from "react-router-dom";

export default function CompanyInterns() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);
  const navigate = useNavigate();

  const fetchInterns = async () => {
    try {
      const res = await API.get("/company/interns");
      setData(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterns();
  }, []);

  const updateStatus = async (id, status) => {
    const confirmAction = window.confirm(
      `Are you sure you want to mark as ${status}?`
    );

    if (!confirmAction) return;

    setLoadingId(id);

    try {
      await API.patch(`/applications/${id}/status`, { status });
      await fetchInterns();
    } catch (err) {
      alert(err?.response?.data?.message || "Update failed");
    } finally {
      setLoadingId(null);
    }
  };

  const getStatusBadge = (status) => {
    let colorClass = "bg-white/10 text-white/80 border-white/20";
    if (status === "ongoing") colorClass = "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30";
    else if (status === "completed") colorClass = "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
    else if (status === "terminated") colorClass = "bg-red-500/10 text-red-400 border-red-500/20 opacity-80";
    else if (status === "offer_accepted") colorClass = "bg-violet-500/20 text-violet-300 border-violet-500/30";
    
    return (
      <span className={`inline-block px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${colorClass}`}>
        {status.replace("_", " ")}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0B0F19]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-white/10 border-t-fuchsia-500 rounded-full animate-spin"></div>
          <p className="text-fuchsia-400 font-bold tracking-widest uppercase text-[10px] animate-pulse m-0">
            Loading Interns
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] p-4 md:p-8 font-sans text-white selection:bg-fuchsia-500/30 selection:text-fuchsia-200 relative overflow-hidden">
      {/* Ambient Backgrounds */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" aria-hidden="true"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" aria-hidden="true"></div>

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col gap-6 md:gap-8">
        <header className="mb-4 border-b border-white/10 pb-6">
          <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 m-0 tracking-tight mb-2">
            Company Interns
          </h2>
          <p className="text-white/40 font-medium text-sm m-0 tracking-wide">
            Manage your active and past internship programs
          </p>
        </header>

        {data.length === 0 ? (
          <div className="bg-[#0B0F19]/50 border border-white/10 rounded-3xl p-16 text-center shadow-inner">
            <p className="text-white/40 m-0 text-base font-medium">No interns found.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {data.map((item) => (
              <div
                key={item._id}
                className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] p-6 md:p-8 flex flex-col gap-6 transition-all duration-300 hover:border-white/20 group hover:-translate-y-1"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-white/5 pb-6">
                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-2xl font-bold text-white/90 mt-0 mb-1 group-hover:text-fuchsia-300 transition-colors">
                      {item.student?.fullName}
                    </h3>
                    <p className="text-sm font-medium text-white/60 m-0">
                      {item.internship?.title}
                    </p>
                  </div>
                  <div>
                    {getStatusBadge(item.status)}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1 bg-[#0B0F19]/30 p-4 rounded-xl border border-white/5 transition-all hover:border-white/10">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                      Mentor Assigned
                    </span>
                    <span className="text-sm font-medium text-white/80">
                      {item.mentor?.fullName || "Not Assigned"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-white/10">
                  {item.status === "offer_accepted" && (
                    <button
                      onClick={() => updateStatus(item._id, "ongoing")}
                      disabled={loadingId === item._id}
                      className="flex-1 md:flex-none px-6 py-3.5 text-[10px] font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl hover:shadow-[0_4px_15px_-3px_rgba(217,70,239,0.5)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest flex items-center justify-center gap-2 outline-none hover:-translate-y-0.5 border-none cursor-pointer"
                    >
                      {loadingId === item._id && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
                      {loadingId === item._id ? "Processing..." : "Start Internship"}
                    </button>
                  )}

                  {item.status === "ongoing" && (
                    <>
                      <button
                        onClick={() => updateStatus(item._id, "completed")}
                        disabled={loadingId === item._id}
                        className="flex-1 md:flex-none px-6 py-3.5 text-[10px] font-bold text-white bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl hover:shadow-[0_4px_15px_-3px_rgba(16,185,129,0.5)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest flex items-center justify-center gap-2 outline-none hover:-translate-y-0.5 border-none cursor-pointer"
                      >
                        {loadingId === item._id && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
                        {loadingId === item._id ? "Processing..." : "Complete"}
                      </button>

                      <button
                        onClick={() => updateStatus(item._id, "terminated")}
                        disabled={loadingId === item._id}
                        className="flex-1 md:flex-none px-6 py-3.5 text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl hover:bg-red-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest flex items-center justify-center gap-2 outline-none hover:-translate-y-0.5 cursor-pointer"
                      >
                        {loadingId === item._id && <span className="w-3.5 h-3.5 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin"></span>}
                        {loadingId === item._id ? "Processing..." : "Terminate"}
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => navigate(`/company/intern/${item._id}`)}
                    className="flex-1 md:flex-none md:ml-auto px-6 py-3.5 text-[10px] font-bold text-white/80 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300 uppercase tracking-widest outline-none hover:-translate-y-0.5 cursor-pointer text-center"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}