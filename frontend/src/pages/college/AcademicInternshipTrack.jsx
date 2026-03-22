import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/api";

/* ================= HELPERS ================= */

function getWeekNumber(startDate, currentDate) {
  const diff = new Date(currentDate) - new Date(startDate);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return Math.floor(days / 7) + 1;
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short"
  });
}

function groupTasksByWeek(tasks) {
  if (!tasks?.length) return [];

  const sorted = [...tasks].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );

  const startDate = sorted[0].createdAt;
  const weekMap = {};

  for (const task of sorted) {
    const week = getWeekNumber(startDate, task.createdAt);

    if (!weekMap[week]) {
      weekMap[week] = {
        weekNumber: week,
        startDate: task.createdAt,
        endDate: task.createdAt,
        tasks: []
      };
    }

    weekMap[week].endDate = task.createdAt;
    weekMap[week].tasks.push(task);
  }

  return Object.values(weekMap);
}

/* ================= MAIN ================= */

export default function AcademicInternshipTrack() {

  const { applicationId } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [applicationId]);

  const fetchData = async () => {
    try {
      const res = await API.get(`/applications/${applicationId}/academic-track`);
      setData(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-10">Loading...</div>;
  if (!data) return <div className="p-10">No data found</div>;

  const weeklyTasks = groupTasksByWeek(data.tasks);

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">

      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-2xl font-bold mb-4">
          Internship Tracking
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <Info label="Student" value={data.student?.fullName} />
          <Info label="Company" value={data.company?.name} />
          <Info label="Mentor" value={data.mentor?.fullName} />
          <Info label="Status" value={data.status} />
        </div>
      </div>

      {/* ================= WEEK TABLES ================= */}
      {weeklyTasks.map((week) => (
        <div key={week.weekNumber} className="border rounded-xl p-4">

          {/* WEEK HEADER */}
          <div className="flex justify-between mb-3">
            <div className="font-semibold">
              Week {week.weekNumber}
            </div>

            <div className="text-sm text-gray-500">
              {formatDate(week.startDate)} - {formatDate(week.endDate)}
            </div>
          </div>

          {/* TASK TABLE */}
          <table className="w-full border text-sm">

            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border w-16">Sr No.</th>
                <th className="p-2 border">Task</th>
                <th className="p-2 border">Status</th>
              </tr>
            </thead>

            <tbody>
              {week.tasks.map((task, index) => (
                <tr key={task._id || index}>

                  {/* SR NO */}
                  <td className="border p-2 text-center">
                    {index + 1}
                  </td>

                  {/* GENERIC TASK NAME */}
                  <td className="border p-2">
                    Task {index + 1}
                  </td>

                  {/* STATUS */}
                  <td className="border p-2 capitalize">
                    {task.status}
                  </td>

                </tr>
              ))}
            </tbody>

          </table>

        </div>
      ))}

    </div>
  );
}

/* ================= INFO ================= */

function Info({ label, value }) {
  return (
    <div>
      <span className="text-gray-500">{label}</span>
      <div className="font-medium capitalize">{value || "-"}</div>
    </div>
  );
}