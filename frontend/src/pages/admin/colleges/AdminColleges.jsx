import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../api/api";

export default function AdminColleges() {
  const navigate = useNavigate();

  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchColleges = async () => {
    try {
      const res = await API.get("/admin/colleges");
      setColleges(res.data?.data || []);
    } catch (err) {
      console.error("Fetch colleges error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, []);

  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";

      await API.patch(`/admin/colleges/${id}/status`, {
        status: newStatus,
      });

      fetchColleges();
    } catch (err) {
      console.error(err);
      alert("Status update failed");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0B0F19]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-white/10 border-t-fuchsia-500 rounded-full animate-spin"></div>
          <p className="text-fuchsia-400 font-medium tracking-widest uppercase text-xs animate-pulse m-0">
            Loading Colleges
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] p-4 md:p-8 font-sans text-white selection:bg-fuchsia-500/30 selection:text-fuchsia-200">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-6 mb-10 border-b border-white/10 pb-6">
          <h2 className="text-3xl md:text-4xl font-black m-0 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
            Colleges
          </h2>
          <button
            onClick={() => navigate("/admin/colleges/new")}
            className="px-8 py-3.5 text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 border-none rounded-xl cursor-pointer transition-all duration-300 hover:shadow-[0_8px_20px_-6px_rgba(217,70,239,0.5)] hover:-translate-y-0.5 whitespace-nowrap uppercase tracking-widest"
          >
            Add College
          </button>
        </header>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] overflow-hidden box-border transition-all duration-300 hover:border-white/20">
          <div className="overflow-x-auto bg-[#0B0F19]/30 shadow-inner">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-5 text-[10px] font-bold text-violet-400 uppercase tracking-widest">
                    Name
                  </th>
                  <th className="px-6 py-5 text-[10px] font-bold text-violet-400 uppercase tracking-widest">
                    Email Domain
                  </th>
                  <th className="px-6 py-5 text-[10px] font-bold text-violet-400 uppercase tracking-widest">
                    Website
                  </th>
                  <th className="px-6 py-5 text-[10px] font-bold text-violet-400 uppercase tracking-widest">
                    Status
                  </th>
                  <th className="px-6 py-5 text-[10px] font-bold text-violet-400 uppercase tracking-widest">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5">
                {colleges.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-12 text-center text-sm font-medium text-white/40"
                    >
                      No colleges found
                    </td>
                  </tr>
                )}

                {colleges.map((college) => (
                  <tr
                    key={college._id}
                    className="hover:bg-white/5 transition-colors duration-300 group"
                  >
                    <td className="px-6 py-5 text-sm font-bold text-white/90 group-hover:text-fuchsia-300 transition-colors">
                      {college.name}
                    </td>

                    <td className="px-6 py-5 text-sm text-white/70 font-medium">
                      {college.emailDomain || "—"}
                    </td>

                    <td className="px-6 py-5 text-xs text-fuchsia-400 font-medium tracking-wide">
                      {college.website || "—"}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`inline-block px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${
                          college.status === "active"
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                            : "bg-red-500/10 text-red-400 border-red-500/20 opacity-80"
                        }`}
                      >
                        {college.status}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex gap-3">
                        <button
                          onClick={() =>
                            navigate(`/admin/colleges/${college._id}`)
                          }
                          className="px-4 py-2 text-[10px] font-bold tracking-widest uppercase text-white/80 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer hover:-translate-y-0.5 outline-none"
                        >
                          View
                        </button>

                        <button
                          onClick={() =>
                            navigate(`/admin/colleges/edit/${college._id}`)
                          }
                          className="px-4 py-2 text-[10px] font-bold tracking-widest uppercase text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 border-none rounded-lg hover:shadow-[0_4px_15px_-3px_rgba(217,70,239,0.5)] transition-all duration-300 cursor-pointer hover:-translate-y-0.5 outline-none"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            toggleStatus(college._id, college.status)
                          }
                          className={`px-4 py-2 text-[10px] font-bold tracking-widest uppercase rounded-lg border transition-all duration-300 cursor-pointer hover:-translate-y-0.5 outline-none ${
                            college.status === "active"
                              ? "bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
                              : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20"
                          }`}
                        >
                          {college.status === "active"
                            ? "Deactivate"
                            : "Activate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}