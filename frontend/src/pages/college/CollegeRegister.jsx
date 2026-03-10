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
    verificationDocument: null
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

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "verificationDocument") {
      setForm(prev => ({
        ...prev,
        verificationDocument: files[0]
      }));
      return;
    }

    if (name === "selectedCollege") {
      if (value === "other") {
        setIsOther(true);
        setForm(prev => ({
          ...prev,
          selectedCollege: "",
          collegeName: ""
        }));
      } else {
        setIsOther(false);
        setForm(prev => ({
          ...prev,
          selectedCollege: value
        }));
      }
      return;
    }

    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("requesterName", form.requesterName);
      formData.append("requesterEmail", form.requesterEmail);
      formData.append("requesterPhone", form.requesterPhone);

      if (form.selectedCollege) {
        formData.append("selectedCollege", form.selectedCollege);
      }

      if (isOther) {
        formData.append("collegeName", form.collegeName);
      }

      formData.append("location", form.location);
      formData.append("website", form.website);
      formData.append("emailDomain", form.emailDomain);

      if (form.verificationDocument) {
        formData.append(
          "verificationDocument",
          form.verificationDocument
        );
      }

      await API.post("/onboarding/college", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      setSuccess("Request submitted successfully. Please wait for admin approval.");
      setForm({
        requesterName: "",
        requesterEmail: "",
        requesterPhone: "",
        selectedCollege: "",
        collegeName: "",
        location: "",
        website: "",
        emailDomain: "",
        verificationDocument: null
      });
      setIsOther(false);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Error submitting request"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0F19] p-4 md:p-8 font-sans box-border text-white selection:bg-fuchsia-500/30 selection:text-fuchsia-200 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>

      <div className="w-full max-w-2xl bg-white/5 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] border border-white/10 box-border relative z-10 transition-all duration-300 hover:border-white/20">
        <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 mt-0 mb-10 text-center tracking-tight">
          College Registration
        </h2>

        {error && (
          <div className="mb-6 px-5 py-4 text-[11px] font-bold text-white bg-red-500/10 border border-red-500/20 rounded-xl uppercase tracking-widest text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 px-5 py-4 text-[11px] font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-xl uppercase tracking-widest text-center">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
                Your Name
              </label>
              <input
                name="requesterName"
                placeholder="John Doe"
                value={form.requesterName}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-300 placeholder:text-white/20 box-border"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
                Official Email
              </label>
              <input
                name="requesterEmail"
                type="email"
                placeholder="john@college.edu"
                value={form.requesterEmail}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-300 placeholder:text-white/20 box-border"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
              Phone Number
            </label>
            <input
              name="requesterPhone"
              placeholder="+91 98765 43210"
              value={form.requesterPhone}
              onChange={handleChange}
              required
              className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-300 placeholder:text-white/20 box-border"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
              Select College
            </label>
            <select
              name="selectedCollege"
              value={form.selectedCollege}
              onChange={handleChange}
              className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-300 box-border appearance-none cursor-pointer [&>option]:bg-[#0B0F19]"
            >
              <option value="" disabled className="text-white/40">Select College</option>
              {colleges.map(col => (
                <option key={col._id} value={col._id}>
                  {col.name}
                </option>
              ))}
              <option value="other">
                Other (Not Listed)
              </option>
            </select>
          </div>

          {isOther && (
            <div className="flex flex-col gap-2 p-5 bg-[#0B0F19]/30 rounded-2xl border border-fuchsia-500/20 shadow-inner">
              <label className="text-[10px] font-bold text-fuchsia-400 uppercase tracking-widest">
                New College Name
              </label>
              <input
                name="collegeName"
                placeholder="Enter College Name"
                value={form.collegeName}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/80 border border-white/10 rounded-xl outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-all duration-300 placeholder:text-white/20 box-border"
              />
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
              Address
            </label>
            <input
              name="location"
              placeholder="City, State"
              value={form.location}
              onChange={handleChange}
              required
              className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-300 placeholder:text-white/20 box-border"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
                Website
              </label>
              <input
                name="website"
                placeholder="https://college.edu"
                value={form.website}
                onChange={handleChange}
                className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-300 placeholder:text-white/20 box-border"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
                Email Domain
              </label>
              <input
                name="emailDomain"
                placeholder="college.edu"
                value={form.emailDomain}
                onChange={handleChange}
                className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-300 placeholder:text-white/20 box-border"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-4 p-6 bg-[#0B0F19]/30 rounded-2xl border border-white/5 border-dashed">
            <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest text-center">
              Verification Document
            </label>
            <input
              type="file"
              name="verificationDocument"
              onChange={handleChange}
              required
              className="block w-full text-sm text-white/70 file:mr-4 file:py-3 file:px-5 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-white/5 file:text-white/80 hover:file:bg-white/10 hover:file:text-white transition-all cursor-pointer box-border outline-none file:cursor-pointer"
            />
          </div>

          <div className="pt-8 border-t border-white/10 mt-2">
            <button 
              disabled={loading}
              className="w-full py-4 text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 border-none rounded-xl cursor-pointer transition-all duration-300 hover:shadow-[0_8px_20px_-6px_rgba(217,70,239,0.5)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest flex items-center justify-center gap-3 outline-none"
            >
              {loading && (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              )}
              {loading ? "Submitting..." : "Submit Registration"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}