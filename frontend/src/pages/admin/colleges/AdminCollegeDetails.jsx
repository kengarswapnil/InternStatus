import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../../api/api";

export default function AdminCollegeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCollege = async () => {
    try {
      const res = await API.get(`/admin/colleges/${id}`);
      setCollege(res.data?.data || null);
    } catch (err) {
      console.error("Fetch college error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollege();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0B0F19]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-white/10 border-t-fuchsia-500 rounded-full animate-spin"></div>
          <p className="text-fuchsia-400 font-medium tracking-widest uppercase text-xs animate-pulse m-0">
            Loading Details
          </p>
        </div>
      </div>
    );
  }

  if (!college) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0B0F19]">
        <div className="bg-[#0B0F19]/50 border border-white/10 rounded-2xl p-12 text-center shadow-inner">
          <p className="text-white/40 m-0 text-base font-medium">
            College not found
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] p-4 md:p-8 font-sans text-white selection:bg-fuchsia-500/30 selection:text-fuchsia-200">
      <div className="max-w-5xl mx-auto flex flex-col gap-6 md:gap-8">
        <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white/5 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] border border-white/10 transition-all duration-300 hover:border-white/20">
          <h2 className="text-3xl font-black m-0 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
            College Details
          </h2>
          <button
            onClick={() => navigate(`/admin/colleges/edit/${college._id}`)}
            className="px-8 py-3.5 text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 border-none rounded-xl cursor-pointer transition-all duration-300 hover:shadow-[0_8px_20px_-6px_rgba(217,70,239,0.5)] hover:-translate-y-0.5 uppercase tracking-widest"
          >
            Edit College
          </button>
        </header>

        <div className="bg-white/5 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] border border-white/10 transition-all duration-300 hover:border-white/20">
          <h3 className="text-sm font-bold text-violet-400 mt-0 mb-6 border-b border-white/10 pb-4 uppercase tracking-widest">
            Basic Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5 bg-[#0B0F19]/30 p-5 rounded-2xl border border-white/5">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                Name
              </span>
              <span className="text-sm font-bold text-white/90">
                {college.name}
              </span>
            </div>
            <div className="flex flex-col gap-1.5 bg-[#0B0F19]/30 p-5 rounded-2xl border border-white/5">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                Status
              </span>
              <span
                className={`text-xs font-bold tracking-widest uppercase w-max ${
                  college.status === "active"
                    ? "text-emerald-400"
                    : "text-red-400"
                }`}
              >
                {college.status}
              </span>
            </div>
            <div className="flex flex-col gap-1.5 bg-[#0B0F19]/30 p-5 rounded-2xl border border-white/5">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                Phone
              </span>
              <span className="text-sm font-medium text-white/90">
                {college.phone || "—"}
              </span>
            </div>
            <div className="flex flex-col gap-1.5 bg-[#0B0F19]/30 p-5 rounded-2xl border border-white/5">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                Website
              </span>
              <span className="text-sm font-medium text-fuchsia-400">
                {college.website || "—"}
              </span>
            </div>
            <div className="flex flex-col gap-1.5 bg-[#0B0F19]/30 p-5 rounded-2xl border border-white/5">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                Email Domain
              </span>
              <span className="text-sm font-medium text-white/90">
                {college.emailDomain || "—"}
              </span>
            </div>
            <div className="flex flex-col gap-1.5 bg-[#0B0F19]/30 p-5 rounded-2xl border border-white/5 md:col-span-2">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                Address
              </span>
              <span className="text-sm font-medium text-white/90">
                {college.address || "—"}
              </span>
            </div>
            <div className="flex flex-col gap-1.5 bg-[#0B0F19]/30 p-5 rounded-2xl border border-white/5 md:col-span-2">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                Description
              </span>
              <span className="text-sm font-medium text-white/70 leading-relaxed">
                {college.description || "—"}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] border border-white/10 transition-all duration-300 hover:border-white/20">
          <h3 className="text-sm font-bold text-violet-400 mt-0 mb-6 border-b border-white/10 pb-4 uppercase tracking-widest">
            Courses
          </h3>

          {(!college.courses || college.courses.length === 0) && (
            <div className="px-6 py-12 text-center bg-[#0B0F19]/30 border border-white/5 rounded-2xl">
              <p className="text-white/40 m-0 text-sm font-medium">
                No courses added
              </p>
            </div>
          )}

          {college.courses && college.courses.length > 0 && (
            <div className="flex flex-col gap-5">
              {college.courses.map((course, index) => (
                <div
                  key={index}
                  className="bg-[#0B0F19]/30 border border-white/5 p-6 rounded-2xl flex flex-col gap-5 transition-all hover:border-white/10"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-fuchsia-400 uppercase tracking-widest">
                        Course Name
                      </span>
                      <span className="text-lg font-bold text-white/90">
                        {course.name}
                      </span>
                    </div>
                    <div className="flex flex-col md:items-end gap-1">
                      <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                        Duration
                      </span>
                      <span className="text-sm font-bold text-white/90">
                        {course.durationYears} years
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                      Specializations
                    </span>
                    {!course.specializations ||
                    course.specializations.length === 0 ? (
                      <span className="text-xs text-white/30 italic font-medium">
                        None specified
                      </span>
                    ) : (
                      <div className="flex flex-wrap gap-2.5">
                        {course.specializations.map((sp, i) => (
                          <span
                            key={i}
                            className="px-3 py-1.5 text-xs font-bold text-white/80 bg-white/5 border border-white/10 rounded-lg tracking-wide"
                          >
                            {sp}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}