import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { useParams, useNavigate } from "react-router-dom";

export default function InternProgress() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProgress = async () => {
    try {

      const res = await API.get(`/company/interns/${id}/progress`);
      setData(res.data.data);

    } catch (err) {

      alert(err.response?.data?.message || "Failed to load progress");

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading progress...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>No progress data found</p>
      </div>
    );
  }

  const { application, tasks, logs, reports } = data;
  const student = application.student || {};
  const mentor = application.mentor || {};
  const internship = application.internship || {};

  return (
    <div className="p-8 max-w-6xl mx-auto">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Intern Progress</h1>
        <p className="text-gray-500">
          Internship Monitoring Dashboard
        </p>
      </div>

      {/* INTERN INFO */}
      <div className="bg-white shadow rounded-xl p-6 mb-8">

        <h2 className="text-xl font-semibold mb-4">
          Intern Information
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

          <div>
            <p className="text-gray-500 text-sm">Name</p>
            <p className="font-medium">{student.fullName}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Email</p>
            <p className="font-medium">{student.email}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Mentor</p>
            <p className="font-medium">{mentor.fullName || "Not Assigned"}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Internship</p>
            <p className="font-medium">{internship.title}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Status</p>
            <p className="font-medium capitalize">{application.status}</p>
          </div>

        </div>
      </div>

      {/* TASKS */}
      <div className="bg-white shadow rounded-xl p-6 mb-8">

        <h2 className="text-xl font-semibold mb-4">
          Tasks
        </h2>

        {tasks.length === 0 ? (
          <p className="text-gray-500">No tasks assigned</p>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="border p-4 rounded-lg flex justify-between"
              >
                <div>
                  <p className="font-medium">{task.title}</p>
                  <p className="text-sm text-gray-500">
                    Deadline: {task.deadline?.slice(0, 10)}
                  </p>
                </div>

                <div className="text-sm font-medium capitalize">
                  {task.status}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* PROGRESS LOGS */}
      <div className="bg-white shadow rounded-xl p-6 mb-8">

        <h2 className="text-xl font-semibold mb-4">
          Progress Logs
        </h2>

        {logs.length === 0 ? (
          <p className="text-gray-500">No logs submitted</p>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <div
                key={log._id}
                className="border p-4 rounded-lg"
              >
                <p className="text-sm text-gray-500">
                  {log.date?.slice(0, 10)}
                </p>
                <p>{log.description}</p>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* REPORTS */}
      <div className="bg-white shadow rounded-xl p-6">

        <h2 className="text-xl font-semibold mb-4">
          Internship Reports
        </h2>

        {reports.length === 0 ? (
          <p className="text-gray-500">No reports submitted</p>
        ) : (
          <div className="space-y-3">
            {reports.map((report) => (
              <div
                key={report._id}
                className="border p-4 rounded-lg flex justify-between"
              >
                <p className="capitalize">{report.type}</p>

                <span className="text-sm font-medium capitalize">
                  {report.status}
                </span>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* BACK BUTTON */}
      <div className="mt-8">
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 bg-gray-900 text-white rounded-lg"
        >
          Back
        </button>
      </div>

    </div>
  );
}

