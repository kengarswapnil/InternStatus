import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../api/api";
import AdminNavBar from "../../../components/navbars/AdminNavBar";

export default function AdminCompanies() {
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCompanies = async () => {
    try {
      const res = await API.get("/admin/companies");
      setCompanies(res.data?.data || []);
    } catch (err) {
      console.error("Fetch companies error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";

      await API.patch(`/admin/companies/${id}/status`, {
        status: newStatus,
      });

      fetchCompanies();
    } catch (err) {
      console.error(err);
      alert("Status update failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#FFFFFF] flex flex-col font-['Nunito'] transition-all duration-300">
        <main className="flex-grow flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#F5F6FA] border-t-[#6C5CE7] rounded-full animate-spin mb-4"></div>
          <p className="text-[#6C5CE7] font-black text-[14px] tracking-widest uppercase animate-pulse m-0">
            Syncing Partners...
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#2D3436] flex flex-col font-['Nunito'] pb-10 transition-colors duration-300">
      <main className="max-w-7xl mx-auto w-full px-4 md:px-8 py-8 flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* HEADER AREA */}
        <header className="flex flex-col sm:flex-row justify-between sm:items-end gap-6 border-b border-[#F5F6FA] pb-8">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-black text-[#2D3436] m-0 tracking-tighter leading-tight">
              Companies
            </h1>
            <p className="text-[14px] font-bold text-[#6C5CE7] m-0 uppercase tracking-[0.2em] opacity-80">
              Industry Partners
            </p>
          </div>
          <button
            onClick={() => navigate("/admin/companies/new")}
            className="px-8 py-3.5 text-[12px] font-black text-[#FFFFFF] bg-[#6C5CE7] border-none rounded-[16px] cursor-pointer hover:shadow-[0_10px_25px_-5px_rgba(108,92,231,0.4)] hover:-translate-y-1 active:scale-95 transition-all duration-300 uppercase tracking-widest shadow-md"
          >
            Add Company
          </button>
        </header>

        {/* DATA CONTAINER */}
        <div className="bg-[#FFFFFF] border border-[#F5F6FA] rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden box-border transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead className="bg-[#F5F6FA] bg-opacity-50 border-b border-[#F5F6FA]">
                <tr>
                  <th className="px-8 py-6 text-[11px] font-black text-[#2D3436] opacity-50 uppercase tracking-[0.15em]">
                    Name
                  </th>
                  <th className="px-8 py-6 text-[11px] font-black text-[#2D3436] opacity-50 uppercase tracking-[0.15em]">
                    Industry
                  </th>
                  <th className="px-8 py-6 text-[11px] font-black text-[#2D3436] opacity-50 uppercase tracking-[0.15em]">
                    Website
                  </th>
                  <th className="px-8 py-6 text-[11px] font-black text-[#2D3436] opacity-50 uppercase tracking-[0.15em]">
                    Status
                  </th>
                  <th className="px-8 py-6 text-[11px] font-black text-[#2D3436] opacity-50 uppercase tracking-[0.15em] text-center">
                    Management
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#F5F6FA]">
                {companies.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-2 opacity-30">
                        <p className="text-lg font-black uppercase tracking-widest m-0">
                          No companies found
                        </p>
                        <p className="text-sm font-bold m-0 tracking-tight">
                          Database registry is currently empty.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  companies.map((company) => (
                    <tr
                      key={company._id}
                      className="hover:bg-[#F5F6FA]/30 transition-all duration-300 group"
                    >
                      <td className="px-8 py-6">
                        <span className="text-[14px] font-black text-[#2D3436] group-hover:text-[#6C5CE7] transition-colors duration-300">
                          {company.name}
                        </span>
                      </td>

                      <td className="px-8 py-6">
                        <span className="text-[13px] font-bold text-[#2D3436] opacity-60">
                          {company.industry || "—"}
                        </span>
                      </td>

                      <td className="px-8 py-6">
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[13px] font-black text-[#6C5CE7] underline decoration-[#6C5CE7]/30 underline-offset-4 hover:decoration-[#6C5CE7] transition-all duration-300"
                        >
                          {company.website ? "Visit Portal" : "—"}
                        </a>
                      </td>

                      <td className="px-8 py-6">
                        <span
                          className={`inline-flex items-center px-3 py-1.5 rounded-[12px] text-[10px] font-black uppercase tracking-widest border transition-all duration-300 shadow-sm ${
                            company.status === "active"
                              ? "bg-[#2D3436] text-[#FFFFFF] border-[#2D3436]"
                              : "bg-[#FFFFFF] text-[#cc0000] border-[#cc0000]"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full mr-2 ${company.status === "active" ? "bg-emerald-400" : "bg-rose-500"}`}
                          ></span>
                          {company.status}
                        </span>
                      </td>

                      <td className="px-8 py-6">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() =>
                              navigate(`/admin/companies/${company._id}`)
                            }
                            className="px-4 py-2 text-[10px] font-black text-[#2D3436] uppercase tracking-widest bg-[#FFFFFF] border border-[#F5F6FA] rounded-[12px] hover:border-[#6C5CE7] hover:text-[#6C5CE7] hover:shadow-sm transition-all duration-300 cursor-pointer outline-none transform hover:-translate-y-0.5"
                          >
                            View
                          </button>

                          <button
                            onClick={() =>
                              navigate(`/admin/companies/edit/${company._id}`)
                            }
                            className="px-4 py-2 text-[10px] font-black text-[#FFFFFF] bg-[#6C5CE7] border border-[#6C5CE7] rounded-[12px] hover:shadow-lg hover:bg-opacity-90 transition-all duration-300 cursor-pointer outline-none transform hover:-translate-y-0.5"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              toggleStatus(company._id, company.status)
                            }
                            className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest border rounded-[12px] transition-all duration-300 cursor-pointer outline-none transform hover:-translate-y-0.5 shadow-sm ${
                              company.status === "active"
                                ? "bg-[#FFFFFF] border-[#cc0000] text-[#cc0000] hover:bg-[#cc0000] hover:text-[#FFFFFF] hover:shadow-rose-100"
                                : "bg-[#FFFFFF] border-[#008000] text-[#008000] hover:bg-[#008000] hover:text-[#FFFFFF] hover:shadow-emerald-100"
                            }`}
                          >
                            {company.status === "active"
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

        {/* SUMMARY FOOTER */}
        <footer className="flex justify-end mt-4">
          <div className="bg-[#F5F6FA] px-6 py-3 rounded-[16px] border border-transparent transition-all hover:border-[#6C5CE7]/20">
            <p className="text-[11px] font-black text-[#2D3436] opacity-40 uppercase tracking-widest m-0">
              Total Managed Entities:{" "}
              <span className="text-[#6C5CE7] opacity-100 text-[13px] ml-1">
                {companies.length}
              </span>
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
