import React, { useEffect, useState } from "react";
import API from "../../api/api";

export default function FacultyStudents() {
  const COURSE_DURATION = 4;
  const CURRENT_YEAR = new Date().getFullYear();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [editForm, setEditForm] = useState({
    courseStartYear: "",
    courseEndYear: "",
    Year: "",
    prn: "",
    abcId: "",
    status: "active"
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (editForm.courseStartYear) {
      const endYear = Number(editForm.courseStartYear) + COURSE_DURATION;
      setEditForm(prev => ({
        ...prev,
        courseEndYear: endYear
      }));
    }
  }, [editForm.courseStartYear]);

  const fetchStudents = async () => {
    try {
      const res = await API.get("/faculty/students");
      setStudents(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openView = (student) => {
    setSelected(student);
    setEditMode(false);
  };

  const openEdit = (student) => {
    setSelected(student);
    setEditMode(true);
    setEditForm({
      courseStartYear: student.courseStartYear || "",
      courseEndYear: student.courseEndYear || "",
      Year: student.Year || "",
      prn: student.prn || "",
      abcId: student.abcId || "",
      status: student.status || "active"
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!selected) return;

    if (editForm.abcId && !/^\d{12}$/.test(editForm.abcId)) {
      alert("ABC ID must be exactly 12 digits");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        courseStartYear: editForm.courseStartYear ? Number(editForm.courseStartYear) : undefined,
        courseEndYear: editForm.courseEndYear ? Number(editForm.courseEndYear) : undefined,
        Year: editForm.Year ? Number(editForm.Year) : undefined,
        prn: editForm.prn || undefined,
        abcId: editForm.abcId || undefined,
        status: editForm.status
      };

      await API.patch(`/faculty/students/${selected._id}`, payload);
      await fetchStudents();
      setSelected(null);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0B0F19]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-white/10 border-t-fuchsia-500 rounded-full animate-spin"></div>
          <p className="text-fuchsia-400 font-bold tracking-widest uppercase text-[10px] animate-pulse m-0">
            Syncing Student Records
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] p-4 md:p-8 font-sans text-white selection:bg-fuchsia-500/30 selection:text-fuchsia-200 relative overflow-hidden">
      {/* Ambient Visuals */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-8">
          <div>
            <div className="text-[10px] font-bold text-violet-400 uppercase tracking-[0.3em] mb-2">Academic Oversight</div>
            <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 m-0 tracking-tight">
              My Students
            </h2>
          </div>
          <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-xs font-medium text-white/60">
            Total Enrolled: <span className="text-fuchsia-400 font-bold">{students.length}</span>
          </div>
        </header>

        {students.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-20 text-center shadow-inner">
            <p className="text-white/30 m-0 text-base font-medium italic tracking-wide">No student entities assigned to your uplink.</p>
          </div>
        ) : (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] overflow-hidden transition-all duration-300 hover:border-white/20">
            <div className="overflow-x-auto no-scrollbar bg-[#0B0F19]/30">
              <table className="w-full text-left border-collapse whitespace-nowrap min-w-max">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-5 text-[10px] font-bold text-violet-400 uppercase tracking-widest">Name</th>
                    <th className="px-6 py-5 text-[10px] font-bold text-violet-400 uppercase tracking-widest">Course</th>
                    <th className="px-6 py-5 text-[10px] font-bold text-violet-400 uppercase tracking-widest">Specialization</th>
                    <th className="px-6 py-5 text-[10px] font-bold text-violet-400 uppercase tracking-widest">PRN</th>
                    <th className="px-6 py-5 text-[10px] font-bold text-violet-400 uppercase tracking-widest">Year</th>
                    <th className="px-6 py-5 text-[10px] font-bold text-violet-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-5 text-[10px] font-bold text-violet-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {students.map(s => (
                    <tr key={s._id} className="hover:bg-white/5 transition-colors duration-300 group">
                      <td className="px-6 py-5 text-sm font-bold text-white/90 group-hover:text-fuchsia-300 transition-colors">{s.fullName}</td>
                      <td className="px-6 py-5 text-xs text-white/60 font-medium">{s.courseName || "—"}</td>
                      <td className="px-6 py-5 text-xs text-violet-400 font-bold tracking-wide">{s.specialization || "—"}</td>
                      <td className="px-6 py-5 text-xs text-white/40 font-mono">{s.prn || "—"}</td>
                      <td className="px-6 py-5 text-xs text-fuchsia-400 font-black">{s.Year || "—"}</td>
                      <td className="px-6 py-5">
                        <span className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded-md border ${
                          s.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                          s.status === 'graduated' ? 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20' : 
                          'bg-white/5 text-white/40 border-white/10'
                        }`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex gap-3 justify-end">
                          <button
                            className="px-4 py-2 text-[10px] font-bold text-white/80 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-300 cursor-pointer uppercase tracking-widest outline-none"
                            onClick={() => openView(s)}
                          >
                            Dossier
                          </button>
                          <button
                            className="px-5 py-2 text-[10px] font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-lg hover:shadow-[0_4px_15px_-3px_rgba(217,70,239,0.5)] transition-all duration-300 cursor-pointer border-none uppercase tracking-widest outline-none hover:-translate-y-0.5"
                            onClick={() => openEdit(s)}
                          >
                            Modify
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

      {/* Modal - Unified for View and Edit */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0F19]/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#0B0F19]/90 backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] border border-white/10 p-8 box-border flex flex-col max-h-[90vh]">
            
            <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4 shrink-0">
              <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 m-0 tracking-tight truncate pr-4">
                {editMode ? "Override Student Data" : selected.fullName}
              </h3>
              <button 
                onClick={() => setSelected(null)}
                className="text-[10px] font-bold text-white/40 uppercase tracking-widest bg-transparent border-none cursor-pointer hover:text-white transition-colors outline-none p-0 shrink-0"
              >
                Close
              </button>
            </div>

            <div className="overflow-y-auto no-scrollbar flex-1 pr-2">
              {!editMode ? (
                <div className="flex flex-col gap-4">
                  {[
                    { label: "Communication", value: selected.user?.email },
                    { label: "Curriculum", value: selected.courseName },
                    { label: "Domain", value: selected.specialization },
                    { label: "Cycle Start", value: selected.courseStartYear },
                    { label: "Cycle End", value: selected.courseEndYear },
                    { label: "Level", value: `${selected.Year} Year` },
                    { label: "PRN Matrix", value: selected.prn },
                    { label: "ABC ID", value: selected.abcId },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center py-3 border-b border-white/5">
                      <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{item.label}</span>
                      <span className="text-sm font-medium text-white/90">{item.value || "—"}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center py-3">
                    <span className="text-[10px] font-bold text-fuchsia-400 uppercase tracking-widest">Global Status</span>
                    <span className="text-sm font-black capitalize text-emerald-400">{selected.status}</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Course Start Year</label>
                    <select
                      name="courseStartYear"
                      value={editForm.courseStartYear}
                      onChange={handleChange}
                      className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none focus:border-violet-500 transition-all cursor-pointer appearance-none [&>option]:bg-[#0B0F19]"
                    >
                      <option value="" disabled className="text-white/20">Select Baseline Year</option>
                      {Array.from({ length: 10 }, (_, i) => CURRENT_YEAR - 5 + i).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Academic Progression</label>
                    <select
                      name="Year"
                      value={editForm.Year}
                      onChange={handleChange}
                      className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none focus:border-violet-500 transition-all cursor-pointer appearance-none [&>option]:bg-[#0B0F19]"
                    >
                      <option value="" disabled className="text-white/20">Current Year Level</option>
                      {[...Array(COURSE_DURATION)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>Year {i + 1}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Calculated End Year (Read-Only)</label>
                    <input
                      value={editForm.courseEndYear}
                      readOnly
                      className="w-full px-5 py-4 text-sm text-white/30 bg-white/5 border border-white/5 rounded-xl outline-none italic cursor-not-allowed"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Permanent Registration Number</label>
                    <input
                      name="prn"
                      value={editForm.prn}
                      onChange={handleChange}
                      placeholder="Enter PRN Matrix"
                      className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none focus:border-violet-500 transition-all placeholder:text-white/20 font-mono"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">ABC ID (12 Digit Verification)</label>
                    <input
                      name="abcId"
                      value={editForm.abcId}
                      onChange={handleChange}
                      placeholder="0000 0000 0000"
                      className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none focus:border-violet-500 transition-all placeholder:text-white/20 font-mono"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Status Override</label>
                    <select
                      name="status"
                      value={editForm.status}
                      onChange={handleChange}
                      className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none focus:border-violet-500 transition-all cursor-pointer appearance-none [&>option]:bg-[#0B0F19]"
                    >
                      <option value="active">Active</option>
                      <option value="graduated">Graduated</option>
                      <option value="inactive">Inactive</option>
                      <option value="unassigned">Unassigned</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-white/10 shrink-0">
              <button
                onClick={() => setSelected(null)}
                className="px-6 py-3.5 text-[10px] font-bold text-white/80 bg-transparent border border-white/10 rounded-xl hover:bg-white/10 transition-colors duration-300 cursor-pointer uppercase tracking-widest outline-none"
              >
                {editMode ? "Abort" : "Close"}
              </button>
              {editMode && (
                <button
                  onClick={handleUpdate}
                  disabled={saving}
                  className="px-8 py-3.5 text-[10px] font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 border-none rounded-xl hover:shadow-[0_4px_15px_-3px_rgba(217,70,239,0.5)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer uppercase tracking-widest outline-none hover:-translate-y-0.5 flex items-center gap-2"
                >
                  {saving && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  {saving ? "Deploying..." : "Sync Changes"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}