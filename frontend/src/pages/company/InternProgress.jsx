import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { useParams, useNavigate } from "react-router-dom";

// ==========================================
// 1. Reusable Status Badge Component
// ==========================================
const StatusBadge = ({ status }) => {
  let cls = "bg-[#f9f9f9] border-[#e5e5e5] text-[#333]";
  if (["completed", "offer_accepted"].includes(status)) {
    cls = "bg-[#f9f9f9] border-[#008000] text-[#008000]";
  } else if (["ongoing", "submitted"].includes(status)) {
    cls = "bg-[#111] text-[#fff] border-[#111]";
  } else if (
    ["terminated", "rejected", "revision_requested"].includes(status)
  ) {
    cls = "bg-[#fff] border-[#cc0000] text-[#cc0000]";
  }

  return (
    <span
      className={`px-2.5 py-1 rounded-[10px] text-[9px] font-black uppercase tracking-widest border ${cls}`}
    >
      {status ? status.replace("_", " ") : "UNKNOWN"}
    </span>
  );
};

// ==========================================
// 2. Main Intern Progress Component
// ==========================================
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
      <div className="h-full bg-[#f9f9f9] flex items-center justify-center font-sans min-h-[50vh]">
        <p className="text-[14px] font-bold text-[#333] animate-pulse m-0">
          Loading Monitoring Data...
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="h-full bg-[#f9f9f9] flex items-center justify-center p-4 font-sans min-h-[50vh]">
        <div className="bg-[#fff] border-2 border-dashed border-[#e5e5e5] rounded-[20px] p-10 text-center">
          <p className="text-[13px] font-bold text-[#333] opacity-60 m-0 uppercase tracking-widest">
            No progress data found
          </p>
        </div>
      </div>
    );
  }

  const { application, tasks } = data;
  const student = application.student || {};
  const mentor = application.mentor || {};
  const internship = application.internship || {};

  // Analytics Math
  const total = tasks.length || 1; // prevent divide by zero
  const completed = tasks.filter((t) => t.status === "completed").length;
  const submitted = tasks.filter((t) => t.status === "submitted").length;
  const pending = tasks.length - completed - submitted;

  const progressPercent =
    tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;
  const completedPct = (completed / total) * 100;
  const submittedPct = (submitted / total) * 100;

  // Pure CSS Pie Chart
  const pieChartStyle = {
    background:
      tasks.length === 0
        ? "#f9f9f9"
        : `conic-gradient(
          #008000 0% ${completedPct}%, 
          #111 ${completedPct}% ${completedPct + submittedPct}%, 
          #e5e5e5 ${completedPct + submittedPct}% 100%
        )`,
  };

  return (
    <div className="h-full bg-[#f9f9f9] text-[#333] font-sans pb-10">
      <main className="max-w-6xl mx-auto w-full px-4 md:px-6 py-6 flex flex-col gap-6">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#e5e5e5] pb-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-[23px] font-black text-[#333] m-0 tracking-tight leading-tight">
              Intern Progress Tracking
            </h1>
            <p className="text-[13px] font-bold text-[#333] opacity-60 m-0 mt-1 uppercase tracking-widest">
              Performance & Milestone Overview
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2 text-[11px] font-black text-[#333] bg-[#fff] border border-[#e5e5e5] rounded-[10px] hover:border-[#333] transition-colors uppercase tracking-widest cursor-pointer"
          >
            Back to Details
          </button>
        </header>

        {/* Top Section: Side-by-Side Grid (Info Left, Analytics Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT: Intern Information */}
          <div className="bg-[#fff] border border-[#e5e5e5] rounded-[20px] p-6 shadow-sm">
            <h3 className="text-[11px] font-bold text-[#333] opacity-50 m-0 uppercase tracking-widest border-b border-[#f9f9f9] pb-3 mb-5">
              Intern Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold text-[#333] opacity-40 uppercase tracking-widest">
                  Full Name
                </span>
                <span className="text-[14px] font-black">
                  {student.fullName}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold text-[#333] opacity-40 uppercase tracking-widest">
                  Email Address
                </span>
                {/* Fixed Email Cutoff here (break-all) */}
                <span className="text-[13px] font-bold break-all">
                  {student.email}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold text-[#333] opacity-40 uppercase tracking-widest">
                  Internship Title
                </span>
                <span className="text-[13px] font-bold">
                  {internship.title}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold text-[#333] opacity-40 uppercase tracking-widest">
                  Mentor Assigned
                </span>
                <span className="text-[13px] font-bold">
                  {mentor.fullName || "Awaiting Assignment"}
                </span>
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2 mt-2 border-t border-[#f9f9f9] pt-4">
                <span className="text-[10px] font-bold text-[#333] opacity-40 uppercase tracking-widest">
                  Current Status
                </span>
                <div>
                  <StatusBadge status={application.status} />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Overall Completion (Pie Chart + Bar Graph) */}
          <div className="bg-[#fff] border border-[#e5e5e5] rounded-[20px] p-6 shadow-sm flex flex-col">
            <h3 className="text-[11px] font-bold text-[#333] opacity-50 m-0 uppercase tracking-widest border-b border-[#f9f9f9] pb-3 mb-5">
              Overall Analytics
            </h3>

            <div className="flex flex-col sm:flex-row items-center gap-8 flex-1">
              {/* Doughnut Pie Chart */}
              <div
                className="relative w-[100px] h-[100px] rounded-full flex items-center justify-center flex-shrink-0 shadow-sm"
                style={pieChartStyle}
              >
                <div className="w-[65px] h-[65px] bg-[#fff] rounded-full flex items-center justify-center flex-col shadow-inner">
                  <span className="text-[16px] font-black text-[#333] leading-none">
                    {tasks.length}
                  </span>
                  <span className="text-[7px] font-bold opacity-50 uppercase tracking-widest">
                    Total
                  </span>
                </div>
              </div>

              {/* Stats & Bar Graph */}
              <div className="flex flex-col flex-1 w-full gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#333] uppercase tracking-widest">
                    <span>
                      <span className="inline-block w-2 h-2 rounded-full bg-[#008000] mr-1.5"></span>
                      {completed} Completed
                    </span>
                    <span>
                      <span className="inline-block w-2 h-2 rounded-full bg-[#111] mr-1.5"></span>
                      {submitted} Submitted
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#333] uppercase tracking-widest opacity-60">
                    <span>
                      <span className="inline-block w-2 h-2 rounded-full bg-[#e5e5e5] mr-1.5"></span>
                      {pending} Pending
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#f9f9f9]">
                  <div className="flex items-end justify-between mb-2">
                    <span className="text-[18px] font-black text-[#333] leading-none">
                      {progressPercent}% Completion
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-[#f9f9f9] rounded-full overflow-hidden border border-[#e5e5e5]">
                    <div
                      className="h-full bg-[#008000] transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: Full Width Task Management Log */}
        <div className="bg-[#fff] border border-[#e5e5e5] rounded-[20px] shadow-sm overflow-hidden mt-2">
          <div className="px-6 py-5 border-b border-[#e5e5e5] bg-[#f9f9f9] flex justify-between items-center">
            <h3 className="text-[11px] font-bold text-[#333] opacity-50 m-0 uppercase tracking-widest">
              Task Management Log
            </h3>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#333]">
              {tasks.length} Assigned Milestones
            </span>
          </div>

          <div className="overflow-x-auto">
            {tasks.length === 0 ? (
              <div className="p-10 text-center">
                <p className="text-[13px] font-bold text-[#333] opacity-40 m-0 uppercase tracking-widest">
                  No tasks have been assigned to this intern yet.
                </p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#fff] border-b border-[#f9f9f9]">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-bold text-[#333] opacity-40 uppercase tracking-widest whitespace-nowrap">
                      Task Detail
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-[#333] opacity-40 uppercase tracking-widest">
                      Description / Link
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-[#333] opacity-40 uppercase tracking-widest whitespace-nowrap">
                      Timeline
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-[#333] opacity-40 uppercase tracking-widest whitespace-nowrap text-right">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5e5e5]">
                  {tasks.map((task) => (
                    <tr
                      key={task._id}
                      className="hover:bg-[#fafafa] transition-colors"
                    >
                      <td className="px-6 py-5 align-middle">
                        <span className="text-[14px] font-black text-[#333] block leading-tight">
                          {task.title}
                        </span>
                      </td>
                      <td className="px-6 py-5 align-middle max-w-[250px]">
                        {task.taskType === "internal" ? (
                          <p className="text-[12px] font-medium opacity-70 m-0 line-clamp-2">
                            {task.description}
                          </p>
                        ) : (
                          <a
                            href={task.externalLink}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] font-black text-[#111] underline uppercase tracking-widest"
                          >
                            External Resource
                          </a>
                        )}
                      </td>
                      <td className="px-6 py-5 align-middle whitespace-nowrap">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold opacity-40 uppercase w-16">
                              Assigned:
                            </span>
                            <span className="text-[11px] font-bold text-[#333]">
                              {task.assignedAt
                                ? new Date(task.assignedAt).toLocaleDateString(
                                    "en-IN",
                                  )
                                : "—"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold opacity-40 uppercase w-16">
                              Deadline:
                            </span>
                            <span className="text-[11px] font-bold text-[#cc0000]">
                              {task.deadline
                                ? new Date(task.deadline).toLocaleDateString(
                                    "en-IN",
                                  )
                                : "—"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 align-middle text-right whitespace-nowrap">
                        <StatusBadge status={task.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
