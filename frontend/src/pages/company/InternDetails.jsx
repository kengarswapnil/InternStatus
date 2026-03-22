import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { useParams, useNavigate } from "react-router-dom";

export default function InternDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ certificate states
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

  // ================= MENTOR =================
  const assignMentor = async (mentorId) => {
    if (!mentorId) return;

    if (data.status !== "offer_accepted") {
      alert("Mentor can only be assigned before internship starts.");
      return;
    }

    try {
      setLoading(true);

      await API.patch(`/company/${id}/assign-mentor`, {
        mentorId,
      });

      await fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Mentor assignment failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= CERTIFICATE =================
  const handleCertificateUpload = async () => {
    if (!certificateFile) {
      alert("Please select a certificate file");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("certificate", certificateFile);

      await API.post(
        `/company/applications/${id}/certificate`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      alert("Certificate issued successfully");

      setCertificateFile(null);
      await fetchData();

    } catch (err) {
      alert(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // ================= STATUS UI =================
  const getStatusBadge = (status) => {
    let colorClass = "bg-white/10 text-white/80 border-white/20";
    if (status === "offer_accepted")
      colorClass = "bg-violet-500/20 text-violet-300 border-violet-500/30";
    else if (status === "ongoing")
      colorClass = "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30";
    else if (status === "completed")
      colorClass = "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
    else if (["terminated", "rejected"].includes(status))
      colorClass = "bg-red-500/10 text-red-400 border-red-500/20";

    return (
      <span className={`inline-block px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${colorClass}`}>
        {status.replace("_", " ")}
      </span>
    );
  };

  if (!data) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  const s = data.studentSnapshot || {};
  const report = data.report || {};

  // ✅ flags
  const isCompleted = data.status === "completed";
  const hasCertificate = !!data.certificateUrl;
  const canUploadCertificate = isCompleted && !hasCertificate;

  const mentorLocked = data.status !== "offer_accepted";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0F19] p-6 text-white">

      <div className="w-full max-w-3xl bg-white/5 p-8 rounded-2xl border border-white/10">

        <h2 className="text-2xl font-bold mb-6">Intern Details</h2>

        {/* ================= STUDENT INFO ================= */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>{s.fullName}</div>
          <div>{s.email}</div>
          <div>{s.phoneNo}</div>
          <div>{getStatusBadge(data.status)}</div>
        </div>

        {/* ================= PROGRESS ================= */}
        {["ongoing", "completed"].includes(data.status) && (
          <button
            onClick={() => navigate(`/company/interns/${id}/progress`)}
            className="mb-6 px-4 py-2 bg-blue-600 rounded"
          >
            View Progress
          </button>
        )}

        {/* ================= REPORT ================= */}
        {isCompleted && report?.reportUrl && (
          <div className="mb-6">
            <button
              onClick={() => window.open(report.reportUrl, "_blank")}
              className="px-4 py-2 bg-gray-700 rounded"
            >
              View Report
            </button>
          </div>
        )}

        {/* ================= CERTIFICATE ================= */}
        {isCompleted && (
          <div className="mb-6 flex flex-col gap-3">

            {/* upload */}
            {canUploadCertificate && (
              <>
                <input
                  type="file"
                  accept=".pdf,.jpg,.png"
                  onChange={(e) => setCertificateFile(e.target.files[0])}
                />

                <button
                  onClick={handleCertificateUpload}
                  disabled={uploading}
                  className="px-4 py-2 bg-purple-600 rounded"
                >
                  {uploading ? "Uploading..." : "Issue Certificate"}
                </button>
              </>
            )}

            {/* view */}
            {hasCertificate && (
              <button
                onClick={() => window.open(data.certificateUrl, "_blank")}
                className="px-4 py-2 bg-green-600 rounded"
              >
                View Certificate
              </button>
            )}
          </div>
        )}

        {/* ================= MENTOR ================= */}
        <div className="mt-6">
          <select
            value={data.mentor?._id || ""}
            onChange={(e) => assignMentor(e.target.value)}
            disabled={loading || mentorLocked}
            className="p-2 text-black"
          >
            <option value="">Select Mentor</option>
            {mentors.map((m) => (
              <option key={m._id} value={m._id}>
                {m.fullName}
              </option>
            ))}
          </select>
        </div>

      </div>
    </div>
  );
}