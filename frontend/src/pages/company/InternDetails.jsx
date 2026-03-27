import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { useParams, useNavigate } from "react-router-dom";

// Helper for dynamic status colors - Preserved as requested
const getStatusStyles = (status) => {
  if (["completed", "offer_accepted", "selected"].includes(status)) {
    return "bg-[#f9f9f9] border-[#008000] text-[#008000]"; 
  } else if (["terminated", "rejected", "revision_requested"].includes(status)) {
    return "bg-[#fff] border-[#cc0000] text-[#cc0000]"; 
  }
  return "bg-[#2D3436] text-[#FFFFFF] border-[#2D3436]"; 
};

export default function InternDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [certificateFile, setCertificateFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchData = async () => {
    try {
      const res = await API.get(`/applications/${id}`);
      setData(res.data.data);
      const mentorRes = await API.get("/company/mentors");
      setMentors(mentorRes.data.data || []);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to load data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssignMentor = async () => {
    if (!selectedMentor) return;
    if (!["offer_accepted", "ongoing"].includes(data.status)) {
      alert("Mentor can only be changed before or during internship.");
      return;
    }
    try {
      setLoading(true);
      await API.patch(`/company/${id}/assign-mentor`, {
        mentorId: selectedMentor._id,
      });
      alert("Mentor updated successfully");
      setShowModal(false);
      setSelectedMentor(null);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to assign mentor");
    } finally {
      setLoading(false);
    }
  };

  const handleCertificateUpload = async () => {
    if (!certificateFile) {
      alert("Please select a certificate file");
      return;
    }
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("certificate", certificateFile);
      await API.post(`/company/applications/${id}/certificate`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Certificate issued successfully");
      setCertificateFile(null);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center font-['Nunito']">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#F5F6FA] border-t-[#6C5CE7] rounded-full animate-spin"></div>
          <p className="text-[12px] font-black text-[#2D3436] opacity-40 uppercase tracking-[0.3em]">
            Syncing Profile Data
          </p>
        </div>
      </div>
    );
  }

  const s = data.studentSnapshot || {};
  const report = data.report || {};
  const isCompleted = data.status === "completed";
  const hasCertificate = !!data.certificateUrl;
  const canUploadCertificate = isCompleted && !hasCertificate;

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#2D3436] font-['Nunito'] pb-16 selection:bg-[#6C5CE7]/10">
      <main className="max-w-5xl mx-auto w-full px-4 md:px-8 py-8 flex flex-col gap-8">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex flex-col gap-1">
            <h1 className="text-[28px] md:text-[34px] font-black text-[#2D3436] tracking-tighter leading-tight m-0">
              Intern Profile
            </h1>
            <p className="text-[10px] font-black text-[#6C5CE7] uppercase tracking-[0.4em] m-0">
              Performance & Records
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 bg-[#F5F6FA] text-[#2D3436] text-[10px] font-black rounded-xl hover:bg-[#2D3436] hover:text-[#FFFFFF] transition-all uppercase tracking-widest border-none cursor-pointer"
            >
              Back
            </button>
            <span
              className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] border ${getStatusStyles(
                data.status
              )} transition-all duration-300 shadow-sm`}
            >
              {data.status ? data.status.replace("_", " ") : "UNKNOWN"}
            </span>
          </div>
        </header>

        {/* Student Bio Card */}
        <section className="bg-[#F5F6FA] rounded-[35px] p-8 md:p-10 border border-[#2D3436]/5 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          <h3 className="text-[10px] font-black text-[#6C5CE7] opacity-60 m-0 uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6C5CE7]"></span>
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <DataField label="Legal Full Name" value={s.fullName} />
            <DataField label="Registered Email" value={s.email} isEmail />
            <DataField label="Contact Number" value={s.phoneNo} />
          </div>
        </section>

        {/* Dual Management Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          {/* Tracking Card */}
          <div className="bg-[#FFFFFF] border-2 border-[#F5F6FA] rounded-[35px] p-8 shadow-xl shadow-[#2D3436]/5 flex flex-col justify-between group">
            <div>
              <h3 className="text-[10px] font-black text-[#2D3436]/40 m-0 uppercase tracking-[0.3em] mb-6">
                Work Monitoring
              </h3>
              <p className="text-[14px] font-bold text-[#2D3436]/70 mb-8 leading-relaxed">
                Analyze weekly progress logs, task completion rates, and historical performance metrics.
              </p>
            </div>
            {["ongoing", "completed"].includes(data.status) && (
              <button
                onClick={() => navigate(`/company/interns/${id}/progress`)}
                className="w-full py-4 bg-[#6C5CE7] text-[#FFFFFF] text-[11px] font-black rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest shadow-lg shadow-[#6C5CE7]/30 border-none cursor-pointer"
              >
                Open Progress Dashboard
              </button>
            )}
          </div>

          {/* Mentor Card */}
          <div className="bg-[#FFFFFF] border-2 border-[#F5F6FA] rounded-[35px] p-8 shadow-xl shadow-[#2D3436]/5 flex flex-col justify-between">
            <div>
              <h3 className="text-[10px] font-black text-[#2D3436]/40 m-0 uppercase tracking-[0.3em] mb-6">
                Supervision
              </h3>
              <div className="mb-8">
                <span className="text-[9px] font-black text-[#6C5CE7] uppercase tracking-widest block mb-2">
                  Active Mentor
                </span>
                <div className="text-[18px] font-black text-[#2D3436]">
                  {data.mentor?.fullName || "Unassigned"}
                </div>
                {data.mentor && (
                  <div className="text-[11px] font-bold text-[#2D3436]/50 mt-1 uppercase tracking-tighter">
                    {data.mentor.designation} • {data.mentor.department}
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="w-full py-4 bg-[#FFFFFF] border-2 border-[#2D3436] text-[#2D3436] text-[11px] font-black rounded-2xl hover:bg-[#2D3436] hover:text-[#FFFFFF] transition-all uppercase tracking-widest cursor-pointer"
            >
              Update Mentor
            </button>
          </div>
        </div>

        {/* Certification Section */}
        {isCompleted && (
          <section className="bg-[#FFFFFF] border border-[#F5F6FA] rounded-[35px] p-8 md:p-10 shadow-2xl shadow-[#2D3436]/5 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <h3 className="text-[10px] font-black text-[#2D3436]/40 m-0 uppercase tracking-[0.3em] mb-8 border-b border-[#F5F6FA] pb-6">
              Official Certification
            </h3>

            <div className="flex flex-col gap-8">
              {report?.reportUrl && (
                <div className="flex items-center justify-between p-6 bg-[#F5F6FA] rounded-[25px]">
                  <div>
                    <span className="text-[14px] font-black block">Final Internship Report</span>
                    <span className="text-[10px] font-bold text-[#2D3436]/40 uppercase tracking-widest">Submitted by Student</span>
                  </div>
                  <button
                    onClick={() => window.open(report.reportUrl, "_blank")}
                    className="px-6 py-3 bg-[#FFFFFF] text-[#6C5CE7] text-[10px] font-black rounded-xl hover:bg-[#6C5CE7] hover:text-[#FFFFFF] transition-all uppercase tracking-widest shadow-sm border-none cursor-pointer"
                  >
                    Review PDF
                  </button>
                </div>
              )}

              <div className="flex flex-col gap-4">
                <span className="text-[10px] font-black text-[#6C5CE7] uppercase tracking-[0.2em]">
                  Credential Issuance
                </span>

                {canUploadCertificate && (
                  <div className="flex flex-col sm:flex-row gap-4 p-2 bg-[#F5F6FA] rounded-[22px]">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.png"
                      onChange={(e) => setCertificateFile(e.target.files[0])}
                      className="flex-1 text-[11px] font-black bg-transparent p-4 outline-none cursor-pointer"
                    />
                    <button
                      onClick={handleCertificateUpload}
                      disabled={uploading}
                      className="px-8 py-4 bg-[#6C5CE7] text-[#FFFFFF] text-[10px] font-black rounded-xl hover:opacity-90 transition-all uppercase tracking-widest disabled:opacity-30 border-none cursor-pointer"
                    >
                      {uploading ? "Processing..." : "Generate Certificate"}
                    </button>
                  </div>
                )}

                {hasCertificate && (
                  <div className="flex items-center justify-between p-6 bg-[#6C5CE7]/5 rounded-[25px] border border-[#6C5CE7]/20">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-[#008000] animate-pulse"></div>
                      <span className="text-[12px] font-black text-[#008000] uppercase tracking-widest">
                        Digital Record Issued
                      </span>
                    </div>
                    <button
                      onClick={() => window.open(data.certificateUrl, "_blank")}
                      className="px-6 py-3 bg-[#6C5CE7] text-[#FFFFFF] text-[10px] font-black rounded-xl hover:scale-105 transition-all uppercase tracking-widest shadow-lg shadow-[#6C5CE7]/30 border-none cursor-pointer"
                    >
                      View Certificate
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Modern Modal Overhaul */}
      {showModal && (
        <div className="fixed inset-0 bg-[#2D3436]/60 backdrop-blur-md flex justify-center items-center z-50 p-6 animate-in fade-in duration-300">
          <div className="bg-[#FFFFFF] rounded-[40px] shadow-2xl w-full max-w-xl flex flex-col max-h-[85vh] overflow-hidden">
            <header className="px-8 py-6 border-b border-[#F5F6FA] flex justify-between items-center bg-[#F5F6FA]/30">
              <h3 className="text-[20px] font-black text-[#2D3436] tracking-tight">Assign Supervisor</h3>
              <button
                onClick={() => { setShowModal(false); setSelectedMentor(null); }}
                className="w-8 h-8 rounded-full bg-[#FFFFFF] flex items-center justify-center text-[18px] font-light hover:bg-[#2D3436] hover:text-white transition-all cursor-pointer border-none shadow-sm"
              >
                ×
              </button>
            </header>

            <div className="p-6 overflow-y-auto space-y-3 custom-scrollbar">
              {mentors.map((m) => (
                <div
                  key={m._id}
                  onClick={() => setSelectedMentor(m)}
                  className={`p-5 rounded-[22px] cursor-pointer transition-all duration-300 border-2 ${
                    selectedMentor?._id === m._id
                      ? "bg-[#6C5CE7] border-[#6C5CE7] translate-x-2"
                      : "bg-[#FFFFFF] border-[#F5F6FA] hover:border-[#6C5CE7]/30 hover:bg-[#F5F6FA]"
                  }`}
                >
                  <div className={`text-[15px] font-black ${selectedMentor?._id === m._id ? "text-white" : "text-[#2D3436]"}`}>
                    {m.fullName}
                  </div>
                  <div className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${selectedMentor?._id === m._id ? "text-white/70" : "text-[#2D3436]/40"}`}>
                    {m.designation || "Faculty"} • {m.department}
                  </div>
                </div>
              ))}
            </div>

            <footer className="p-8 border-t border-[#F5F6FA] flex justify-end gap-4">
              <button
                onClick={() => { setShowModal(false); setSelectedMentor(null); }}
                className="px-6 py-3 text-[10px] font-black text-[#2D3436] bg-[#F5F6FA] rounded-xl hover:bg-[#2D3436] hover:text-white transition-all uppercase tracking-widest border-none cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignMentor}
                disabled={!selectedMentor || loading}
                className="px-8 py-3 bg-[#6C5CE7] text-white text-[10px] font-black rounded-xl hover:shadow-lg hover:shadow-[#6C5CE7]/30 transition-all uppercase tracking-widest disabled:opacity-30 border-none cursor-pointer"
              >
                Confirm Assignment
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}

/* --- Styled Utility Component --- */

function DataField({ label, value, isEmail }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[9px] font-black text-[#2D3436]/40 uppercase tracking-[0.2em]">
        {label}
      </span>
      <span className={`font-black text-[#2D3436] leading-none ${isEmail ? 'text-[14px] opacity-70 break-all' : 'text-[17px] tracking-tight'}`}>
        {value || "—"}
      </span>
    </div>
  );
}