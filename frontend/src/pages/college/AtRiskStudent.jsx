import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/api";

const AtRiskStudent = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  // ---------------- FETCH STUDENT ----------------
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/college/at-risk/${studentId}`);
        const data = res.data.data;
        setStudent(data);

        setMessage(
          `Hi ${data.name},\n\nWe noticed you haven't applied for any internships yet.\n\nPlease log in to InternStatus and apply as soon as possible.\n\nIf you need help, contact your faculty.\n\n- College Team`
        );
      } catch (err) {
        setError("Failed to load student");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [studentId]);

  // ---------------- SEND NOTIFICATION ----------------
  const handleSend = async () => {
    try {
      setSending(true);
      await API.post("/college/at-risk/notify", {
        studentId,
        message
      });
      alert("Notification sent successfully");
      navigate("/college/at-risk");
    } catch (err) {
      console.error(err);
      alert("Failed to send notification");
    } finally {
      setSending(false);
    }
  };

  // ---------------- UI ----------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFFFF] font-['Nunito']">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#F5F6FA] border-t-[#6C5CE7] rounded-full animate-spin"></div>
          <p className="text-[#2D3436] font-bold animate-pulse">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFFFF] font-['Nunito']">
        <div className="bg-red-50 p-6 rounded-2xl border border-red-100 text-center">
          <p className="text-red-600 font-bold text-lg">{error || "Student not found"}</p>
          <button onClick={() => navigate(-1)} className="mt-4 text-[#6C5CE7] font-bold underline">Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF] p-4 md:p-8 font-['Nunito'] text-[#2D3436]">
      <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* BACK NAVIGATION */}
        <button 
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-gray-400 hover:text-[#6C5CE7] transition-colors font-bold text-sm group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
          </svg>
          Back to List
        </button>

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Intervention <span className="text-[#6C5CE7]">Panel</span>
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Personalize your outreach to re-engage {student.name.split(' ')[0]}
          </p>
        </div>

        {/* STUDENT INFO CARD */}
        <div className="bg-[#F5F6FA] border border-transparent rounded-[24px] p-6 mb-6 relative overflow-hidden group hover:border-[#6C5CE7]/20 transition-all duration-500 shadow-sm">
          {/* Decorative Circle */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#6C5CE7]/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
          
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-[#6C5CE7] text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#6C5CE7]/20">
                  Student Profile
                </span>
              </div>
              <h2 className="text-2xl font-black text-[#2D3436]">{student.name}</h2>
              <p className="text-[#6C5CE7] font-bold text-sm">{student.email}</p>
            </div>

            <div className="bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-white space-y-2 min-w-[200px]">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400 font-bold uppercase">Course</span>
                <span className="font-black">{student.courseName || "N/A"}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400 font-bold uppercase">Year</span>
                <span className="font-black">{student.year || "N/A"}</span>
              </div>
              <div className="flex justify-between text-xs border-t border-gray-100 pt-2 mt-2">
                <span className="text-red-500 font-black uppercase tracking-tighter italic">Warning: {student.reason}</span>
              </div>
            </div>
          </div>
        </div>

        {/* MESSAGE BOX */}
        <div className="bg-white border-2 border-[#F5F6FA] rounded-[32px] p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(108,92,231,0.05)] transition-all duration-500">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-6 bg-[#6C5CE7] rounded-full"></div>
            <h3 className="text-lg font-black text-[#2D3436]">Compose Notification</h3>
          </div>

          <div className="relative group">
            <label className="absolute -top-2.5 left-5 bg-white px-2 text-[10px] font-black text-[#6C5CE7] uppercase tracking-widest z-10">
              Communication Content
            </label>
            <textarea
              className="w-full bg-[#F5F6FA] border-2 border-transparent rounded-2xl p-5 h-56 text-sm font-semibold text-[#2D3436] focus:outline-none focus:border-[#6C5CE7]/30 focus:bg-white transition-all duration-300 resize-none shadow-inner"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
            />
          </div>

          {/* ACTION BUTTONS */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-400 font-medium max-w-[250px]">
              This message will be sent via <span className="text-[#6C5CE7] font-bold">In-App Notification</span> and Email.
            </p>
            
            <button
              onClick={handleSend}
              disabled={sending}
              className="w-full sm:w-auto bg-[#6C5CE7] hover:bg-[#5b4cc4] text-white px-10 py-4 rounded-2xl text-sm font-black transition-all duration-300 transform hover:scale-[1.03] active:scale-95 shadow-xl shadow-[#6C5CE7]/30 flex items-center justify-center gap-3 disabled:opacity-50 disabled:transform-none"
            >
              {sending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Dispatching...
                </>
              ) : (
                <>
                  Send Notification
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AtRiskStudent;