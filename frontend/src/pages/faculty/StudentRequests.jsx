import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils/constants";

const StudentRequests = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/faculty/pending-student-requests`,
        { withCredentials: true }
      );
      setStudents(res.data.pendingRequests || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load student requests"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateRequestStatus = async (id, status) => {
    try {
      setActionLoading(id);

      await axios.post(
        `${BASE_URL}/api/faculty/student/${id}/${status}`,
        {},
        { withCredentials: true }
      );

      setStudents((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0B0F19]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-white/10 border-t-fuchsia-500 rounded-full animate-spin"></div>
          <p className="text-fuchsia-400 font-bold tracking-widest uppercase text-[10px] animate-pulse m-0">
            Scanning Student Uplinks
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0F19] p-4 font-sans box-border text-white">
        <div className="w-full max-w-md px-6 py-4 text-[11px] font-bold text-red-300 bg-red-500/10 border border-red-500/30 rounded-xl uppercase tracking-widest text-center shadow-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] p-4 md:p-12 font-sans text-white selection:bg-violet-500/30 selection:text-violet-200 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" aria-hidden="true" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" aria-hidden="true" />

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-12 border-b border-white/10 pb-8 text-center md:text-left">
          <div className="text-[10px] font-bold text-violet-400 uppercase tracking-[0.3em] mb-3">Verification Terminal</div>
          <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 m-0 tracking-tight">
            Pending Requests
          </h1>
          <p className="text-white/40 text-sm md:text-base mt-3 m-0 tracking-wide font-medium">
            Review and authorize incoming student entities for the institutional roster.
          </p>
        </header>

        {students.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-20 text-center shadow-inner">
            <p className="text-white/30 m-0 text-base font-medium italic tracking-wide">No pending student uplinks detected.</p>
          </div>
        ) : (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] overflow-hidden transition-all duration-300 hover:border-white/20">
            <div className="overflow-x-auto no-scrollbar bg-[#0B0F19]/30">
              <table className="w-full text-left border-collapse whitespace-nowrap min-w-max">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-5 text-[10px] font-bold text-violet-400 uppercase tracking-widest">Candidate</th>
                    <th className="px-6 py-5 text-[10px] font-bold text-violet-400 uppercase tracking-widest">PRN Matrix</th>
                    <th className="px-6 py-5 text-[10px] font-bold text-violet-400 uppercase tracking-widest">Course / Entity</th>
                    <th className="px-6 py-5 text-[10px] font-bold text-violet-400 uppercase tracking-widest">Level</th>
                    <th className="px-6 py-5 text-[10px] font-bold text-violet-400 uppercase tracking-widest text-center">Dossier</th>
                    <th className="px-6 py-5 text-[10px] font-bold text-violet-400 uppercase tracking-widest">Submitted</th>
                    <th className="px-6 py-5 text-[10px] font-bold text-violet-400 uppercase tracking-widest text-right">Auth</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {students.map((s) => (
                    <tr key={s._id} className="hover:bg-white/5 transition-colors duration-300 group">
                      <td className="px-6 py-5">
                        <div className="text-sm font-bold text-white/90 group-hover:text-fuchsia-300 transition-colors">{s.fullName}</div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-xs text-white/40 font-mono tracking-wider">{s.prn}</div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-xs text-white/80 font-medium">{s.course}</div>
                        <div className="text-[10px] text-white/30 uppercase mt-1 tracking-tight">{s.college?.name || "—"}</div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-xs font-black text-fuchsia-400 uppercase tracking-tighter">Year {s.year}</div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex justify-center items-center gap-3">
                          {s.collegeIdImageUrl && (
                            <a
                              href={s.collegeIdImageUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/70 font-bold text-[9px] uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all no-underline"
                            >
                              ID CARD
                            </a>
                          )}
                          {s.resumeFileUrl && (
                            <a
                              href={s.resumeFileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/30 text-violet-300 font-bold text-[9px] uppercase tracking-widest hover:bg-violet-500/20 transition-all no-underline"
                            >
                              RESUME
                            </a>
                          )}
                          {!s.collegeIdImageUrl && !s.resumeFileUrl && (
                            <span className="text-white/20 text-[10px] italic">Void</span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-[11px] text-white/40 font-medium">
                          {new Date(s.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-3">
                          <button
                            disabled={actionLoading === s._id}
                            onClick={() => updateRequestStatus(s._id, "approved")}
                            className="px-5 py-2.5 text-[10px] font-black text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-lg hover:shadow-[0_4px_15px_-3px_rgba(217,70,239,0.5)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest outline-none hover:-translate-y-0.5 border-none"
                          >
                            {actionLoading === s._id ? "..." : "Approve"}
                          </button>
                          <button
                            disabled={actionLoading === s._id}
                            onClick={() => updateRequestStatus(s._id, "rejected")}
                            className="px-5 py-2.5 text-[10px] font-black text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest outline-none hover:-translate-y-0.5"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentRequests;