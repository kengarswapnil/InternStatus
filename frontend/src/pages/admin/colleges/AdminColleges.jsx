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
      <div className="flex items-center justify-center min-h-screen bg-[#FFFFFF] font-['Nunito']">
        <div className="flex flex-col items-center gap-4 animate-in fade-in duration-700">
          <div className="w-12 h-12 border-4 border-[#F5F6FA] border-t-[#6C5CE7] rounded-full animate-spin"></div>
          <p className="text-[#6C5CE7] font-black tracking-widest uppercase text-[11px] animate-pulse m-0">
            Syncing Institution Data
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF] p-4 md:p-10 font-['Nunito'] text-[#2D3436] selection:bg-[#6C5CE7]/20 selection:text-[#6C5CE7]">
      <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* HEADER SECTION */}
        <header className="flex flex-col sm:flex-row justify-between sm:items-end gap-6 mb-12 border-b border-[#F5F6FA] pb-8">
          <div className="space-y-1">
            <h2 className="text-4xl md:text-5xl font-black m-0 tracking-tighter text-[#2D3436] uppercase">
              Colleges
            </h2>
            <p className="text-[13px] font-bold text-[#2D3436] opacity-50 uppercase tracking-[0.2em]">
              Directory Management Portal
            </p>
          </div>
          <button
            onClick={() => navigate("/admin/colleges/new")}
            className="px-8 py-4 text-[12px] font-black text-[#FFFFFF] bg-[#6C5CE7] border border-[#6C5CE7] rounded-[16px] cursor-pointer transition-all duration-300 hover:shadow-[0_10px_25px_-5px_rgba(108,92,231,0.4)] hover:-translate-y-1 active:scale-95 whitespace-nowrap uppercase tracking-[0.15em] shadow-md"
          >
            Add College
          </button>
        </header>

        {/* DATA TABLE CONTAINER */}
        <div className="bg-[#FFFFFF] border border-[#F5F6FA] rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden box-border transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead className="bg-[#F5F6FA] bg-opacity-50">
                <tr>
                  <th className="px-8 py-6 text-[11px] font-black text-[#2D3436] opacity-60 uppercase tracking-[0.15em]">
                    Institution Name
                  </th>
                  <th className="px-8 py-6 text-[11px] font-black text-[#2D3436] opacity-60 uppercase tracking-[0.15em]">
                    Whitelisted Domain
                  </th>
                  <th className="px-8 py-6 text-[11px] font-black text-[#2D3436] opacity-60 uppercase tracking-[0.15em]">
                    Official Website
                  </th>
                  <th className="px-8 py-6 text-[11px] font-black text-[#2D3436] opacity-60 uppercase tracking-[0.15em]">
                    Status
                  </th>
                  <th className="px-8 py-6 text-[11px] font-black text-[#2D3436] opacity-60 uppercase tracking-[0.15em] text-right">
                    Management
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#F5F6FA]">
                {colleges.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-2 opacity-30">
                        <p className="text-lg font-black uppercase tracking-widest">
                          No colleges found
                        </p>
                        <p className="text-sm font-bold">
                          Database registry is currently empty.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  colleges.map((college) => (
                    <tr
                      key={college._id}
                      className="hover:bg-[#F5F6FA]/30 transition-all duration-300 group"
                    >
                      <td className="px-8 py-6">
                        <span className="text-[14px] font-black text-[#2D3436] group-hover:text-[#6C5CE7] transition-colors duration-300">
                          {college.name}
                        </span>
                      </td>

                      <td className="px-8 py-6">
                        <span className="text-[13px] text-[#2D3436] opacity-70 font-bold font-mono">
                          {college.emailDomain || "—"}
                        </span>
                      </td>

                      <td className="px-8 py-6">
                        <span className="text-[13px] text-[#2D3436] opacity-70 font-bold tracking-tight">
                          {college.website || "—"}
                        </span>
                      </td>

                      <td className="px-8 py-6">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-[10px] text-[10px] font-black uppercase tracking-widest border transition-all duration-300 ${
                            college.status === "active"
                              ? "bg-[#f0fdf4] text-[#166534] border-[#bbf7d0] shadow-sm"
                              : "bg-[#fef2f2] text-[#991b1b] border-[#fecaca] shadow-sm"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full mr-2 ${college.status === "active" ? "bg-[#166534]" : "bg-[#991b1b]"}`}
                          ></span>
                          {college.status}
                        </span>
                      </td>

                      <td className="px-8 py-6">
                        <div className="flex gap-3 justify-end items-center">
                          <button
                            onClick={() =>
                              navigate(`/admin/colleges/${college._id}`)
                            }
                            className="px-5 py-2.5 text-[10px] font-black tracking-widest uppercase text-[#2D3436] bg-[#FFFFFF] border border-[#F5F6FA] rounded-[12px] hover:bg-[#FFFFFF] hover:border-[#6C5CE7] hover:text-[#6C5CE7] hover:shadow-md transition-all duration-300 cursor-pointer hover:-translate-y-0.5 outline-none"
                          >
                            View
                          </button>

                          <button
                            onClick={() =>
                              navigate(`/admin/colleges/edit/${college._id}`)
                            }
                            className="px-5 py-2.5 text-[10px] font-black tracking-widest uppercase text-[#FFFFFF] bg-[#6C5CE7] border border-[#6C5CE7] rounded-[12px] transition-all duration-300 cursor-pointer hover:shadow-lg hover:bg-opacity-90 hover:-translate-y-0.5 outline-none"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              toggleStatus(college._id, college.status)
                            }
                            className={`px-5 py-2.5 text-[10px] font-black tracking-widest uppercase rounded-[12px] border transition-all duration-300 cursor-pointer hover:-translate-y-0.5 outline-none ${
                              college.status === "active"
                                ? "bg-[#FFFFFF] border-[#fecaca] text-[#991b1b] hover:bg-[#fef2f2] hover:shadow-md"
                                : "bg-[#FFFFFF] border-[#bbf7d0] text-[#166534] hover:bg-[#f0fdf4] hover:shadow-md"
                            }`}
                          >
                            {college.status === "active"
                              ? "Deactivate"
                              : "Activate"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* FOOTER STATS */}
        <footer className="mt-8 flex justify-end">
          <div className="bg-[#F5F6FA] px-6 py-3 rounded-2xl">
            <p className="text-[11px] font-black text-[#2D3436] opacity-40 uppercase tracking-widest m-0">
              Total Managed Institutions:{" "}
              <span className="text-[#6C5CE7] opacity-100">
                {colleges.length}
              </span>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
