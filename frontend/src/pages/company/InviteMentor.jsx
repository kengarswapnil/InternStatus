import React, { useState } from "react";
import API from "../../api/api";

export default function InviteMentor() {
  const [form, setForm] = useState({
    email: "",
    fullName: "",
    designation: "",
    department: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await API.post("/users/mentor/invite", form);
      alert("Mentor invited successfully. Setup email sent.");
      setForm({
        email: "",
        fullName: "",
        designation: "",
        department: "",
      });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to invite mentor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFFFF] p-4 md:p-6 font-['Nunito'] text-[#2D3436]">
      {/* Decorative Background Element for 'Stunning Vibe' */}
      <div className="absolute top-0 left-0 w-full h-1 bg-[#6C5CE7] opacity-20"></div>
      
      <div className="w-full max-w-lg bg-[#FFFFFF] p-8 md:p-12 rounded-[32px] shadow-[0_20px_50px_rgba(108,92,231,0.05)] border border-[#F5F6FA] box-border animate-in fade-in zoom-in-95 duration-700">
        
        <header className="mb-10 text-center relative">
          <div className="w-16 h-1 bg-[#6C5CE7] rounded-full mx-auto mb-6 opacity-80"></div>
          <h2 className="text-[30px] font-black m-0 tracking-tight text-[#2D3436]">
            Invite Mentor
          </h2>
          <p className="text-[13px] font-extrabold text-[#6C5CE7] m-0 mt-2 uppercase tracking-[0.2em] opacity-80">
            Organizational Access Request
          </p>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Full Name Field */}
          <div className="flex flex-col gap-2 group">
            <label className="text-[12px] font-black text-[#2D3436] opacity-40 uppercase tracking-widest ml-1 transition-opacity group-focus-within:opacity-100">
              Full Name
            </label>
            <input
              name="fullName"
              placeholder="e.g. Jonathan Doe"
              value={form.fullName}
              onChange={handleChange}
              required
              className="w-full px-5 py-4 text-[14px] text-[#2D3436] bg-[#F5F6FA] border-2 border-transparent rounded-2xl outline-none transition-all duration-300 focus:bg-white focus:border-[#6C5CE7]/30 focus:shadow-[0_0_0_4px_rgba(108,92,231,0.05)]"
            />
          </div>

          {/* Corporate Email Field */}
          <div className="flex flex-col gap-2 group">
            <label className="text-[12px] font-black text-[#2D3436] opacity-40 uppercase tracking-widest ml-1 transition-opacity group-focus-within:opacity-100">
              Corporate Email
            </label>
            <input
              name="email"
              type="email"
              placeholder="email@company.com"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-5 py-4 text-[14px] text-[#2D3436] bg-[#F5F6FA] border-2 border-transparent rounded-2xl outline-none transition-all duration-300 focus:bg-white focus:border-[#6C5CE7]/30 focus:shadow-[0_0_0_4px_rgba(108,92,231,0.05)]"
            />
          </div>

          {/* Designation & Department Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2 group">
              <label className="text-[12px] font-black text-[#2D3436] opacity-40 uppercase tracking-widest ml-1 transition-opacity group-focus-within:opacity-100">
                Designation
              </label>
              <input
                name="designation"
                placeholder="Senior Architect"
                value={form.designation}
                onChange={handleChange}
                className="w-full px-5 py-4 text-[14px] text-[#2D3436] bg-[#F5F6FA] border-2 border-transparent rounded-2xl outline-none transition-all duration-300 focus:bg-white focus:border-[#6C5CE7]/30"
              />
            </div>

            <div className="flex flex-col gap-2 group">
              <label className="text-[12px] font-black text-[#2D3436] opacity-40 uppercase tracking-widest ml-1 transition-opacity group-focus-within:opacity-100">
                Department
              </label>
              <input
                name="department"
                placeholder="Engineering"
                value={form.department}
                onChange={handleChange}
                className="w-full px-5 py-4 text-[14px] text-[#2D3436] bg-[#F5F6FA] border-2 border-transparent rounded-2xl outline-none transition-all duration-300 focus:bg-white focus:border-[#6C5CE7]/30"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-6 mt-2 border-t border-[#F5F6FA]">
            <button
              disabled={loading}
              className="w-full py-4 text-[13px] font-black text-[#FFFFFF] bg-[#6C5CE7] border-none rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-[0_10px_25px_rgba(108,92,231,0.3)] hover:-translate-y-0.5 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed uppercase tracking-[0.15em] flex items-center justify-center gap-3 outline-none shadow-lg shadow-[#6C5CE7]/20"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Send Invitation</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>

        <footer className="mt-8 text-center">
          <p className="text-[11px] font-bold text-[#2D3436] opacity-30 uppercase tracking-widest">
            Security Verified • Secure invitation system
          </p>
        </footer>
      </div>
    </div>
  );
}