import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/api";

// ==========================================
// 1. Reusable Status Badge Component
// ==========================================
const StatusBadge = ({ status }) => {
  let cls = "bg-[#f9f9f9] border-[#e5e5e5] text-[#333]";
  if (status === "completed")
    cls = "bg-[#f9f9f9] border-[#008000] text-[#008000]";
  else if (status === "submitted") cls = "bg-[#111] text-[#fff] border-[#111]";
  else if (status === "revision_requested")
    cls = "bg-[#fff] border-[#cc0000] text-[#cc0000]";

  return (
    <span
      className={`px-2.5 py-1 rounded-[10px] text-[9px] font-black uppercase tracking-widest border ${cls}`}
    >
      {status ? status.replace("_", " ") : "PENDING"}
    </span>
  );
};

// ==========================================
// 2. Dashboard Header & Pie Chart Component
// ==========================================
const DashboardHeader = ({ tasks }) => {
  // Calculate analytics for the Pie Chart
  const total = tasks.length || 1; // Prevent division by zero
  const completed = tasks.filter((t) => t.status === "completed").length;
  const submitted = tasks.filter((t) => t.status === "submitted").length;
  const pending = tasks.length - completed - submitted;

  const completedPct = (completed / total) * 100;
  const submittedPct = (submitted / total) * 100;

  // Pure CSS Pie Chart (No external libraries needed!)
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
    <div className="bg-[#fff] border border-[#e5e5e5] rounded-[20px] shadow-sm p-6 md:p-8 flex flex-col lg:flex-row gap-8">
      {/* LEFT HALF: Information & Buttons */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between gap-6 border-b lg:border-b-0 lg:border-r border-[#f9f9f9] pb-6 lg:pb-0 lg:pr-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-[23px] font-black text-[#333] m-0 tracking-tight leading-tight">
            Task Console
          </h1>
          <p className="text-[13px] font-bold text-[#333] opacity-60 m-0 uppercase tracking-widest">
            Java Intern • Remote
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">
              Supervisor
            </span>
            <span className="text-[13px] font-black text-[#111]">
              Ambadas Gote
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">
              Total Milestones
            </span>
            <span className="text-[13px] font-black text-[#111]">
              {tasks.length} Assigned
            </span>
          </div>
        </div>

        {/* Compact Button Group */}
        <div className="flex flex-wrap gap-3 mt-2">
          <button className="px-5 py-2.5 text-[10px] font-black text-[#fff] bg-[#111] rounded-[10px] border-none hover:opacity-80 transition-opacity uppercase tracking-widest cursor-pointer">
            View Submitted Resume
          </button>
          <button className="px-5 py-2.5 text-[10px] font-black text-[#333] bg-[#f9f9f9] border border-[#e5e5e5] rounded-[10px] hover:border-[#333] transition-all uppercase tracking-widest cursor-pointer">
            Contact Supervisor
          </button>
        </div>
      </div>

      {/* RIGHT HALF: Pie Chart Analytics */}
      <div className="w-full lg:w-1/2 flex items-center justify-center lg:justify-start gap-8">
        {/* CSS Doughnut Chart */}
        <div
          className="relative w-[120px] h-[120px] rounded-full flex items-center justify-center"
          style={pieChartStyle}
        >
          {/* Inner white circle to create the doughnut hole effect */}
          <div className="w-[80px] h-[80px] bg-[#fff] rounded-full flex items-center justify-center flex-col shadow-inner">
            <span className="text-[20px] font-black text-[#333] leading-none">
              {tasks.length}
            </span>
            <span className="text-[8px] font-bold opacity-50 uppercase tracking-widest">
              Total
            </span>
          </div>
        </div>

        {/* Chart Legend */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#008000]"></div>
            <span className="text-[11px] font-bold text-[#333] uppercase tracking-widest">
              {completed} Completed
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#111]"></div>
            <span className="text-[11px] font-bold text-[#333] uppercase tracking-widest">
              {submitted} Submitted
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#e5e5e5]"></div>
            <span className="text-[11px] font-bold text-[#333] uppercase tracking-widest opacity-60">
              {pending} Pending
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. Main Page Component
// ==========================================
export default function InternTaskConsole() {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const res = await API.get(`/tasks/application/${applicationId}`);
      setTasks(res.data?.data || []);
    } catch (err) {
      console.error("Task fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [applicationId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f9f9f9] flex items-center justify-center font-sans">
        <p className="text-[14px] font-bold text-[#333] animate-pulse m-0">
          Loading Milestones...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-[#333] font-sans pb-10">
      <main className="max-w-6xl mx-auto w-full px-4 md:px-6 py-6 flex flex-col gap-8">
        {/* Top 50/50 Split Section */}
        <DashboardHeader tasks={tasks} />

        {/* Bottom Section: Milestones Table */}
        <div className="flex flex-col gap-4">
          <h2 className="text-[14px] font-black text-[#333] m-0 uppercase tracking-widest px-2">
            Assigned Milestones
          </h2>

          {tasks.length === 0 ? (
            <div className="bg-[#fff] border-2 border-dashed border-[#e5e5e5] rounded-[20px] p-20 text-center">
              <p className="text-[13px] font-bold text-[#333] opacity-40 m-0 uppercase tracking-widest">
                No milestones have been assigned yet
              </p>
            </div>
          ) : (
            <div className="bg-[#fff] border border-[#e5e5e5] rounded-[20px] shadow-sm overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#e5e5e5] bg-[#f9f9f9]">
                    <th className="p-5 text-[10px] font-bold opacity-40 uppercase tracking-widest whitespace-nowrap">
                      Task Info
                    </th>
                    <th className="p-5 text-[10px] font-bold opacity-40 uppercase tracking-widest">
                      Description / Link
                    </th>
                    <th className="p-5 text-[10px] font-bold opacity-40 uppercase tracking-widest whitespace-nowrap">
                      Timeline
                    </th>
                    <th className="p-5 text-[10px] font-bold opacity-40 uppercase tracking-widest whitespace-nowrap">
                      Status
                    </th>
                    <th className="p-5 text-[10px] font-bold opacity-40 uppercase tracking-widest whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr
                      key={task._id}
                      className="border-b border-[#e5e5e5] last:border-none hover:bg-[#fafafa] transition-colors"
                    >
                      <td className="p-5 align-middle">
                        <span className="text-[14px] font-black text-[#333] m-0 leading-tight block min-w-[150px]">
                          {task.title}
                        </span>
                      </td>
                      <td className="p-5 align-middle max-w-[250px] whitespace-normal">
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
                      <td className="p-5 align-middle whitespace-nowrap">
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
                      <td className="p-5 align-middle whitespace-nowrap">
                        <StatusBadge status={task.status} />
                      </td>
                      <td className="p-5 align-middle whitespace-nowrap">
                        <button
                          onClick={() =>
                            navigate(`/student/intern/${task._id}/submit`)
                          }
                          className="px-4 py-2 bg-[#f9f9f9] border border-[#333] text-[#333] text-[10px] font-black uppercase tracking-widest rounded-[10px] hover:bg-[#333] hover:text-[#fff] transition-all cursor-pointer"
                        >
                          Open Milestone
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
