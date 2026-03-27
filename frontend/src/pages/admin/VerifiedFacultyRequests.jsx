import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils/constants";
import AdminNavBar from "../../components/navbars/AdminNavBar";

const VerifiedFacultyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchVerifiedRequests = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${BASE_URL}/api/admin/verified-faculty-requests`,
        { withCredentials: true },
      );

      setRequests(res.data.verifiedRequests || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to fetch verified faculty requests",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifiedRequests();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#FFFFFF] font-['Nunito'] flex flex-col box-border transition-all duration-300">
        <AdminNavBar />
        <main className="w-full flex-grow flex flex-col items-center justify-center px-4">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-[#F5F6FA] border-t-[#6C5CE7] rounded-full animate-spin"></div>
            <p className="text-[#6C5CE7] font-black tracking-widest uppercase text-[10px] animate-pulse m-0">
              Loading Verified Faculty
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-[#FFFFFF] font-['Nunito'] flex flex-col box-border transition-all duration-300">
        <AdminNavBar />
        <main className="w-full max-w-7xl mx-auto flex-grow px-4 md:px-8 py-10 flex items-center justify-center">
          <div className="px-6 py-4 text-[11px] font-black text-rose-600 bg-rose-50 border border-rose-200 rounded-[14px] uppercase tracking-widest shadow-sm animate-pulse">
            {error}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#FFFFFF] font-['Nunito'] flex flex-col box-border text-[#2D3436] transition-all duration-300 relative overflow-hidden">
      <div className="relative z-10 flex flex-col min-h-screen">
        <AdminNavBar />

        <main className="w-full max-w-7xl mx-auto flex-grow px-4 md:px-8 py-10 md:py-16 max-w-[100vw]">
          <div className="mb-10 border-b border-[#F5F6FA] pb-6 animate-fade-in-up">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[#6C5CE7] mb-3 mt-0">
              Verified Faculty
            </h2>
            <p className="text-[#2D3436] opacity-60 font-bold text-sm md:text-base m-0 tracking-wide">
              List of approved and verified faculty members
            </p>
          </div>

          {requests.length === 0 ? (
            <div className="bg-[#F5F6FA] border border-transparent rounded-[24px] p-16 text-center shadow-inner animate-fade-in-up">
              <p className="text-[#2D3436] opacity-60 m-0 text-[13px] font-black uppercase tracking-widest">
                No verified faculty found
              </p>
            </div>
          ) : (
            <div className="bg-[#FFFFFF] border border-[#F5F6FA] rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(108,92,231,0.08)] overflow-hidden box-border transition-all duration-500 w-full max-w-full animate-fade-in-up">
              <div className="overflow-x-auto bg-[#FFFFFF] custom-scrollbar w-full">
                <table className="w-full text-left border-collapse whitespace-nowrap min-w-max">
                  <thead className="bg-[#F5F6FA] border-b border-[#E5E5E5]">
                    <tr>
                      <th className="px-6 py-5 text-[10px] font-black text-[#6C5CE7] uppercase tracking-widest">
                        Name
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black text-[#6C5CE7] uppercase tracking-widest">
                        Email
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black text-[#6C5CE7] uppercase tracking-widest">
                        College
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black text-[#6C5CE7] uppercase tracking-widest">
                        Document
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black text-[#6C5CE7] uppercase tracking-widest">
                        Verified At
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black text-[#6C5CE7] uppercase tracking-widest">
                        Verified By
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#F5F6FA]">
                    {requests.map((req) => (
                      <tr
                        key={req._id}
                        className="hover:bg-[#F5F6FA] transition-colors duration-300 group cursor-default"
                      >
                        <td className="px-6 py-5 align-middle font-black text-[#2D3436] text-sm group-hover:text-[#6C5CE7] transition-colors">
                          {req.requesterName}
                        </td>

                        <td className="px-6 py-5 align-middle font-bold text-[#2D3436] opacity-60 text-xs tracking-wide">
                          {req.requesterEmail}
                        </td>

                        <td className="px-6 py-5 align-middle font-black text-[#2D3436] opacity-80 text-sm">
                          {req.college?.name}
                        </td>

                        <td className="px-6 py-5 align-middle">
                          {req.verificationDocumentUrl ? (
                            <a
                              href={req.verificationDocumentUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-block px-4 py-2 rounded-[12px] bg-[#FFFFFF] border border-[#F5F6FA] text-[#6C5CE7] font-black text-[10px] uppercase tracking-widest hover:border-[#6C5CE7] hover:shadow-sm transition-all duration-300 no-underline cursor-pointer outline-none transform hover:-translate-y-0.5"
                            >
                              View Doc
                            </a>
                          ) : (
                            <span className="inline-block px-3 py-1.5 rounded-[12px] text-[10px] font-black uppercase tracking-widest bg-[#F5F6FA] border border-transparent text-[#2D3436] opacity-40 shadow-sm">
                              Not provided
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-5 align-middle text-[#2D3436] opacity-60 font-bold text-xs tracking-wide">
                          {req.verifiedAt
                            ? new Date(req.verifiedAt).toLocaleDateString(
                                undefined,
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                },
                              )
                            : "—"}
                        </td>

                        <td className="px-6 py-5 align-middle">
                          <span className="inline-block px-3 py-1.5 rounded-[12px] text-[10px] font-black uppercase tracking-widest bg-emerald-50 border border-emerald-200 text-emerald-600 shadow-sm">
                            {req.verifiedBy?.name || "Admin"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default VerifiedFacultyRequests;
