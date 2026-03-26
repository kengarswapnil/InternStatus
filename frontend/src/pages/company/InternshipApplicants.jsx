import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { useParams } from "react-router-dom";

export default function InternshipApplicants() {
  const { id } = useParams();

  const [data, setData] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const fetchData = async () => {
    try {
      const res = await API.get(`/applications/internship/${id}`);
      setData(res.data?.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load applicants");
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const updateStatus = async (appId, status) => {
    const confirmAction = window.confirm(
      `Are you sure you want to mark as ${status}?`
    );
    if (!confirmAction) return;

    setLoadingId(appId);

    try {
      await API.patch(`/applications/${appId}/status`, { status });
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setLoadingId(null);
    }
  };

  // 🔍 FILTER LOGIC
  const filteredData = data.filter((app) => {
    const name = app.studentSnapshot?.fullName || "";
    const matchesSearch = name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus
      ? app.status === filterStatus
      : true;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#f9f9f9] p-6 font-sans text-[#111]">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <h2 className="text-2xl font-black uppercase tracking-tight">
            Applicants
          </h2>

          <div className="flex gap-3 w-full md:w-auto">
            {/* SEARCH */}
            <input
              type="text"
              placeholder="Search name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-[#e5e5e5] rounded-[10px] text-[13px] w-full md:w-[250px]"
            />

            <select
  value={filterStatus}
  onChange={(e) => setFilterStatus(e.target.value)}
  className="px-4 py-2 border border-[#e5e5e5] rounded-[10px] text-[13px]"
>
  <option value="">All</option>
  <option value="applied">Applied</option>
  <option value="shortlisted">Shortlisted</option>
  <option value="selected">Selected</option>
  <option value="offer_accepted">Accepted</option>
  <option value="ongoing">Ongoing</option>
  <option value="completed">Completed</option>
  <option value="terminated">Terminated</option>
  <option value="rejected">Rejected</option>
</select>
          </div>
        </div>

        {/* EMPTY STATE */}
        {filteredData.length === 0 ? (
          <div className="text-center py-20 text-[#999] text-[13px] font-bold">
            No applicants found
          </div>
        ) : (
          <div className="overflow-x-auto bg-white border border-[#e5e5e5] rounded-[12px]">
            <table className="w-full text-left border-collapse">
              
              {/* TABLE HEADER */}
              <thead className="bg-[#f4f4f4] text-[11px] uppercase tracking-widest">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Resume</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>

              {/* TABLE BODY */}
              <tbody>
                {filteredData.map((app) => {
                  const s = app.studentSnapshot || {};

                  return (
                    <tr
                      key={app._id}
                      className="border-t border-[#eee] hover:bg-[#fafafa]"
                    >
                      {/* NAME */}
                      <td className="p-3 font-bold">
                        {s.fullName || "—"}
                      </td>

                      {/* EMAIL */}
                      <td className="p-3 text-[13px]">
                        {s.email || "—"}
                      </td>

                      {/* RESUME */}
                      <td className="p-3">
                        {app.resumeSnapshot ? (
                          <a
                            href={app.resumeSnapshot}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[12px] font-bold underline"
                          >
                            View
                          </a>
                        ) : (
                          <span className="text-[#999] text-[12px]">
                            N/A
                          </span>
                        )}
                      </td>

                      {/* STATUS */}
                      <td className="p-3 text-[12px] font-bold uppercase">
                        {app.status}
                      </td>

                      {/* ACTIONS */}
                    <td className="p-3 text-right">
  <div className="flex gap-2 justify-end flex-wrap">

    {/* ACTIVE PIPELINE */}
    {app.status === "applied" && (
      <>
        <button
          onClick={() => updateStatus(app._id, "shortlisted")}
          disabled={loadingId === app._id}
          className="px-3 py-1 bg-black text-white text-[11px] rounded"
        >
          Shortlist
        </button>
        <button
          onClick={() => updateStatus(app._id, "rejected")}
          className="px-3 py-1 border text-[11px] rounded"
        >
          Reject
        </button>
      </>
    )}

    {app.status === "shortlisted" && (
      <>
        <button
          onClick={() => updateStatus(app._id, "selected")}
          className="px-3 py-1 bg-black text-white text-[11px] rounded"
        >
          Select
        </button>
        <button
          onClick={() => updateStatus(app._id, "rejected")}
          className="px-3 py-1 border text-[11px] rounded"
        >
          Reject
        </button>
      </>
    )}

    {/* MID STATE */}
    {app.status === "selected" && (
      <span className="text-[11px] text-yellow-600 font-bold">
        Waiting Acceptance
      </span>
    )}

    {app.status === "offer_accepted" && (
      <span className="text-[11px] text-blue-600 font-bold">
        Ready to Start
      </span>
    )}

    {/* ACTIVE INTERNSHIP */}
    {app.status === "ongoing" && (
      <span className="text-[11px] text-blue-700 font-bold">
        In Progress
      </span>
    )}

    {/* FINAL STATES */}
    {app.status === "completed" && (
      <span className="text-[11px] text-green-600 font-bold">
        Completed
      </span>
    )}

    {app.status === "terminated" && (
      <span className="text-[11px] text-orange-600 font-bold">
        Terminated
      </span>
    )}

    {app.status === "rejected" && (
      <span className="text-[11px] text-red-600 font-bold">
        Rejected
      </span>
    )}

  </div>
</td>
                    </tr>
                  );
                })}
              </tbody>

            </table>
          </div>
        )}
      </div>
    </div>
  );
}