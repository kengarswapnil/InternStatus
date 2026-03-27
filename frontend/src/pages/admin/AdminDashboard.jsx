import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchDashboard } from "../../store/dashboardSlice";

// ─── HELPERS ──────────────────────────────────────────────────────────
const fmt = (n) => (n ?? 0).toLocaleString();
const timeAgo = (d) => {
  if (!d) return "—";
  const s = Math.floor((Date.now() - new Date(d)) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

// ─── KPI CARD ─────────────────────────────────────────────────────────
const KpiCard = ({ label, value, sub, accent, onClick }) => (
  <div
    onClick={onClick}
    className={`bg-white rounded-2xl shadow-sm p-5 border border-gray-100 flex flex-col gap-2 cursor-pointer hover:shadow-md transition-shadow ${accent || ""}`}
  >
    <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
      {label}
    </span>
    <span className="text-3xl font-bold text-gray-800">{fmt(value)}</span>
    {sub && <span className="text-xs text-gray-400">{sub}</span>}
  </div>
);

// ─── SECTION CARD ─────────────────────────────────────────────────────
const SectionCard = ({ title, children, className = "" }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
    <div className="px-5 py-4 border-b border-gray-50">
      <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">{title}</h2>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

// ─── TABLE ROW ────────────────────────────────────────────────────────
const TableRow = ({ left, right, muted }) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
    <span className={`text-sm ${muted ? "text-gray-400 italic" : "text-gray-700"}`}>{left}</span>
    <span className="text-sm font-medium text-gray-500">{right}</span>
  </div>
);

// ─── ACTION ITEM ──────────────────────────────────────────────────────
const ActionItem = ({ label, route, navigate }) => (
  <button
    onClick={() => navigate(route)}
    className="w-full text-left px-4 py-3 rounded-xl bg-gray-50 hover:bg-indigo-50 hover:text-indigo-700 text-sm font-medium text-gray-700 transition-colors border border-transparent hover:border-indigo-100"
  >
    {label} →
  </button>
);

// ─── BADGE ────────────────────────────────────────────────────────────
const Badge = ({ n, warn }) =>
  n > 0 ? (
    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${warn ? "bg-red-100 text-red-600" : "bg-indigo-100 text-indigo-600"}`}>
      {n}
    </span>
  ) : null;

// ─── STAT ROW ─────────────────────────────────────────────────────────
const StatRow = ({ label, value, highlight }) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
    <span className="text-sm text-gray-600">{label}</span>
    <span className={`text-sm font-bold ${highlight ? "text-emerald-600" : "text-gray-800"}`}>{value}</span>
  </div>
);

// ─── ACTIVITY DOT ─────────────────────────────────────────────────────
const dotColor = (type) => {
  if (type?.includes("college")) return "bg-violet-400";
  if (type?.includes("company")) return "bg-sky-400";
  return "bg-emerald-400";
};

// ═══════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ═══════════════════════════════════════════════════════════════════════
export default function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, loading, error } = useSelector((s) => s.dashboard);

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-gray-400 font-medium">Loading dashboard…</span>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-sm">
          <p className="text-red-600 font-semibold mb-2">Failed to load</p>
          <p className="text-red-400 text-sm mb-4">{error}</p>
          <button
            onClick={() => dispatch(fetchDashboard())}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );

  if (!data) return null;

  const { kpis, onboarding, growth, systemStats, atRisk, recentActivity, actions } = data;
  const totalPending = (onboarding?.pendingCollegeRequests ?? 0) + (onboarding?.pendingCompanyRequests ?? 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── HEADER ─────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 px-6 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-400 mt-0.5">System overview & controls</p>
          </div>
          {totalPending > 0 && (
            <button
              onClick={() => navigate("/admin/onboarding/pending")}
              className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm font-semibold hover:bg-amber-100 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              {totalPending} pending request{totalPending !== 1 ? "s" : ""}
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* ── 1. KPI CARDS ─────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <KpiCard label="Total Users" value={kpis?.totalUsers} sub={`${fmt(kpis?.activeUsers)} active (30d)`} onClick={() => navigate("/admin/users")} />
          <KpiCard label="Students" value={kpis?.totalStudents} onClick={() => navigate("/admin/users")} />
          <KpiCard label="Faculty" value={kpis?.totalFaculty} onClick={() => navigate("/admin/users")} />
          <KpiCard label="Applications" value={kpis?.totalApplications} sub={`${systemStats?.successRate ?? 0}% success rate`} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <KpiCard label="Colleges" value={kpis?.totalColleges} onClick={() => navigate("/admin/colleges")} />
          <KpiCard label="Companies" value={kpis?.totalCompanies} onClick={() => navigate("/admin/companies")} />
          <KpiCard label="Active Internships" value={systemStats?.activeInternships} />
          <KpiCard label="Completed" value={systemStats?.completedInternships} accent="border-l-4 border-l-emerald-400" />
        </div>

        {/* ── 2. ONBOARDING + ACTIONS ──────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <SectionCard
            title={
              <>
                Onboarding Status
                <Badge n={totalPending} warn />
              </>
            }
            className="xl:col-span-2"
          >
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div
                onClick={() => navigate("/admin/onboarding/pending")}
                className={`rounded-xl p-4 cursor-pointer border transition-colors ${onboarding?.pendingCollegeRequests > 0 ? "bg-amber-50 border-amber-200 hover:bg-amber-100" : "bg-gray-50 border-gray-100"}`}
              >
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">College Requests</p>
                <p className="text-3xl font-bold text-gray-800">{onboarding?.pendingCollegeRequests ?? 0}</p>
                <p className="text-xs text-gray-400 mt-1">pending approval</p>
              </div>
              <div
                onClick={() => navigate("/admin/onboarding/pending")}
                className={`rounded-xl p-4 cursor-pointer border transition-colors ${onboarding?.pendingCompanyRequests > 0 ? "bg-amber-50 border-amber-200 hover:bg-amber-100" : "bg-gray-50 border-gray-100"}`}
              >
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Company Requests</p>
                <p className="text-3xl font-bold text-gray-800">{onboarding?.pendingCompanyRequests ?? 0}</p>
                <p className="text-xs text-gray-400 mt-1">pending approval</p>
              </div>
            </div>

            {onboarding?.recentApproved?.length > 0 && (
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">Recently Approved</p>
                {onboarding.recentApproved.slice(0, 4).map((r) => (
                  <TableRow
                    key={r._id}
                    left={r.collegeName || r.companyName}
                    right={timeAgo(r.reviewedAt)}
                  />
                ))}
              </div>
            )}
          </SectionCard>

          <SectionCard title="Quick Actions">
            <div className="flex flex-col gap-2">
              {(actions || []).map((a) => (
                <ActionItem key={a.route} label={a.label} route={a.route} navigate={navigate} />
              ))}
            </div>
          </SectionCard>
        </div>

        {/* ── 3. GROWTH + SYSTEM STATS ─────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <SectionCard title="Growth — Last 30 Days">
            <StatRow label="New Users" value={`+${fmt(growth?.newUsers)}`} highlight />
            <StatRow label="New Colleges" value={`+${fmt(growth?.newColleges)}`} />
            <StatRow label="New Companies" value={`+${fmt(growth?.newCompanies)}`} />
            <StatRow label="New Applications" value={`+${fmt(growth?.newApplications)}`} />
            {growth?.byRole && Object.keys(growth.byRole).length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-50">
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">By Role</p>
                {Object.entries(growth.byRole).map(([role, count]) => (
                  <div key={role} className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs text-gray-500 capitalize w-20">{role}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                      <div
                        className="bg-indigo-400 h-1.5 rounded-full transition-all"
                        style={{ width: `${Math.min(100, (count / (growth.newUsers || 1)) * 100)}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-gray-600 w-6 text-right">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          <SectionCard title="System Stats">
            <StatRow label="Active Internships" value={fmt(systemStats?.activeInternships)} highlight />
            <StatRow label="Ongoing Applications" value={fmt(systemStats?.ongoingApplications)} />
            <StatRow label="Completed Internships" value={fmt(systemStats?.completedInternships)} />
            <StatRow label="Closed Internship Listings" value={fmt(systemStats?.closedInternships)} />
            <div className="mt-4 pt-4 border-t border-gray-50">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm text-gray-600">Success Rate</span>
                <span className="text-sm font-bold text-emerald-600">{systemStats?.successRate ?? 0}%</span>
              </div>
              <div className="bg-gray-100 rounded-full h-2">
                <div
                  className="bg-emerald-400 h-2 rounded-full transition-all"
                  style={{ width: `${systemStats?.successRate ?? 0}%` }}
                />
              </div>
            </div>
          </SectionCard>
        </div>

        {/* ── 4. AT-RISK + RECENT ACTIVITY ─────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* AT RISK */}
          <SectionCard
            title={
              <>
                At-Risk Items
                {atRisk?.length > 0 && <Badge n={atRisk.length} warn />}
              </>
            }
            className={atRisk?.length > 0 ? "border-red-100" : ""}
          >
            {!atRisk?.length ? (
              <p className="text-sm text-gray-400 italic">No risks detected. System looks healthy.</p>
            ) : (
              <div className="space-y-2">
                {atRisk.slice(0, 10).map((item, i) => (
                  <div
                    key={item.id ?? i}
                    className={`rounded-xl px-4 py-3 border text-sm ${
                      item.type?.includes("unverified") || item.type?.includes("stalled") || item.type?.includes("onboarding")
                        ? "bg-amber-50 border-amber-200 text-amber-800"
                        : "bg-red-50 border-red-200 text-red-700"
                    }`}
                  >
                    {item.reason}
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          {/* RECENT ACTIVITY */}
          <SectionCard title="Recent Activity">
            {!recentActivity?.length ? (
              <p className="text-sm text-gray-400 italic">No recent activity.</p>
            ) : (
              <div className="space-y-1">
                {recentActivity.slice(0, 10).map((item, i) => (
                  <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                    <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${dotColor(item.type)}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700 truncate">{item.label}</p>
                    </div>
                    <span className="text-xs text-gray-400 flex-shrink-0">{timeAgo(item.time)}</span>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  );
}