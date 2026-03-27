import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/api";
import AdminNavBar from "../../components/navbars/AdminNavBar";

export default function AdminCollegeProfile() {
  const { id } = useParams();

  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchCollege();
  }, [id]);

  const fetchCollege = async () => {
    try {
      const res = await API.get(`/college/${id}`);
      setCollege(res.data.data);
    } catch {
      setError("Failed to load college");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCollege((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await API.patch(`/college/${id}`, {
        name: college.name,
        website: college.website,
        phone: college.phone,
        address: college.address,
        description: college.description,
      });
      setCollege(res.data.data);
      setSuccess("College updated successfully!");
    } catch {
      setError("Update failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] flex flex-col font-['Nunito'] transition-all duration-300">
        <AdminNavBar />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-[14px] font-black tracking-widest uppercase text-[#6C5CE7] animate-pulse m-0">
            Loading College...
          </p>
        </div>
      </div>
    );
  }

  if (!college) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] flex flex-col font-['Nunito'] transition-all duration-300">
        <AdminNavBar />
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="bg-[#F5F6FA] border-2 border-dashed border-[#A29BFE] border-opacity-30 rounded-[24px] p-10 text-center shadow-sm">
            <p className="text-[13px] font-black uppercase tracking-widest text-[#2D3436] opacity-60 m-0">
              College not found.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const abbr = (college.name || "C")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#2D3436] flex flex-col font-['Nunito'] transition-all duration-300">
      <AdminNavBar />

      <div className="max-w-6xl mx-auto w-full p-4 md:p-6 flex flex-col md:flex-row gap-6 lg:gap-8 mt-4 animate-fade-in-up">
        {/* Tighter Sidebar Profile Info */}
        <aside className="w-full md:w-[320px] flex-shrink-0 bg-[#FFFFFF] p-6 lg:p-8 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(108,92,231,0.08)] transition-all duration-500 border border-[#F5F6FA] h-max flex flex-col gap-6">
          <div className="flex flex-col items-center gap-4">
            <div className="w-24 h-24 bg-[#F5F6FA] border border-transparent rounded-[24px] flex items-center justify-center text-[28px] font-black text-[#6C5CE7] shadow-sm transform hover:rotate-3 transition-transform duration-300">
              {abbr}
            </div>

            <div className="text-center w-full">
              <h2 className="text-[20px] font-black text-[#6C5CE7] m-0 mb-2 leading-tight tracking-tight">
                {college.name || "College"}
              </h2>
              {college.website && (
                <a
                  className="text-[13px] font-black text-[#2D3436] opacity-80 underline decoration-[#6C5CE7] decoration-2 underline-offset-4 hover:opacity-100 hover:text-[#6C5CE7] transition-all duration-300 inline-block truncate w-full px-2"
                  href={college.website}
                  target="_blank"
                  rel="noreferrer"
                >
                  {college.website.replace(/^https?:\/\//, "")}
                </a>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-6 border-t border-[#F5F6FA]">
            <div className="flex flex-col gap-1 p-3 bg-[#F5F6FA] rounded-[16px] hover:bg-opacity-70 transition-colors">
              <span className="text-[10px] font-black text-[#6C5CE7] uppercase tracking-widest">
                College ID
              </span>
              <span className="text-[13px] font-mono font-bold text-[#2D3436] break-all">
                {id}
              </span>
            </div>
            <div className="flex flex-col gap-1 p-3 bg-[#F5F6FA] rounded-[16px] hover:bg-opacity-70 transition-colors">
              <span className="text-[10px] font-black text-[#6C5CE7] uppercase tracking-widest">
                Phone
              </span>
              <span className="text-[13px] font-bold text-[#2D3436]">
                {college.phone || "—"}
              </span>
            </div>
            <div className="flex flex-col gap-1 p-3 bg-[#F5F6FA] rounded-[16px] hover:bg-opacity-70 transition-colors">
              <span className="text-[10px] font-black text-[#6C5CE7] uppercase tracking-widest">
                Address
              </span>
              <span className="text-[13px] font-bold text-[#2D3436] leading-relaxed">
                {college.address || "—"}
              </span>
            </div>
          </div>

          {college.description && (
            <div className="pt-6 border-t border-[#F5F6FA] flex flex-col gap-2">
              <span className="text-[11px] font-black text-[#6C5CE7] uppercase tracking-widest px-1">
                About
              </span>
              <p className="text-[13px] text-[#2D3436] font-medium leading-relaxed m-0 opacity-80 px-1">
                {college.description}
              </p>
            </div>
          )}
        </aside>

        {/* Tighter Main Form */}
        <main className="flex-1 bg-[#FFFFFF] p-6 lg:p-8 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(108,92,231,0.08)] transition-all duration-500 border border-[#F5F6FA]">
          <header className="mb-8 flex flex-col gap-2 border-b border-[#F5F6FA] pb-6">
            <h1 className="text-[26px] font-black text-[#6C5CE7] m-0 tracking-tight">
              Edit College
            </h1>
            <p className="text-[14px] font-bold text-[#2D3436] opacity-60 m-0">
              Modify this institution's details
            </p>
          </header>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-6"
          >
            {error && (
              <div className="px-5 py-4 text-[13px] font-bold text-rose-600 bg-rose-50 border border-rose-200 rounded-[16px] animate-pulse shadow-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="px-5 py-4 text-[13px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-[16px] shadow-sm">
                {success}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label
                className="text-[11px] font-black text-[#2D3436] opacity-60 uppercase tracking-widest px-1"
                htmlFor="name"
              >
                College Name
              </label>
              <input
                id="name"
                name="name"
                value={college.name || ""}
                onChange={handleChange}
                placeholder="e.g. MIT College of Engineering"
                required
                className="w-full px-5 py-3.5 text-[14px] font-bold text-[#2D3436] bg-[#F5F6FA] border border-transparent rounded-[16px] outline-none transition-all duration-300 hover:border-[#6C5CE7] focus:border-[#6C5CE7] focus:ring-1 focus:ring-[#6C5CE7] placeholder-[#2D3436] placeholder-opacity-40"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-[11px] font-black text-[#2D3436] opacity-60 uppercase tracking-widest px-1"
                  htmlFor="website"
                >
                  Website
                </label>
                <input
                  id="website"
                  name="website"
                  value={college.website || ""}
                  onChange={handleChange}
                  placeholder="https://yourcollege.edu"
                  type="url"
                  className="w-full px-5 py-3.5 text-[14px] font-bold text-[#2D3436] bg-[#F5F6FA] border border-transparent rounded-[16px] outline-none transition-all duration-300 hover:border-[#6C5CE7] focus:border-[#6C5CE7] focus:ring-1 focus:ring-[#6C5CE7] placeholder-[#2D3436] placeholder-opacity-40"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-[11px] font-black text-[#2D3436] opacity-60 uppercase tracking-widest px-1"
                  htmlFor="phone"
                >
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  value={college.phone || ""}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full px-5 py-3.5 text-[14px] font-bold text-[#2D3436] bg-[#F5F6FA] border border-transparent rounded-[16px] outline-none transition-all duration-300 hover:border-[#6C5CE7] focus:border-[#6C5CE7] focus:ring-1 focus:ring-[#6C5CE7] placeholder-[#2D3436] placeholder-opacity-40"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                className="text-[11px] font-black text-[#2D3436] opacity-60 uppercase tracking-widest px-1"
                htmlFor="address"
              >
                Address
              </label>
              <input
                id="address"
                name="address"
                value={college.address || ""}
                onChange={handleChange}
                placeholder="123 University Road, City, State"
                className="w-full px-5 py-3.5 text-[14px] font-bold text-[#2D3436] bg-[#F5F6FA] border border-transparent rounded-[16px] outline-none transition-all duration-300 hover:border-[#6C5CE7] focus:border-[#6C5CE7] focus:ring-1 focus:ring-[#6C5CE7] placeholder-[#2D3436] placeholder-opacity-40"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                className="text-[11px] font-black text-[#2D3436] opacity-60 uppercase tracking-widest px-1"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={5}
                value={college.description || ""}
                onChange={handleChange}
                placeholder="Write a brief description of the institution..."
                className="w-full px-5 py-4 text-[14px] font-bold text-[#2D3436] bg-[#F5F6FA] border border-transparent rounded-[16px] outline-none resize-y transition-all duration-300 hover:border-[#6C5CE7] focus:border-[#6C5CE7] focus:ring-1 focus:ring-[#6C5CE7] placeholder-[#2D3436] placeholder-opacity-40"
              />
            </div>

            <div className="pt-4 flex justify-end border-t border-[#F5F6FA]">
              <button
                type="submit"
                disabled={saving}
                className="w-full md:w-auto px-10 py-4 text-[13px] font-black uppercase tracking-widest text-[#FFFFFF] bg-[#6C5CE7] border-none rounded-[16px] cursor-pointer hover:bg-opacity-90 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-md flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-[#FFFFFF] border-t-transparent animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
