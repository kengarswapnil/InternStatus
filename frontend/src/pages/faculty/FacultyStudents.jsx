import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { useNavigate } from "react-router-dom";

export default function FacultyStudents() {

  const COURSE_DURATION = 4;
  const CURRENT_YEAR = new Date().getFullYear();
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingStudent, setEditingStudent] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    courseStartYear: "",
    courseEndYear: "",
    Year: "",
    prn: "",
    abcId: "",
    status: "active"
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (form.courseStartYear) {
      setForm(prev => ({
        ...prev,
        courseEndYear: Number(form.courseStartYear) + COURSE_DURATION
      }));
    }
  }, [form.courseStartYear]);

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

  const openEdit = (student) => {
    setEditingStudent(student);

    setForm({
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
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {

    if (!editingStudent) return;

    if (form.abcId && !/^\d{12}$/.test(form.abcId)) {
      alert("ABC ID must be exactly 12 digits");
      return;
    }

    setSaving(true);

    try {

      const payload = {
        courseStartYear: form.courseStartYear ? Number(form.courseStartYear) : undefined,
        courseEndYear: form.courseEndYear ? Number(form.courseEndYear) : undefined,
        Year: form.Year ? Number(form.Year) : undefined,
        prn: form.prn || undefined,
        abcId: form.abcId || undefined,
        status: form.status
      };

      await API.patch(`/faculty/students/${editingStudent._id}`, payload);

      await fetchStudents();
      setEditingStudent(null);

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
          <p className="text-fuchsia-400 text-xs font-bold uppercase tracking-widest">
            Syncing Student Records
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] p-6 text-white">

      <div className="max-w-7xl mx-auto">

        <header className="mb-8 flex justify-between items-center border-b border-white/10 pb-6">
          <h2 className="text-3xl font-black">My Students</h2>
          <span className="text-sm text-white/60">
            Total: <b>{students.length}</b>
          </span>
        </header>

        {students.length === 0 ? (
          <div className="text-center text-white/40 py-20">
            No students found
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-xl overflow-x-auto">

            <table className="w-full text-left whitespace-nowrap">

              <thead className="bg-white/5 text-xs uppercase text-violet-400">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Course</th>
                  <th className="px-6 py-4">Specialization</th>
                  <th className="px-6 py-4">PRN</th>
                  <th className="px-6 py-4">Year</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>

                {students.map((s) => (
                  <tr key={s._id} className="border-t border-white/5">

                    <td className="px-6 py-4 font-semibold">{s.fullName}</td>
                    <td className="px-6 py-4">{s.courseName || "—"}</td>
                    <td className="px-6 py-4">{s.specialization || "—"}</td>
                    <td className="px-6 py-4 font-mono">{s.prn || "—"}</td>
                    <td className="px-6 py-4">{s.Year || "—"}</td>

                    <td className="px-6 py-4">
                      <span className="text-xs px-2 py-1 bg-white/10 rounded">
                        {s.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right flex gap-2 justify-end">

                      <button
                        onClick={() => navigate(`/faculty/students/${s._id}`)}
                        className="px-3 py-1 bg-white/10 rounded"
                      >
                        View
                      </button>

                      <button
                        onClick={() => openEdit(s)}
                        className="px-3 py-1 bg-violet-600 rounded"
                      >
                        Modify
                      </button>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {editingStudent && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">

          <div className="bg-[#0B0F19] border border-white/10 rounded-xl w-[420px] p-6 space-y-4">

            <h3 className="text-lg font-bold">Edit Student</h3>

            <select
              name="courseStartYear"
              value={form.courseStartYear}
              onChange={handleChange}
              className="w-full p-3 bg-white/5 border border-white/10 rounded"
            >
              <option value="">Start Year</option>
              {Array.from({ length: 10 }, (_, i) => CURRENT_YEAR - 5 + i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            <select
              name="Year"
              value={form.Year}
              onChange={handleChange}
              className="w-full p-3 bg-white/5 border border-white/10 rounded"
            >
              <option value="">Academic Year</option>
              {[...Array(COURSE_DURATION)].map((_, i) => (
                <option key={i} value={i + 1}>Year {i + 1}</option>
              ))}
            </select>

            <input
              name="prn"
              value={form.prn}
              onChange={handleChange}
              placeholder="PRN"
              className="w-full p-3 bg-white/5 border border-white/10 rounded"
            />

            <input
              name="abcId"
              value={form.abcId}
              onChange={handleChange}
              placeholder="ABC ID"
              className="w-full p-3 bg-white/5 border border-white/10 rounded"
            />

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full p-3 bg-white/5 border border-white/10 rounded"
            >
              <option value="active">Active</option>
              <option value="graduated">Graduated</option>
              <option value="inactive">Inactive</option>
              <option value="unassigned">Unassigned</option>
            </select>

            <div className="flex justify-end gap-3 pt-4">

              <button
                onClick={() => setEditingStudent(null)}
                className="px-4 py-2 border border-white/10 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                disabled={saving}
                className="px-4 py-2 bg-violet-600 rounded"
              >
                {saving ? "Saving..." : "Save"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}