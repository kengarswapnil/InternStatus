import React, { useEffect, useState } from "react";
import API from "../../api/api";

export default function CompanyProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [logoFile, setLogoFile] = useState(null);

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
      const res = await API.get("/company/profile");
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

  const handleLocationChange = (index, field, value) => {
    const updated = [...(profile.locations || [])];
    updated[index][field] = value;
    setProfile((prev) => ({ ...prev, locations: updated }));
  };

  const addLocation = () => {
    const updated = [...(profile.locations || [])];
    updated.push({ city: "", state: "", country: "" });
    setProfile((prev) => ({ ...prev, locations: updated }));
  };

  const removeLocation = (index) => {
    const updated = [...(profile.locations || [])];
    updated.splice(index, 1);
    setProfile((prev) => ({ ...prev, locations: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      let res;

      if (logoFile) {
        const formData = new FormData();

        formData.append("name", profile.name || "");
        formData.append("website", profile.website || "");
        formData.append("industry", profile.industry || "");
        formData.append("companySize", profile.companySize || "");
        formData.append("description", profile.description || "");
        formData.append("locations", JSON.stringify(profile.locations || []));
        formData.append("logo", logoFile);

        res = await API.patch("/company/profile", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      } else {
        const payload = {
          name: profile.name || "",
          website: profile.website || "",
          industry: profile.industry || "",
          companySize: profile.companySize || "",
          description: profile.description || "",
          locations: profile.locations || []
        };

        res = await API.patch("/company/profile", payload);
      }

      setProfile(res.data.data);
      setSuccess("Profile updated successfully!");
      setLogoFile(null);
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
            Loading Profile
          </p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0B0F19]">
        <div className="bg-[#0B0F19]/50 border border-white/10 rounded-3xl p-16 text-center shadow-inner">
          <p className="text-white/40 m-0 text-base font-medium">
            No profile found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] p-4 md:p-8 font-sans text-white selection:bg-fuchsia-500/30 selection:text-fuchsia-200 relative overflow-hidden">
      {/* Ambient Backgrounds */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" aria-hidden="true"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" aria-hidden="true"></div>

      <div className="relative z-10 max-w-4xl mx-auto bg-white/5 backdrop-blur-xl rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] border border-white/10 p-6 md:p-10 box-border transition-all duration-300 hover:border-white/20">

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10 pb-8 border-b border-white/10">
          <div className="w-24 h-24 flex-shrink-0 bg-gradient-to-br from-violet-600/30 to-fuchsia-600/30 border border-white/10 rounded-2xl overflow-hidden flex items-center justify-center text-white font-black text-4xl shadow-inner shadow-white/5">
            {profile.logoUrl ? (
              <img src={profile.logoUrl} alt="logo" className="w-full h-full object-cover" />
            ) : (
              <div className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                {profile.name?.charAt(0)}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 items-center sm:items-start text-center sm:text-left mt-2">
            <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 m-0 tracking-tight leading-none">
              {profile.name}
            </h2>
            <span className="w-max px-3 py-1.5 text-[10px] font-bold tracking-widest text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 rounded-lg uppercase">
              {profile.status?.toUpperCase()}
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-8 px-5 py-4 text-[11px] font-bold text-red-300 bg-red-500/10 border border-red-500/30 rounded-xl uppercase tracking-widest text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-8 px-5 py-4 text-[11px] font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 rounded-xl uppercase tracking-widest text-center">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
                Company Name
              </label>
              <input
                name="name"
                value={profile.name || ""}
                onChange={handleChange}
                placeholder="e.g. Acme Corp"
                className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-300 placeholder:text-white/20 box-border"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
                Website
              </label>
              <input
                name="website"
                value={profile.website || ""}
                onChange={handleChange}
                placeholder="https://acme.com"
                className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-300 placeholder:text-white/20 box-border"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
                Industry
              </label>
              <input
                name="industry"
                value={profile.industry || ""}
                onChange={handleChange}
                placeholder="e.g. Technology"
                className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-300 placeholder:text-white/20 box-border"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
                Company Size
              </label>
              <input
                name="companySize"
                value={profile.companySize || ""}
                onChange={handleChange}
                placeholder="e.g. 50-200"
                className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-300 placeholder:text-white/20 box-border"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              value={profile.description || ""}
              onChange={handleChange}
              placeholder="Brief overview of the company..."
              className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-300 resize-y placeholder:text-white/20 box-border"
            />
          </div>

          <div className="flex flex-col gap-5 pt-4 border-t border-white/10">
            <h3 className="text-sm font-bold text-violet-400 uppercase tracking-widest m-0">
              Locations
            </h3>

            <div className="flex flex-col gap-4">
              {profile.locations?.map((loc, index) => (
                <div key={index} className="flex flex-col sm:flex-row gap-3 bg-[#0B0F19]/30 p-4 rounded-xl border border-white/5 transition-all hover:border-white/10 relative group">
                  <div className="flex-1 flex flex-col gap-1.5">
                    <label className="text-[9px] font-bold text-fuchsia-400 uppercase tracking-widest">City</label>
                    <input
                      placeholder="e.g. San Francisco"
                      value={loc.city || ""}
                      onChange={(e) => handleLocationChange(index, "city", e.target.value)}
                      className="w-full bg-transparent border-none text-sm text-white outline-none placeholder:text-white/20 font-medium"
                    />
                  </div>
                  <div className="hidden sm:block w-px bg-white/10 self-stretch"></div>
                  <div className="flex-1 flex flex-col gap-1.5">
                    <label className="text-[9px] font-bold text-fuchsia-400 uppercase tracking-widest">State</label>
                    <input
                      placeholder="e.g. California"
                      value={loc.state || ""}
                      onChange={(e) => handleLocationChange(index, "state", e.target.value)}
                      className="w-full bg-transparent border-none text-sm text-white outline-none placeholder:text-white/20 font-medium"
                    />
                  </div>
                  <div className="hidden sm:block w-px bg-white/10 self-stretch"></div>
                  <div className="flex-1 flex flex-col gap-1.5">
                    <label className="text-[9px] font-bold text-fuchsia-400 uppercase tracking-widest">Country</label>
                    <input
                      placeholder="e.g. USA"
                      value={loc.country || ""}
                      onChange={(e) => handleLocationChange(index, "country", e.target.value)}
                      className="w-full bg-transparent border-none text-sm text-white outline-none placeholder:text-white/20 font-medium"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeLocation(index)}
                    className="sm:absolute sm:right-4 sm:top-1/2 sm:-translate-y-1/2 px-4 py-2 text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-all duration-300 uppercase tracking-widest outline-none mt-2 sm:mt-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <button 
              type="button" 
              onClick={addLocation}
              className="self-start px-6 py-3 text-[10px] font-bold text-white/80 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300 uppercase tracking-widest outline-none hover:-translate-y-0.5 cursor-pointer"
            >
              + Add Location
            </button>
          </div>

          <div className="flex flex-col gap-3 pt-6 border-t border-white/10">
            <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
              Company Logo
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-white/10 border-dashed rounded-xl cursor-pointer bg-[#0B0F19]/50 hover:bg-white/5 hover:border-violet-500/50 transition-all group">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-8 h-8 mb-3 text-white/40 group-hover:text-violet-400 transition-colors" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                  </svg>
                  <p className="mb-2 text-sm text-white/60 font-medium"><span className="font-bold text-white">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-white/40">SVG, PNG, JPG or GIF</p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => setLogoFile(e.target.files[0])}
                />
              </label>
            </div>
            {logoFile && (
              <p className="text-xs font-bold text-emerald-400 mt-2">
                Selected: {logoFile.name}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
             <div className="bg-[#0B0F19]/30 border border-white/5 rounded-xl p-5 flex flex-col gap-1.5 transition-all hover:border-white/10">
               <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Email Domain</span>
               <span className="text-sm font-medium text-white/90">{profile.emailDomain}</span>
             </div>
             <div className="bg-[#0B0F19]/30 border border-white/5 rounded-xl p-5 flex flex-col gap-1.5 transition-all hover:border-white/10">
               <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Approved At</span>
               <span className="text-sm font-medium text-white/90">
                 {profile.approvedAt ? new Date(profile.approvedAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                 }) : "—"}
               </span>
             </div>
          </div>

          <div className="pt-8 mt-2 border-t border-white/10 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="w-full md:w-auto px-10 py-4 text-[10px] font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 border-none rounded-xl cursor-pointer transition-all duration-300 hover:shadow-[0_8px_20px_-6px_rgba(217,70,239,0.5)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest flex items-center justify-center gap-3 outline-none"
            >
              {saving && (
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              )}
              {saving ? "Saving..." : "Save Profile Changes"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}