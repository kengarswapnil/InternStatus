import React, { useEffect, useState } from "react";
import API from "../../api/api";

export default function CollegeFacultyList() {

  const [faculty, setFaculty] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("ALL");
  const [filterSpecialization, setFilterSpecialization] = useState("ALL");

  const [editForm, setEditForm] = useState({
    courseName: "",
    department: "",
    designation: "",
    employeeId: "",
    joiningYear: "",
  });

  const [saving, setSaving] = useState(false);
  const [removingId, setRemovingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchFaculty();
    fetchCourses();
  }, []);

  const fetchFaculty = async () => {
    try {
      const res = await API.get("/college/faculty");
      setFaculty(res.data.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load faculty");
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

  const openEdit = (f) => {
    setError("");
    setSuccess("");
    setSelected(f);
    setEditForm({
      courseName: f.courseName ?? "",
      department: f.department ?? "",
      designation: f.designation ?? "",
      employeeId: f.employeeId ?? "",
      joiningYear: f.joiningYear ?? "",
    });
  };

  const closeEdit = () => setSelected(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "courseName" ? { department: "" } : {}),
    }));
  };

  const handleUpdate = async () => {
    if (!selected) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await API.patch(`/college/faculty/${selected._id}`, editForm);
      setSuccess("Faculty updated successfully");
      await fetchFaculty();
      closeEdit();
    } catch (err) {
      console.error(err);
      setError("Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (facultyId) => {
    const confirm = window.confirm("Remove this faculty from college?");
    if (!confirm) return;
    setRemovingId(facultyId);
    try {
      await API.delete(`/college/faculty/${facultyId}`);
      setFaculty((prev) => prev.filter((f) => f._id !== facultyId));
    } catch (err) {
      console.error(err);
      alert("Remove failed");
    } finally {
      setRemovingId(null);
    }
  };

  // FIX: separate lookups for modal vs filter bar
  // Modal: specializations based on editForm.courseName
  const modalCourse = courses.find(
    (c) => c.name?.trim().toLowerCase() === (editForm.courseName || "").trim().toLowerCase()
  );
  const modalSpecializations = modalCourse?.specializations || []; // string[]

  // Filter bar: specializations based on filterCourse
  const filterBarCourse = courses.find(
    (c) => c.name?.trim().toLowerCase() === (filterCourse || "").trim().toLowerCase()
  );
  const filterBarSpecializations = filterBarCourse?.specializations || []; // string[]

  // Dropdowns
  const uniqueCourses = [
    "ALL",
    ...new Set(faculty.map((f) => f.courseName).filter(Boolean)),
  ];

  // FIX: specializations are strings, not objects — no .name needed
  const uniqueSpecializations = [
    "ALL",
    ...new Set(filterBarSpecializations.filter(Boolean)),
  ];

  // Apply Filters
  const filteredFaculty = faculty.filter((f) => {
    const matchesSearch =
      (f.fullName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (f.employeeId || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse =
      filterCourse === "ALL" || f.courseName === filterCourse;
    const matchesSpecialization =
      filterSpecialization === "ALL" || f.specialization === filterSpecialization;
    return matchesSearch && matchesCourse && matchesSpecialization;
  });

  if (loading) {
    return (
      <div className="h-full bg-[#f9f9f9] flex items-center justify-center font-sans">
        <p className="text-[14px] font-bold text-[#333] animate-pulse m-0">
          Syncing Faculty Roster...
        </p>
      </div>
    );
  }

  return (
    <div className="h-full bg-[#f9f9f9] text-[#333] font-sans">
      <main className="max-w-7xl mx-auto w-full px-4 md:px-6 py-6 flex flex-col gap-6">

        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#e5e5e5] pb-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-[23px] font-black text-[#333] m-0 tracking-tight leading-tight">
              College Faculty
            </h1>
            <p className="text-[13px] font-bold text-[#333] opacity-60 m-0 uppercase tracking-widest">
              Staff & Roster Management
            </p>
          </div>
        </header>

        {/* Filters Bar */}
        {faculty.length > 0 && (
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search by name or Emp ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-3 text-[13px] bg-[#fff] border border-[#e5e5e5] rounded-[14px] outline-none focus:border-[#333] transition-colors shadow-sm"
            />
            <select
              value={filterCourse}
              onChange={(e) => {
                setFilterCourse(e.target.value);
                setFilterSpecialization("ALL"); // reset specialization when course changes
              }}
              className="w-full md:w-56 px-4 py-3 text-[11px] font-bold text-[#333] bg-[#fff] border border-[#e5e5e5] rounded-[14px] outline-none focus:border-[#333] transition-colors appearance-none uppercase tracking-widest shadow-sm"
            >
              {uniqueCourses.map((course) => (
                <option key={course} value={course}>
                  {course === "ALL" ? "All Courses" : course}
                </option>
              ))}
            </select>
            <select
              value={filterSpecialization}
              onChange={(e) => setFilterSpecialization(e.target.value)}
              disabled={filterCourse === "ALL"}
              className="w-full md:w-56 px-4 py-3 text-[11px] font-bold text-[#333] bg-[#fff] border border-[#e5e5e5] rounded-[14px] outline-none focus:border-[#333] transition-colors appearance-none uppercase tracking-widest shadow-sm disabled:opacity-50"
            >
              {uniqueSpecializations.map((s) => (
                <option key={s} value={s}>
                  {s === "ALL" ? "All Specializations" : s}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Data Handling */}
        {faculty.length === 0 ? (
          <div className="bg-[#fff] border-2 border-dashed border-[#e5e5e5] rounded-[20px] p-20 text-center">
            <p className="text-[13px] font-bold text-[#333] opacity-40 m-0 uppercase tracking-widest">
              No faculty members found in the system.
            </p>
          </div>
        ) : filteredFaculty.length === 0 ? (
          <div className="bg-[#fff] border border-[#e5e5e5] rounded-[20px] p-20 text-center">
            <p className="text-[13px] font-bold text-[#333] opacity-40 m-0 uppercase tracking-widest">
              No faculty match your current filters.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterCourse("ALL");
                setFilterSpecialization("ALL");
              }}
              className="mt-4 px-4 py-2 bg-[#f9f9f9] border border-[#e5e5e5] text-[#333] text-[10px] font-black uppercase tracking-widest rounded-[10px] hover:border-[#333] transition-colors cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="bg-[#fff] border border-[#e5e5e5] rounded-[20px] shadow-sm overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="border-b border-[#e5e5e5] bg-[#f9f9f9]">
                  <th className="p-5 text-[10px] font-bold opacity-40 uppercase tracking-widest">Faculty Details</th>
                  <th className="p-5 text-[10px] font-bold opacity-40 uppercase tracking-widest">Academic Role</th>
                  <th className="p-5 text-[10px] font-bold opacity-40 uppercase tracking-widest">Emp ID / Year</th>
                  <th className="p-5 text-[10px] font-bold opacity-40 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFaculty.map((f) => (
                  <tr
                    key={f._id}
                    className="border-b border-[#e5e5e5] last:border-none hover:bg-[#fafafa] transition-colors"
                  >
                    <td className="p-5 align-middle">
                      <div className="flex flex-col">
                        <span className="text-[15px] font-black text-[#333] m-0 leading-tight">{f.fullName}</span>
                        <span className="text-[12px] font-bold text-[#333] opacity-50 mt-1">{f.email}</span>
                      </div>
                    </td>
                    <td className="p-5 align-middle">
                      <div className="flex flex-col gap-1">
                        <span className="text-[13px] font-black text-[#333] leading-tight">{f.designation || "—"}</span>
                        <span className="text-[11px] font-bold text-[#333] opacity-50">
                          {f.courseName || "—"} • {f.department || "—"}
                        </span>
                      </div>
                    </td>
                    <td className="p-5 align-middle">
                      <div className="flex flex-col gap-1.5 items-start">
                        <span className="px-2 py-1 rounded-[6px] text-[10px] font-mono font-black tracking-widest bg-[#f9f9f9] border border-[#e5e5e5]">
                          ID: {f.employeeId || "—"}
                        </span>
                        <span className="text-[11px] font-bold opacity-50 uppercase tracking-widest ml-1">
                          Joined: {f.joiningYear || "—"}
                        </span>
                      </div>
                    </td>
                    <td className="p-5 align-middle text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEdit(f)}
                          className="px-4 py-2 bg-[#f9f9f9] border border-[#333] text-[#333] text-[10px] font-black uppercase tracking-widest rounded-[10px] hover:bg-[#333] hover:text-[#fff] transition-all cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          disabled={removingId === f._id}
                          onClick={() => handleRemove(f._id)}
                          className="px-4 py-2 bg-[#fff] border border-[#cc0000] text-[#cc0000] text-[10px] font-black uppercase tracking-widest rounded-[10px] hover:bg-[#cc0000] hover:text-[#fff] transition-all cursor-pointer disabled:opacity-50"
                        >
                          {removingId === f._id ? "..." : "Remove"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Edit Modal */}
      {selected && (
        <div className="fixed inset-0 bg-[#333]/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-[#fff] rounded-[20px] shadow-sm border border-[#e5e5e5] w-full max-w-md flex flex-col max-h-[85vh]">
            <header className="px-5 py-4 border-b border-[#f9f9f9] flex justify-between items-center">
              <div className="flex flex-col">
                <h3 className="text-[16px] font-black text-[#333] m-0 tracking-tight">Edit Faculty Profile</h3>
                <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest mt-0.5 m-0">{selected.fullName}</p>
              </div>
              <button
                onClick={closeEdit}
                className="text-[10px] font-bold text-[#333] opacity-50 uppercase tracking-widest border-none bg-transparent cursor-pointer hover:opacity-100 transition-opacity"
              >
                Close
              </button>
            </header>

            <div className="p-5 overflow-y-auto no-scrollbar flex flex-col gap-4">
              {error && (
                <span className="text-[10px] font-black text-[#cc0000] uppercase tracking-widest bg-[#fef2f2] px-3 py-2 rounded-[8px] border border-[#fecaca] text-center">
                  {error}
                </span>
              )}
              {success && (
                <span className="text-[10px] font-black text-[#008000] uppercase tracking-widest bg-[#f0fdf4] px-3 py-2 rounded-[8px] border border-[#bbf7d0] text-center">
                  {success}
                </span>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[#333] opacity-60 uppercase tracking-widest">Course</label>
                <select
                  name="courseName"
                  value={editForm.courseName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-[12px] font-bold text-[#333] bg-[#f9f9f9] border border-[#e5e5e5] rounded-[10px] outline-none focus:border-[#333] appearance-none cursor-pointer"
                >
                  <option value="">Select Course</option>
                  {courses.map((c) => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[#333] opacity-60 uppercase tracking-widest">Specialization</label>
                <select
                  name="department"
                  value={editForm.department}
                  onChange={handleChange}
                  disabled={!editForm.courseName}
                  className="w-full px-4 py-2.5 text-[12px] font-bold text-[#333] bg-[#f9f9f9] border border-[#e5e5e5] rounded-[10px] outline-none focus:border-[#333] appearance-none cursor-pointer disabled:opacity-50"
                >
                  <option value="">Select Specialization</option>
                  {/* FIX: modalSpecializations is string[] — render directly */}
                  {modalSpecializations.map((spec) => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[#333] opacity-60 uppercase tracking-widest">Designation</label>
                <input
                  name="designation"
                  value={editForm.designation}
                  onChange={handleChange}
                  placeholder="e.g. Associate Professor"
                  className="w-full px-4 py-2.5 text-[12px] font-bold text-[#333] bg-[#f9f9f9] border border-[#e5e5e5] rounded-[10px] outline-none focus:border-[#333]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[#333] opacity-60 uppercase tracking-widest">Employee ID</label>
                <input
                  name="employeeId"
                  value={editForm.employeeId}
                  onChange={handleChange}
                  placeholder="e.g. EMP12345"
                  className="w-full px-4 py-2.5 text-[12px] font-mono font-bold text-[#333] bg-[#f9f9f9] border border-[#e5e5e5] rounded-[10px] outline-none focus:border-[#333]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[#333] opacity-60 uppercase tracking-widest">Joining Year</label>
                <input
                  type="number"
                  name="joiningYear"
                  value={editForm.joiningYear}
                  onChange={handleChange}
                  placeholder="e.g. 2021"
                  className="w-full px-4 py-2.5 text-[12px] font-bold text-[#333] bg-[#f9f9f9] border border-[#e5e5e5] rounded-[10px] outline-none focus:border-[#333]"
                />
              </div>
            </div>

            <footer className="p-4 border-t border-[#f9f9f9] flex justify-end gap-2">
              <button
                onClick={closeEdit}
                className="px-4 py-2 text-[10px] font-black text-[#333] bg-[#f9f9f9] border border-[#e5e5e5] rounded-[10px] hover:bg-[#e5e5e5] transition-colors uppercase tracking-widest cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={saving}
                className="px-5 py-2 bg-[#111] text-[#fff] text-[10px] font-black rounded-[10px] hover:opacity-80 transition-opacity uppercase tracking-widest disabled:opacity-30 cursor-pointer"
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