import React, { useEffect, useState } from "react";
import API from "../../api/api";

export default function CompanyMentorList() {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState(null);

  const [editForm, setEditForm] = useState({
    designation: "",
    department: "",
    employeeId: ""
  });

  const [saving, setSaving] = useState(false);
  const [removingId, setRemovingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchMentors();
  }, []);

  // ================= FETCH =================

  const fetchMentors = async () => {
    try {
      const res = await API.get("/company/mentors");
      setMentors(res.data.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load mentors");
    } finally {
      setLoading(false);
    }
  };

  // ================= EDIT =================

  const openEdit = (m) => {
    setError("");
    setSuccess("");
    setSelected(m);
    setEditForm({
      designation: m.designation || "",
      department: m.department || "",
      employeeId: m.employeeId || ""
    });
  };

  const closeEdit = () => {
    setSelected(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = async () => {
    if (!selected) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await API.patch(`/company/mentors/${selected._id}`, editForm);
      setSuccess("Mentor updated successfully");
      await fetchMentors();
      closeEdit();
    } catch (err) {
      console.error(err);
      setError("Update failed");
    } finally {
      setSaving(false);
    }
  };

  // ================= REMOVE =================

  const handleRemove = async (mentorId) => {
    const confirm = window.confirm("Remove this mentor from company?");

    if (!confirm) return;

    setRemovingId(mentorId);

    try {
      await API.delete(`/company/mentors/${mentorId}`);
      setMentors((prev) => prev.filter((m) => m._id !== mentorId));
    } catch (err) {
      console.error(err);
      alert("Remove failed");
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0B0F19]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-white/10 border-t-fuchsia-500 rounded-full animate-spin"></div>
          <p className="text-fuchsia-400 font-bold tracking-widest uppercase text-[10px] animate-pulse m-0">
            Loading Mentors
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] p-4 md:p-8 font-sans text-white selection:bg-fuchsia-500/30 selection:text-fuchsia-200 relative overflow-hidden">
      {/* Ambient Backgrounds */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" aria-hidden="true"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" aria-hidden="true"></div>

      <div className="relative z-10 max-w-7xl mx-auto bg-white/5 backdrop-blur-xl rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] border border-white/10 p-6 md:p-10 box-border transition-all duration-300 hover:border-white/20">
        
        <header className="mb-8 border-b border-white/10 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 m-0 tracking-tight">
              Company Mentors
            </h2>
            <p className="text-white/40 font-medium text-sm mt-2 m-0 tracking-wide">
              Manage your organization's mentor roster
            </p>
          </div>
        </header>

        {mentors.length === 0 ? (
          <div className="bg-[#0B0F19]/50 border border-white/10 rounded-3xl p-16 text-center shadow-inner">
            <p className="text-white/40 m-0 text-base font-medium">No mentors found.</p>
          </div>
        ) : (
          <div className="bg-[#0B0F19]/30 border border-white/10 rounded-2xl overflow-hidden shadow-inner w-full max-w-full">
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left border-collapse whitespace-nowrap min-w-max">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-5 text-[10px] font-bold text-violet-400 uppercase tracking-widest">Name</th>
                    <th className="px-6 py-5 text-[10px] font-bold text-violet-400 uppercase tracking-widest">Email</th>
                    <th className="px-6 py-5 text-[10px] font-bold text-violet-400 uppercase tracking-widest">Department</th>
                    <th className="px-6 py-5 text-[10px] font-bold text-violet-400 uppercase tracking-widest">Designation</th>
                    <th className="px-6 py-5 text-[10px] font-bold text-violet-400 uppercase tracking-widest">Employee ID</th>
                    <th className="px-6 py-5 text-[10px] font-bold text-violet-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {mentors.map((m) => (
                    <tr key={m._id} className="hover:bg-white/5 transition-colors duration-300 group">
                      <td className="px-6 py-5 text-sm font-bold text-white/90 group-hover:text-fuchsia-300 transition-colors">
                        {m.fullName}
                      </td>
                      <td className="px-6 py-5 text-xs text-white/70 font-medium">{m.user?.email || "—"}</td>
                      <td className="px-6 py-5 text-xs text-violet-400 font-bold tracking-wide">{m.department || "—"}</td>
                      <td className="px-6 py-5 text-xs text-white/70">{m.designation || "—"}</td>
                      <td className="px-6 py-5 text-xs text-white/50 font-mono tracking-wider">{m.employeeId || "—"}</td>
                      <td className="px-6 py-5">
                        <div className="flex gap-3 justify-end">
                          <button
                            className="px-5 py-2.5 text-[10px] font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-lg hover:shadow-[0_4px_15px_-3px_rgba(217,70,239,0.5)] transition-all duration-300 cursor-pointer border-none uppercase tracking-widest outline-none hover:-translate-y-0.5"
                            onClick={() => openEdit(m)}
                          >
                            Edit
                          </button>
                          <button
                            className="px-5 py-2.5 text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer uppercase tracking-widest outline-none hover:-translate-y-0.5"
                            disabled={removingId === m._id}
                            onClick={() => handleRemove(m._id)}
                          >
                            {removingId === m._id ? "Removing..." : "Remove"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ================= MODAL ================= */}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0F19]/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#0B0F19]/90 backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] border border-white/10 p-8 box-border flex flex-col max-h-[90vh]">
            
            <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4 shrink-0">
              <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 m-0 tracking-tight">
                Edit Mentor
              </h3>
              <button 
                onClick={closeEdit}
                className="text-[10px] font-bold text-white/40 uppercase tracking-widest bg-transparent border-none cursor-pointer hover:text-white transition-colors outline-none p-0"
              >
                Close
              </button>
            </div>

            <div className="overflow-y-auto no-scrollbar flex-1 pr-2">
              {error && <div className="mb-6 px-4 py-3 text-[11px] font-bold text-red-300 bg-red-500/10 border border-red-500/30 rounded-xl uppercase tracking-widest">{error}</div>}
              {success && <div className="mb-6 px-4 py-3 text-[11px] font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 rounded-xl uppercase tracking-widest">{success}</div>}

              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Department</label>
                  <input
                    name="department"
                    value={editForm.department}
                    onChange={handleChange}
                    placeholder="e.g. Engineering"
                    className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-300 placeholder:text-white/20"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Designation</label>
                  <input
                    name="designation"
                    value={editForm.designation}
                    onChange={handleChange}
                    placeholder="e.g. Senior Developer"
                    className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-300 placeholder:text-white/20"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Employee ID</label>
                  <input
                    name="employeeId"
                    value={editForm.employeeId}
                    onChange={handleChange}
                    placeholder="e.g. EMP12345"
                    className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-300 placeholder:text-white/20 font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-white/10 shrink-0">
              <button
                onClick={closeEdit}
                className="px-6 py-3.5 text-[10px] font-bold text-white/80 bg-transparent border border-white/10 rounded-xl hover:bg-white/10 transition-colors duration-300 cursor-pointer uppercase tracking-widest outline-none"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={saving}
                className="px-8 py-3.5 text-[10px] font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 border-none rounded-xl hover:shadow-[0_4px_15px_-3px_rgba(217,70,239,0.5)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer uppercase tracking-widest outline-none hover:-translate-y-0.5 flex items-center gap-2"
              >
                {saving && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}