import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchDashboard } from "../../store/dashboardSlice";

// ─────────────────────────────────────────────────────────────────────
// KPI CARD COMPONENT
// ─────────────────────────────────────────────────────────────────────
const KpiCard = ({ label, value, unit = "", trend = null }) => (
  <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
    <p className="text-gray-500 text-sm font-medium">{label}</p>
    <div className="mt-2 flex items-baseline gap-2">
      <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
      {unit && <span className="text-gray-400 text-sm">{unit}</span>}
    </div>
    {trend && (
      <p
        className={`mt-2 text-xs font-medium ${
          trend > 0 ? "text-green-600" : "text-red-600"
        }`}
      >
        {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
      </p>
    )}
  </div>
);

// ─────────────────────────────────────────────────────────────────────
// SECTION CARD COMPONENT
// ─────────────────────────────────────────────────────────────────────
const SectionCard = ({ title, children, action }) => (
  <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
    <div className="flex justify-between items-center mb-5">
      <h2 className="text-lg font-bold text-gray-800">{title}</h2>
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

// ─────────────────────────────────────────────────────────────────────
// PIPELINE BAR COMPONENT
// ─────────────────────────────────────────────────────────────────────
const PipelineBar = ({ label, value, total, color }) => {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  return (
    <div className="mb-3">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm text-gray-600">
          {value} ({Math.round(percentage)}%)
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${color}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────
// TABLE ROW COMPONENT
// ─────────────────────────────────────────────────────────────────────
const TableRow = ({ cells, onClick, danger = false }) => (
  <tr
    onClick={onClick}
    className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition ${
      danger ? "bg-red-50" : ""
    }`}
  >
    {cells.map((cell, i) => (
      <td key={i} className="px-4 py-3 text-sm text-gray-700">
        {cell}
      </td>
    ))}
  </tr>
);

// ─────────────────────────────────────────────────────────────────────
// COLLEGE DASHBOARD MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────
const CollegeDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, loading, error } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  const {
    kpis = {},
    pipeline = {},
    specializationStats = [],
    facultyStats = {},
    atRisk = [],
    recentActivity = [],
    actions = [],
  } = data || {};

  const totalApps =
    (pipeline.applied || 0) +
    (pipeline.shortlisted || 0) +
    (pipeline.selected || 0) +
    (pipeline.ongoing || 0) +
    (pipeline.completed || 0) +
    (pipeline.rejected || 0);

  // ─────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">College Dashboard</h1>
          <p className="text-gray-500 mt-1">Monitor students, faculty & placements</p>
        </div>

        {/* KPI SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          <KpiCard
            label="Total Students"
            value={kpis.totalStudents || 0}
            trend={100}
          />
          <KpiCard
            label="Active Students"
            value={kpis.activeStudents || 0}
            unit="enrolled"
          />
          <KpiCard
            label="Placement Rate"
            value={`${kpis.placementRate || 0}%`}
            trend={kpis.placementRate > 50 ? 10 : -5}
          />
          <KpiCard
            label="Avg Student Score"
            value={kpis.avgStudentScore || 0}
            unit="/10"
          />
        </div>

        {/* SECONDARY KPI */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <KpiCard
            label="With Internships"
            value={kpis.studentsWithInternships || 0}
          />
          <KpiCard
            label="Completed"
            value={kpis.completedInternships || 0}
          />
          <KpiCard
            label="Faculty (Active/Total)"
            value={`${kpis.activeFaculty || 0}/${kpis.totalFaculty || 0}`}
          />
        </div>

        {/* PIPELINE SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <SectionCard
            title="Application Pipeline"
            action={{
              label: "View All",
              onClick: () => navigate("/college/students"),
            }}
          >
            <PipelineBar
              label="Applied"
              value={pipeline.applied || 0}
              total={totalApps}
              color="bg-blue-400"
            />
            <PipelineBar
              label="Shortlisted"
              value={pipeline.shortlisted || 0}
              total={totalApps}
              color="bg-purple-400"
            />
            <PipelineBar
              label="Selected"
              value={pipeline.selected || 0}
              total={totalApps}
              color="bg-amber-400"
            />
            <PipelineBar
              label="Ongoing"
              value={pipeline.ongoing || 0}
              total={totalApps}
              color="bg-cyan-400"
            />
            <PipelineBar
              label="Completed"
              value={pipeline.completed || 0}
              total={totalApps}
              color="bg-green-400"
            />
            <PipelineBar
              label="Rejected"
              value={pipeline.rejected || 0}
              total={totalApps}
              color="bg-red-400"
            />
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                <span className="font-bold text-gray-800">
                  {pipeline.conversionRate || 0}%
                </span>{" "}
                conversion rate
              </p>
            </div>
          </SectionCard>

          {/* SPECIALIZATION STATS */}
          <SectionCard
            title="By Specialization"
            action={{
              label: "View All",
              onClick: () => navigate("/college/courses"),
            }}
          >
            {specializationStats.length > 0 ? (
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-2 text-xs font-semibold text-gray-500">
                      Specialization
                    </th>
                    <th className="px-4 py-2 text-xs font-semibold text-gray-500">
                      Placed
                    </th>
                    <th className="px-4 py-2 text-xs font-semibold text-gray-500">
                      Rate
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {specializationStats.slice(0, 5).map((spec, idx) => (
                    <TableRow
                      key={idx}
                      cells={[
                        spec.specialization || "N/A",
                        `${spec.placed}/${spec.total}`,
                        `${spec.placementRate}%`,
                      ]}
                    />
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500 text-sm">No data available</p>
            )}
          </SectionCard>
        </div>

        {/* FACULTY & AT-RISK */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* TOP FACULTY */}
          <SectionCard
            title="Top Faculty"
            action={{
              label: "Manage",
              onClick: () => navigate("/college/faculty"),
            }}
          >
            {facultyStats.top5 && facultyStats.top5.length > 0 ? (
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-2 text-xs font-semibold text-gray-500">
                      Name
                    </th>
                    <th className="px-4 py-2 text-xs font-semibold text-gray-500">
                      Students
                    </th>
                    <th className="px-4 py-2 text-xs font-semibold text-gray-500">
                      Active
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {facultyStats.top5.map((fac) => (
                    <TableRow
                      key={fac.id}
                      cells={[
                        fac.name,
                        fac.studentsCount,
                        fac.activeInternships,
                      ]}
                    />
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500 text-sm">No faculty data</p>
            )}
          </SectionCard>

          {/* AT-RISK STUDENTS */}
          <SectionCard
            title="At-Risk Students"
            action={{
              label: "Review",
             onClick:() => navigate("/college/at-risk"),
            }}
          >
            {atRisk && atRisk.length > 0 ? (
              <div className="space-y-2">
                {atRisk.slice(0, 5).map((student) => (
                  <div
                    key={student.id}
                    className="bg-red-50 border border-red-200 rounded-lg p-3 cursor-pointer hover:bg-red-100 transition"
                    onClick={() => navigate(`/college/at-risk/${student.id}`)}
                  >
                    <p className="font-medium text-gray-800">{student.name}</p>
                    <p className="text-sm text-red-600 mt-1">{student.reason}</p>
                  </div>
                ))}
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
        </div>

        {/* RECENT ACTIVITY */}
        <SectionCard title="Recent Activity">
          {recentActivity && recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.slice(0, 8).map((activity, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0"
                >
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm text-gray-700">{activity.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(activity.time).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No recent activity</p>
          )}
        </SectionCard>

        {/* QUICK ACTIONS */}
       
      </div>
    </div>
  );
};

export default CollegeDashboard;