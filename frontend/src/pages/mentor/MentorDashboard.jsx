import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchDashboard } from "../../store/dashboardSlice";

const STATUS_LABELS = {
  submitted: "Submitted", under_review: "Under Review",
  revision_requested: "Revision Requested", completed: "Completed", assigned: "Assigned"
};

const KpiCard = ({ label, value, sub, onClick, warn }) => (
  <div onClick={onClick}
    className={`bg-white rounded-2xl shadow-sm p-5 border cursor-pointer hover:shadow-md transition-shadow
      ${warn ? "border-yellow-200 bg-yellow-50" : "border-gray-100"}`}>
    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">{label}</p>
    <p className={`text-3xl font-bold ${warn ? "text-yellow-700" : "text-gray-800"}`}>{value ?? "—"}</p>
    {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
  </div>
);

const SectionCard = ({ title, children, accent }) => (
  <div className={`bg-white rounded-2xl shadow-sm p-5 border ${accent || "border-gray-100"}`}>
    <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">{title}</h2>
    {children}
  </div>
);

const TableRow = ({ cols, highlight, onClick }) => (
  <div onClick={onClick}
    className={`grid gap-3 py-2 border-b border-gray-50 last:border-0 text-sm
      ${highlight ? "bg-yellow-50 -mx-2 px-2 rounded-lg" : ""}
      ${onClick ? "cursor-pointer hover:bg-gray-50 rounded-lg transition-colors" : ""}`}
    style={{ gridTemplateColumns: `repeat(${cols.length}, minmax(0,1fr))` }}>
    {cols.map((c, i) => (
      <span key={i} className={i === 0 ? "font-medium text-gray-800 truncate" : "text-gray-500 truncate"}>{c}</span>
    ))}
  </div>
);

const ActionItem = ({ label, onClick }) => (
  <button onClick={onClick}
    className="px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-xl hover:bg-gray-700 transition-colors">
    {label}
  </button>
);

const Badge = ({ label, color }) => {
  const colors = {
    yellow: "bg-yellow-100 text-yellow-700",
    blue: "bg-blue-100 text-blue-700",
    red: "bg-red-100 text-red-700",
    green: "bg-green-100 text-green-700",
    gray: "bg-gray-100 text-gray-600"
  };
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors[color] || colors.gray}`}>{label}</span>;
};

const statusColor = (s) => ({ submitted: "yellow", under_review: "blue", revision_requested: "red", completed: "green" }[s] || "gray");

export default function MentorDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, loading, error } = useSelector((s) => s.dashboard);

  useEffect(() => { dispatch(fetchDashboard()); }, [dispatch]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-sm text-gray-400 animate-pulse">Loading dashboard…</p>
    </div>
  );
  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-sm text-red-500">{error}</p>
    </div>
  );
  if (!data) return null;

  const { kpis, taskStats, internStats, pendingReviews, atRisk, recentActivity, actions } = data;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Mentor Dashboard</h1>
            <p className="text-sm text-gray-400 mt-0.5">Your interns, tasks, and reviews</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            {actions?.map((a) => (
              <ActionItem key={a.route} label={a.label} onClick={() => navigate(a.route)} />
            ))}
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <KpiCard label="Total Interns" value={kpis?.totalInterns} sub={`${kpis?.activeInternships} active`} onClick={() => navigate("/mentor/interns")} />
          <KpiCard label="Completed" value={kpis?.completedInternships} onClick={() => navigate("/mentor/interns")} />
          <KpiCard label="Pending Reviews" value={kpis?.pendingTaskReviews} warn={kpis?.pendingTaskReviews > 0} onClick={() => navigate("/mentor/interns")} />
          <KpiCard label="Avg Intern Score" value={kpis?.avgInternScore != null ? `${kpis.avgInternScore}/10` : "—"}
            warn={kpis?.avgInternScore != null && kpis.avgInternScore < 5} />
        </div>

        {/* Task Stats + Pending Reviews */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <SectionCard title="Task Overview">
            <div className="grid grid-cols-2 gap-3">
              {[
                ["Total Tasks", taskStats?.totalTasks],
                ["Pending", taskStats?.pending],
                ["Submitted", taskStats?.submitted],
                ["Under Review", taskStats?.under_review],
                ["Revision Requested", taskStats?.revision_requested],
                ["Completed", taskStats?.completed]
              ].map(([label, val]) => (
                <div key={label} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-1">{label}</p>
                  <p className="text-xl font-bold text-gray-800">{val ?? 0}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="⏳ Pending Reviews" accent="border-yellow-200">
            {pendingReviews?.length ? (
              <div className="space-y-2">
                {pendingReviews.map((r) => (
                  <div key={r._id}
                    onClick={() => navigate(`/mentor/intern/${r.applicationId}/track`)}
                    className="flex items-center justify-between bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 cursor-pointer hover:bg-yellow-100 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{r.studentName}</p>
                      <p className="text-xs text-gray-400">{new Date(r.submittedAt).toLocaleDateString()} · Attempt #{r.attempt}</p>
                    </div>
                    <Badge label={STATUS_LABELS[r.status] || r.status} color={statusColor(r.status)} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 py-2">No pending reviews. 🎉</p>
            )}
          </SectionCard>
        </div>

        {/* Intern Stats + At-Risk */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <SectionCard title="Intern Performance">
            <TableRow cols={["Name", "Internship", "Progress", "Score"]} />
            {internStats?.map((i) => (
              <TableRow key={i.id}
                cols={[i.name, i.internship, `${i.progress}%`, i.avgScore != null ? `${i.avgScore}/10` : "—"]}
                onClick={() => navigate(`/mentor/intern/${i.id}/track`)} />
            ))}
            {!internStats?.length && <p className="text-sm text-gray-400 py-2">No interns assigned.</p>}
          </SectionCard>

          <SectionCard title="⚠ At-Risk Interns" accent="border-red-100">
            {atRisk?.length ? (
              <div className="space-y-2">
                {atRisk.map((a) => (
                  <div key={a.id}
                    onClick={() => navigate(`/mentor/intern/${a.id}/track`)}
                    className="flex items-center justify-between bg-red-50 border border-red-200 rounded-xl px-4 py-3 cursor-pointer hover:bg-red-100 transition-colors">
                    <span className="text-sm font-medium text-gray-800">{a.name}</span>
                    <span className="text-xs text-red-600 font-medium">{a.reason}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 py-2">No at-risk interns.</p>
            )}
          </SectionCard>
        </div>

        {/* Recent Activity */}
        <SectionCard title="Recent Activity">
          <TableRow cols={["Student", "Task", "Status", "Date"]} />
          {recentActivity?.map((a) => (
            <TableRow key={a._id}
              cols={[
                a.studentName,
                a.taskTitle,
                <Badge label={STATUS_LABELS[a.status] || a.status} color={statusColor(a.status)} />,
                new Date(a.submittedAt).toLocaleDateString()
              ]}
              onClick={() => navigate(`/mentor/intern/${a.applicationId}/track`)} />
          ))}
          {!recentActivity?.length && <p className="text-sm text-gray-400 py-2">No recent activity.</p>}
        </SectionCard>

      </div>
    </div>
  );
}