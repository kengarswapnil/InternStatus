import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { useNavigate } from "react-router-dom";

// ==========================================
// 1. Reusable Status Badge Component
// ==========================================
const StatusBadge = ({ status }) => {
  let cls = "bg-[#f9f9f9] border-[#e5e5e5] text-[#333]";
  if (status === "active") {
    cls = "bg-[#111] text-[#fff] border-[#111]";
  } else if (status === "graduated") {
    cls = "bg-[#f9f9f9] border-[#008000] text-[#008000]";
  } else if (status === "suspended") {
    cls = "bg-[#fff] border-[#cc0000] text-[#cc0000]";
  }

  return (
    <span
      className={`px-2.5 py-1 rounded-[10px] text-[9px] font-black uppercase tracking-widest border ${cls}`}
    >
      {status ? status : "UNKNOWN"}
    </span>
  );
};

// ==========================================
// 2. Main College Students Component
// ==========================================
export default function CollegeStudents() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit State
  const [editingStudent, setEditingStudent] = useState(null);
  const [editForm, setEditForm] = useState({
    courseName: "",
    specialization: "",
    courseStartYear: "",
    courseEndYear: "",
    Year: "",
    prn: "",
    abcId: "",
    status: "active",
  });
  const [saving, setSaving] = useState(false);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterSpecialization, setFilterSpecialization] = useState("ALL");

  useEffect(() => {
    fetchStudents();
    fetchCourses();
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

  const fetchCourses = async () => {
    try {
      const res = await API.get("/college/courses");
      setCourses(res.data?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const openEdit = (student) => {
    setEditingStudent(student);
    setEditForm({
      courseName: student.courseName || "",
      specialization: student.specialization || "",
      courseStartYear: student.courseStartYear || "",
      courseEndYear: student.courseEndYear || "",
      Year: student.Year || "",
      prn: student.prn || "",
      abcId: student.abcId || "",
      status: student.status || "active",
    });
  };

  const closeEdit = () => {
    setEditingStudent(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    if (!editingStudent) return;
    setSaving(true);
    try {
      await API.patch(`/college/students/${editingStudent._id}`, editForm);
      await fetchStudents();
      closeEdit();
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
      setStudents((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error(err);
      alert("Remove failed");
    }
  };

  // Extract unique values for filters
  const uniqueCourses = [
    "ALL",
    ...new Set(students.map((s) => s.courseName).filter(Boolean)),
  ];
  const uniqueStatuses = [
    "ALL",
    ...new Set(students.map((s) => s.status).filter(Boolean)),
  ];

  // ✅ ADDED: Derive specializations from selected course via courses API data
  const selectedCourse = courses.find(
    (c) => c.name?.trim().toLowerCase() === filterCourse.trim().toLowerCase()
  );
  const courseSpecializations = selectedCourse?.specializations || [];
  const uniqueSpecializations = [
    "ALL",
    ...new Set(courseSpecializations.filter(Boolean)),
  ];

  // Apply Filters
  const filteredStudents = students.filter((s) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      (s.fullName || "").toLowerCase().includes(searchLower) ||
      (s.prn || "").toLowerCase().includes(searchLower);

    const matchesCourse =
      filterCourse === "ALL" || s.courseName === filterCourse;
    const matchesStatus = filterStatus === "ALL" || s.status === filterStatus;
    // ✅ ADDED: Course-dependent specialization match logic
    const matchesSpecialization =
      filterSpecialization === "ALL" || s.specialization === filterSpecialization;

    return matchesSearch && matchesCourse && matchesStatus && matchesSpecialization;
  });

  if (loading) {
    return (
      <div className="h-full bg-[#f9f9f9] flex items-center justify-center font-sans">
        <p className="text-[14px] font-bold text-[#333] animate-pulse m-0">
          Syncing Student Records...
        </p>
      </div>
    );
  }

  return (
    <div className="h-full bg-[#f9f9f9] text-[#333] font-sans overflow-hidden">
      <main className="max-w-7xl mx-auto w-full px-4 md:px-6 py-6 flex flex-col gap-6 h-full overflow-y-auto no-scrollbar">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#e5e5e5] pb-4 flex-shrink-0">
          <div className="flex flex-col gap-1">
            <h1 className="text-[23px] font-black text-[#333] m-0 tracking-tight leading-tight">
              College Students
            </h1>
            <p className="text-[13px] font-bold text-[#333] opacity-60 m-0 uppercase tracking-widest">
              Student Directory & Roster
            </p>
          </div>
        </header>

        {/* Filters Bar */}
        {students.length > 0 && (
          <div className="flex flex-col md:flex-row gap-4 flex-shrink-0">
            <input
              type="text"
              placeholder="Search by Name or PRN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-3 text-[13px] bg-[#fff] border border-[#e5e5e5] rounded-[14px] outline-none focus:border-[#333] transition-colors shadow-sm"
            />
            {/* ✅ MODIFIED: Course dropdown now also resets specialization on change */}
            <select
              value={filterCourse}
              onChange={(e) => {
                setFilterCourse(e.target.value);
                setFilterSpecialization("ALL");
              }}
              className="w-full md:w-56 px-4 py-3 text-[11px] font-bold text-[#333] bg-[#fff] border border-[#e5e5e5] rounded-[14px] outline-none focus:border-[#333] transition-colors appearance-none uppercase tracking-widest shadow-sm"
            >
              {uniqueCourses.map((course) => (
                <option key={course} value={course}>
                  {course === "ALL" ? "All Courses" : course}
                </option>
              ))}
            </select>
            {/* ✅ ADDED: Course-dependent specialization dropdown, disabled when no course selected */}
            <select
              value={filterSpecialization}
              onChange={(e) => setFilterSpecialization(e.target.value)}
              disabled={filterCourse === "ALL"}
              className="w-full md:w-56 px-4 py-3 text-[11px] font-bold text-[#333] bg-[#fff] border border-[#e5e5e5] rounded-[14px] outline-none focus:border-[#333] transition-colors appearance-none uppercase tracking-widest shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {uniqueSpecializations.map((spec) => (
                <option key={spec} value={spec}>
                  {spec === "ALL" ? "All Specializations" : spec}
                </option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full md:w-48 px-4 py-3 text-[11px] font-bold text-[#333] bg-[#fff] border border-[#e5e5e5] rounded-[14px] outline-none focus:border-[#333] transition-colors appearance-none uppercase tracking-widest shadow-sm"
            >
              {uniqueStatuses.map((status) => (
                <option key={status} value={status}>
                  {status === "ALL" ? "All Statuses" : status}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Data Handling */}
        {students.length === 0 ? (
          <div className="bg-[#fff] border-2 border-dashed border-[#e5e5e5] rounded-[20px] p-20 text-center flex-shrink-0">
            <p className="text-[13px] font-bold text-[#333] opacity-40 m-0 uppercase tracking-widest">
              No registered students found.
            </p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="bg-[#fff] border border-[#e5e5e5] rounded-[20px] p-20 text-center flex-shrink-0">
            <p className="text-[13px] font-bold text-[#333] opacity-40 m-0 uppercase tracking-widest">
              No students match your current filters.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterCourse("ALL");
                setFilterStatus("ALL");
                // ✅ ADDED: Reset specialization filter
                setFilterSpecialization("ALL");
              }}
              className="mt-4 px-4 py-2 bg-[#f9f9f9] border border-[#e5e5e5] text-[#333] text-[10px] font-black uppercase tracking-widest rounded-[10px] hover:border-[#333] transition-colors cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="bg-[#fff] border border-[#e5e5e5] rounded-[20px] shadow-sm overflow-hidden flex-shrink-0">
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead className="bg-[#f9f9f9] border-b border-[#e5e5e5]">
                  <tr>
                    <th className="p-5 text-[10px] font-bold text-[#333] opacity-40 uppercase tracking-widest">
                      Name & Email
                    </th>
                    <th className="p-5 text-[10px] font-bold text-[#333] opacity-40 uppercase tracking-widest">
                      Course / Spec
                    </th>
                    <th className="p-5 text-[10px] font-bold text-[#333] opacity-40 uppercase tracking-widest">
                      PRN / Year
                    </th>
                    <th className="p-5 text-[10px] font-bold text-[#333] opacity-40 uppercase tracking-widest text-center">
                      Status
                    </th>
                    <th className="p-5 text-[10px] font-bold text-[#333] opacity-40 uppercase tracking-widest text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((s) => (
                    <tr
                      key={s._id}
                      className="border-b border-[#e5e5e5] last:border-none hover:bg-[#fafafa] transition-colors"
                    >
                      {/* Name & Email Column */}
                      <td className="p-5 align-middle">
                        <div className="flex flex-col">
                          <span className="text-[15px] font-black text-[#333] m-0 leading-tight">
                            {s.fullName}
                          </span>
                          <span className="text-[12px] font-bold text-[#333] opacity-50 mt-1">
                            {s.email || "—"}
                          </span>
                        </div>
                      </td>

                      {/* Course / Spec Column */}
                      <td className="p-5 align-middle">
                        <div className="flex flex-col gap-1">
                          <span className="text-[13px] font-black text-[#333] leading-tight">
                            {s.courseName || "—"}
                          </span>
                          <span className="text-[11px] font-bold text-[#333] opacity-50 uppercase tracking-widest">
                            {s.specialization || "—"}
                          </span>
                        </div>
                      </td>

                      {/* PRN / Year Column */}
                      <td className="p-5 align-middle">
                        <div className="flex flex-col gap-1.5 items-start">
                          <span className="px-2 py-1 rounded-[6px] text-[10px] font-mono font-black tracking-widest bg-[#f9f9f9] border border-[#e5e5e5]">
                            PRN: {s.prn || "—"}
                          </span>
                          <span className="text-[11px] font-bold opacity-50 uppercase tracking-widest ml-1">
                            Year: {s.Year || "—"}
                          </span>
                        </div>
                      </td>

                      {/* Status Column */}
                      <td className="p-5 align-middle text-center">
                        <StatusBadge status={s.status} />
                      </td>

                      {/* Actions Column */}
                      <td className="p-5 align-middle text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() =>
                              navigate(`/college/students/${s._id}`)
                            }
                            className="px-4 py-2 bg-[#f9f9f9] border border-[#e5e5e5] text-[#333] text-[10px] font-black uppercase tracking-widest rounded-[10px] hover:border-[#333] transition-colors cursor-pointer"
                          >
                            View
                          </button>
                          <button
                            onClick={() => openEdit(s)}
                            className="px-4 py-2 bg-[#111] border border-[#111] text-[#fff] text-[10px] font-black uppercase tracking-widest rounded-[10px] hover:opacity-80 transition-opacity cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleRemove(s._id)}
                            className="px-4 py-2 bg-[#fff] border border-[#cc0000] text-[#cc0000] text-[10px] font-black uppercase tracking-widest rounded-[10px] hover:bg-[#cc0000] hover:text-[#fff] transition-colors cursor-pointer"
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
      </main>

      {/* Edit Student Modal */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#333]/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#fff] rounded-[20px] shadow-sm border border-[#e5e5e5] flex flex-col max-h-[90vh]">
            <header className="px-6 py-4 border-b border-[#f9f9f9] flex justify-between items-center">
              <h3 className="text-[18px] font-black text-[#333] m-0 tracking-tight">
                Edit Student Details
              </h3>
              <button
                onClick={closeEdit}
                className="text-[11px] font-bold text-[#333] opacity-50 uppercase tracking-widest bg-transparent border-none cursor-pointer hover:opacity-100 p-0"
              >
                Close
              </button>
            </header>

            <div className="p-6 flex flex-col gap-4 overflow-y-auto no-scrollbar">
              {[
                { label: "Course Name", name: "courseName" },
                { label: "Specialization", name: "specialization" },
                { label: "Start Year", name: "courseStartYear" },
                { label: "End Year", name: "courseEndYear" },
                { label: "Current Year", name: "Year" },
                { label: "PRN Number", name: "prn" },
                { label: "ABC ID", name: "abcId" },
              ].map((field) => (
                <div key={field.name} className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-[#333] opacity-60 uppercase tracking-widest">
                    {field.label}
                  </label>
                  <input
                    name={field.name}
                    value={editForm[field.name]}
                    onChange={handleChange}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    className="w-full px-4 py-2.5 text-[13px] font-bold text-[#333] bg-[#f9f9f9] border border-[#e5e5e5] rounded-[10px] outline-none focus:border-[#333]"
                  />
                </div>
              ))}

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-[#333] opacity-60 uppercase tracking-widest">
                  Account Status
                </label>
                <select
                  name="status"
                  value={editForm.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-[13px] font-bold text-[#333] bg-[#f9f9f9] border border-[#e5e5e5] rounded-[10px] outline-none focus:border-[#333] appearance-none cursor-pointer"
                >
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="graduated">Graduated</option>
                </select>
              </div>
            </div>

            <footer className="px-6 py-4 border-t border-[#f9f9f9] flex justify-end gap-2">
              <button
                onClick={closeEdit}
                className="px-5 py-2 text-[11px] font-black text-[#333] bg-[#f9f9f9] border border-[#e5e5e5] rounded-[10px] hover:border-[#333] transition-colors cursor-pointer uppercase tracking-widest"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={saving}
                className="px-6 py-2 text-[11px] font-black text-[#fff] bg-[#111] border-none rounded-[10px] hover:opacity-80 transition-opacity disabled:opacity-50 cursor-pointer uppercase tracking-widest"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}