import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { useParams, useNavigate } from "react-router-dom";

/* ================= 1. REUSABLE STATUS BADGE ================= */
const StatusBadge = ({ status }) => {
  let cls = "bg-[#F5F6FA] border-[#2D3436]/10 text-[#2D3436]";
  if (["completed", "offer_accepted"].includes(status)) {
    cls = "bg-[#008000]/10 border-[#008000]/20 text-[#008000]";
  } else if (["ongoing", "submitted"].includes(status)) {
    cls = "bg-[#2D3436] text-[#FFFFFF] border-[#2D3436]";
  } else if (["terminated", "rejected", "revision_requested"].includes(status)) {
    cls = "bg-[#FFFFFF] border-[#cc0000]/30 text-[#cc0000]";
  }

  return (
    <span className={`px-2.5 py-1 rounded-[8px] text-[8px] font-black uppercase tracking-[0.1em] border ${cls}`}>
      {status ? status.replace("_", " ") : "UNKNOWN"}
    </span>
  );
};

/* ================= 2. WEEK GROUPING LOGIC ================= */
const groupTasksByWeek = (tasks) => {
  if (!tasks?.length) return [];
  const sorted = [...tasks].sort((a, b) => new Date(a.assignedAt) - new Date(b.assignedAt));
  const startDate = new Date(sorted[0]?.assignedAt);
  const weekMap = {};
  for (const task of sorted) {
    const diff = new Date(task.assignedAt) - startDate;
    const week = Math.floor(diff / (1000 * 60 * 60 * 24 * 7)) + 1;
    if (!weekMap[week]) weekMap[week] = { weekNumber: week, tasks: [] };
    weekMap[week].tasks.push(task);
  }
  return Object.values(weekMap);
};

/* ================= 3. MAIN COMPONENT ================= */
export default function InternProgress() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedTaskId, setExpandedTaskId] = useState(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await API.get(`/company/interns/${id}/progress`);
        setData(res.data.data);
      } catch (err) {
        console.error("API Error");
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, [id]);

  if (loading || !data) return <div className="h-screen bg-white flex items-center justify-center font-['Nunito'] uppercase text-[10px] font-black tracking-widest opacity-40">Initializing...</div>;

  const { application, tasks = [] } = data;
  const student = application.student || {};
  const internship = application.internship || {};

  const total = tasks.length || 1;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const submitted = tasks.filter((t) => t.status === "submitted").length;
  const pending = tasks.length - completed - submitted;

  const progressPercent = Math.round((completed / total) * 100);
  const completedPct = (completed / total) * 100;
  const submittedPct = (submitted / total) * 100;

  const pieChartStyle = {
    background: `conic-gradient(#008000 0% ${completedPct}%, #2D3436 ${completedPct}% ${completedPct + submittedPct}%, #F5F6FA ${completedPct + submittedPct}% 100%)`,
  };

  const weeklyTasks = groupTasksByWeek(tasks);

  return (
    <div className="min-h-screen bg-white text-[#2D3436] font-['Nunito'] pb-20 selection:bg-[#6C5CE7]/10">
      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        
        {/* HEADER */}
        <header className="flex justify-between items-center border-b border-[#F5F6FA] pb-6">
          <div>
            <h1 className="text-2xl font-black tracking-tighter m-0">Corporate Monitoring</h1>
            <p className="text-[10px] font-black text-[#6C5CE7] uppercase tracking-[0.4em] m-0">{internship.title}</p>
          </div>
          <button onClick={() => navigate(-1)} className="px-5 py-2.5 bg-[#F5F6FA] hover:bg-[#2D3436] hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer border-none">Return</button>
        </header>

        {/* ANALYTICS PANEL */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 bg-[#F5F6FA] rounded-[30px] p-8 border border-[#2D3436]/5">
            <p className="text-[9px] font-black text-[#2D3436]/30 uppercase tracking-widest mb-6">Subject Identity</p>
            <div className="space-y-4">
              <div className="flex flex-col"><span className="text-[8px] font-black text-[#6C5CE7] uppercase">Name</span><span className="text-[14px] font-black">{student.fullName}</span></div>
              <div className="flex flex-col"><span className="text-[8px] font-black text-[#6C5CE7] uppercase">ID Reference</span><span className="text-[14px] font-black opacity-60">{id.slice(-8).toUpperCase()}</span></div>
              <div className="pt-4"><StatusBadge status={application.status} /></div>
            </div>
          </div>

          <div className="lg:col-span-8 bg-white border-2 border-[#F5F6FA] rounded-[30px] p-8 flex items-center gap-10 shadow-sm">
            <div className="relative w-[120px] h-[120px] rounded-full flex items-center justify-center shadow-lg border-4 border-white" style={pieChartStyle}>
              <div className="w-[85px] h-[85px] bg-white rounded-full flex flex-col items-center justify-center">
                <span className="text-[18px] font-black">{progressPercent}%</span>
                <span className="text-[7px] font-black opacity-30 uppercase">Yield</span>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-3 gap-4">
              <StatBlock label="Completed" val={completed} color="#008000" />
              <StatBlock label="In-Review" val={submitted} color="#2D3436" />
              <StatBlock label="Remaining" val={pending} color="#F5F6FA" dark />
            </div>
          </div>
        </div>

        {/* TASK LOG TABLE */}
        <div className="bg-white border border-[#F5F6FA] rounded-[30px] overflow-hidden shadow-2xl shadow-[#2D3436]/5">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F5F6FA]/50 border-b border-[#F5F6FA]">
                <th className="px-6 py-4 text-[9px] font-black text-[#2D3436]/40 uppercase tracking-widest">Task Title</th>
                <th className="px-6 py-4 text-[9px] font-black text-[#2D3436]/40 uppercase tracking-widest">Timeline</th>
                <th className="px-6 py-4 text-[9px] font-black text-[#2D3436]/40 uppercase tracking-widest text-right">Status</th>
                <th className="px-6 py-4 text-[9px] font-black text-[#2D3436]/40 uppercase tracking-widest text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {weeklyTasks.map((week) => (
                <React.Fragment key={week.weekNumber}>
                  <tr className="bg-[#F5F6FA]/30"><td colSpan="4" className="px-6 py-2 text-[9px] font-black text-[#6C5CE7] uppercase tracking-[0.3em]">Week {week.weekNumber}</td></tr>
                  {week.tasks.map((task) => (
                    <React.Fragment key={task._id}>
                      <tr className={`border-b border-[#F5F6FA] transition-colors ${expandedTaskId === task._id ? 'bg-[#6C5CE7]/5' : 'hover:bg-[#F5F6FA]/20'}`}>
                        <td className="px-6 py-4"><span className="text-[13px] font-black text-[#2D3436] block truncate max-w-[200px]">{task.title}</span></td>
                        <td className="px-6 py-4 text-[11px] font-bold opacity-60">
                           {new Date(task.assignedAt).toLocaleDateString("en-IN")} <span className="mx-1">→</span> {task.deadline ? new Date(task.deadline).toLocaleDateString("en-IN") : 'TBD'}
                        </td>
                        <td className="px-6 py-4 text-right"><StatusBadge status={task.status} /></td>
                        <td className="px-6 py-4 text-center">
                          <button 
                            onClick={() => setExpandedTaskId(expandedTaskId === task._id ? null : task._id)}
                            className="bg-[#6C5CE7] text-white border-none px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest cursor-pointer hover:scale-105 transition-transform"
                          >
                            {expandedTaskId === task._id ? 'Close' : 'View'}
                          </button>
                        </td>
                      </tr>
                      {/* EXPANDED DETAILS PANEL */}
                      {expandedTaskId === task._id && (
                        <tr className="bg-[#F5F6FA]/40 animate-in fade-in slide-in-from-top-2">
                          <td colSpan="4" className="px-8 py-6">
                            <div className="grid grid-cols-2 gap-8">
                              <div className="space-y-4">
                                <div><h4 className="text-[8px] font-black text-[#6C5CE7] uppercase m-0 mb-1">Detailed Description</h4><p className="text-[12px] font-bold text-[#2D3436]/70 leading-relaxed m-0">{task.description || "No further documentation provided."}</p></div>
                                {task.externalLink && (
                                  <div><h4 className="text-[8px] font-black text-[#6C5CE7] uppercase m-0 mb-1">Attached Assets</h4><a href={task.externalLink} target="_blank" rel="noreferrer" className="text-[#6C5CE7] text-[11px] font-black underline">Open Resource Link</a></div>
                                )}
                              </div>
                              <div className="bg-white p-4 rounded-2xl border border-[#2D3436]/5 space-y-3">
                                <h4 className="text-[8px] font-black text-[#2D3436]/40 uppercase m-0">Metadata</h4>
                                <div className="flex justify-between border-b border-[#F5F6FA] pb-2"><span className="text-[10px] font-bold opacity-40">Task Type</span><span className="text-[10px] font-black uppercase">{task.taskType || 'Standard'}</span></div>
                                <div className="flex justify-between"><span className="text-[10px] font-bold opacity-40">Assigned In</span><span className="text-[10px] font-black uppercase">Week {week.weekNumber}</span></div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

const StatBlock = ({ label, val, color, dark }) => (
  <div className={`p-4 rounded-2xl flex flex-col items-center justify-center ${dark ? 'bg-[#F5F6FA]' : ''}`} style={{ backgroundColor: dark ? '' : `${color}10` }}>
    <span className="text-xl font-black" style={{ color: color }}>{val}</span>
    <span className="text-[7px] font-black text-[#2D3436]/40 uppercase tracking-widest">{label}</span>
  </div>
);