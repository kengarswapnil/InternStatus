import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { useNavigate } from "react-router-dom";

const QUICK_STATUS_BUTTONS = ["ALL", "ongoing", "completed", "terminated"];

export default function CompanyInterns() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ongoing"); // DEFAULT = ongoing

  const navigate = useNavigate();

  const STATUS_OPTIONS = [
    "ALL",
    "offer_accepted",
    "ongoing",
    "completed",
    "terminated",
    "rejected",
  ];

  useEffect(() => {
    const fetchInterns = async () => {
      try {
        const res = await API.get("/company/interns");
        setData(res?.data?.data || []);
      } catch (err) {
        console.error("Fetch interns error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInterns();
  }, []);

  const getStatusBadge = (status) => {
    // Default badge styling
    let cls = "bg-[#F5F6FA] border-[#E5E5E5] text-[#2D3436]";

    if (["completed", "offer_accepted"].includes(status)) {
      cls = "bg-emerald-50 border-emerald-300 text-emerald-600";
    } else if (status === "ongoing") {
      // Primary color highlight
      cls = "bg-[#6C5CE7] text-[#FFFFFF] border-[#6C5CE7]";
    } else if (["terminated", "rejected"].includes(status)) {
      cls = "bg-rose-50 border-rose-300 text-rose-600";
    }

    return (
      <span
        className={`px-2.5 py-1 rounded-[10px] text-[9px] font-black uppercase tracking-widest border ${cls}`}
      >
        {status ? status.replace("_", " ") : "UNKNOWN"}
      </span>
    );
  };

  const filteredData = data.filter((item) => {
    const name = item?.student?.fullName || "";
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center">
        <p className="text-[14px] font-bold text-[#6C5CE7] animate-pulse">
          Syncing Company Interns...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#2D3436] font-sans pb-10">
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-6 flex flex-col gap-6">
        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E5E5E5] pb-4">
          <div>
            <h1 className="text-[23px] font-black tracking-tight text-[#6C5CE7]">
              Company Interns
            </h1>
            <p className="text-[13px] font-bold opacity-60 uppercase tracking-widest text-[#2D3436]">
              Active Intern Roster Management
            </p>
          </div>
          <div className="text-[11px] font-black bg-[#F5F6FA] text-[#2D3436] border border-[#E5E5E5] px-3 py-1.5 rounded-[10px] uppercase tracking-widest">
            Total: {data.length}
          </div>
        </header>

        {/* FILTERS */}
        {data.length > 0 && (
          <div className="flex flex-col gap-3">
            {/* PRIMARY: Quick Status Buttons */}
            <div className="flex flex-wrap gap-2">
              {QUICK_STATUS_BUTTONS.map((status) => {
                const isActive = statusFilter === status;
                return (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 text-[11px] font-black uppercase tracking-widest rounded-[10px] border transition-colors cursor-pointer ${
                      isActive
                        ? "bg-[#6C5CE7] text-[#FFFFFF] border-[#6C5CE7] shadow-sm"
                        : "bg-[#F5F6FA] text-[#2D3436] border-[#E5E5E5] hover:border-[#6C5CE7] hover:text-[#6C5CE7]"
                    }`}
                  >
                    {status === "ALL"
                      ? "All"
                      : status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                );
              })}
            </div>

            {/* SECONDARY: Search + Full Dropdown */}
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="Search by intern name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-3 text-[13px] bg-[#F5F6FA] text-[#2D3436] border border-[#E5E5E5] rounded-[14px] focus:outline-none focus:border-[#6C5CE7] focus:ring-1 focus:ring-[#6C5CE7] transition-all placeholder:opacity-40"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full md:w-56 px-4 py-3 text-[11px] font-bold bg-[#F5F6FA] text-[#2D3436] border border-[#E5E5E5] rounded-[14px] uppercase tracking-widest focus:outline-none focus:border-[#6C5CE7] focus:ring-1 focus:ring-[#6C5CE7] transition-all"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status === "ALL"
                      ? "All Statuses"
                      : status.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* EMPTY STATES */}
        {data.length === 0 ? (
          <div className="bg-[#F5F6FA] border-2 border-dashed border-[#E5E5E5] rounded-[20px] p-20 text-center">
            <p className="text-[13px] font-bold text-[#6C5CE7] opacity-80 uppercase tracking-widest">
              No interns found
            </p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="bg-[#F5F6FA] border border-[#E5E5E5] rounded-[20px] p-20 text-center">
            <p className="text-[13px] font-bold text-[#6C5CE7] opacity-80 uppercase tracking-widest">
              No results match filters
            </p>
          </div>
        ) : (
          /* TABLE */
          <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-[20px] overflow-x-auto shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F5F6FA] border-b border-[#E5E5E5]">
                  <th className="p-5 text-[10px] uppercase font-bold text-[#2D3436] opacity-60">
                    Name
                  </th>
                  <th className="p-5 text-[10px] uppercase font-bold text-[#2D3436] opacity-60">
                    Role
                  </th>
                  <th className="p-5 text-[10px] uppercase font-bold text-[#2D3436] opacity-60">
                    Status
                  </th>
                  <th className="p-5 text-[10px] uppercase font-bold text-[#2D3436] opacity-60 text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr
                    key={item._id}
                    className={`border-b border-[#E5E5E5] hover:bg-[#F5F6FA] transition-colors ${
                      index === filteredData.length - 1 ? "border-none" : ""
                    }`}
                  >
                    <td className="p-5 font-bold text-[#2D3436]">
                      {item?.student?.fullName || "—"}
                    </td>
                    <td className="p-5 text-[13px] text-[#2D3436] opacity-80">
                      {item?.internship?.title || "—"}
                    </td>
                    <td className="p-5 whitespace-nowrap">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="p-5 text-right">
                      <button
                        onClick={() => navigate(`/company/intern/${item._id}`)}
                        className="px-5 py-2 bg-[#FFFFFF] border border-[#E5E5E5] text-[#2D3436] text-[10px] font-black uppercase rounded-[10px] hover:border-[#6C5CE7] hover:text-[#6C5CE7] transition-colors shadow-sm"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
