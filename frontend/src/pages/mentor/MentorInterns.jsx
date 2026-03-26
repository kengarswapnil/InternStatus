import { useEffect, useState } from "react";
import API from "../../api/api";
import { useNavigate } from "react-router-dom";

const STATUS_BUTTONS = ["ALL", "ongoing", "completed", "terminated"];

const MentorInterns = () => {
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ongoing"); // DEFAULT = ongoing
  const [modeFilter, setModeFilter] = useState("ALL");

  const navigate = useNavigate();

  const fetchInterns = async () => {
    try {
      const res = await API.get("/mentor/interns");
      setInterns(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch interns", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.patch(`/mentor/interns/${id}/status`, { status });
      fetchInterns();
    } catch (err) {
      console.error("Status update failed", err);
    }
  };

  useEffect(() => {
    fetchInterns();
  }, []);

  const filteredInterns = interns.filter((intern) => {
    const matchesSearch =
      intern.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intern.studentEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || intern.status === statusFilter;
    const matchesMode = modeFilter === "ALL" || intern.mode === modeFilter;
    return matchesSearch && matchesStatus && matchesMode;
  });

  const uniqueModes = [
    "ALL",
    ...new Set(interns.map((i) => i.mode).filter(Boolean)),
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f9f9f9] flex items-center justify-center font-sans">
        <p className="text-[14px] font-bold text-[#333] animate-pulse m-0">
          Syncing Intern Cohort...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-[#333] font-sans pb-10">
      <main className="max-w-7xl mx-auto w-full px-4 md:px-6 py-6 flex flex-col gap-6">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#e5e5e5] pb-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-[23px] font-black text-[#333] m-0 tracking-tight leading-tight">
              My Interns
            </h1>
            <p className="text-[13px] font-bold text-[#333] opacity-60 m-0 uppercase tracking-widest">
              Active Mentorship Roster
            </p>
          </div>
          <div className="text-[11px] font-black text-[#111] bg-[#fff] border border-[#e5e5e5] px-3 py-1.5 rounded-[10px] uppercase tracking-widest">
            Total Interns: {interns.length}
          </div>
        </header>

        {interns.length > 0 && (
          <div className="flex flex-col gap-3">

            {/* PRIMARY: Quick Status Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {STATUS_BUTTONS.map((status) => {
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

            {/* SECONDARY: Search + Mode Filter */}
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                placeholder="Search by intern name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-3 text-[13px] bg-[#fff] border border-[#e5e5e5] rounded-[14px] outline-none focus:border-[#333] transition-colors"
              />
              <select
                value={modeFilter}
                onChange={(e) => setModeFilter(e.target.value)}
                className="w-full md:w-56 px-4 py-3 text-[11px] font-bold text-[#333] bg-[#fff] border border-[#e5e5e5] rounded-[14px] outline-none focus:border-[#333] transition-colors appearance-none uppercase tracking-widest"
              >
                {uniqueModes.map((mode) => (
                  <option key={mode} value={mode}>
                    {mode === "ALL"
                      ? "All Work Modes"
                      : mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {interns.length === 0 ? (
          <div className="bg-[#fff] border-2 border-dashed border-[#e5e5e5] rounded-[20px] p-20 text-center">
            <p className="text-[13px] font-bold text-[#333] opacity-40 m-0 uppercase tracking-widest">
              No interns assigned to your profile
            </p>
          </div>
        ) : filteredInterns.length === 0 ? (
          <div className="bg-[#fff] border border-[#e5e5e5] rounded-[20px] p-20 text-center">
            <p className="text-[13px] font-bold text-[#333] opacity-40 m-0 uppercase tracking-widest">
              No interns match your current filters
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("ongoing");
                setModeFilter("ALL");
              }}
              className="mt-4 px-4 py-2 bg-[#f9f9f9] border border-[#e5e5e5] text-[#333] text-[10px] font-black uppercase tracking-widest rounded-[10px] hover:border-[#333] transition-colors cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="bg-[#fff] border border-[#e5e5e5] rounded-[20px] shadow-sm overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="border-b border-[#e5e5e5] bg-[#f9f9f9]">
                  <th className="p-5 text-[10px] font-bold opacity-40 uppercase tracking-widest">
                    Name & Details
                  </th>
                  <th className="p-5 text-[10px] font-bold opacity-40 uppercase tracking-widest">
                    Program
                  </th>
                  <th className="p-5 text-[10px] font-bold opacity-40 uppercase tracking-widest">
                    Timeline
                  </th>
                  <th className="p-5 text-[10px] font-bold opacity-40 uppercase tracking-widest">
                    Status
                  </th>
                  <th className="p-5 text-[10px] font-bold opacity-40 uppercase tracking-widest">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredInterns.map((intern) => (
                  <tr
                    key={intern.applicationId}
                    className="border-b border-[#e5e5e5] last:border-none hover:bg-[#fafafa] transition-colors"
                  >
                    <td className="p-5">
                      <div className="flex flex-col">
                        <span className="text-[15px] font-black text-[#333] m-0 leading-tight">
                          {intern.studentName}
                        </span>
                        <span className="text-[12px] font-bold text-[#333] opacity-50 mt-1">
                          {intern.studentEmail}
                        </span>
                      </div>
                    </td>

                    <td className="p-5">
                      <div className="flex flex-col">
                        <span className="text-[13px] font-bold text-[#333] leading-tight">
                          {intern.internshipTitle}
                        </span>
                        <span className="text-[11px] font-bold text-[#333] opacity-50 mt-1">
                          {intern.mode} • {intern.location}
                        </span>
                      </div>
                    </td>

                    <td className="p-5">
                      <span className="text-[12px] font-mono font-bold text-[#111] uppercase">
                        {intern.startDate
                          ? new Date(intern.startDate).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                            })
                          : "—"}
                        <span className="mx-2 opacity-30">/</span>
                        {intern.endDate
                          ? new Date(intern.endDate).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                            })
                          : "Ongoing"}
                      </span>
                    </td>

                    <td className="p-5">
                      <span className="px-3 py-1.5 rounded-[10px] text-[9px] font-black uppercase tracking-widest bg-[#f9f9f9] border border-[#e5e5e5]">
                        {intern.status}
                      </span>
                    </td>

                    <td className="p-5">
                      <div className="flex flex-wrap gap-2 items-center">
                        {intern.status === "offer_accepted" && (
                          <button
                            onClick={() => updateStatus(intern.applicationId, "ongoing")}
                            className="px-4 py-2 bg-[#111] text-[#fff] text-[11px] font-bold rounded-[10px] border-none cursor-pointer uppercase tracking-widest hover:opacity-80 transition-opacity"
                          >
                            Start
                          </button>
                        )}

                        {intern.status === "ongoing" && (
                          <>
                            <button
                              onClick={() => updateStatus(intern.applicationId, "completed")}
                              className="px-4 py-2 bg-[#111] text-[#fff] text-[11px] font-bold rounded-[10px] border-none cursor-pointer uppercase tracking-widest hover:opacity-80 transition-opacity"
                            >
                              Complete
                            </button>
                            <button
                              onClick={() => updateStatus(intern.applicationId, "terminated")}
                              className="px-4 py-2 bg-[#fff] border border-[#cc0000] text-[#cc0000] text-[11px] font-bold rounded-[10px] cursor-pointer uppercase tracking-widest hover:bg-[#cc0000] hover:text-[#fff] transition-colors"
                            >
                              Terminate
                            </button>
                          </>
                        )}

                        {intern.status === "completed" &&
                          intern.report &&
                          intern.report.status !== "generated" && (
                            <button
                              onClick={() => window.open(intern.report.reportUrl, "_blank")}
                              className="px-4 py-2 bg-[#f9f9f9] border border-[#333] text-[#333] text-[11px] font-bold rounded-[10px] cursor-pointer uppercase tracking-widest hover:bg-[#333] hover:text-[#fff] transition-all"
                            >
                              Report
                            </button>
                          )}

                        <button
                          onClick={() => navigate(`/mentor/intern/${intern.applicationId}/track`)}
                          className="px-4 py-2 bg-[#f9f9f9] border border-[#e5e5e5] text-[#333] text-[11px] font-bold rounded-[10px] cursor-pointer uppercase tracking-widest hover:border-[#333] transition-colors"
                        >
                          Track Task
                        </button>
                      </div>
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
};

export default MentorInterns;