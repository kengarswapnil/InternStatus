import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchDashboard } from "../../store/dashboardSlice";

// ── Sub-components ──────────────────────────────────────────────────────
const KpiCard = ({ label, value, sub, onClick, accent }) => (
  <div
    onClick={onClick}
    className={`bg-white rounded-2xl shadow-sm p-5 cursor-pointer hover:shadow-md transition-shadow border-l-4 ${accent || "border-indigo-400"}`}
  >
    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">{label}</p>
    <p className="text-3xl font-bold text-gray-800">{value ?? "—"}</p>
    {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
  </div>
);

const SectionCard = ({ title, children, action }) => (
  <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">

    {/* 🔥 HEADER */}
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400">
        {title}
      </h2>

      {/* 🔥 ACTION BUTTON */}
      {action && (
        <button
          onClick={action.onClick}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          {action.label} →
        </button>
      )}
    </div>

    {children}
  </div>
);

const StatusBadge = ({ status }) => {
  const map = {
    ongoing: "bg-emerald-100 text-emerald-700",
    completed: "bg-blue-100 text-blue-700",
    selected: "bg-violet-100 text-violet-700",
    applied: "bg-gray-100 text-gray-600",
    terminated: "bg-red-100 text-red-600",
    not_applied: "bg-red-100 text-red-600"
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${map[status] || "bg-gray-100 text-gray-500"}`}>
      {status}
    </span>
  );
};

const TableRow = ({ student, onTrack }) => (
  <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
    <td className="py-3 px-2 text-sm font-medium text-gray-800">{student.name || "Unknown"}</td>
    <td className="py-3 px-2"><StatusBadge status={student.status} /></td>
    <td className="py-3 px-2">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-400 rounded-full"
            style={{ width: `${student.completionPct || 0}%` }}
          />
        </div>
        <span className="text-xs text-gray-500 w-8">{student.completionPct || 0}%</span>
      </div>
    </td>
    <td className="py-3 px-2 text-sm text-gray-600">{student.avgScore ?? "—"}</td>
    <td className="py-3 px-2">
      <button
        onClick={() => onTrack(student.applicationId)}
        className="text-xs text-indigo-500 hover:text-indigo-700 font-medium"
      >
        Track →
      </button>
    </td>
  </tr>
);

const ActionItem = ({ action, onClick }) => (
  <button
    onClick={onClick}
    className="w-full text-left px-4 py-3 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all text-sm font-medium text-gray-700 flex justify-between items-center"
  >
    {action.label}
    <span className="text-indigo-400">→</span>
  </button>
);

// ── Main Component ──────────────────────────────────────────────────────
export default function FacultyDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, loading, error } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-pulse text-gray-400 text-sm tracking-widest uppercase">Loading dashboard…</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-red-500 text-sm">{error}</p>
    </div>
  );

  if (!data) return null;

  const { 
    kpis = {}, 
    pipeline = {}, 
    taskStats = {}, 
    studentStats = [], 
    atRisk = [], 
    recentActivity = [], 
    actions = [] 
  } = data;

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Faculty Dashboard</h1>
        <p className="text-sm text-gray-400 mt-0.5">Internship supervision overview</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard label="Total Students" value={kpis.totalStudents} accent="border-indigo-400"
          onClick={() => navigate("/faculty/students")} />
        <KpiCard label="Active Internships" value={kpis.activeInternships} accent="border-emerald-400"
          onClick={() => navigate("/faculty/students")} />
        <KpiCard label="Pending Reviews" value={kpis.pendingTaskReviews} accent="border-amber-400"
          onClick={() => navigate("/faculty/students")} />
        <KpiCard
  label="Avg Score"
  value={
    typeof kpis.avgStudentScore === "number" && !isNaN(kpis.avgStudentScore)
      ? `${kpis.avgStudentScore.toFixed(1)}/10`
      : "—"
  }
  sub={`${kpis.completedInternships ?? 0} completed · ${kpis.pendingApprovals ?? 0} approvals pending`}
  accent="border-violet-400"
/>
      </div>

      {/* Pipeline + Task Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SectionCard title="Application Pipeline">
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(pipeline).map(([k, v]) => (
              <div key={k} className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 capitalize">{k}</p>
                <p className="text-xl font-bold text-gray-800">{v}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Task Overview">
          <div className="grid grid-cols-2 gap-3">
            {[
              ["Total", taskStats.totalTasks],
              ["Pending", taskStats.pending],
              ["Under Review", taskStats.under_review],
              ["Revision", taskStats.revision_requested],
            ].map(([label, val]) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400">{label}</p>
                <p className="text-xl font-bold text-gray-800">{val ?? 0}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Student Table */}
      <SectionCard title="Student List">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs uppercase tracking-widest text-gray-400 border-b border-gray-100">
                <th className="pb-2 px-2">Name</th>
                <th className="pb-2 px-2">Status</th>
                <th className="pb-2 px-2">Progress</th>
                <th className="pb-2 px-2">Score</th>
                <th className="pb-2 px-2"></th>
              </tr>
            </thead>
            <tbody>
              {studentStats.map((s, index) => (
                <TableRow
                  // FIX: If s.id is null, use s.applicationId or the loop index
                  key={s.id || s.applicationId || `student-${index}`}
                  student={s}
                  onTrack={() => navigate(`/faculty/students/${s.studentId}`)}
                />
              ))}
            </tbody>
          </table>
          {studentStats.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-6">No students assigned.</p>
          )}
        </div>
      </SectionCard>

     {/* At-Risk + Recent Activity */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">

<SectionCard
  title="At-Risk Students"
  action={{
    label: "Review",
    onClick: () => navigate("/faculty/at-risk"), // adjust if needed
  }}
>
  {atRisk && atRisk.length > 0 ? (
    <div className="space-y-2">

      {atRisk.slice(0, 5).map((student, index) => (
        <div
          key={student.id || `atrisk-${index}`}
          className="bg-red-50 border border-red-200 rounded-lg p-3 cursor-pointer hover:bg-red-100 transition"
         onClick={() => {
  const id = student.id || student.studentId;

  if (id) {
    navigate(`/faculty/at-risk/${id}`);
  }
}}
        >
          <p className="font-medium text-gray-800">
            {student.name}
          </p>

          <p className="text-sm text-red-600 mt-1">
            {student.reason}
          </p>
        </div>
      ))}

      {/* 🔥 MORE COUNT */}
      {atRisk.length > 5 && (
        <p className="text-sm text-gray-500 text-center mt-3">
          +{atRisk.length - 5} more
        </p>
      )}

    </div>
  ) : (
    <p className="text-green-600 text-sm font-medium">
      ✓ All students on track
    </p>
  )}
</SectionCard>
 
  {/* 🔵 RECENT ACTIVITY */}
  <SectionCard title="Recent Activity">
    <div className="space-y-4">

      {recentActivity.length === 0 && (
        <p className="text-sm text-gray-400">No recent activity.</p>
      )}

      {recentActivity.map((a, index) => (
        <div key={index} className="flex items-start gap-3">

          {/* 🔵 Dot */}
          <div className={`w-2 h-2 rounded-full mt-2 ${
            a.type === "approval" ? "bg-green-500" :
            a.type === "submission" ? "bg-blue-500" :
            a.type === "application" ? "bg-purple-500" :
            a.type === "warning" ? "bg-red-500" :
            "bg-gray-400"
          }`} />

          {/* 📄 Content */}
          <div className="flex-1 border-b border-gray-100 pb-3 last:border-0">
            
            {/* ✅ LABEL FIX */}
            <p className="text-sm text-gray-700 font-medium">
              {a.label}
            </p>

            {/* ✅ DATE FIX (was wrong before) */}
            <p className="text-xs text-gray-400 mt-1">
              {a.time
                ? new Date(a.time).toLocaleDateString("en-IN")
                : "—"}
            </p>

          </div>
        </div>
      ))}
    </div>
  </SectionCard>

</div>
      
    </div>
  );
}