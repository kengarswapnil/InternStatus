import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { useNavigate } from "react-router-dom";

// ==========================================
// 1. Reusable Status Badge Component
// ==========================================
const StatusBadge = ({ status }) => {
  const isOpen = status === "open";
  return (
    <span
      className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] border-2 transition-all duration-300 ${
        isOpen
          ? "bg-[#f9f9f9] border-[#008000] text-[#008000] shadow-[0_4px_12px_rgba(0,128,0,0.1)]"
          : "bg-[#fff] border-[#cc0000] text-[#cc0000] shadow-[0_4px_12px_rgba(204,0,0,0.1)]"
      }`}
    >
      {status ? status : "UNKNOWN"}
    </span>
  );
};

// ==========================================
// 2. Main Internships Component
// ==========================================
export default function CompanyInternships() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loadingId, setLoadingId] = useState(null);

  // UI States
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [expandedId, setExpandedId] = useState(null);

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await API.get("/internships/company");
      setData(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load internships");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleStatus = async (id, currentStatus) => {
    try {
      setLoadingId(id);
      const newStatus = currentStatus === "open" ? "closed" : "open";
      await API.patch(`/internships/${id}/status`, { status: newStatus });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    } finally {
      setLoadingId(null);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Filter Logic
  const filteredData = data.filter((item) => {
    const matchesSearch = (item.title || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const uniqueStatuses = [
    "ALL",
    ...new Set(data.map((i) => i.status).filter(Boolean)),
  ];

  if (loading) {
    return (
      <div className="h-screen bg-[#FFFFFF] flex flex-col items-center justify-center font-['Nunito']">
        <div className="w-10 h-10 border-4 border-[#6C5CE7]/20 border-t-[#6C5CE7] rounded-full animate-spin mb-4" />
        <p className="text-[14px] font-black text-[#2D3436] tracking-[0.2em] uppercase animate-pulse">
          Syncing Internships...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#2D3436] font-['Nunito'] pb-12 transition-all">
      <main className="max-w-7xl mx-auto w-full px-4 md:px-8 py-10 flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#F5F6FA] pb-8">
          <div className="flex flex-col gap-1">
            <h1 className="text-[32px] font-black text-[#2D3436] m-0 tracking-tight leading-none">
              My Internships
            </h1>
            <p className="text-[12px] font-black text-[#6C5CE7] m-0 uppercase tracking-[0.25em] opacity-80">
              Internship Posting Management
            </p>
          </div>
          <div className="inline-flex items-center gap-3 text-[12px] font-black text-[#2D3436] bg-[#F5F6FA] px-5 py-3 rounded-2xl border border-transparent hover:border-[#6C5CE7]/20 transition-all uppercase tracking-widest shadow-sm">
            Total Postings: <span className="text-[#6C5CE7]">{data.length}</span>
          </div>
        </header>

        {/* Error State */}
        {error && (
          <div className="px-6 py-4 text-[12px] font-black text-[#cc0000] bg-[#cc0000]/5 border-2 border-[#cc0000]/20 rounded-2xl uppercase tracking-widest text-center animate-shake">
            {error}
          </div>
        )}

        {/* Filters Bar */}
        {data.length > 0 && (
          <div className="flex flex-col md:flex-row gap-4 animate-in fade-in slide-in-from-left-4 duration-500 delay-150">
            <div className="relative flex-1 group">
              <input
                type="text"
                placeholder="Search by internship title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-[14px] text-[#2D3436] bg-[#F5F6FA] border-2 border-transparent rounded-[20px] outline-none transition-all group-focus-within:bg-white group-focus-within:border-[#6C5CE7]/30 group-focus-within:shadow-[0_10px_30px_rgba(108,92,231,0.06)]"
              />
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2D3436] opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
            
            <div className="relative w-full md:w-64 group">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-5 py-4 text-[12px] font-black text-[#2D3436] bg-[#F5F6FA] border-2 border-transparent rounded-[20px] outline-none transition-all group-focus-within:bg-white group-focus-within:border-[#6C5CE7]/30 appearance-none uppercase tracking-widest cursor-pointer"
              >
                {uniqueStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status === "ALL" ? "All Statuses" : status}
                  </option>
                ))}
              </select>
              <svg className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2D3436] opacity-30 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="3"/></svg>
            </div>
          </div>
        )}

        {/* Data Handling */}
        {data.length === 0 && !error ? (
          <div className="bg-[#FFFFFF] border-4 border-dashed border-[#F5F6FA] rounded-[40px] p-24 text-center">
            <div className="w-20 h-20 bg-[#F5F6FA] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-[#6C5CE7] opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth="2.5" strokeLinecap="round"/></svg>
            </div>
            <p className="text-[14px] font-black text-[#2D3436] opacity-40 m-0 uppercase tracking-[0.3em]">
              No internships posted yet.
            </p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="bg-[#FFFFFF] border border-[#F5F6FA] rounded-[32px] p-20 text-center shadow-sm">
            <p className="text-[13px] font-black text-[#2D3436] opacity-30 m-0 uppercase tracking-widest mb-6">
              No results match your criteria.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("ALL");
              }}
              className="px-8 py-3 bg-[#6C5CE7] text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:shadow-[0_15px_30px_rgba(108,92,231,0.3)] transition-all cursor-pointer active:scale-95"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="bg-[#FFFFFF] border border-[#F5F6FA] rounded-[32px] shadow-[0_30px_60px_rgba(108,92,231,0.04)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F5F6FA]/50">
                    <th className="p-6 text-[11px] font-black text-[#2D3436] opacity-40 uppercase tracking-[0.2em] whitespace-nowrap">
                      Internship Opportunity
                    </th>
                    <th className="p-6 text-[11px] font-black text-[#2D3436] opacity-40 uppercase tracking-[0.2em] whitespace-nowrap">
                      Closing Date
                    </th>
                    <th className="p-6 text-[11px] font-black text-[#2D3436] opacity-40 uppercase tracking-[0.2em] whitespace-nowrap">
                      Current Status
                    </th>
                    <th className="p-6 text-[11px] font-black text-[#2D3436] opacity-40 uppercase tracking-[0.2em] text-right whitespace-nowrap">
                      Management
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5F6FA]">
                  {filteredData.map((item) => {
                    const isExpanded = expandedId === item._id;
                    const isOpen = item.status === "open";

                    return (
                      <React.Fragment key={item._id}>
                        {/* Main Row */}
                        <tr
                          className={`transition-all duration-300 hover:bg-[#F5F6FA]/30 ${isExpanded ? "bg-[#F5F6FA]/40 shadow-inner" : ""}`}
                        >
                          <td className="p-6 align-middle">
                            <span className="text-[16px] font-black text-[#2D3436] tracking-tight block group-hover:text-[#6C5CE7] transition-colors">
                              {item.title}
                            </span>
                          </td>
                          <td className="p-6 align-middle whitespace-nowrap">
                            <span className="text-[13px] font-black text-[#2D3436]/80 bg-[#F5F6FA] px-3 py-1 rounded-lg">
                              {item.applicationDeadline
                                ? new Date(item.applicationDeadline).toLocaleDateString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })
                                : "—"}
                            </span>
                          </td>
                          <td className="p-6 align-middle whitespace-nowrap">
                            <StatusBadge status={item.status} />
                          </td>
                          <td className="p-6 align-middle text-right whitespace-nowrap">
                            <div className="flex justify-end gap-3">
                              <button
                                onClick={() => navigate(`/company/internship/${item._id}/applicants`)}
                                className="px-5 py-2.5 bg-[#2D3436] text-[#FFFFFF] text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-[#6C5CE7] transition-all cursor-pointer shadow-md active:scale-95"
                              >
                                View Applicants
                              </button>
                              <button
                                onClick={() => toggleExpand(item._id)}
                                className={`px-5 py-2.5 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer active:scale-95 border-2 ${
                                  isExpanded 
                                    ? "bg-[#6C5CE7] text-white border-[#6C5CE7]" 
                                    : "bg-white text-[#2D3436] border-[#F5F6FA] hover:border-[#6C5CE7]/30 shadow-sm"
                                }`}
                              >
                                {isExpanded ? "Minimize" : "Actions"}
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Expanded Info Drawer */}
                        {isExpanded && (
                          <tr className="bg-[#F5F6FA]/20 animate-in slide-in-from-top-4 duration-500">
                            <td colSpan={4} className="p-8">
                              <div className="bg-white rounded-3xl p-6 border border-[#F5F6FA] shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                                {/* Left Stats */}
                                <div className="flex gap-12">
                                  <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-black text-[#6C5CE7] uppercase tracking-widest">
                                      Open Positions
                                    </span>
                                    <span className="text-[20px] font-black text-[#2D3436]">
                                      {item.positions}
                                    </span>
                                  </div>
                                  <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-black text-[#6C5CE7] uppercase tracking-widest">
                                      Applicant Cap
                                    </span>
                                    <span className="text-[20px] font-black text-[#2D3436]">
                                      {item.maxApplicants}
                                    </span>
                                  </div>
                                </div>

                                {/* Right Actions */}
                                <div className="flex flex-wrap gap-3 w-full md:w-auto pt-6 md:pt-0 border-t border-[#F5F6FA] md:border-none">
                                  <button
                                    onClick={() => navigate(`/company/internship/${item._id}/edit`)}
                                    className="flex-1 md:flex-none px-6 py-3 bg-white border-2 border-[#2D3436] text-[#2D3436] text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-[#2D3436] hover:text-white transition-all cursor-pointer"
                                  >
                                    Edit Details
                                  </button>
                                  <button
                                    disabled={loadingId === item._id}
                                    onClick={() => toggleStatus(item._id, item.status)}
                                    className={`flex-1 md:flex-none px-6 py-3 text-[11px] font-black uppercase tracking-widest rounded-2xl transition-all cursor-pointer disabled:opacity-50 border-2 ${
                                      isOpen
                                        ? "text-[#cc0000] bg-white border-[#cc0000] hover:bg-[#cc0000] hover:text-white shadow-[0_10px_20px_rgba(204,0,0,0.1)]"
                                        : "text-[#008000] bg-white border-[#008000] hover:bg-[#008000] hover:text-white shadow-[0_10px_20px_rgba(0,128,0,0.1)]"
                                    }`}
                                  >
                                    {loadingId === item._id ? (
                                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mx-auto" />
                                    ) : isOpen ? (
                                      "Deactivate Posting"
                                    ) : (
                                      "Reactivate Posting"
                                    )}
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}