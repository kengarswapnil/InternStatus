import React, { useEffect, useState } from "react";
import API from "../../api/api";

export default function CollegeRegister() {
  const [colleges, setColleges] = useState([]);
  const [form, setForm] = useState({
    requesterName: "",
    requesterEmail: "",
    requesterPhone: "",
    selectedCollege: "",
    collegeName: "",
    location: "",
    website: "",
    emailDomain: "",
    verificationDocument: null,
  });

  const [loading, setLoading] = useState(false);
  const [isOther, setIsOther] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const res = await API.get("/college/list");
        setColleges(res.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchColleges();
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "verificationDocument") {
      setForm((prev) => ({ ...prev, verificationDocument: files[0] }));
      return;
    }
    if (name === "selectedCollege") {
      if (value === "other") {
        setIsOther(true);
        setForm((prev) => ({ ...prev, selectedCollege: "", collegeName: "" }));
      } else {
        setIsOther(false);
        setForm((prev) => ({ ...prev, selectedCollege: value }));
      }
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      setLoading(true);
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (form[key]) formData.append(key, form[key]);
      });
      if (isOther) formData.append("collegeName", form.collegeName);

      await API.post("/onboarding/college", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Request submitted successfully. Please wait for admin approval.");
      setForm({
        requesterName: "", requesterEmail: "", requesterPhone: "",
        selectedCollege: "", collegeName: "", location: "",
        website: "", emailDomain: "", verificationDocument: null,
      });
      setIsOther(false);
    } catch (err) {
      setError(err.response?.data?.message || "Error submitting request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#FFFFFF] p-4 sm:p-6 md:p-12 font-['Nunito'] text-[#2D3436] selection:bg-[#6C5CE7]/20">
      {/* Main Container */}
      <div className="w-full max-w-3xl bg-white p-6 sm:p-10 md:p-16 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(108,92,231,0.15)] border border-[#F5F6FA] transform transition-all hover:shadow-[0_30px_70px_-10px_rgba(108,92,231,0.2)] animate-in fade-in zoom-in duration-700">
        
        {/* Header Section */}
        <header className="mb-12 text-center space-y-3">
          <div className="inline-block px-4 py-1.5 mb-2 bg-[#6C5CE7]/10 rounded-full">
            <p className="text-[11px] font-black text-[#6C5CE7] uppercase tracking-[0.25em]">
              Institutional Access
            </p>
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-[#2D3436]">
            Register <span className="text-[#6C5CE7]">College</span>
          </h2>
          <p className="text-sm text-[#2D3436]/60 font-medium max-w-xs mx-auto">
            Join the digital ecosystem to streamline internships and NEP compliance.
          </p>
        </header>

        {/* Feedback Messages */}
        <div className="space-y-4 mb-8">
          {error && (
            <div className="px-6 py-4 text-sm font-bold text-red-600 bg-red-50/50 border border-red-100 rounded-2xl text-center animate-in slide-in-from-top-4 duration-300">
              {error}
            </div>
          )}
          {success && (
            <div className="px-6 py-4 text-sm font-bold text-[#6C5CE7] bg-[#6C5CE7]/5 border border-[#6C5CE7]/20 rounded-2xl text-center animate-in slide-in-from-top-4 duration-300">
              {success}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section: Requester Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 group">
              <label className="text-[11px] font-black text-[#2D3436]/40 uppercase tracking-widest ml-1 group-focus-within:text-[#6C5CE7] transition-colors">
                Full Name
              </label>
              <input
                name="requesterName"
                value={form.requesterName}
                onChange={handleChange}
                required
                className="w-full px-6 py-4 text-[15px] font-semibold text-[#2D3436] bg-[#F5F6FA] border-2 border-transparent rounded-2xl outline-none focus:border-[#6C5CE7] focus:bg-white focus:shadow-[0_0_20px_rgba(108,92,231,0.1)] transition-all placeholder:text-[#2D3436]/30"
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2 group">
              <label className="text-[11px] font-black text-[#2D3436]/40 uppercase tracking-widest ml-1 group-focus-within:text-[#6C5CE7] transition-colors">
                Official Email
              </label>
              <input
                name="requesterEmail"
                type="email"
                value={form.requesterEmail}
                onChange={handleChange}
                required
                className="w-full px-6 py-4 text-[15px] font-semibold text-[#2D3436] bg-[#F5F6FA] border-2 border-transparent rounded-2xl outline-none focus:border-[#6C5CE7] focus:bg-white focus:shadow-[0_0_20px_rgba(108,92,231,0.1)] transition-all"
                placeholder="admin@college.edu"
              />
            </div>
          </div>

          <div className="space-y-2 group">
            <label className="text-[11px] font-black text-[#2D3436]/40 uppercase tracking-widest ml-1 group-focus-within:text-[#6C5CE7] transition-colors">
              Contact Number
            </label>
            <input
              name="requesterPhone"
              value={form.requesterPhone}
              onChange={handleChange}
              required
              className="w-full px-6 py-4 text-[15px] font-semibold text-[#2D3436] bg-[#F5F6FA] border-2 border-transparent rounded-2xl outline-none focus:border-[#6C5CE7] focus:bg-white focus:shadow-[0_0_20px_rgba(108,92,231,0.1)] transition-all"
              placeholder="+91 00000 00000"
            />
          </div>

          {/* Section: Institution Selection */}
          <div className="space-y-4">
            <div className="space-y-2 group">
              <label className="text-[11px] font-black text-[#2D3436]/40 uppercase tracking-widest ml-1 group-focus-within:text-[#6C5CE7] transition-colors">
                Select Institution
              </label>
              <div className="relative">
                <select
                  name="selectedCollege"
                  value={form.selectedCollege || (isOther ? "other" : "")}
                  onChange={handleChange}
                  className="w-full px-6 py-4 text-[15px] font-semibold text-[#2D3436] bg-[#F5F6FA] border-2 border-transparent rounded-2xl outline-none focus:border-[#6C5CE7] focus:bg-white transition-all appearance-none cursor-pointer"
                >
                  <option value="" disabled>Search or Select College</option>
                  {colleges.map((col) => (
                    <option key={col._id} value={col._id}>{col.name}</option>
                  ))}
                  <option value="other">My Institution is not listed</option>
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#6C5CE7]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {isOther && (
              <div className="p-6 bg-[#6C5CE7]/5 border-2 border-dashed border-[#6C5CE7]/20 rounded-3xl animate-in slide-in-from-top-2 duration-500">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-[#6C5CE7] uppercase tracking-widest">
                    Enter New Institution Name
                  </label>
                  <input
                    name="collegeName"
                    value={form.collegeName}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 text-[15px] font-semibold text-[#2D3436] bg-white border-2 border-transparent rounded-2xl outline-none focus:border-[#6C5CE7] transition-all"
                    placeholder="University of Excellence"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section: Details */}
          <div className="space-y-2 group">
            <label className="text-[11px] font-black text-[#2D3436]/40 uppercase tracking-widest ml-1 group-focus-within:text-[#6C5CE7] transition-colors">
              Physical Location
            </label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              className="w-full px-6 py-4 text-[15px] font-semibold text-[#2D3436] bg-[#F5F6FA] border-2 border-transparent rounded-2xl outline-none focus:border-[#6C5CE7] focus:bg-white focus:shadow-[0_0_20px_rgba(108,92,231,0.1)] transition-all"
              placeholder="City, State"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 group">
              <label className="text-[11px] font-black text-[#2D3436]/40 uppercase tracking-widest ml-1 group-focus-within:text-[#6C5CE7] transition-colors">
                Website URL
              </label>
              <input
                name="website"
                value={form.website}
                onChange={handleChange}
                className="w-full px-6 py-4 text-[15px] font-semibold text-[#2D3436] bg-[#F5F6FA] border-2 border-transparent rounded-2xl outline-none focus:border-[#6C5CE7] focus:bg-white transition-all"
                placeholder="https://college.edu"
              />
            </div>
            <div className="space-y-2 group">
              <label className="text-[11px] font-black text-[#2D3436]/40 uppercase tracking-widest ml-1 group-focus-within:text-[#6C5CE7] transition-colors">
                Email Domain
              </label>
              <input
                name="emailDomain"
                value={form.emailDomain}
                onChange={handleChange}
                className="w-full px-6 py-4 text-[15px] font-semibold text-[#2D3436] bg-[#F5F6FA] border-2 border-transparent rounded-2xl outline-none focus:border-[#6C5CE7] focus:bg-white transition-all"
                placeholder="@college.edu"
              />
            </div>
          </div>

          {/* Section: Document Upload */}
          <div className="space-y-2 group">
            <label className="text-[11px] font-black text-[#2D3436]/40 uppercase tracking-widest ml-1 group-focus-within:text-[#6C5CE7] transition-colors text-center block">
              Verification Proof (ID/Letter)
            </label>
            <div className="relative p-8 bg-[#F5F6FA] border-2 border-dashed border-[#F5F6FA] rounded-3xl hover:border-[#6C5CE7]/40 hover:bg-[#6C5CE7]/5 transition-all group flex flex-col items-center justify-center gap-4">
              <input
                type="file"
                name="verificationDocument"
                onChange={handleChange}
                required
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#6C5CE7] shadow-sm group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <p className="text-[13px] font-bold text-[#2D3436]/60">
                {form.verificationDocument ? form.verificationDocument.name : "Click or drag document here"}
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-8 border-t border-[#F5F6FA]">
            <button
              disabled={loading}
              className="group relative w-full py-5 text-sm font-black text-white bg-[#6C5CE7] rounded-3xl shadow-[0_15px_30px_-5px_rgba(108,92,231,0.3)] hover:shadow-[0_20px_40px_-5px_rgba(108,92,231,0.5)] hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50 uppercase tracking-[0.2em] overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {loading ? (
                  <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    Submit Registration
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
            </button>
          </div>
        </form>
      </div>

      <style jsx="true">{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}