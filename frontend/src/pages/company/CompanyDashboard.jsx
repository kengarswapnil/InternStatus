import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchDashboard } from "../../store/dashboardSlice";

const STATUS_LABELS = {
  applied: "Applied", shortlisted: "Shortlisted", selected: "Selected",
  offer_accepted: "Offer Accepted", ongoing: "Ongoing", completed: "Completed"
};

const KpiCard = ({ label, value, sub, onClick, accent }) => (
  <div
    onClick={onClick}
    className={`bg-white rounded-2xl shadow-sm p-5 border border-gray-100 cursor-pointer hover:shadow-md transition-shadow ${accent || ""}`}
  >
    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">{label}</p>
    <p className="text-3xl font-bold text-gray-800">{value ?? "—"}</p>
    {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
  </div>
);

const SectionCard = ({ title, children }) => (
  <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
    <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">{title}</h2>
    {children}
  </div>
);

const TableRow = ({ cols, highlight }) => (
  <div className={`grid gap-3 py-2 border-b border-gray-50 last:border-0 text-sm ${highlight ? "bg-red-50 -mx-2 px-2 rounded-lg" : ""}`}
    style={{ gridTemplateColumns: `repeat(${cols.length}, minmax(0, 1fr))` }}>
    {cols.map((c, i) => <span key={i} className={i === 0 ? "font-medium text-gray-800 truncate" : "text-gray-500 truncate"}>{c}</span>)}
  </div>
);

const ActionItem = ({ label, route, onClick }) => (
  <button onClick={() => onClick(route)}
    className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-xl hover:bg-gray-700 transition-colors">
    {label} <span className="text-gray-400">→</span>
  </button>
);

export default function CompanyDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, loading, error } = useSelector((s) => s.dashboard);

  useEffect(() => { dispatch(fetchDashboard()); }, [dispatch]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-gray-400 text-sm animate-pulse">Loading dashboard…</div>
    </div>
  );
  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-red-500 text-sm">{error}</div>
    </div>
  );
  if (!data) return null;

  const { kpis, pipeline, internshipStats, internStats, atRisk, recentActivity, actions } = data;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Company Dashboard</h1>
            <p className="text-sm text-gray-400 mt-0.5">Internship management overview</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            {actions?.map((a) => (
              <ActionItem key={a.route} label={a.label} route={a.route} onClick={navigate} />
            ))}
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <KpiCard label="Active Internships" value={kpis?.activeInternships} sub={`${kpis?.totalInternships} total`} onClick={() => navigate("/company/company-internships")} />
          <KpiCard label="Total Applicants" value={kpis?.totalApplicants} onClick={() => navigate("/company/company-internships")} />
          <KpiCard label="Ongoing Interns" value={kpis?.ongoingInterns} sub={`${kpis?.completedInterns} completed`} onClick={() => navigate("/company/interns")} />
          <KpiCard label="Avg Intern Score" value={kpis?.avgInternScore != null ? `${kpis.avgInternScore}/10` : "—"} sub={`${kpis?.selectedCandidates} selected`} accent={kpis?.avgInternScore < 5 ? "border-red-200" : ""} />
        </div>

        {/* Pipeline + Internship Stats */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <SectionCard title="Hiring Pipeline">
            <div className="space-y-2">
              {Object.entries(pipeline || {}).map(([key, val]) => (
                <div key={key} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-28 shrink-0">{STATUS_LABELS[key]}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div className="bg-gray-700 h-2 rounded-full transition-all" style={{ width: `${val.conversionRate}%` }} />
                  </div>
                  <span className="text-xs font-semibold text-gray-700 w-14 text-right">{val.count} <span className="text-gray-400 font-normal">({val.conversionRate}%)</span></span>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Internship Stats">
            <div className="space-y-1">
              <TableRow cols={["Title", "Applicants", "Selected", "Ongoing"]} />
              {internshipStats?.map((i) => (
                <TableRow key={i._id} cols={[i.title, i.applicants, i.selected, i.ongoing]} />
              ))}
              {!internshipStats?.length && <p className="text-sm text-gray-400 py-2">No internships found.</p>}
            </div>
          </SectionCard>
        </div>

        {/* Intern Stats + At-Risk */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <SectionCard title="Intern Performance">
            <div className="space-y-1">
              <TableRow cols={["Name", "Internship", "Progress", "Score"]} />
              {internStats?.map((i) => (
                <div key={i.id} onClick={() => navigate(`/company/interns/${i.id}/progress`)} className="cursor-pointer hover:bg-gray-50 rounded-lg -mx-1 px-1 transition-colors">
                  <TableRow cols={[i.name, i.internship, `${i.progress}%`, i.avgScore != null ? `${i.avgScore}/10` : "—"]} />
                </div>
              ))}
              {!internStats?.length && <p className="text-sm text-gray-400 py-2">No ongoing interns.</p>}
            </div>
          </SectionCard>

          <SectionCard title="⚠ At-Risk Interns">
            {atRisk?.length ? (
              <div className="space-y-2">
                {atRisk.map((a) => (
                  <div key={a.id} onClick={() => navigate(`/company/interns/${a.id}/progress`)}
                    className="flex items-center justify-between bg-red-50 border border-red-200 rounded-xl px-4 py-3 cursor-pointer hover:bg-red-100 transition-colors">
                    <span className="text-sm font-medium text-gray-800">{a.name}</span>
                    <span className="text-xs text-red-600 font-medium">{a.reason}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 py-2">No at-risk interns. 🎉</p>
            )}
          </SectionCard>
        </div>

        {/* Recent Activity */}
        <SectionCard title="Recent Activity">
          <div className="space-y-1">
            <TableRow cols={["Student", "Internship", "Status", "Date"]} />
            {recentActivity?.map((a) => (
              <TableRow key={a.id} cols={[
                a.student,
                a.internship,
                STATUS_LABELS[a.status] || a.status,
                a.date ? new Date(a.date).toLocaleDateString() : "—"
              ]} />
            ))}
            {!recentActivity?.length && <p className="text-sm text-gray-400 py-2">No recent activity.</p>}
          </div>
        </SectionCard>

      </div>
    </div>
  );
}