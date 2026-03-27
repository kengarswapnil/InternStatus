import React, { useEffect, useState } from "react";
import API from "../../api/api";
import AdminNavBar from "../../components/navbars/AdminNavBar";

export default function CollegeRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await API.get("/onboarding/college");
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
      await API.patch(`/onboarding/college/${id}/status`, { status });
      setRequests((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status } : r)),
      );
    } catch (err) {
      console.error(err);
      alert("Action failed");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FFFFFF] font-['Nunito'] transition-all duration-300">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#F5F6FA] border-t-[#6C5CE7] rounded-full animate-spin"></div>
          <p className="text-[#6C5CE7] font-black tracking-widest uppercase text-[10px] animate-pulse m-0">
            Loading Requests
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF] p-4 md:p-8 font-['Nunito'] text-[#2D3436] transition-all duration-300">
      <div className="max-w-6xl mx-auto flex flex-col gap-6 md:gap-8">
        <header className="mb-6 border-b border-[#F5F6FA] pb-6 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-black m-0 tracking-tight text-[#6C5CE7]">
            College Onboarding Requests
          </h2>
        </header>

        {requests.length === 0 && (
          <div className="bg-[#F5F6FA] border border-transparent rounded-[24px] p-16 text-center shadow-inner animate-fade-in-up">
            <p className="text-[#2D3436] opacity-60 m-0 text-base font-bold uppercase tracking-widest">
              No requests found
            </p>
          </div>
        )}

        <div className="flex flex-col gap-6">
          {requests.map((req) => {
            const collegeName =
              req.selectedCollege?.name || req.collegeName || "—";
            const isExisting = !!req.selectedCollege;

            return (
              <div
                key={req._id}
                className="bg-[#FFFFFF] border border-[#F5F6FA] rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(108,92,231,0.08)] p-6 md:p-8 flex flex-col gap-6 box-border transition-all duration-500 group hover:-translate-y-1 animate-fade-in-up"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F5F6FA] pb-5">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-4 flex-wrap">
                      <h3 className="text-2xl font-black text-[#2D3436] m-0 group-hover:text-[#6C5CE7] transition-colors">
                        {collegeName}
                      </h3>
                      {isExisting && (
                        <span className="px-3 py-1.5 text-[10px] font-black text-[#6C5CE7] bg-[#F5F6FA] border border-transparent uppercase tracking-widest rounded-[12px] shadow-sm">
                          Existing College
                        </span>
                      )}
                    </div>
                  </div>
                  <span
                    className={`inline-block px-4 py-2 rounded-[12px] text-[10px] font-black uppercase tracking-widest border transition-colors shadow-sm ${
                      req.status === "approved"
                        ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                        : req.status === "rejected"
                          ? "bg-rose-50 text-rose-600 border-rose-200"
                          : "bg-amber-50 text-amber-600 border-amber-200"
                    }`}
                  >
                    {req.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-4">
                    <h4 className="text-[11px] font-black text-[#6C5CE7] uppercase tracking-widest m-0 px-1">
                      Requester Details
                    </h4>
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col gap-1 bg-[#F5F6FA] p-4 rounded-[16px] border border-transparent transition-all duration-300 hover:border-[#6C5CE7] hover:shadow-sm">
                        <span className="text-[10px] font-black text-[#2D3436] opacity-60 uppercase tracking-widest">
                          Name
                        </span>
                        <span className="text-sm font-black text-[#2D3436]">
                          {req.requesterName}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1 bg-[#F5F6FA] p-4 rounded-[16px] border border-transparent transition-all duration-300 hover:border-[#6C5CE7] hover:shadow-sm">
                        <span className="text-[10px] font-black text-[#2D3436] opacity-60 uppercase tracking-widest">
                          Email
                        </span>
                        <span className="text-sm font-bold text-[#2D3436] break-all">
                          {req.requesterEmail}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1 bg-[#F5F6FA] p-4 rounded-[16px] border border-transparent transition-all duration-300 hover:border-[#6C5CE7] hover:shadow-sm">
                        <span className="text-[10px] font-black text-[#2D3436] opacity-60 uppercase tracking-widest">
                          Phone
                        </span>
                        <span className="text-sm font-bold text-[#2D3436]">
                          {req.requesterPhone || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <h4 className="text-[11px] font-black text-[#6C5CE7] uppercase tracking-widest m-0 px-1">
                      Institution Details
                    </h4>
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col gap-1 bg-[#F5F6FA] p-4 rounded-[16px] border border-transparent transition-all duration-300 hover:border-[#6C5CE7] hover:shadow-sm">
                        <span className="text-[10px] font-black text-[#2D3436] opacity-60 uppercase tracking-widest">
                          Address
                        </span>
                        <span className="text-sm font-bold text-[#2D3436] leading-relaxed">
                          {req.location}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1 bg-[#F5F6FA] p-4 rounded-[16px] border border-transparent transition-all duration-300 hover:border-[#6C5CE7] hover:shadow-sm">
                        <span className="text-[10px] font-black text-[#2D3436] opacity-60 uppercase tracking-widest">
                          Website
                        </span>
                        <span className="text-sm font-black text-[#6C5CE7] break-all">
                          {req.website || "N/A"}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1 bg-[#F5F6FA] p-4 rounded-[16px] border border-transparent transition-all duration-300 hover:border-[#6C5CE7] hover:shadow-sm">
                        <span className="text-[10px] font-black text-[#2D3436] opacity-60 uppercase tracking-widest">
                          Email Domain
                        </span>
                        <span className="text-sm font-bold text-[#2D3436]">
                          {req.emailDomain || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-[#F5F6FA] flex flex-col sm:flex-row sm:items-center justify-between gap-5 mt-2">
                  <div className="flex items-center gap-4">
                    <span className="text-[11px] font-black text-[#6C5CE7] uppercase tracking-widest hidden sm:inline px-1">
                      Verification Document
                    </span>
                    <a
                      href={req.verificationDocumentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full sm:w-auto text-center px-6 py-3.5 text-[10px] font-black text-[#6C5CE7] bg-[#F5F6FA] border border-transparent rounded-[14px] hover:border-[#6C5CE7] hover:shadow-md transition-all duration-300 no-underline cursor-pointer uppercase tracking-widest transform hover:-translate-y-0.5"
                    >
                      View Document
                    </a>
                  </div>

                  {req.status === "pending" && (
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                      <button
                        onClick={() => handleAction(req._id, "rejected")}
                        className="w-full sm:w-auto px-10 py-3.5 text-[10px] font-black text-rose-600 bg-rose-50 border border-rose-200 rounded-[14px] hover:bg-rose-100 hover:shadow-md transition-all duration-300 cursor-pointer uppercase tracking-widest transform hover:-translate-y-0.5 outline-none"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleAction(req._id, "approved")}
                        className="w-full sm:w-auto px-10 py-3.5 text-[10px] font-black text-[#FFFFFF] bg-emerald-500 rounded-[14px] hover:bg-emerald-600 hover:shadow-lg transition-all duration-300 cursor-pointer border-none uppercase tracking-widest transform hover:-translate-y-0.5 outline-none shadow-md"
                      >
                        Approve
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
