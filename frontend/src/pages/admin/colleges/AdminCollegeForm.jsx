import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../../api/api";

export default function AdminCollegeForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    website: "",
    emailDomain: "",
    description: "",
    courses: [],
  });

  const fetchCollege = async () => {
    try {
      const res = await API.get(`/admin/colleges/${id}`);
      setForm(res.data?.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load college");
    }
  };

  useEffect(() => {
    if (isEdit) fetchCollege();
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const addCourse = () => {
    setForm({
      ...form,
      courses: [
        ...form.courses,
        {
          name: "",
          durationYears: "",
          specializations: [],
        },
      ],
    });
  };

  const updateCourse = (index, field, value) => {
    const updated = [...form.courses];
    updated[index][field] = value;
    setForm({
      ...form,
      courses: updated,
    });
  };

  const addSpecialization = (index) => {
    const updated = [...form.courses];
    updated[index].specializations.push("");
    setForm({
      ...form,
      courses: updated,
    });
  };

  const updateSpecialization = (cIndex, sIndex, value) => {
    const updated = [...form.courses];
    updated[cIndex].specializations[sIndex] = value;
    setForm({
      ...form,
      courses: updated,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (isEdit) {
        await API.put(`/admin/colleges/${id}`, form);
      } else {
        await API.post(`/admin/colleges`, form);
      }

      navigate("/admin/colleges");
    } catch (err) {
      console.error(err);
      alert("Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] p-4 md:p-8 font-['Nunito'] text-[#2D3436] transition-all duration-300">
      <div className="max-w-4xl mx-auto bg-[#FFFFFF] p-6 md:p-10 rounded-[24px] border border-[#F5F6FA] shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 hover:shadow-[0_8px_30px_rgba(108,92,231,0.08)]">
        <header className="mb-10 border-b border-[#F5F6FA] pb-6 animate-fade-in-down">
          <h2 className="text-3xl font-black m-0 tracking-tight text-[#6C5CE7]">
            {isEdit ? "Edit College Profile" : "Add New College"}
          </h2>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-10">
          <div className="flex flex-col gap-6 animate-fade-in-up">
            <h3 className="text-sm font-black text-[#6C5CE7] m-0 uppercase tracking-widest border-l-4 border-[#6C5CE7] pl-3">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-[10px] font-black text-[#2D3436] opacity-60 uppercase tracking-widest px-1">
                  College Name
                </label>
                <input
                  name="name"
                  placeholder="e.g. Institute of Technology"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-5 py-4 text-sm font-bold text-[#2D3436] bg-[#F5F6FA] border border-transparent rounded-[16px] outline-none transition-all duration-300 focus:border-[#6C5CE7] focus:ring-1 focus:ring-[#6C5CE7] placeholder-[#2D3436] placeholder-opacity-40"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-[#2D3436] opacity-60 uppercase tracking-widest px-1">
                  Email Domain
                </label>
                <input
                  name="emailDomain"
                  placeholder="e.g. college.edu.in"
                  value={form.emailDomain || ""}
                  onChange={handleChange}
                  className="w-full px-5 py-4 text-sm font-bold text-[#2D3436] bg-[#F5F6FA] border border-transparent rounded-[16px] outline-none transition-all duration-300 focus:border-[#6C5CE7] focus:ring-1 focus:ring-[#6C5CE7] placeholder-[#2D3436] placeholder-opacity-40"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-[#2D3436] opacity-60 uppercase tracking-widest px-1">
                  Phone Number
                </label>
                <input
                  name="phone"
                  placeholder="e.g. +91 9876543210"
                  value={form.phone || ""}
                  onChange={handleChange}
                  className="w-full px-5 py-4 text-sm font-bold text-[#2D3436] bg-[#F5F6FA] border border-transparent rounded-[16px] outline-none transition-all duration-300 focus:border-[#6C5CE7] focus:ring-1 focus:ring-[#6C5CE7] placeholder-[#2D3436] placeholder-opacity-40"
                />
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-[10px] font-black text-[#2D3436] opacity-60 uppercase tracking-widest px-1">
                  Website
                </label>
                <input
                  name="website"
                  placeholder="e.g. https://www.college.edu.in"
                  value={form.website || ""}
                  onChange={handleChange}
                  className="w-full px-5 py-4 text-sm font-bold text-[#2D3436] bg-[#F5F6FA] border border-transparent rounded-[16px] outline-none transition-all duration-300 focus:border-[#6C5CE7] focus:ring-1 focus:ring-[#6C5CE7] placeholder-[#2D3436] placeholder-opacity-40"
                />
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-[10px] font-black text-[#2D3436] opacity-60 uppercase tracking-widest px-1">
                  Address
                </label>
                <input
                  name="address"
                  placeholder="Full physical address"
                  value={form.address || ""}
                  onChange={handleChange}
                  className="w-full px-5 py-4 text-sm font-bold text-[#2D3436] bg-[#F5F6FA] border border-transparent rounded-[16px] outline-none transition-all duration-300 focus:border-[#6C5CE7] focus:ring-1 focus:ring-[#6C5CE7] placeholder-[#2D3436] placeholder-opacity-40"
                />
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-[10px] font-black text-[#2D3436] opacity-60 uppercase tracking-widest px-1">
                  Description
                </label>
                <textarea
                  name="description"
                  placeholder="Brief overview of the institution"
                  value={form.description || ""}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-5 py-4 text-sm font-bold text-[#2D3436] bg-[#F5F6FA] border border-transparent rounded-[16px] outline-none transition-all duration-300 focus:border-[#6C5CE7] focus:ring-1 focus:ring-[#6C5CE7] placeholder-[#2D3436] placeholder-opacity-40 resize-y"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 pt-8 border-t border-[#F5F6FA] animate-fade-in-up">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="text-sm font-black text-[#6C5CE7] m-0 uppercase tracking-widest border-l-4 border-[#6C5CE7] pl-3">
                Course Catalog
              </h3>
              <button
                type="button"
                onClick={addCourse}
                className="px-6 py-3 text-[11px] font-black text-[#6C5CE7] bg-[#F5F6FA] border border-transparent rounded-[14px] hover:border-[#6C5CE7] hover:shadow-sm hover:-translate-y-0.5 transition-all duration-300 cursor-pointer uppercase tracking-widest outline-none"
              >
                Add Course
              </button>
            </div>

            <div className="flex flex-col gap-6">
              {form.courses.length === 0 && (
                <div className="p-12 text-center bg-[#F5F6FA] border-2 border-dashed border-[#6C5CE7] border-opacity-20 rounded-[24px]">
                  <p className="text-sm text-[#2D3436] opacity-40 font-black uppercase tracking-widest m-0">
                    No courses added yet.
                  </p>
                </div>
              )}

              {form.courses.map((course, index) => (
                <div
                  key={index}
                  className="bg-[#FFFFFF] border border-[#F5F6FA] p-6 rounded-[24px] flex flex-col gap-6 box-border transition-all duration-300 hover:border-[#6C5CE7] hover:shadow-md shadow-sm"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-[#2D3436] opacity-60 uppercase tracking-widest px-1">
                        Course Name
                      </label>
                      <input
                        placeholder="e.g. Bachelor of Technology"
                        value={course.name}
                        onChange={(e) =>
                          updateCourse(index, "name", e.target.value)
                        }
                        className="w-full px-5 py-3.5 text-sm font-bold text-[#2D3436] bg-[#F5F6FA] border border-transparent rounded-[14px] outline-none transition-all duration-300 focus:border-[#6C5CE7] focus:ring-1 focus:ring-[#6C5CE7] placeholder-[#2D3436] placeholder-opacity-40"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-[#2D3436] opacity-60 uppercase tracking-widest px-1">
                        Duration (Years)
                      </label>
                      <input
                        placeholder="e.g. 4"
                        type="number"
                        min="1"
                        value={course.durationYears}
                        onChange={(e) =>
                          updateCourse(index, "durationYears", e.target.value)
                        }
                        className="w-full px-5 py-3.5 text-sm font-bold text-[#2D3436] bg-[#F5F6FA] border border-transparent rounded-[14px] outline-none transition-all duration-300 focus:border-[#6C5CE7] focus:ring-1 focus:ring-[#6C5CE7] placeholder-[#2D3436] placeholder-opacity-40"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 pt-5 border-t border-[#F5F6FA]">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[10px] font-black text-[#2D3436] opacity-80 uppercase tracking-widest">
                        Specializations
                      </span>
                      <button
                        type="button"
                        onClick={() => addSpecialization(index)}
                        className="text-[10px] font-black text-[#6C5CE7] bg-transparent border-none cursor-pointer hover:opacity-70 transition-all p-0 uppercase tracking-widest outline-none"
                      >
                        + Add Specialization
                      </button>
                    </div>

                    <div className="flex flex-col gap-3">
                      {course.specializations.length === 0 && (
                        <p className="text-[11px] text-[#2D3436] opacity-30 font-black uppercase tracking-widest px-1 m-0">
                          None added
                        </p>
                      )}

                      {course.specializations.map((sp, sIndex) => (
                        <div key={sIndex} className="relative group">
                          <input
                            placeholder="e.g. Computer Science"
                            value={sp}
                            onChange={(e) =>
                              updateSpecialization(
                                index,
                                sIndex,
                                e.target.value,
                              )
                            }
                            className="w-full px-5 py-3.5 text-sm font-bold text-[#2D3436] bg-[#F5F6FA] border border-transparent rounded-[14px] outline-none transition-all duration-300 focus:border-[#6C5CE7] focus:ring-1 focus:ring-[#6C5CE7] placeholder-[#2D3436] placeholder-opacity-40"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-8 border-t border-[#F5F6FA]">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 text-[13px] font-black uppercase tracking-widest text-[#FFFFFF] bg-[#6C5CE7] border-none rounded-[16px] cursor-pointer shadow-md transition-all duration-300 hover:bg-opacity-90 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 outline-none"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-3 border-[#FFFFFF]/30 border-t-[#FFFFFF] rounded-full animate-spin"></span>
                  Saving Records...
                </>
              ) : (
                "Save College Profile"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
