import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { useNavigate } from "react-router-dom";
import StudentNavBar from "../../components/navbars/StudentNavBar"; // Kept your original import

// ==========================================
// 1. Reusable Status Badge Component
// ==========================================
const StatusBadge = ({ status }) => {
  let cls = "bg-[#f9f9f9] border-[#e5e5e5] text-[#333]";

  if (["selected", "offer_accepted", "completed"].includes(status)) {
    cls = "bg-[#fff] border-[#008000] text-[#008000]";
  } else if (["applied", "shortlisted", "ongoing"].includes(status)) {
    cls = "bg-[#111] text-[#fff] border-[#111]";
  } else if (["rejected", "terminated"].includes(status)) {
    cls = "bg-[#fff] border-[#cc0000] text-[#cc0000]";
  }

  return (
    <span
      className={`px-2.5 py-1 rounded-[10px] text-[9px] font-black uppercase tracking-widest border ${cls}`}
    >
      {status.replace("_", " ")}
    </span>
  );
};

// ==========================================
// 2. Individual Application Row Component
// ==========================================
const ApplicationRow = ({
  app,
  loadingId,
  expandedId,
  toggleExpand,
  actionHandler,
  navigate,
}) => {
  const internship = app.internship || {};
  const isExpanded = expandedId === app._id;

  // Logic Booleans
  const canWithdraw = app.status === "applied" || app.status === "shortlisted";
  const canAccept = app.status === "selected";
  const waitingStart = app.status === "offer_accepted";
  const canTrack = app.status === "ongoing" || app.status === "completed";

  return (
    <React.Fragment>
      {/* Main Table Row */}
      <tr
        className={`border-b border-[#e5e5e5] transition-colors hover:bg-[#fafafa] ${isExpanded ? "bg-[#fafafa]" : ""}`}
      >
        <td className="p-4 md:p-5 align-middle">
          <div className="flex flex-col">
            <h3 className="text-[15px] font-black text-[#333] m-0 leading-tight">
              {internship.title}
            </h3>
            <p className="text-[11px] font-bold text-[#333] opacity-50 uppercase tracking-widest mt-1">
              {internship.company?.name}
            </p>
          </div>
        </td>

        <td className="p-4 md:p-5 align-middle whitespace-nowrap">
          <span className="text-[12px] font-bold text-[#111]">
            {new Date(app.appliedAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        </td>

        <td className="p-4 md:p-5 align-middle whitespace-nowrap">
          <StatusBadge status={app.status} />
        </td>

        <td className="p-4 md:p-5 align-middle text-right whitespace-nowrap">
          <button
            onClick={() => toggleExpand(app._id)}
            className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[#333] bg-[#fff] border border-[#e5e5e5] rounded-[10px] hover:border-[#333] transition-all cursor-pointer"
          >
            {isExpanded ? "Less Info" : "More Info"}
          </button>
        </td>
      </tr>

      {/* Expanded Details Drawer (Compact & Space-Friendly) */}
      {isExpanded && (
        <tr className="bg-[#fcfcfc] border-b border-[#e5e5e5]">
          <td colSpan={4} className="p-4 md:px-5 md:py-4">
            <div className="flex flex-col gap-3">
              {/* Top Details - Compact Horizontal Flexbox */}
              <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] font-bold opacity-40 uppercase tracking-widest">
                    Work Mode
                  </span>
                  <span className="text-[12px] font-black text-[#111] capitalize">
                    {internship.mode}
                  </span>
                </div>

                {app.mentor && (
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-bold opacity-40 uppercase tracking-widest">
                      Supervisor
                    </span>
                    <span className="text-[12px] font-black text-[#111]">
                      {app.mentor.fullName}
                    </span>
                  </div>
                )}

                {app.resumeSnapshot && (
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-bold opacity-40 uppercase tracking-widest">
                      Document
                    </span>
                    <a
                      href={app.resumeSnapshot}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-black text-[#111] underline uppercase tracking-widest hover:opacity-70 transition-opacity"
                    >
                      View Resume
                    </a>
                  </div>
                )}
              </div>

              {/* Action Buttons - Compact Row */}
              <div className="flex flex-wrap gap-2 pt-3 border-t border-[#e5e5e5]">
                {canWithdraw && (
                  <button
                    disabled={loadingId === app._id}
                    onClick={() => actionHandler(app._id, "withdraw")}
                    className="px-4 py-2 text-[10px] font-bold text-[#cc0000] bg-[#fff] border border-[#cc0000] rounded-[10px] hover:bg-[#cc0000] hover:text-[#fff] transition-all disabled:opacity-30 uppercase tracking-widest cursor-pointer"
                  >
                    {loadingId === app._id ? "..." : "Withdraw Submission"}
                  </button>
                )}

                {canTrack && (
                  <button
                    onClick={() => navigate(`/student/intern/${app._id}/track`)}
                    className="px-4 py-2 text-[10px] font-black text-[#fff] bg-[#111] rounded-[10px] border-none hover:opacity-80 transition-opacity uppercase tracking-widest cursor-pointer"
                  >
                    Access Task Console
                  </button>
                )}

                {canAccept && (
                  <>
                    <button
                      disabled={loadingId === app._id}
                      onClick={() => actionHandler(app._id, "accept")}
                      className="px-4 py-2 text-[10px] font-black text-[#fff] bg-[#008000] border-none rounded-[10px] hover:opacity-80 transition-opacity disabled:opacity-30 uppercase tracking-widest cursor-pointer"
                    >
                      {loadingId === app._id ? "..." : "Confirm Offer"}
                    </button>

                    <button
                      disabled={loadingId === app._id}
                      onClick={() => actionHandler(app._id, "decline")}
                      className="px-4 py-2 text-[10px] font-bold text-[#cc0000] bg-[#fff] border border-[#cc0000] rounded-[10px] hover:bg-[#cc0000] hover:text-[#fff] transition-all disabled:opacity-30 uppercase tracking-widest cursor-pointer"
                    >
                      {loadingId === app._id ? "..." : "Decline Offer"}
                    </button>
                  </>
                )}

                {waitingStart && (
                  <div className="px-3 py-1.5 bg-[#f9f9f9] border border-[#e5e5e5] rounded-[8px] flex items-center">
                    <span className="text-[9px] font-black text-[#333] opacity-40 uppercase tracking-widest">
                      Awaiting official commencement
                    </span>
                  </div>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </React.Fragment>
  );
};

// ==========================================
// 3. Main Applications Component
// ==========================================
export default function MyApplications() {
  const [data, setData] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const res = await API.get("/applications/my");
      setData(res.data.data || []);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to load applications");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const actionHandler = async (id, action) => {
    try {
      setLoadingId(id);
      if (action === "withdraw") {
        await API.patch(`/applications/${id}/withdraw`);
      } else {
        await API.patch(`/applications/${id}/offer`, { decision: action });
      }
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    } finally {
      setLoadingId(null);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-[#333] font-sans pb-10">
      <main className="max-w-5xl mx-auto w-full px-4 md:px-6 py-6 flex flex-col gap-6">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between md:items-end gap-4 border-b border-[#e5e5e5] pb-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-[23px] font-black text-[#333] m-0 tracking-tight leading-tight">
              My Applications
            </h1>
            <p className="text-[13px] font-bold text-[#333] opacity-60 m-0 uppercase tracking-widest">
              Submission & Offer Tracking
            </p>
          </div>
        </header>

        {/* Data Handling */}
        {data.length === 0 ? (
          <div className="bg-[#fff] border-2 border-dashed border-[#e5e5e5] rounded-[20px] p-20 text-center">
            <p className="text-[13px] font-bold text-[#333] opacity-40 m-0 uppercase tracking-widest">
              No application history found
            </p>
          </div>
        ) : (
          <div className="bg-[#fff] border border-[#e5e5e5] rounded-[20px] shadow-sm overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#e5e5e5] bg-[#f9f9f9]">
                  <th className="p-5 text-[10px] font-bold opacity-40 uppercase tracking-widest">
                    Role & Company
                  </th>
                  <th className="p-5 text-[10px] font-bold opacity-40 uppercase tracking-widest whitespace-nowrap">
                    Applied On
                  </th>
                  <th className="p-5 text-[10px] font-bold opacity-40 uppercase tracking-widest">
                    Status
                  </th>
                  <th className="p-5 text-[10px] font-bold opacity-40 uppercase tracking-widest text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((app) => (
                  <ApplicationRow
                    key={app._id}
                    app={app}
                    loadingId={loadingId}
                    expandedId={expandedId}
                    toggleExpand={toggleExpand}
                    actionHandler={actionHandler}
                    navigate={navigate}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
