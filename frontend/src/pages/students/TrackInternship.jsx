import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/api";

export default function TrackInternship() {

  const { applicationId } = useParams();
  const navigate = useNavigate();

  const [internship, setInternship] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [report, setReport] = useState(null);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // ================= FETCH =================
  const fetchData = async () => {
    try {
      const [internRes, taskRes, reportRes] = await Promise.all([
        API.get(`/students/internship/${applicationId}/track`),
        API.get(`/tasks/application/${applicationId}`),
        API.get(`/reports/${applicationId}`)
      ]);

      setInternship(internRes.data.data);
      setTasks(taskRes.data.data || []);
      setReport(reportRes.data || null);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [applicationId]);

  // ================= STATUS =================
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "ongoing":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  console.log("INTERNSHIP DATA:", internship);

  const isCompleted = internship?.status === "completed";
  const isGenerated = report?.isLocked;
  const isSubmitted = report?.status === "faculty_pending";

  const hasCertificate = !!internship?.certificateUrl;

  // ================= ACTIONS =================
  const handleGenerate = async () => {
    if (isGenerated) return;

    try {
      setActionLoading(true);
      await API.post(`/reports/generate/${applicationId}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || "Failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDownloadReport = () => {
    if (!report?.reportUrl) return;
    window.open(report.reportUrl, "_blank");
  };

  const handleSubmit = async () => {
    try {
      setActionLoading(true);
      await API.post(`/reports/submit/${applicationId}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || "Failed");
    } finally {
      setActionLoading(false);
    }
  };

  // ✅ CERTIFICATE VIEW
  const handleViewCertificate = () => {
    if (!internship?.certificateUrl) return;
    window.open(internship.certificateUrl, "_blank");
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">

      {/* ================= INTERNSHIP ================= */}
      <div className="bg-white border rounded-lg p-6 shadow mb-8">

        <h1 className="text-2xl font-bold mb-2">
          {internship?.internship?.title}
        </h1>

        <p className="text-gray-600">
          Company: {internship?.company?.name}
        </p>

        <p className="text-gray-600">
          Mentor: {internship?.mentor?.fullName || "Not assigned"}
        </p>

        <p className={`mt-2 inline-block px-2 py-1 rounded text-sm ${getStatusColor(internship?.status)}`}>
          {internship?.status}
        </p>

        {/* ================= REPORT STATUS ================= */}
        {isGenerated && (
          <p className="mt-2 text-sm text-green-600">
            Report Generated
          </p>
        )}

        {isSubmitted && (
          <p className="text-sm text-purple-600">
            Submitted to Faculty
          </p>
        )}

        {/* ================= ACTIONS ================= */}
        {isCompleted && (
          <div className="mt-4 flex gap-3 flex-wrap">

            {/* GENERATE REPORT */}
            {!isGenerated && (
              <button
                onClick={handleGenerate}
                disabled={actionLoading}
                className="px-4 py-2 rounded text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
              >
                {actionLoading ? "Generating..." : "Generate Report"}
              </button>
            )}

            {/* DOWNLOAD REPORT */}
            {isGenerated && (
              <button
                onClick={handleDownloadReport}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Download Report
              </button>
            )}

            {/* SUBMIT REPORT */}
            {isGenerated && (
              <button
                disabled={isSubmitted || actionLoading}
                onClick={handleSubmit}
                className={`px-4 py-2 rounded text-white ${
                  isSubmitted
                    ? "bg-gray-400"
                    : "bg-purple-600 hover:bg-purple-700"
                }`}
              >
                {actionLoading
                  ? "Processing..."
                  : isSubmitted
                  ? "Submitted"
                  : "Submit Report"}
              </button>
            )}

            {/* 🔥 CERTIFICATE BUTTON (FINAL FIX) */}
            {hasCertificate && (
              <button
                onClick={handleViewCertificate}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                View Certificate
              </button>
            )}

          </div>
        )}

      </div>

      {/* ================= TASKS ================= */}
      <h2 className="text-xl font-semibold mb-4">Assigned Tasks</h2>

      {tasks.length === 0 ? (
        <div className="text-gray-500">No tasks assigned</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <div key={task._id} className="border rounded-lg p-4 shadow bg-white">

              <h3 className="font-semibold text-lg">{task.title}</h3>

              <p className="text-sm text-gray-600 mt-1">
                {task.description}
              </p>

              <div className="mt-2 text-sm text-gray-500">
                Assigned: {new Date(task.assignedAt).toLocaleDateString()}
              </div>

              <div className="text-sm text-gray-500">
                Deadline: {
                  task.deadline
                    ? new Date(task.deadline).toLocaleDateString()
                    : "No deadline"
                }
              </div>

              <div className="mt-3">
                <span className={`text-xs px-2 py-1 rounded capitalize ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
              </div>

              <button
                onClick={() => navigate(`/student/task/${task._id}`)}
                className="mt-3 px-3 py-1 bg-blue-600 text-white rounded text-sm"
              >
                View Task
              </button>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}