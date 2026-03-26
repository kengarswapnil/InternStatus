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
      className={`px-2.5 py-1 rounded-[10px] text-[9px] font-black uppercase tracking-widest border ${
        isOpen
          ? "bg-[#f9f9f9] border-[#008000] text-[#008000]"
          : "bg-[#fff] border-[#cc0000] text-[#cc0000]"
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
      <div className="h-full bg-[#f9f9f9] flex items-center justify-center font-sans">
        <p className="text-[14px] font-bold text-[#333] animate-pulse m-0">
          Syncing Internships...
        </p>
      </div>
    );
  }

  return (
    <div className="h-full bg-[#f9f9f9] text-[#333] font-sans">
      <main className="max-w-6xl mx-auto w-full px-4 md:px-6 py-6 flex flex-col gap-6">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#e5e5e5] pb-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-[23px] font-black text-[#333] m-0 tracking-tight leading-tight">
              My Internships
            </h1>
            <p className="text-[13px] font-bold text-[#333] opacity-60 m-0 uppercase tracking-widest">
              Internship Posting Management
            </p>
          </div>
          <div className="text-[11px] font-black text-[#111] bg-[#fff] border border-[#e5e5e5] px-3 py-1.5 rounded-[10px] uppercase tracking-widest">
            Total Postings: {data.length}
          </div>
        </header>

        {/* Error State */}
        {error && (
          <div className="px-5 py-3 text-[11px] font-bold text-[#cc0000] bg-[#fff] border border-[#cc0000] rounded-[14px] uppercase tracking-widest text-center">
            {error}
          </div>
        )}

        {/* Filters Bar */}
        {data.length > 0 && (
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search by internship title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-3 text-[13px] bg-[#fff] border border-[#e5e5e5] rounded-[14px] outline-none focus:border-[#333] transition-colors"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-56 px-4 py-3 text-[11px] font-bold text-[#333] bg-[#fff] border border-[#e5e5e5] rounded-[14px] outline-none focus:border-[#333] transition-colors appearance-none uppercase tracking-widest"
            >
              {uniqueStatuses.map((status) => (
                <option key={status} value={status}>
                  {status === "ALL" ? "All Statuses" : status}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Data Handling */}
        {data.length === 0 && !error ? (
          <div className="bg-[#fff] border-2 border-dashed border-[#e5e5e5] rounded-[20px] p-20 text-center">
            <p className="text-[13px] font-bold text-[#333] opacity-40 m-0 uppercase tracking-widest">
              No internships posted yet.
            </p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="bg-[#fff] border border-[#e5e5e5] rounded-[20px] p-20 text-center">
            <p className="text-[13px] font-bold text-[#333] opacity-40 m-0 uppercase tracking-widest">
              No internships match your search filters.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("ALL");
              }}
              className="mt-4 px-4 py-2 bg-[#f9f9f9] border border-[#e5e5e5] text-[#333] text-[10px] font-black uppercase tracking-widest rounded-[10px] hover:border-[#333] transition-colors cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="bg-[#fff] border border-[#e5e5e5] rounded-[20px] shadow-sm overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#e5e5e5] bg-[#f9f9f9]">
                  <th className="p-5 text-[10px] font-bold opacity-40 uppercase tracking-widest whitespace-nowrap">
                    Internship Title
                  </th>
                  <th className="p-5 text-[10px] font-bold opacity-40 uppercase tracking-widest whitespace-nowrap">
                    Deadline
                  </th>
                  <th className="p-5 text-[10px] font-bold opacity-40 uppercase tracking-widest whitespace-nowrap">
                    Status
                  </th>
                  <th className="p-5 text-[10px] font-bold opacity-40 uppercase tracking-widest text-right whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => {
                  const isExpanded = expandedId === item._id;
                  const isOpen = item.status === "open";

                  return (
                    <React.Fragment key={item._id}>
                      {/* Main Row */}
                      <tr
                        className={`border-b border-[#e5e5e5] transition-colors hover:bg-[#fafafa] ${isExpanded ? "bg-[#fafafa]" : ""}`}
                      >
                        <td className="p-5 align-middle">
                          <span className="text-[15px] font-black text-[#333] m-0 leading-tight block">
                            {item.title}
                          </span>
                        </td>
                        <td className="p-5 align-middle whitespace-nowrap">
                          <span className="text-[12px] font-bold text-[#111]">
                            {item.applicationDeadline
                              ? new Date(
                                  item.applicationDeadline,
                                ).toLocaleDateString("en-IN", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "—"}
                          </span>
                        </td>
                        <td className="p-5 align-middle whitespace-nowrap">
                          <StatusBadge status={item.status} />
                        </td>
                        <td className="p-5 align-middle text-right whitespace-nowrap">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() =>
                                navigate(
                                  `/company/internship/${item._id}/applicants`,
                                )
                              }
                              className="px-4 py-2 bg-[#111] text-[#fff] text-[10px] font-black uppercase tracking-widest rounded-[10px] hover:opacity-80 transition-opacity cursor-pointer"
                            >
                              Applicants
                            </button>
                            <button
                              onClick={() => toggleExpand(item._id)}
                              className="px-4 py-2 bg-[#fff] border border-[#e5e5e5] text-[#333] text-[10px] font-black uppercase tracking-widest rounded-[10px] hover:border-[#333] transition-all cursor-pointer"
                            >
                              {isExpanded ? "Less" : "Show More"}
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Info Drawer */}
                      {isExpanded && (
                        <tr className="bg-[#fcfcfc] border-b border-[#e5e5e5]">
                          <td colSpan={4} className="p-5">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                              {/* Left Stats */}
                              <div className="flex gap-8">
                                <div className="flex flex-col gap-0.5">
                                  <span className="text-[9px] font-bold text-[#333] opacity-40 uppercase tracking-widest">
                                    Positions Available
                                  </span>
                                  <span className="text-[13px] font-black text-[#111]">
                                    {item.positions}
                                  </span>
                                </div>
                                <div className="flex flex-col gap-0.5">
                                  <span className="text-[9px] font-bold text-[#333] opacity-40 uppercase tracking-widest">
                                    Max Applicants
                                  </span>
                                  <span className="text-[13px] font-black text-[#111]">
                                    {item.maxApplicants}
                                  </span>
                                </div>
                              </div>

                              {/* Right Actions */}
                              <div className="flex flex-wrap gap-2 w-full md:w-auto pt-4 md:pt-0 border-t border-[#e5e5e5] md:border-none">
                                <button
                                  onClick={() =>
                                    navigate(
                                      `/company/internship/${item._id}/edit`,
                                    )
                                  }
                                  className="px-4 py-2 bg-[#f9f9f9] border border-[#333] text-[#333] text-[10px] font-black uppercase tracking-widest rounded-[10px] hover:bg-[#333] hover:text-[#fff] transition-all cursor-pointer"
                                >
                                  Edit Details
                                </button>
                                <button
                                  disabled={loadingId === item._id}
                                  onClick={() =>
                                    toggleStatus(item._id, item.status)
                                  }
                                  className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-[10px] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border ${
                                    isOpen
                                      ? "text-[#cc0000] bg-[#fff] border-[#cc0000] hover:bg-[#cc0000] hover:text-[#fff]"
                                      : "text-[#008000] bg-[#fff] border-[#008000] hover:bg-[#008000] hover:text-[#fff]"
                                  }`}
                                >
                                  {loadingId === item._id
                                    ? "..."
                                    : isOpen
                                      ? "Close Posting"
                                      : "Open Posting"}
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
        )}
      </main>
    </div>
  );
}
