import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../../api/api";

export default function AdminCompanyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCompany = async () => {
    try {
      const res = await API.get(`/admin/companies/${id}`);
      setCompany(res.data?.data || null);
    } catch (err) {
      console.error("Fetch company error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompany();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FFFFFF] font-['Nunito'] transition-all duration-300">
        <div className="flex flex-col items-center gap-4 animate-in fade-in duration-700">
          <div className="w-12 h-12 border-4 border-[#F5F6FA] border-t-[#6C5CE7] rounded-full animate-spin"></div>
          <p className="text-[#6C5CE7] font-black tracking-widest uppercase text-[11px] animate-pulse m-0">
            Fetching Entity Data
          </p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FFFFFF] p-4 font-['Nunito']">
        <div className="bg-[#FFFFFF] border border-[#F5F6FA] rounded-[32px] p-12 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-in zoom-in duration-500">
          <p className="text-[#2D3436] opacity-40 m-0 text-sm font-black uppercase tracking-widest">
            Company not found
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF] p-4 md:p-10 font-['Nunito'] text-[#2D3436] selection:bg-[#6C5CE7]/20 selection:text-[#6C5CE7] transition-all duration-300">
      <div className="max-w-5xl mx-auto flex flex-col gap-8 md:gap-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Back Button */}
        <button
          onClick={() => navigate("/admin/companies")}
          className="flex items-center text-[10px] font-black text-[#2D3436] opacity-60 uppercase tracking-widest hover:text-[#6C5CE7] hover:opacity-100 mb-2 transition-all bg-[#F5F6FA] border-none rounded-full px-4 py-2 cursor-pointer outline-none w-max transform hover:-translate-x-1"
        >
          ← Back to Directory
        </button>

        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-6 bg-[#FFFFFF] p-6 md:p-10 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#F5F6FA] transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] group">
          <div className="space-y-1">
            <h2 className="text-[28px] md:text-3xl font-black m-0 tracking-tighter text-[#2D3436] uppercase group-hover:text-[#6C5CE7] transition-colors duration-300">
              Company Details
            </h2>
            <p className="text-[12px] font-black text-[#2D3436] opacity-40 uppercase tracking-[0.2em] m-0">
              System ID: {id}
            </p>
          </div>
          <button
            onClick={() => navigate(`/admin/companies/edit/${company._id}`)}
            className="px-8 py-4 text-[12px] font-black text-[#FFFFFF] bg-[#6C5CE7] border border-[#6C5CE7] rounded-[16px] cursor-pointer transition-all duration-300 hover:shadow-[0_10px_25px_-5px_rgba(108,92,231,0.4)] hover:-translate-y-1 active:scale-95 uppercase tracking-widest shadow-md"
          >
            Edit Company
          </button>
        </header>

        {/* Basic Information Section */}
        <div className="bg-[#FFFFFF] p-6 md:p-10 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#F5F6FA] transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
          <h3 className="text-[12px] font-black text-[#6C5CE7] mt-0 mb-8 border-b border-[#F5F6FA] pb-5 uppercase tracking-widest border-l-4 border-[#6C5CE7] pl-4">
            Core Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2 bg-[#F5F6FA] p-6 rounded-[20px] border border-transparent hover:border-[#6C5CE7]/30 transition-all duration-300">
              <span className="text-[10px] font-black text-[#2D3436] opacity-50 uppercase tracking-widest">
                Entity Name
              </span>
              <span className="text-[15px] font-black text-[#2D3436]">
                {company.name}
              </span>
            </div>

            <div className="flex flex-col gap-2 bg-[#F5F6FA] p-6 rounded-[20px] border border-transparent hover:border-[#6C5CE7]/30 transition-all duration-300">
              <span className="text-[10px] font-black text-[#2D3436] opacity-50 uppercase tracking-widest">
                Account Status
              </span>
              <span
                className={`text-[11px] font-black tracking-widest uppercase w-max px-3 py-1 rounded-[8px] border bg-[#FFFFFF] shadow-sm ${
                  company.status === "active"
                    ? "text-[#166534] border-[#bbf7d0]"
                    : "text-[#991b1b] border-[#fecaca]"
                }`}
              >
                {company.status}
              </span>
            </div>

            <div className="flex flex-col gap-2 bg-[#F5F6FA] p-6 rounded-[20px] border border-transparent hover:border-[#6C5CE7]/30 transition-all duration-300">
              <span className="text-[10px] font-black text-[#2D3436] opacity-50 uppercase tracking-widest">
                Industry Segment
              </span>
              <span className="text-[14px] font-bold text-[#2D3436]">
                {company.industry || "—"}
              </span>
            </div>

            <div className="flex flex-col gap-2 bg-[#F5F6FA] p-6 rounded-[20px] border border-transparent hover:border-[#6C5CE7]/30 transition-all duration-300">
              <span className="text-[10px] font-black text-[#2D3436] opacity-50 uppercase tracking-widest">
                Workforce Size
              </span>
              <span className="text-[14px] font-bold text-[#2D3436]">
                {company.companySize || "—"}
              </span>
            </div>

            <div className="flex flex-col gap-2 bg-[#F5F6FA] p-6 rounded-[20px] border border-transparent hover:border-[#6C5CE7]/30 transition-all duration-300">
              <span className="text-[10px] font-black text-[#2D3436] opacity-50 uppercase tracking-widest">
                Official Website
              </span>
              <a
                href={company.website}
                target="_blank"
                rel="noreferrer"
                className="text-[14px] font-black text-[#6C5CE7] underline underline-offset-4 decoration-[#6C5CE7]/30 hover:decoration-[#6C5CE7] truncate transition-all"
              >
                {company.website || "—"}
              </a>
            </div>

            <div className="flex flex-col gap-2 bg-[#F5F6FA] p-6 rounded-[20px] border border-transparent hover:border-[#6C5CE7]/30 transition-all duration-300">
              <span className="text-[10px] font-black text-[#2D3436] opacity-50 uppercase tracking-widest">
                Internal Email Domain
              </span>
              <span className="text-[14px] font-bold text-[#2D3436] font-mono">
                {company.emailDomain || "—"}
              </span>
            </div>

            <div className="flex flex-col gap-3 bg-[#F5F6FA] p-6 rounded-[20px] border border-transparent hover:border-[#6C5CE7]/30 transition-all duration-300 md:col-span-2">
              <span className="text-[10px] font-black text-[#2D3436] opacity-50 uppercase tracking-widest">
                Corporate Description
              </span>
              <span className="text-[14px] font-bold text-[#2D3436] opacity-80 leading-relaxed">
                {company.description ||
                  "No description provided for this entity."}
              </span>
            </div>
          </div>
        </div>

        {/* Locations Section */}
        <div className="bg-[#FFFFFF] p-6 md:p-10 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#F5F6FA] transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
          <h3 className="text-[12px] font-black text-[#6C5CE7] mt-0 mb-8 border-b border-[#F5F6FA] pb-5 uppercase tracking-widest border-l-4 border-[#6C5CE7] pl-4">
            Geographic Locations
          </h3>

          {!company.locations || company.locations.length === 0 ? (
            <div className="px-6 py-16 text-center bg-[#F5F6FA] border-2 border-dashed border-[#6C5CE7]/20 rounded-[24px]">
              <p className="text-[#2D3436] opacity-30 m-0 text-[11px] font-black uppercase tracking-[0.2em]">
                No regional data documented
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {company.locations.map((loc, index) => (
                <div
                  key={index}
                  className="bg-[#F5F6FA] border border-transparent p-8 rounded-[24px] flex flex-col gap-5 transition-all duration-300 hover:bg-[#FFFFFF] hover:border-[#6C5CE7] hover:shadow-lg group"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-black text-[#6C5CE7] uppercase tracking-widest">
                      City
                    </span>
                    <span className="text-[16px] font-black text-[#2D3436]">
                      {loc.city}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-black text-[#2D3436] opacity-40 uppercase tracking-widest">
                      State / Province
                    </span>
                    <span className="text-[14px] font-bold text-[#2D3436]">
                      {loc.state}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-black text-[#2D3436] opacity-40 uppercase tracking-widest">
                      Country
                    </span>
                    <span className="text-[13px] font-bold text-[#2D3436] opacity-60">
                      {loc.country}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Meta */}
        <footer className="mt-4 flex justify-end">
          <div className="bg-[#F5F6FA] px-6 py-3 rounded-2xl">
            <p className="text-[10px] font-black text-[#2D3436] opacity-30 uppercase tracking-widest m-0">
              Record Last Verified: {new Date().toLocaleDateString()}
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
