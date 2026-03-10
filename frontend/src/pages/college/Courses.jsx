import React, { useEffect, useState } from "react";
import API from "../../api/api";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    name: "",
    durationYears: ""
  });
  const [specializationInput, setSpecializationInput] = useState("");
  const [specializations, setSpecializations] = useState([]);
  const [editingCourse, setEditingCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const res = await API.get("/college/courses");
      setCourses(res.data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const addSpecialization = () => {
    if (!specializationInput.trim()) return;
    setSpecializations([
      ...specializations,
      specializationInput.trim()
    ]);
    setSpecializationInput("");
  };

  const removeSpecialization = (index) => {
    const updated = [...specializations];
    updated.splice(index, 1);
    setSpecializations(updated);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.durationYears) {
      alert("Name and duration required");
      return;
    }
    try {
      if (editingCourse) {
        await API.patch(
          `/college/courses/${editingCourse.name}`,
          {
            ...form,
            specializations
          }
        );
      } else {
        await API.post("/college/courses", {
          ...form,
          specializations
        });
      }
      resetForm();
      fetchCourses();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  const deleteCourse = async (name) => {
    const confirm = window.confirm(`Are you sure you want to delete the course "${name}"?`);
    if (!confirm) return;
    
    try {
      await API.delete(`/college/courses/${name}`);
      fetchCourses();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const startEdit = (course) => {
    setEditingCourse(course);
    setForm({
      name: course.name,
      durationYears: course.durationYears
    });
    setSpecializations(course.specializations || []);
  };

  const resetForm = () => {
    setForm({
      name: "",
      durationYears: ""
    });
    setSpecializations([]);
    setEditingCourse(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0B0F19]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-white/10 border-t-fuchsia-500 rounded-full animate-spin"></div>
          <p className="text-fuchsia-400 font-bold tracking-widest uppercase text-[10px] animate-pulse m-0">
            Loading Courses
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] p-4 md:p-8 font-sans text-white selection:bg-fuchsia-500/30 selection:text-fuchsia-200">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 md:gap-8">
        
        <div className="w-full lg:w-[420px] flex-shrink-0 bg-white/5 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] border border-white/10 h-max box-border transition-all duration-300 hover:border-white/20">
          <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 mt-0 mb-8 tracking-tight">
            {editingCourse ? "Edit Course" : "Add Course"}
          </h2>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
                Course Name
              </label>
              <input
                placeholder="e.g. B.Tech"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-300 placeholder:text-white/20"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
                Duration (Years)
              </label>
              <input
                type="number"
                placeholder="e.g. 4"
                value={form.durationYears}
                onChange={e => setForm({ ...form, durationYears: e.target.value })}
                className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-300 placeholder:text-white/20"
              />
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
                Specializations
              </label>
              <div className="flex gap-3">
                <input
                  placeholder="e.g. Computer Science"
                  value={specializationInput}
                  onChange={e => setSpecializationInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSpecialization())}
                  className="flex-1 px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-300 placeholder:text-white/20"
                />
                <button 
                  type="button" 
                  onClick={addSpecialization}
                  className="px-6 py-4 text-[10px] font-bold text-violet-300 bg-violet-500/20 border border-violet-500/30 rounded-xl hover:bg-violet-500/30 transition-colors duration-300 uppercase tracking-widest whitespace-nowrap outline-none"
                >
                  Add
                </button>
              </div>
            </div>

            {specializations.length > 0 && (
              <div className="flex flex-wrap gap-2.5 mt-2 bg-[#0B0F19]/30 p-4 rounded-2xl border border-white/5">
                {specializations.map((s, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white/5 text-white/90 text-[11px] font-bold tracking-wide rounded-lg border border-white/10 group hover:border-red-500/30 transition-colors"
                  >
                    {s}
                    <button
                      onClick={() => removeSpecialization(i)}
                      className="text-white/40 hover:text-red-400 font-black text-[10px] outline-none bg-transparent border-none p-0 ml-1 cursor-pointer transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-white/10">
              <button 
                onClick={handleSubmit}
                className="flex-1 py-4 text-[10px] font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl hover:shadow-[0_4px_15px_-3px_rgba(217,70,239,0.5)] transition-all duration-300 uppercase tracking-widest outline-none hover:-translate-y-0.5 border-none cursor-pointer"
              >
                {editingCourse ? "Update Course" : "Save Course"}
              </button>

              {editingCourse && (
                <button 
                  onClick={resetForm}
                  className="flex-1 py-4 text-[10px] font-bold text-white/80 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300 uppercase tracking-widest outline-none hover:-translate-y-0.5 cursor-pointer"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 bg-white/5 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] border border-white/10 box-border transition-all duration-300 hover:border-white/20 overflow-hidden flex flex-col">
          <header className="mb-8 border-b border-white/10 pb-6 shrink-0">
            <h2 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 m-0 tracking-tight">
              Course List
            </h2>
          </header>

          {courses.length === 0 ? (
            <div className="bg-[#0B0F19]/50 border border-white/10 rounded-3xl p-16 text-center shadow-inner flex-1 flex items-center justify-center">
              <p className="text-white/40 m-0 text-base font-medium">No courses available.</p>
            </div>
          ) : (
            <div className="bg-[#0B0F19]/30 border border-white/10 rounded-2xl overflow-hidden shadow-inner flex-1">
              <div className="overflow-x-auto no-scrollbar h-full">
                <table className="w-full text-left border-collapse whitespace-nowrap min-w-max">
                  <thead className="bg-white/5 border-b border-white/10 sticky top-0 z-10 backdrop-blur-md">
                    <tr>
                      <th className="px-6 py-5 text-[10px] font-bold text-violet-400 uppercase tracking-widest">Name</th>
                      <th className="px-6 py-5 text-[10px] font-bold text-violet-400 uppercase tracking-widest">Duration</th>
                      <th className="px-6 py-5 text-[10px] font-bold text-violet-400 uppercase tracking-widest">Specializations</th>
                      <th className="px-6 py-5 text-[10px] font-bold text-violet-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {courses.map(c => (
                      <tr key={c.name} className="hover:bg-white/5 transition-colors duration-300 group">
                        <td className="px-6 py-5 text-sm font-bold text-white/90 group-hover:text-fuchsia-300 transition-colors">
                          {c.name}
                        </td>
                        <td className="px-6 py-5 text-xs text-white/60 font-medium">
                          <span className="text-fuchsia-400 font-bold">{c.durationYears}</span> Years
                        </td>
                        <td className="px-6 py-5 text-xs text-white/80 whitespace-normal min-w-[200px] max-w-[300px] leading-relaxed">
                          {c.specializations?.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5">
                              {c.specializations.map((spec, idx) => (
                                <span key={idx} className="bg-white/5 px-2 py-1 rounded text-[10px] font-medium border border-white/5">
                                  {spec}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-white/30 italic">None</span>
                          )}
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex gap-3 justify-end">
                            <button
                              onClick={() => startEdit(c)}
                              className="px-5 py-2.5 text-[10px] font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-lg hover:shadow-[0_4px_15px_-3px_rgba(217,70,239,0.5)] transition-all duration-300 cursor-pointer border-none uppercase tracking-widest outline-none hover:-translate-y-0.5"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteCourse(c.name)}
                              className="px-5 py-2.5 text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-all duration-300 cursor-pointer uppercase tracking-widest outline-none hover:-translate-y-0.5"
                            >
                              Delete
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
        
      </div>
    </div>
  );
}