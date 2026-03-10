import React, { useEffect, useState } from "react";
import API from "../../api/api";

export default function CollegeStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({
    courseName: "",
    specialization: "",
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

  const fetchStudents = async () => {
    try {
      const res = await API.get("/college/students");
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
      courseName: student.courseName || "",
      specialization: student.specialization || "",
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
    setSaving(true);
    try {
      await API.patch(
        `/college/students/${selected._id}`,
        editForm
      );
      await fetchStudents();
      setSelected(null);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (id) => {
    const ok = window.confirm("Remove student from college?");
    if (!ok) return;
    try {
      await API.delete(`/college/students/${id}`);
      setStudents(prev =>
        prev.filter(s => s._id !== id)
      );
    } catch (err) {
      console.error(err);
      alert("Remove failed");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0B0F19]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-white/10 border-t-fuchsia-500 rounded-full animate-spin"></div>
          <p className="text-fuchsia-400 font-bold tracking-widest uppercase text-[10px] animate-pulse m-0">
            Loading Students Roster
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] p-4 md:p-8 font-sans text-white selection:bg-fuchsia-500/30 selection:text-fuchsia-200">
      <div className="max-w-7xl mx-auto bg-white/5 backdrop-blur-xl rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] border border-white/10 p-6 md:p-10 box-border transition-all duration-300 hover:border-white/20">
        
        <header className="mb-8 border-b border-white/10 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 m-0 tracking-tight">
              College Students
            </h2>
            <p className="text-white/40 font-medium text-sm mt-2 m-0 tracking-wide">
              Manage your institution's student records
            </p>
          </div>
        </header>

        {students.length === 0 ? (
          <div className="bg-[#0B0F19]/50 border border-white/10 rounded-3xl p-16 text-center shadow-inner">
            <p className="text-white/40 m-0 text-base font-medium">No students found.</p>
          </div>
        ) : (
          <div className="bg-[#0B0F19]/30 border border-white/10 rounded-2xl overflow-hidden shadow-inner w-full max-w-full">
            <div className="overflow-x-auto no-scrollbar">
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
                      <td className="px-6 py-5 text-sm font-bold text-white/90 group-hover:text-fuchsia-300 transition-colors">
                        {s.fullName}
                      </td>
                      <td className="px-6 py-5 text-xs text-white/70 font-medium">{s.courseName || "—"}</td>
                      <td className="px-6 py-5 text-xs text-violet-400 font-bold tracking-wide">{s.specialization || "—"}</td>
                      <td className="px-6 py-5 text-xs text-white/50 font-mono tracking-wider">{s.prn || "—"}</td>
                      <td className="px-6 py-5 text-xs text-fuchsia-400 font-bold">{s.Year || "—"}</td>
                      <td className="px-6 py-5">
                        <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md border ${
                          s.status === 'active' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                          s.status === 'graduated' ? 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30' :
                          'bg-white/10 text-white/60 border-white/20'
                        }`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex gap-3 justify-end">
                          <button
                            className="px-4 py-2 text-[10px] font-bold text-white/80 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors duration-300 cursor-pointer uppercase tracking-widest outline-none hover:-translate-y-0.5"
                            onClick={() => openView(s)}
                          >
                            View
                          </button>
                          <button
                            className="px-5 py-2 text-[10px] font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-lg hover:shadow-[0_4px_15px_-3px_rgba(217,70,239,0.5)] transition-all duration-300 cursor-pointer border-none uppercase tracking-widest outline-none hover:-translate-y-0.5"
                            onClick={() => openEdit(s)}
                          >
                            Edit
                          </button>
                          <button
                            className="px-4 py-2 text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-all duration-300 cursor-pointer uppercase tracking-widest outline-none hover:-translate-y-0.5"
                            onClick={() => handleRemove(s._id)}
                          >
                            Remove
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

      {selected && !editMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0F19]/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#0B0F19]/90 backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] border border-white/10 p-8 box-border flex flex-col max-h-[90vh]">
            
            <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4 shrink-0">
              <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 m-0 tracking-tight truncate pr-4">
                {selected.fullName}
              </h3>
              <button 
                onClick={() => setSelected(null)}
                className="text-[10px] font-bold text-white/40 uppercase tracking-widest bg-transparent border-none cursor-pointer hover:text-white transition-colors outline-none p-0 shrink-0"
              >
                Close
              </button>
            </div>

            <div className="overflow-y-auto no-scrollbar flex-1 pr-2 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5 bg-[#0B0F19]/50 p-4 rounded-xl border border-white/5">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Email</span>
                <span className="text-sm font-medium text-white/90 break-all">{selected.user?.email}</span>
              </div>
              <div className="flex flex-col gap-1.5 bg-[#0B0F19]/50 p-4 rounded-xl border border-white/5">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Course</span>
                <span className="text-sm font-medium text-white/90">{selected.courseName || "—"}</span>
              </div>
              <div className="flex flex-col gap-1.5 bg-[#0B0F19]/50 p-4 rounded-xl border border-white/5">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Specialization</span>
                <span className="text-sm font-medium text-white/90">{selected.specialization || "—"}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 bg-[#0B0F19]/50 p-4 rounded-xl border border-white/5">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Start Year</span>
                  <span className="text-sm font-medium text-white/90">{selected.courseStartYear || "—"}</span>
                </div>
                <div className="flex flex-col gap-1.5 bg-[#0B0F19]/50 p-4 rounded-xl border border-white/5">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">End Year</span>
                  <span className="text-sm font-medium text-white/90">{selected.courseEndYear || "—"}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 bg-[#0B0F19]/50 p-4 rounded-xl border border-white/5">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Academic Year</span>
                <span className="text-sm font-medium text-white/90">{selected.Year || "—"}</span>
              </div>
              <div className="flex flex-col gap-1.5 bg-[#0B0F19]/50 p-4 rounded-xl border border-white/5">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">PRN</span>
                <span className="text-sm font-mono text-white/90 break-all">{selected.prn || "—"}</span>
              </div>
              <div className="flex flex-col gap-1.5 bg-[#0B0F19]/50 p-4 rounded-xl border border-white/5">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">ABC ID</span>
                <span className="text-sm font-mono text-white/90 break-all">{selected.abcId || "—"}</span>
              </div>
              <div className="flex flex-col gap-1.5 bg-[#0B0F19]/50 p-4 rounded-xl border border-white/5">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Status</span>
                <span className="text-sm font-bold capitalize text-emerald-400">{selected.status}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {selected && editMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0F19]/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#0B0F19]/90 backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] border border-white/10 p-8 box-border flex flex-col max-h-[90vh]">
            
            <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4 shrink-0">
              <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 m-0 tracking-tight truncate pr-4">
                Edit Student Details
              </h3>
              <button 
                onClick={() => setSelected(null)}
                className="text-[10px] font-bold text-white/40 uppercase tracking-widest bg-transparent border-none cursor-pointer hover:text-white transition-colors outline-none p-0 shrink-0"
              >
                Close
              </button>
            </div>

            <div className="overflow-y-auto no-scrollbar flex-1 pr-2">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Course Name</label>
                  <input
                    name="courseName"
                    value={editForm.courseName}
                    onChange={handleChange}
                    placeholder="e.g. B.Tech"
                    className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-300 placeholder:text-white/20"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Specialization</label>
                  <input
                    name="specialization"
                    value={editForm.specialization}
                    onChange={handleChange}
                    placeholder="e.g. Computer Science"
                    className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-300 placeholder:text-white/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Start Year</label>
                    <input
                      name="courseStartYear"
                      type="number"
                      value={editForm.courseStartYear}
                      onChange={handleChange}
                      placeholder="YYYY"
                      className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-300 placeholder:text-white/20"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">End Year</label>
                    <input
                      name="courseEndYear"
                      type="number"
                      value={editForm.courseEndYear}
                      onChange={handleChange}
                      placeholder="YYYY"
                      className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-300 placeholder:text-white/20"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Academic Year</label>
                  <input
                    name="Year"
                    type="number"
                    value={editForm.Year}
                    onChange={handleChange}
                    placeholder="e.g. 1, 2, 3, 4"
                    className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-300 placeholder:text-white/20"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">PRN</label>
                  <input
                    name="prn"
                    value={editForm.prn}
                    onChange={handleChange}
                    placeholder="Permanent Registration Number"
                    className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-300 placeholder:text-white/20 font-mono"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">ABC ID</label>
                  <input
                    name="abcId"
                    value={editForm.abcId}
                    onChange={handleChange}
                    placeholder="Academic Bank of Credits ID"
                    className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-300 placeholder:text-white/20 font-mono"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Status</label>
                  <select
                    name="status"
                    value={editForm.status}
                    onChange={handleChange}
                    className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-300 cursor-pointer appearance-none [&>option]:bg-[#0B0F19]"
                  >
                    <option value="active">Active</option>
                    <option value="graduated">Graduated</option>
                    <option value="inactive">Inactive</option>
                    <option value="unassigned">Unassigned</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-white/10 shrink-0">
              <button
                className="px-6 py-3.5 text-[10px] font-bold text-white/80 bg-transparent border border-white/10 rounded-xl hover:bg-white/10 transition-colors duration-300 cursor-pointer uppercase tracking-widest outline-none"
                onClick={() => setSelected(null)}
              >
                Cancel
              </button>
              <button
                className="px-8 py-3.5 text-[10px] font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 border-none rounded-xl hover:shadow-[0_4px_15px_-3px_rgba(217,70,239,0.5)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer uppercase tracking-widest outline-none hover:-translate-y-0.5 flex items-center gap-2"
                onClick={handleUpdate}
                disabled={saving}
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