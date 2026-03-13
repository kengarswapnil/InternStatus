import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { useNavigate } from "react-router-dom";

export default function CollegeStudents() {

const navigate = useNavigate();

const [students, setStudents] = useState([]);
const [loading, setLoading] = useState(true);

const [editingStudent, setEditingStudent] = useState(null);

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
  status: student.status || "active"
});

};

const closeEdit = () => {
setEditingStudent(null);
};

const handleChange = (e) => {
const { name, value } = e.target;

setEditForm((prev) => ({
  ...prev,
  [name]: value
}));

};

const handleUpdate = async () => {

if (!editingStudent) return;

setSaving(true);

try {

  await API.patch(
    `/college/students/${editingStudent._id}`,
    editForm
  );

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

  setStudents((prev) =>
    prev.filter((s) => s._id !== id)
  );

} catch (err) {

  console.error(err);
  alert("Remove failed");

}
};

if (loading) {

return (
  <div className="flex items-center justify-center min-h-screen">
    Loading students...
  </div>
);
}

return ( <div className="p-6 md:p-10 max-w-7xl mx-auto">

  <h1 className="text-2xl font-bold mb-6">
    College Students
  </h1>

  {students.length === 0 ? (
    <p>No students found</p>
  ) : (

    <div className="overflow-x-auto">

      <table className="w-full text-sm border">

        <thead className="bg-gray-100">

          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Course</th>
            <th className="p-3 text-left">Specialization</th>
            <th className="p-3 text-left">PRN</th>
            <th className="p-3 text-left">Year</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-right">Actions</th>
          </tr>

        </thead>

        <tbody>

          {students.map((s) => (

            <tr key={s._id} className="border-t">

              <td className="p-3">{s.fullName}</td>
              <td className="p-3">{s.courseName}</td>
              <td className="p-3">{s.specialization}</td>
              <td className="p-3">{s.prn || "-"}</td>
              <td className="p-3">{s.Year}</td>
              <td className="p-3">{s.status}</td>

              <td className="p-3 text-right space-x-2">

                <button
                  onClick={() =>
                    navigate(`/college/students/${s._id}`)
                  }
                  className="px-3 py-1 bg-blue-600 text-white rounded"
                >
                  View
                </button>

                <button
                  onClick={() => openEdit(s)}
                  className="px-3 py-1 bg-purple-600 text-white rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleRemove(s._id)}
                  className="px-3 py-1 bg-red-600 text-white rounded"
                >
                  Remove
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  )}

  {/* EDIT MODAL */}

  {editingStudent && (

    <div className="fixed inset-0 flex items-center justify-center bg-black/40">

      <div className="bg-white p-6 rounded-xl w-[420px]">

        <h2 className="text-lg font-bold mb-4">
          Edit Student
        </h2>

        <div className="space-y-3">

          <input
            name="courseName"
            value={editForm.courseName}
            onChange={handleChange}
            placeholder="Course"
            className="w-full border p-2 rounded"
          />

          <input
            name="specialization"
            value={editForm.specialization}
            onChange={handleChange}
            placeholder="Specialization"
            className="w-full border p-2 rounded"
          />

          <input
            name="courseStartYear"
            value={editForm.courseStartYear}
            onChange={handleChange}
            placeholder="Start Year"
            className="w-full border p-2 rounded"
          />

          <input
            name="courseEndYear"
            value={editForm.courseEndYear}
            onChange={handleChange}
            placeholder="End Year"
            className="w-full border p-2 rounded"
          />

          <input
            name="Year"
            value={editForm.Year}
            onChange={handleChange}
            placeholder="Year"
            className="w-full border p-2 rounded"
          />

          <input
            name="prn"
            value={editForm.prn}
            onChange={handleChange}
            placeholder="PRN"
            className="w-full border p-2 rounded"
          />

          <input
            name="abcId"
            value={editForm.abcId}
            onChange={handleChange}
            placeholder="ABC ID"
            className="w-full border p-2 rounded"
          />

        </div>

        <div className="flex justify-end gap-2 mt-5">

          <button
            onClick={closeEdit}
            className="px-3 py-1 border rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleUpdate}
            disabled={saving}
            className="px-3 py-1 bg-blue-600 text-white rounded"
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
