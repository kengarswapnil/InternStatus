import React, { useEffect, useState } from "react";
import API from "../../api/api";
import AdminNavBar from "../../components/navbars/AdminNavBar";

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
        prev.map((r) => (r._id === id ? { ...r, status } : r)),
      );
    } catch (err) {
      console.error(err);
      alert("Action failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] flex flex-col font-['Nunito'] transition-all duration-300">
        <AdminNavBar />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-[#6C5CE7] font-black uppercase tracking-widest text-[13px] animate-pulse m-0">
            Loading Requests...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#2D3436] flex flex-col font-['Nunito'] pb-10 transition-all duration-300">
      <AdminNavBar />

      <main className="max-w-6xl mx-auto w-full px-4 md:px-6 py-6 lg:py-10 flex flex-col gap-6 animate-fade-in-up">
        {/* Header */}
        <header className="border-b border-[#F5F6FA] pb-6 mb-2">
          <h2 className="text-[26px] font-black m-0 tracking-tight text-[#6C5CE7]">
            Company Onboarding Requests
          </h2>
          <p className="text-[14px] font-bold text-[#2D3436] opacity-60 m-0 mt-2">
            Review and manage new company registrations
          </p>
        </header>

        {requests.length === 0 && (
          <div className="bg-[#F5F6FA] border-2 border-dashed border-[#A29BFE] border-opacity-30 rounded-[24px] p-16 text-center shadow-sm">
            <p className="text-[13px] font-black uppercase tracking-widest text-[#2D3436] opacity-60 m-0">
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
                className="bg-[#FFFFFF] border border-[#F5F6FA] rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(108,92,231,0.08)] transition-all duration-500 p-6 md:p-8 flex flex-col gap-6 transform hover:-translate-y-1"
              >
                {/* Card Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F5F6FA] pb-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-[20px] font-black text-[#6C5CE7] m-0">
                      {companyName}
                    </h3>
                    {isExisting && (
                      <span className="px-3 py-1.5 text-[10px] font-black text-[#6C5CE7] bg-[#F5F6FA] border border-transparent uppercase tracking-widest rounded-[12px] shadow-sm">
                        Existing Company
                      </span>
                    )}
                  </div>
                  <span
                    className={`inline-block px-3 py-1.5 rounded-[12px] text-[10px] font-black uppercase tracking-widest border transition-colors shadow-sm ${
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

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Requester Info */}
                  <div className="flex flex-col gap-3">
                    <h4 className="text-[11px] font-black text-[#2D3436] opacity-60 uppercase tracking-widest m-0 border-b border-[#F5F6FA] pb-2">
                      Requester Details
                    </h4>
                    <div className="flex flex-col gap-2 bg-[#F5F6FA] p-4 rounded-[16px]">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#2D3436] opacity-60 uppercase tracking-widest">
                          Name
                        </span>
                        <span className="text-[13px] font-black text-[#2D3436]">
                          {req.requesterName}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#2D3436] opacity-60 uppercase tracking-widest">
                          Email
                        </span>
                        <span className="text-[13px] font-bold text-[#2D3436] break-all">
                          {req.requesterEmail}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Company Info */}
                  <div className="flex flex-col gap-3">
                    <h4 className="text-[11px] font-black text-[#2D3436] opacity-60 uppercase tracking-widest m-0 border-b border-[#F5F6FA] pb-2">
                      Company Details
                    </h4>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3 bg-[#F5F6FA] p-4 rounded-[16px]">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-[#2D3436] opacity-50 uppercase tracking-widest">
                          Industry
                        </span>
                        <span
                          className="text-[13px] font-bold text-[#2D3436] truncate"
                          title={req.industry || "N/A"}
                        >
                          {req.industry || "N/A"}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-[#2D3436] opacity-50 uppercase tracking-widest">
                          Size
                        </span>
                        <span className="text-[13px] font-bold text-[#2D3436]">
                          {req.companySize || "N/A"}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-[#2D3436] opacity-50 uppercase tracking-widest">
                          Website
                        </span>
                        <span
                          className="text-[13px] font-black text-[#6C5CE7] hover:underline truncate transition-all"
                          title={req.website || "N/A"}
                        >
                          {req.website || "N/A"}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-[#2D3436] opacity-50 uppercase tracking-widest">
                          Domain
                        </span>
                        <span
                          className="text-[13px] font-bold text-[#2D3436] truncate"
                          title={req.emailDomain || "N/A"}
                        >
                          {req.emailDomain || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Locations */}
                  {req.locations?.length > 0 && (
                    <div className="flex flex-col gap-2 md:col-span-2">
                      <span className="text-[11px] font-black text-[#2D3436] opacity-60 uppercase tracking-widest px-1">
                        Locations
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {req.locations.map((loc, i) => (
                          <span
                            key={i}
                            className="px-3 py-1.5 bg-[#F5F6FA] border border-transparent rounded-[12px] text-[11px] text-[#2D3436] font-bold shadow-sm"
                          >
                            {[loc.city, loc.state, loc.country]
                              .filter(Boolean)
                              .join(", ")}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions Footer */}
                <div className="pt-6 border-t border-[#F5F6FA] flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    {req.verificationDocumentUrl && (
                      <a
                        href={req.verificationDocumentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full sm:w-auto text-center px-6 py-3 text-[11px] font-black text-[#6C5CE7] bg-[#F5F6FA] border border-transparent rounded-[14px] hover:border-[#6C5CE7] hover:shadow-md transition-all duration-300 no-underline uppercase tracking-widest flex items-center justify-center gap-2"
                      >
                        View Document
                      </a>
                    )}
                  </div>

                  {req.status === "pending" && (
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                      <button
                        onClick={() => handleAction(req._id, "rejected")}
                        className="w-full sm:w-auto px-8 py-3 text-[11px] font-black text-rose-600 bg-rose-50 border border-rose-200 rounded-[14px] hover:bg-rose-100 hover:shadow-md transition-all duration-300 cursor-pointer uppercase tracking-widest outline-none transform hover:-translate-y-0.5"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleAction(req._id, "approved")}
                        className="w-full sm:w-auto px-8 py-3 text-[11px] font-black text-[#FFFFFF] bg-emerald-500 border-none rounded-[14px] hover:bg-emerald-600 hover:shadow-lg transition-all duration-300 cursor-pointer uppercase tracking-widest outline-none transform hover:-translate-y-0.5 shadow-md"
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
      </main>
    </div>
  );
}
