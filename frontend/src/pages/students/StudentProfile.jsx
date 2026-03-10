import React, { useEffect, useState, useRef } from "react";
import API from "../../api/api";

export default function StudentProfile() {
  const [profile, setProfile] = useState(null);
  const [skillsInput, setSkillsInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await API.get("/users/student/profile");
      let data = res.data.data;

      if (typeof data.skills === "string") {
        try {
          data.skills = JSON.parse(data.skills);
        } catch {
          data.skills = [];
        }
      }

      setProfile(data);
      setSkillsInput((data.skills || []).join(", "));
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

  const handleSkillsChange = (e) => {
    setSkillsInput(e.target.value);
  };

  const handleResumeChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setResumeFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) setResumeFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (profile.phoneNo && !/^\+?[0-9]{10,15}$/.test(profile.phoneNo)) {
        setError("Invalid phone number format.");
        setSaving(false);
        return;
      }

      const parsedSkills = skillsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const formData = new FormData();
      formData.append("phoneNo", profile.phoneNo || "");
      formData.append("bio", profile.bio || "");
      formData.append("skills", JSON.stringify(parsedSkills));

      if (resumeFile) {
        formData.append("resume", resumeFile);
      }

      const res = await API.patch("/users/student/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      let updatedData = res.data.data;

      if (typeof updatedData.skills === "string") {
        try {
          updatedData.skills = JSON.parse(updatedData.skills);
        } catch {
          updatedData.skills = [];
        }
      }

      setProfile(updatedData);
      setSkillsInput((updatedData.skills || []).join(", "));
      setResumeFile(null);
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
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
          <div className="w-12 h-12 border-4 border-white/10 border-t-fuchsia-500 rounded-full animate-spin"></div>
          <p className="text-fuchsia-400 font-medium tracking-widest uppercase text-sm animate-pulse">
            Loading
          </p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0B0F19]">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl">
          <p className="text-white/70 font-medium text-lg tracking-wide m-0">
            No profile found.
          </p>
        </div>
      </div>
    );
  }

  const initials = (profile.fullName || "S")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#0B0F19] p-4 md:p-8 font-sans text-white selection:bg-fuchsia-500/30 selection:text-fuchsia-200">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-[380px] flex-shrink-0 flex flex-col gap-6">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] transition-all duration-300 hover:border-white/20">
            <div className="flex justify-center mb-8 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full blur-xl opacity-40 animate-pulse"></div>
              <div className="relative w-32 h-32 bg-[#0B0F19] rounded-full flex items-center justify-center text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-violet-400 to-fuchsia-400 border-2 border-white/10 shadow-inner">
                {initials}
              </div>
            </div>

            <h2 className="text-3xl font-extrabold text-center mt-0 mb-2 tracking-tight">
              {profile.fullName}
            </h2>

            <p className="text-sm font-medium text-center m-0 text-fuchsia-400 uppercase tracking-widest">
              {[profile.courseName, profile.specialization]
                .filter(Boolean)
                .join(" | ") || "Student"}
            </p>

            <button
              onClick={() => {
                setIsEditing(!isEditing);
                setError("");
                setSuccess("");
              }}
              className="w-full mt-8 px-6 py-3.5 rounded-xl font-bold uppercase tracking-wider text-sm transition-all duration-300 bg-white/5 border border-white/10 hover:bg-white/10 hover:-translate-y-1 hover:shadow-[0_8px_20px_-6px_rgba(217,70,239,0.3)]"
            >
              {isEditing ? "Cancel Editing" : "Edit Profile"}
            </button>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] transition-all duration-300 hover:border-white/20">
            <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-6 border-b border-white/10 pb-4">
              Academic Details
            </h3>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-bold text-violet-400 uppercase tracking-wider">
                  College
                </span>
                <span className="text-sm font-medium text-white/90">
                  {profile.college?.name || "—"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-bold text-violet-400 uppercase tracking-wider">
                    PRN
                  </span>
                  <span className="text-sm font-mono text-white/90 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 w-max">
                    {profile.prn || "—"}
                  </span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-bold text-violet-400 uppercase tracking-wider">
                    ABC ID
                  </span>
                  <span className="text-sm font-mono text-white/90 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 w-max">
                    {profile.abcId || "—"}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-bold text-violet-400 uppercase tracking-wider">
                    Year
                  </span>
                  <span className="text-sm font-medium text-white/90">
                    {profile.Year || "—"}
                  </span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-bold text-violet-400 uppercase tracking-wider">
                    Duration
                  </span>
                  <span className="text-sm font-medium text-white/90">
                    {profile.courseStartYear || "—"} –{" "}
                    {profile.courseEndYear || "—"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] transition-all duration-300 hover:border-white/20 h-max">
          <header className="mb-8 border-b border-white/10 pb-6 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-black m-0 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
                {isEditing ? "Update Details" : "Overview"}
              </h1>
              <p className="text-white/40 text-sm mt-2 font-medium">
                {isEditing
                  ? "Make changes to your personal information below."
                  : "Your current profile information and skills."}
              </p>
            </div>
          </header>

          {error && (
            <div className="mb-6 px-5 py-4 text-sm font-bold text-white bg-red-500/10 border border-red-500/20 rounded-xl backdrop-blur-md">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 px-5 py-4 text-sm font-bold text-white bg-emerald-500/10 border border-emerald-500/20 rounded-xl backdrop-blur-md">
              {success}
            </div>
          )}

          {!isEditing ? (
            <div className="flex flex-col gap-8 animate-in fade-in duration-500">
              <div className="flex flex-col gap-3">
                <span className="text-xs font-bold text-fuchsia-400 uppercase tracking-wider">
                  Biography
                </span>
                <p className="text-base text-white/80 leading-relaxed bg-white/5 p-5 rounded-2xl border border-white/5">
                  {profile.bio || "No biography provided yet."}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <span className="text-xs font-bold text-fuchsia-400 uppercase tracking-wider">
                  Contact Number
                </span>
                <p className="text-base text-white/80 font-mono">
                  {profile.phoneNo || "—"}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <span className="text-xs font-bold text-fuchsia-400 uppercase tracking-wider">
                  Technical Skills
                </span>
                {profile.skills?.length > 0 ? (
                  <div className="flex flex-wrap gap-2.5">
                    {profile.skills.map((s, i) => (
                      <span
                        key={i}
                        className="px-4 py-2 bg-gradient-to-br from-white/5 to-white/10 border border-white/10 rounded-xl text-sm font-medium text-white/90 shadow-sm transition-all hover:-translate-y-0.5 hover:border-violet-500/50"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-base text-white/40">No skills added.</p>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <span className="text-xs font-bold text-fuchsia-400 uppercase tracking-wider">
                  Resume Document
                </span>
                {profile.resumeUrl ? (
                  <a
                    href={profile.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-max px-6 py-3 bg-white/5 border border-white/10 text-white text-sm font-bold uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 hover:border-fuchsia-500/30 shadow-lg no-underline"
                  >
                    View Current Resume
                  </a>
                ) : (
                  <p className="text-base text-white/40">
                    No resume uploaded.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-6 animate-in fade-in duration-500"
            >
              <div className="flex flex-col gap-2.5">
                <label className="text-xs font-bold text-white/60 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  value={profile.fullName || ""}
                  readOnly
                  className="w-full px-5 py-4 text-sm text-white/50 bg-white/5 border border-white/5 rounded-xl outline-none cursor-not-allowed"
                />
                <span className="text-xs font-medium text-white/30 mt-1">
                  Name modifications are handled by the institution.
                </span>
              </div>

              <div className="flex flex-col gap-2.5">
                <label className="text-xs font-bold text-white/60 uppercase tracking-wider">
                  Phone Number
                </label>
                <input
                  name="phoneNo"
                  value={profile.phoneNo || ""}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                  className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none transition-all duration-300 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 placeholder:text-white/20"
                />
              </div>

              <div className="flex flex-col gap-2.5">
                <label className="text-xs font-bold text-white/60 uppercase tracking-wider">
                  Bio
                </label>
                <textarea
                  name="bio"
                  rows={4}
                  value={profile.bio || ""}
                  onChange={handleChange}
                  placeholder="Tell us about your background and interests..."
                  className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none transition-all duration-300 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 placeholder:text-white/20 resize-y"
                />
              </div>

              <div className="flex flex-col gap-2.5">
                <label className="text-xs font-bold text-white/60 uppercase tracking-wider">
                  Skills (comma separated)
                </label>
                <input
                  value={skillsInput}
                  onChange={handleSkillsChange}
                  placeholder="React, JavaScript, Tailwind CSS"
                  className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none transition-all duration-300 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 placeholder:text-white/20"
                />
              </div>

              <div className="flex flex-col gap-2.5 mt-2">
                <label className="text-xs font-bold text-white/60 uppercase tracking-wider mb-2">
                  Resume Upload
                </label>

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full p-12 text-center border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${
                    dragOver
                      ? "border-fuchsia-500 bg-fuchsia-500/10"
                      : "border-white/10 bg-[#0B0F19]/50 hover:bg-white/5 hover:border-white/30"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={handleResumeChange}
                  />

                  {resumeFile ? (
                    <p className="m-0 text-base font-bold text-fuchsia-400">
                      {resumeFile.name}
                    </p>
                  ) : (
                    <p className="m-0 text-sm font-medium text-white/50">
                      Click or Drag & Drop to Upload Document
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-8 mt-4 border-t border-white/10 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-8 py-4 text-sm font-bold text-white bg-white/5 border border-white/10 rounded-xl cursor-pointer transition-all duration-300 hover:bg-white/10 hover:-translate-y-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-8 py-4 text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 border-none rounded-xl cursor-pointer transition-all duration-300 hover:shadow-[0_8px_20px_-6px_rgba(217,70,239,0.5)] hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {saving && (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  )}
                  {saving ? "Saving Changes..." : "Save Profile"}
                </button>
              </div>
            </form>
          )}
        </main>
      </div>
    </div>
  );
}