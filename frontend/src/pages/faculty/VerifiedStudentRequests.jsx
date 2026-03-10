import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils/constants";

const VerifiedStudentRequests = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVerifiedStudents = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${BASE_URL}/api/faculty/verified-student-requests`,
          { withCredentials: true }
        );
        setStudents(res.data?.verifiedRequests || []);
      } catch (err) {
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchVerifiedStudents();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0B0F19]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-white/10 border-t-fuchsia-500 rounded-full animate-spin"></div>
          <p className="text-fuchsia-400 font-bold tracking-widest uppercase text-[10px] animate-pulse m-0">
            Indexing Verified Cohort
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] p-4 md:p-12 font-sans text-white selection:bg-violet-500/30 selection:text-violet-200 relative overflow-hidden">
      {/* Ambient Visuals */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" aria-hidden="true" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" aria-hidden="true" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/10 pb-8">
          <div>
            <div className="text-[10px] font-bold text-violet-400 uppercase tracking-[0.3em] mb-3">Authorized Directory</div>
            <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 m-0 tracking-tight">
              Verified Students
            </h2>
            <p className="text-white/40 text-sm md:text-base mt-3 m-0 tracking-wide font-medium">
              A curated database of vetted talent ready for industry interface.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl backdrop-blur-md flex items-center gap-4 shadow-xl">
            <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Active Database</span>
            <div className="h-6 w-px bg-white/10"></div>
            <span className="text-2xl font-black text-fuchsia-400 leading-none">{students.length}</span>
          </div>
        </header>

        {students.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-20 text-center shadow-inner">
            <p className="text-white/30 m-0 text-base font-medium italic tracking-wide">No verified student entities detected in the current partition.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {students.map((student) => (
              <div
                key={student._id}
                className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] hover:border-white/20 hover:bg-white/[0.08] transition-all duration-500 flex flex-col box-border overflow-hidden hover:-translate-y-2"
              >
                
                <div className="p-8 flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-8 gap-4">
                    <div className="flex flex-col gap-1">
                      <h3 className="text-xl font-bold text-white/90 group-hover:text-fuchsia-300 transition-colors tracking-tight">
                        {student.fullName}
                      </h3>
                      <p className="text-violet-400 text-[11px] font-black uppercase tracking-widest">
                        {student.course} <span className="text-white/20 mx-1">•</span> Year {student.year}
                      </p>
                    </div>

                    <span className="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                      VERIFIED
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-5 mb-8">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">PRN Core Matrix</span>
                      <span className="text-sm font-bold text-white/80 font-mono tracking-wider bg-[#0B0F19]/50 px-3 py-2 rounded-xl border border-white/5 w-fit">
                        {student.prn}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <span className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">Comm Channel</span>
                      <span className="text-sm font-medium text-white/70">{student.phone}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 mb-8">
                    <span className="text-[9px] font-bold text-fuchsia-400/70 uppercase tracking-[0.2em]">
                      Tech Stack
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {student.skills?.length > 0 ? (
                        student.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-white/20 italic">No skills documented</span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 mt-auto">
                    <span className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">
                      Professional Bio
                    </span>
                    <p className="text-white/50 text-xs leading-relaxed line-clamp-3 m-0 italic group-hover:text-white/70 transition-colors">
                      {student.bio ? `"${student.bio}"` : "No dossier summary provided."}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-6 border-t border-white/5 bg-white/[0.02] mt-auto">
                  <a
                    href={student.resumeFileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 text-center bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-[11px] font-black py-3 rounded-xl hover:shadow-[0_8px_20px_-6px_rgba(217,70,239,0.5)] transition-all duration-300 block no-underline uppercase tracking-widest"
                  >
                    View Resume
                  </a>

                  <a
                    href={student.collegeIdImageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 text-center bg-white/5 border border-white/10 text-white/80 text-[11px] font-black py-3 rounded-xl hover:bg-white/10 transition-all duration-300 block no-underline uppercase tracking-widest"
                  >
                    ID Credentials
                  </a>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifiedStudentRequests;