import React, { useEffect, useState } from "react";
import API from "../../api/api";

export default function FacultyProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await API.get("/faculty/profile");
      setProfile(res.data.data);
    } catch {
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        fullName: profile.fullName || "",
        phoneNo: profile.phoneNo || "",
        designation: profile.designation || "",
        bio: profile.bio || ""
      };

      const res = await API.patch("/faculty/profile", payload);
      setProfile(res.data.data);
      setSuccess("Profile updated successfully!");
    } catch {
      setError("Update failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0B0F19]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-white/10 border-t-fuchsia-500 rounded-full animate-spin"></div>
          <p className="text-fuchsia-400 font-bold tracking-widest uppercase text-[10px] animate-pulse m-0">
            Fetching Profile
          </p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0B0F19]">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-16 text-center shadow-inner">
          <p className="text-white/40 m-0 text-base font-medium">No profile data found.</p>
        </div>
      </div>
    );
  }

  const initials = (profile.fullName || "F")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#0B0F19] p-4 md:p-8 font-sans text-white selection:bg-fuchsia-500/30 selection:text-fuchsia-200 relative overflow-hidden">
      {/* Ambient Backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" aria-hidden="true"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" aria-hidden="true"></div>

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 md:gap-8 mt-10">
        
        {/* Sidebar Info */}
        <aside className="w-full lg:w-[380px] flex-shrink-0 bg-white/5 backdrop-blur-xl p-6 md:p-10 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] border border-white/10 h-max box-border transition-all duration-300 hover:border-white/20">
          <div className="flex justify-center mb-8 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/30 to-fuchsia-600/30 blur-xl rounded-full scale-110 animate-pulse" />
            <div className="relative w-28 h-28 bg-[#0B0F19] border border-white/10 rounded-full flex items-center justify-center text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-violet-400 to-fuchsia-400 shadow-inner">
              {initials}
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white/90 text-center mt-0 mb-2 tracking-tight">
            {profile.fullName}
          </h2>

          <p className="text-sm font-bold text-violet-400 text-center mb-8 uppercase tracking-widest">
            {profile.college?.name || "Institution Name"}
          </p>

          <div className="flex flex-col gap-5 pt-8 border-t border-white/10">
            {[
              { label: "Employee ID", value: profile.employeeId },
              { label: "Joining Year", value: profile.joiningYear },
              { label: "Course", value: profile.courseName },
              { label: "Specialization", value: profile.department }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col gap-1.5 bg-[#0B0F19]/30 p-4 rounded-xl border border-white/5 transition-all hover:border-white/10">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{item.label}</span>
                <span className="text-sm font-medium text-white/90">{item.value || "—"}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-white/5 backdrop-blur-xl p-6 md:p-10 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] border border-white/10 box-border transition-all duration-300 hover:border-white/20">
          <header className="mb-10 border-b border-white/10 pb-6">
            <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 m-0 tracking-tight">
              Edit Profile
            </h1>
            <p className="text-sm text-white/40 font-medium m-0 mt-2 tracking-wide">
              Update your professional dossier and details
            </p>
          </header>

          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            {error && (
              <div className="px-5 py-4 text-[11px] font-bold text-white bg-red-500/10 border border-red-500/20 rounded-xl uppercase tracking-widest animate-pulse">
                {error}
              </div>
            )}
            
            {success && (
              <div className="px-5 py-4 text-[11px] font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 rounded-xl uppercase tracking-widest animate-bounce">
                {success}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Full Name</label>
                <input
                  name="fullName"
                  value={profile.fullName || ""}
                  onChange={handleChange}
                  placeholder="e.g. Dr. John Doe"
                  className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all placeholder:text-white/20"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Phone Number</label>
                <input
                  name="phoneNo"
                  value={profile.phoneNo || ""}
                  onChange={handleChange}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all placeholder:text-white/20"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Designation</label>
              <input
                name="designation"
                value={profile.designation || ""}
                onChange={handleChange}
                placeholder="e.g. Associate Professor"
                className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all placeholder:text-white/20"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Bio</label>
              <textarea
                name="bio"
                rows={5}
                value={profile.bio || ""}
                onChange={handleChange}
                placeholder="A brief overview of your professional background and interests..."
                className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all resize-none placeholder:text-white/20"
              />
            </div>

            <div className="pt-8 border-t border-white/10 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="w-full md:w-auto px-10 py-4 text-[10px] font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 border-none rounded-xl cursor-pointer transition-all duration-300 hover:shadow-[0_8px_20px_-6px_rgba(217,70,239,0.5)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest flex items-center justify-center gap-3 outline-none"
              >
                {saving ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Saving...
                  </>
                ) : (
                  "Save Profile Changes"
                )}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}