import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; 
import API from "../../api/api";

/* ================= STATUS BADGE ================= */
const StatusBadge = ({ status }) => {
  let cls = "bg-[#F5F6FA] text-[#2D3436] border-transparent";
  if (status === "completed") cls = "bg-emerald-50 text-emerald-600 border-emerald-100";
  else if (status === "submitted" || status === "under_review")
    cls = "bg-[#2D3436] text-white border-[#2D3436]";
  else if (status === "revision_requested")
    cls = "bg-rose-50 text-rose-600 border-rose-100";

  return (
    <span className={`px-4 py-1.5 rounded-xl text-[10px] tracking-widest font-black uppercase border shadow-sm ${cls}`}>
      {status ? status.replace("_", " ") : "pending"}
    </span>
  );
};

/* ================= DASHBOARD HEADER ================= */
const DashboardHeader = ({ tasks, internship, report, onGenerate, onSubmit, onDownload, actionLoading }) => {
  const total = tasks.length || 1;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const submitted = tasks.filter((t) => t.status === "submitted" || t.status === "under_review").length;
  const pending = tasks.length - completed - submitted;

  const completedPct = (completed / total) * 100;
  const submittedPct = (submitted / total) * 100;

  // Pure CSS Conic Gradient Pie Chart
  const pieChartStyle = {
    background: tasks.length === 0
        ? "#F5F6FA"
        : `conic-gradient(
          #10b981 0% ${completedPct}%, 
          #2D3436 ${completedPct}% ${completedPct + submittedPct}%, 
          #F5F6FA ${completedPct + submittedPct}% 100%
        )`,
  };

  const isCompleted = internship?.status === "completed";
  const isGenerated = report?.isLocked;
  const isSubmitted = report?.status === "faculty_pending";

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-[#F5F6FA] rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_50px_rgba(108,92,231,0.06)] flex flex-col lg:flex-row justify-between items-center gap-10"
    >
      {/* LEFT: INFO */}
      <div className="text-center lg:text-left space-y-4">
        <div className="space-y-1">
            <span className="text-[10px] font-black text-[#6C5CE7] uppercase tracking-[0.4em]">Internship Console</span>
            <h1 className="text-3xl md:text-5xl font-black text-[#2D3436] tracking-tighter uppercase leading-none">
            {internship?.internship?.title || "Milestones"}
            </h1>
        </div>
        <div className="flex flex-wrap justify-center lg:justify-start gap-3">
            <div className="px-4 py-2 bg-[#F5F6FA] rounded-xl border border-white shadow-sm">
                <p className="text-[11px] font-black text-[#2D3436] opacity-60 uppercase tracking-widest">{internship?.company?.name}</p>
            </div>
            {isCompleted && (
                <button onClick={onGenerate} disabled={actionLoading || isGenerated} className="px-6 py-2 bg-[#6C5CE7] text-white text-[10px] font-black uppercase rounded-xl tracking-widest hover:bg-[#5A4BCC] transition-all disabled:opacity-50">
                    {isGenerated ? "Report Ready" : "Generate Report"}
                </button>
            )}
        </div>
      </div>

      {/* CENTER: PIE CHART */}
      <div className="flex flex-col sm:flex-row items-center gap-10 bg-[#F5F6FA] p-8 rounded-[2.5rem] border border-white shadow-inner relative overflow-hidden">
        <div className="relative group">
          <div className="absolute inset-0 bg-[#6C5CE7]/5 rounded-full blur-xl group-hover:bg-[#6C5CE7]/10 transition-colors duration-500"></div>
          <div
            className="relative w-[130px] h-[130px] rounded-full flex items-center justify-center shadow-lg transition-transform duration-500"
            style={pieChartStyle}
          >
            <div className="w-[90px] h-[90px] bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
              <span className="text-2xl font-black text-[#2D3436] leading-none">{Math.round(completedPct)}%</span>
              <span className="text-[8px] font-black text-[#6C5CE7] uppercase tracking-widest mt-1">Done</span>
            </div>
          </div>
        </div>

        {/* CHART LEGEND */}
        <div className="flex flex-col gap-3 min-w-[120px]">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-[10px] font-black opacity-40 uppercase tracking-widest">Done</span>
            </div>
            <span className="text-xs font-black text-[#2D3436]">{completed}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#2D3436]"></div>
                <span className="text-[10px] font-black opacity-40 uppercase tracking-widest">Review</span>
            </div>
            <span className="text-xs font-black text-[#2D3436]">{submitted}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-white border border-gray-200"></div>
                <span className="text-[10px] font-black opacity-20 uppercase tracking-widest">Pending</span>
            </div>
            <span className="text-xs font-black text-[#2D3436] opacity-30">{pending}</span>
          </div>
        </div>
      </div>

      {/* RIGHT: REPORT ACTIONS */}
      {isGenerated && (
          <div className="flex flex-col gap-3 w-full lg:w-48">
              <button onClick={onDownload} className="w-full py-3 bg-white border-2 border-[#F5F6FA] text-[#2D3436] text-[10px] font-black uppercase rounded-xl tracking-widest hover:border-[#6C5CE7] transition-all shadow-sm">Download PDF</button>
              <button onClick={onSubmit} disabled={isSubmitted} className={`w-full py-3 text-[10px] font-black uppercase rounded-xl tracking-widest transition-all ${isSubmitted ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-[#2D3436] text-white shadow-lg"}`}>
                  {isSubmitted ? "Submitted ✔" : "Submit Report"}
              </button>
          </div>
      )}
    </motion.div>
  );
};

/* ================= MAIN COMPONENT ================= */
export default function InternTaskConsole() {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [internship, setInternship] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchAll = async () => {
    try {
      const [taskRes, internRes, reportRes] = await Promise.all([
        API.get(`/tasks/application/${applicationId}`),
        API.get(`/students/internship/${applicationId}/track`),
        API.get(`/reports/${applicationId}`),
      ]);
      setTasks(taskRes.data?.data || []);
      setInternship(internRes.data?.data);
      setReport(reportRes.data || null);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, [applicationId]);

  const handleGenerate = async () => {
    setActionLoading(true);
    try { await API.post(`/reports/generate/${applicationId}`); await fetchAll(); } 
    catch (err) { console.error(err); } finally { setActionLoading(false); }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white font-['Nunito']">
      <div className="w-10 h-10 border-4 border-[#F5F6FA] border-t-[#6C5CE7] rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFFFFF] p-4 md:p-8 lg:p-12 font-['Nunito'] text-[#2D3436]">
      <div className="max-w-6xl mx-auto space-y-12">
        
        <DashboardHeader
          tasks={tasks}
          internship={internship}
          report={report}
          onGenerate={handleGenerate}
          onDownload={() => report?.reportUrl && window.open(report.reportUrl)}
          onSubmit={() => { API.post(`/reports/submit/${applicationId}`).then(fetchAll); }}
          actionLoading={actionLoading}
        />

        <div className="flex items-center gap-6 px-4">
            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-[#2D3436] whitespace-nowrap">Assigned Milestones</h2>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-[#F5F6FA] to-transparent"></div>
        </div>

        {/* TASK TABLE */}
        <div className="bg-white border border-[#F5F6FA] rounded-[2.5rem] overflow-hidden shadow-[0_15px_50px_rgba(0,0,0,0.03)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.05)] transition-shadow duration-500">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F5F6FA]/50 border-b border-[#F5F6FA]">
                  <th className="p-8 text-[10px] font-black uppercase tracking-widest opacity-40">Assigned</th>
                  <th className="p-8 text-[10px] font-black uppercase tracking-widest opacity-40">Milestone Title</th>
                  <th className="p-8 text-[10px] font-black uppercase tracking-widest opacity-40">Deadline</th>
                  <th className="p-8 text-[10px] font-black uppercase tracking-widest opacity-40">Status</th>
                  <th className="p-8 text-[10px] font-black uppercase tracking-widest opacity-40 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F6FA]">
                <AnimatePresence>
                  {tasks.map((task, index) => (
                    <motion.tr 
                      key={task._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-[#F5F6FA]/40 transition-colors group"
                    >
                      {/* ASSIGNED DATE */}
                      <td className="p-8 whitespace-nowrap">
                        <span className="text-[13px] font-bold text-[#2D3436] opacity-50">
                          {task.assignedAt ? new Date(task.assignedAt).toLocaleDateString("en-IN") : "—"}
                        </span>
                      </td>

                      {/* TASK TITLE */}
                      <td className="p-8 min-w-[250px]">
                        <div className="flex flex-col gap-1">
                          <span className="text-[15px] font-black text-[#2D3436] group-hover:text-[#6C5CE7] transition-colors leading-tight">
                            {task.title}
                          </span>
                          <span className="text-[9px] font-black opacity-30 uppercase tracking-[0.1em]">{task.taskType || "General Task"}</span>
                        </div>
                      </td>

                      {/* DEADLINE */}
                      <td className="p-8 whitespace-nowrap">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-rose-50/50 rounded-lg border border-rose-100">
                          <div className="w-1.5 h-1.5 rounded-full bg-rose-400"></div>
                          <span className="text-[11px] font-black text-rose-600">
                            {task.deadline ? new Date(task.deadline).toLocaleDateString("en-IN") : "—"}
                          </span>
                        </div>
                      </td>

                      {/* STATUS */}
                      <td className="p-8">
                        <StatusBadge status={task.status} />
                      </td>

                      {/* ACTION BUTTON */}
                      <td className="p-8 text-right">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => navigate(`/student/task/${task._id}`)}
                          className="px-6 py-2.5 bg-white border border-[#F5F6FA] text-[#2D3436] hover:bg-[#2D3436] hover:text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-sm group-hover:shadow-md"
                        >
                          Open
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          {tasks.length === 0 && (
            <div className="p-24 text-center">
                <p className="text-[10px] font-black opacity-20 uppercase tracking-[0.4em]">Queue Empty: No milestones assigned</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}