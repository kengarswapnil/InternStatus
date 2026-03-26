import React, { useEffect, useState } from "react";
import API from "../../api/api";

export default function CompanyProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [emailDomainError, setEmailDomainError] = useState("");

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

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess("");
        setError("");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));

    if (name === "emailDomain") {
      if (value && !validateEmailDomain(value)) {
        setEmailDomainError("Invalid domain format (e.g., company.com)");
      } else {
        setEmailDomainError("");
      }
    }
  };

  const validateEmailDomain = (domain) => {
    if (!domain) return true;
    const emailDomainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailDomainRegex.test(domain);
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

    if (profile.emailDomain && !validateEmailDomain(profile.emailDomain)) {
      setEmailDomainError("Invalid email domain format");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");
    setEmailDomainError("");

    try {
      let res;

      if (logoFile) {
        const formData = new FormData();
        formData.append("name", profile.name || "");
        formData.append("website", profile.website || "");
        formData.append("industry", profile.industry || "");
        formData.append("companySize", profile.companySize || "");
        formData.append("description", profile.description || "");
        formData.append("emailDomain", profile.emailDomain || "");
        formData.append("locations", JSON.stringify(profile.locations || []));
        formData.append("logo", logoFile);

        res = await API.patch("/company/profile", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        const payload = {
          name: profile.name || "",
          website: profile.website || "",
          industry: profile.industry || "",
          companySize: profile.companySize || "",
          description: profile.description || "",
          emailDomain: profile.emailDomain || "",
          locations: profile.locations || [],
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

  if (loading || !profile) {
    return (
      <div className="h-full bg-[#f5f5f5] flex items-center justify-center font-sans">
        <p className="text-[14px] font-bold text-[#666] animate-pulse">
          {loading ? "Loading Profile..." : "No profile found"}
        </p>
      </div>
    );
  }

  return (
    <div className="h-full bg-[#f5f5f5] text-[#333] flex flex-col p-6 font-sans overflow-hidden box-border">
      {/* Header with Status */}
      <div className="mb-6 flex justify-between items-start gap-4">
        <div>
          <h1 className="text-[28px] font-black text-[#111] m-0 tracking-tight">
            Company Settings
          </h1>
          <p className="text-[12px] font-bold text-[#999] m-0 mt-1 uppercase tracking-widest">
            Manage your organization profile
          </p>
        </div>
        <div className="flex gap-2">
          {success && (
            <div className="px-4 py-2 bg-[#f0fdf4] border border-[#bbf7d0] rounded-[10px] whitespace-nowrap">
              <span className="text-[11px] font-black text-[#008000] uppercase tracking-widest">
                ✓ {success}
              </span>
            </div>
          )}
          {error && (
            <div className="px-4 py-2 bg-[#fef2f2] border border-[#fecaca] rounded-[10px] whitespace-nowrap">
              <span className="text-[11px] font-black text-[#cc0000] uppercase tracking-widest">
                ✕ {error}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content - 3 Cards Grid */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-6 pb-4">
        {/* CARD 1: Logo & Basic Info */}
        <div className="bg-[#fff] border border-[#e8e8e8] rounded-[14px] p-6 shadow-sm">
          <h2 className="text-[14px] font-black text-[#111] m-0 mb-5 uppercase tracking-widest">
            Brand & Identity
          </h2>
          
          <div className="flex gap-6 items-start">
            {/* Logo Section */}
            <div className="flex flex-col items-center gap-3 min-w-fit">
              <div className="w-24 h-24 bg-[#f8f8f8] border border-[#e8e8e8] rounded-[12px] overflow-hidden flex items-center justify-center flex-shrink-0">
                {profile.logoUrl ? (
                  <img
                    src={profile.logoUrl}
                    alt="logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-[32px] font-black text-[#ddd]">
                    {profile.name?.charAt(0) || "?"}
                  </div>
                )}
              </div>
              
              <div className="w-24">
                <label className="relative inline-block w-full">
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept="image/*"
                    onChange={(e) => setLogoFile(e.target.files[0])}
                  />
                  <div className="px-3 py-2 bg-[#f8f8f8] border border-[#e8e8e8] text-[9px] font-black text-[#333] uppercase tracking-widest rounded-[8px] hover:border-[#333] hover:bg-[#f0f0f0] transition-all cursor-pointer text-center">
                    Upload Logo
                  </div>
                </label>
              </div>
              
              {logoFile && (
                <p className="text-[8px] font-bold text-[#999] text-center truncate max-w-[120px]">
                  {logoFile.name}
                </p>
              )}
            </div>

            {/* Name & Website */}
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[#666] uppercase tracking-widest">
                  Company Name
                </label>
                <input
                  name="name"
                  value={profile.name || ""}
                  onChange={handleChange}
                  placeholder="Enter company name"
                  className="w-full px-4 py-2.5 text-[13px] font-bold text-[#333] bg-[#f8f8f8] border border-[#e8e8e8] rounded-[8px] outline-none focus:border-[#333] focus:bg-[#fff] transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[#666] uppercase tracking-widest">
                  Website
                </label>
                <input
                  name="website"
                  value={profile.website || ""}
                  onChange={handleChange}
                  placeholder="https://company.com"
                  className="w-full px-4 py-2.5 text-[13px] font-bold text-[#333] bg-[#f8f8f8] border border-[#e8e8e8] rounded-[8px] outline-none focus:border-[#333] focus:bg-[#fff] transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2: Business Details */}
        <div className="bg-[#fff] border border-[#e8e8e8] rounded-[14px] p-6 shadow-sm">
          <h2 className="text-[14px] font-black text-[#111] m-0 mb-5 uppercase tracking-widest">
            Business Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-[#666] uppercase tracking-widest">
                Industry
              </label>
              <input
                name="industry"
                value={profile.industry || ""}
                onChange={handleChange}
                placeholder="e.g., Technology"
                className="w-full px-4 py-2.5 text-[13px] font-bold text-[#333] bg-[#f8f8f8] border border-[#e8e8e8] rounded-[8px] outline-none focus:border-[#333] focus:bg-[#fff] transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-[#666] uppercase tracking-widest">
                Company Size
              </label>
              <input
                name="companySize"
                value={profile.companySize || ""}
                onChange={handleChange}
                placeholder="e.g., 50-200"
                className="w-full px-4 py-2.5 text-[13px] font-bold text-[#333] bg-[#f8f8f8] border border-[#e8e8e8] rounded-[8px] outline-none focus:border-[#333] focus:bg-[#fff] transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-[10px] font-bold text-[#666] uppercase tracking-widest">
                Email Domain
              </label>
              <div className="flex flex-col gap-1.5">
                <input
                  name="emailDomain"
                  value={profile.emailDomain || ""}
                  onChange={handleChange}
                  placeholder="company.com"
                  className={`w-full px-4 py-2.5 text-[13px] font-bold text-[#333] bg-[#f8f8f8] border rounded-[8px] outline-none focus:bg-[#fff] transition-all ${
                    emailDomainError
                      ? "border-[#cc0000] focus:border-[#cc0000]"
                      : "border-[#e8e8e8] focus:border-[#333]"
                  }`}
                />
                {emailDomainError && (
                  <span className="text-[10px] font-bold text-[#cc0000]">
                    {emailDomainError}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-[10px] font-bold text-[#666] uppercase tracking-widest">
                Description
              </label>
              <textarea
                name="description"
                rows={4}
                value={profile.description || ""}
                onChange={handleChange}
                placeholder="Tell us about your company..."
                className="w-full px-4 py-2.5 text-[13px] font-bold text-[#333] bg-[#f8f8f8] border border-[#e8e8e8] rounded-[8px] outline-none focus:border-[#333] focus:bg-[#fff] transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* CARD 3: Office Locations */}
        <div className="bg-[#fff] border border-[#e8e8e8] rounded-[14px] p-6 shadow-sm">
          <div className="flex justify-between items-center mb-5 gap-3">
            <h2 className="text-[14px] font-black text-[#111] m-0 uppercase tracking-widest">
              Office Locations
            </h2>
            <button
              type="button"
              onClick={addLocation}
              className="px-3 py-1.5 text-[9px] font-black text-[#fff] bg-[#333] border-none rounded-[8px] hover:bg-[#111] transition-colors cursor-pointer uppercase tracking-widest whitespace-nowrap"
            >
              + Add Location
            </button>
          </div>

          {profile.locations && profile.locations.length > 0 ? (
            <div className="flex flex-col gap-3">
              {profile.locations.map((loc, index) => (
                <div
                  key={index}
                  className="flex gap-3 items-end bg-[#f8f8f8] p-4 rounded-[10px] border border-[#e8e8e8]"
                >
                  <div className="flex-1 flex gap-3">
                    <input
                      placeholder="City"
                      value={loc.city || ""}
                      onChange={(e) =>
                        handleLocationChange(index, "city", e.target.value)
                      }
                      className="flex-1 px-3 py-2 bg-[#fff] border border-[#e8e8e8] text-[12px] font-bold text-[#333] rounded-[8px] outline-none focus:border-[#333] transition-all"
                    />
                    <input
                      placeholder="State"
                      value={loc.state || ""}
                      onChange={(e) =>
                        handleLocationChange(index, "state", e.target.value)
                      }
                      className="flex-1 px-3 py-2 bg-[#fff] border border-[#e8e8e8] text-[12px] font-bold text-[#333] rounded-[8px] outline-none focus:border-[#333] transition-all"
                    />
                    <input
                      placeholder="Country"
                      value={loc.country || ""}
                      onChange={(e) =>
                        handleLocationChange(index, "country", e.target.value)
                      }
                      className="flex-1 px-3 py-2 bg-[#fff] border border-[#e8e8e8] text-[12px] font-bold text-[#333] rounded-[8px] outline-none focus:border-[#333] transition-all"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeLocation(index)}
                    className="px-3 py-2 text-[12px] font-black text-[#cc0000] hover:bg-[#fef2f2] border border-[#fecaca] rounded-[8px] cursor-pointer transition-colors whitespace-nowrap"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-8 bg-[#f8f8f8] rounded-[10px] border border-[#e8e8e8] border-dashed">
              <p className="text-[12px] font-bold text-[#999]">
                No locations added yet. Click "+ Add Location" to add one.
              </p>
            </div>
          )}
        </div>
      </form>

      {/* Fixed Footer with Submit Button */}
      <div className="flex justify-end pt-6 border-t border-[#e8e8e8] gap-3">
        <button
          onClick={handleSubmit}
          disabled={saving || !!emailDomainError}
          className="px-8 py-3 text-[11px] font-black text-[#fff] bg-[#333] border-none rounded-[10px] cursor-pointer hover:bg-[#111] transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
        >
          {saving ? "Saving..." : "Save All Changes"}
        </button>
      </div>
    </div>
  );
}