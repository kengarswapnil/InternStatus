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
    let cls = "bg-[#f9f9f9] border-[#e5e5e5] text-[#333]";

    if (["completed", "offer_accepted"].includes(status)) {
      cls = "bg-[#f9f9f9] border-[#008000] text-[#008000]";
    } else if (status === "ongoing") {
      cls = "bg-[#111] text-[#fff] border-[#111]";
    } else if (["terminated", "rejected"].includes(status)) {
      cls = "bg-[#fff] border-[#cc0000] text-[#cc0000]";
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
    const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f9f9f9] flex items-center justify-center">
        <p className="text-[14px] font-bold text-[#333] animate-pulse">
          Syncing Company Interns...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-[#333] font-sans pb-10">
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-6 flex flex-col gap-6">

        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#e5e5e5] pb-4">
          <div>
            <h1 className="text-[23px] font-black tracking-tight">
              Company Interns
            </h1>
            <p className="text-[13px] font-bold opacity-60 uppercase tracking-widest">
              Active Intern Roster Management
            </p>
          </div>
          <div className="text-[11px] font-black bg-[#fff] border border-[#e5e5e5] px-3 py-1.5 rounded-[10px] uppercase tracking-widest">
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
                        ? "bg-[#111] text-[#fff] border-[#111]"
                        : "bg-[#fff] text-[#333] border-[#e5e5e5] hover:border-[#333]"
                    }`}
                  >
                    {status === "ALL" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
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
                className="flex-1 px-4 py-3 text-[13px] bg-[#fff] border border-[#e5e5e5] rounded-[14px]"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full md:w-56 px-4 py-3 text-[11px] font-bold bg-[#fff] border border-[#e5e5e5] rounded-[14px] uppercase tracking-widest"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status === "ALL" ? "All Statuses" : status.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* EMPTY */}
        {data.length === 0 ? (
          <div className="bg-[#fff] border-2 border-dashed border-[#e5e5e5] rounded-[20px] p-20 text-center">
            <p className="text-[13px] font-bold opacity-40 uppercase tracking-widest">
              No interns found
            </p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="bg-[#fff] border border-[#e5e5e5] rounded-[20px] p-20 text-center">
            <p className="text-[13px] font-bold opacity-40 uppercase tracking-widest">
              No results match filters
            </p>
          </div>
        ) : (
          <div className="bg-[#fff] border border-[#e5e5e5] rounded-[20px] overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f9f9f9] border-b border-[#e5e5e5]">
                  <th className="p-5 text-[10px] uppercase opacity-40">Name</th>
                  <th className="p-5 text-[10px] uppercase opacity-40">Role</th>
                  <th className="p-5 text-[10px] uppercase opacity-40">Status</th>
                  <th className="p-5 text-[10px] uppercase opacity-40 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b border-[#e5e5e5] hover:bg-[#fafafa]"
                  >
                    <td className="p-5 font-bold">
                      {item?.student?.fullName || "—"}
                    </td>
                    <td className="p-5 text-[13px] opacity-70">
                      {item?.internship?.title || "—"}
                    </td>
                    <td className="p-5 whitespace-nowrap">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="p-5 text-right">
                      <button
                        onClick={() => navigate(`/company/intern/${item._id}`)}
                        className="px-5 py-2 bg-[#f9f9f9] border border-[#333] text-[10px] font-black uppercase rounded-[10px] hover:bg-[#111] hover:text-[#fff]"
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