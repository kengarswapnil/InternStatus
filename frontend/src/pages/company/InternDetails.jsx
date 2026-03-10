import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { useParams, useNavigate } from "react-router-dom";

export default function InternDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const res = await API.get(`/applications/${id}`);
      setData(res.data.data);

      const mentorRes = await API.get("/company/mentors");
      setMentors(mentorRes.data.data || []);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to load data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const assignMentor = async (mentorId) => {
    if (!mentorId) return;

    if (data.status !== "offer_accepted") {
      alert("Mentor can only be assigned before internship starts.");
      return;
    }

    try {
      setLoading(true);

      await API.patch(`/applications/${id}/assign-mentor`, {
        mentorId,
      });

      await fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Mentor assignment failed");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    let colorClass = "bg-white/10 text-white/80 border-white/20";
    if (status === "offer_accepted")
      colorClass = "bg-violet-500/20 text-violet-300 border-violet-500/30";
    else if (status === "ongoing")
      colorClass = "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30";
    else if (status === "completed")
      colorClass = "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
    else if (["terminated", "rejected"].includes(status))
      colorClass = "bg-red-500/10 text-red-400 border-red-500/20";

    return (
      <span
        className={`inline-block px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${colorClass}`}
      >
        {status.replace("_", " ")}
      </span>
    );
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0B0F19]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-white/10 border-t-fuchsia-500 rounded-full animate-spin"></div>
          <p className="text-fuchsia-400 font-bold tracking-widest uppercase text-[10px] animate-pulse m-0">
            Loading Details
          </p>
        </div>
      </div>
    );
  }

  const s = data.studentSnapshot || {};
  const mentorLocked = data.status !== "offer_accepted";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0F19] p-4 md:p-8 font-sans box-border text-white selection:bg-fuchsia-500/30 selection:text-fuchsia-200 relative overflow-hidden">
      {/* Ambient Backgrounds */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" aria-hidden="true"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" aria-hidden="true"></div>

      <div className="w-full max-w-3xl bg-white/5 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] border border-white/10 box-border relative z-10 transition-all duration-300 hover:border-white/20">
        
        <header className="mb-10 pb-6 border-b border-white/10 text-center md:text-left">
          <div className="text-[10px] font-bold text-violet-400 uppercase tracking-widest mb-2">
            Internship Record
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 m-0 tracking-tight">
            Intern Details
          </h2>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="flex flex-col gap-1.5 bg-[#0B0F19]/30 p-5 rounded-2xl border border-white/5 transition-all hover:border-white/10">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
              Name
            </span>
            <span className="text-sm font-bold text-white/90">
              {s.fullName}
            </span>
          </div>

          <div className="flex flex-col gap-1.5 bg-[#0B0F19]/30 p-5 rounded-2xl border border-white/5 transition-all hover:border-white/10">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
              Email
            </span>
            <span className="text-sm font-medium text-white/90 break-all">
              {s.email}
            </span>
          </div>

          <div className="flex flex-col gap-1.5 bg-[#0B0F19]/30 p-5 rounded-2xl border border-white/5 transition-all hover:border-white/10">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
              Phone
            </span>
            <span className="text-sm font-medium text-white/90">
              {s.phoneNo}
            </span>
          </div>

          <div className="flex flex-col gap-1.5 bg-[#0B0F19]/30 p-5 rounded-2xl border border-white/5 transition-all hover:border-white/10 justify-center items-start">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">
              Status
            </span>
            {getStatusBadge(data.status)}
          </div>
        </div>

        {["ongoing", "completed", "terminated"].includes(data.status) && (
          <div className="mb-10">
            <button
              onClick={() => navigate(`/company/interns/${id}/progress`)}
              className="w-full md:w-auto px-8 py-4 text-[10px] font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 border-none rounded-xl cursor-pointer transition-all duration-300 hover:shadow-[0_8px_20px_-6px_rgba(217,70,239,0.5)] hover:-translate-y-0.5 uppercase tracking-widest outline-none"
            >
              View Internship Progress
            </button>
          </div>
        )}

        <div className="h-px w-full bg-white/10 my-10"></div>

        <div className="flex flex-col gap-5">
          <h3 className="text-xl font-black text-white/90 m-0 tracking-tight">
            Assign Mentor
          </h3>

          <div className="flex flex-col gap-2 relative">
            <select
              className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none transition-all duration-300 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed box-border cursor-pointer appearance-none [&>option]:bg-[#0B0F19]"
              value={data.mentor?._id || ""}
              onChange={(e) => assignMentor(e.target.value)}
              disabled={loading || mentorLocked}
            >
              <option value="" disabled className="text-white/40">
                Select Mentor
              </option>
              {mentors.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.fullName}
                </option>
              ))}
            </select>
          </div>

          {mentorLocked && (
            <div className="mt-2 px-5 py-4 text-[11px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-xl uppercase tracking-widest leading-relaxed">
              Mentor assignment is locked after the internship starts.
            </div>
          )}

          {loading && (
            <div className="mt-2 flex items-center justify-center gap-3 text-[10px] font-bold text-fuchsia-400 uppercase tracking-widest bg-white/5 p-4 rounded-xl border border-white/10">
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              Assigning mentor...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}