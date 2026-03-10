import React, { useEffect, useState } from "react";
import API from "../../api/api";

export default function InviteFaculty() {
  const [form, setForm] = useState({
    email: "",
    fullName: "",
    courseName: "",
    specialization: "",
    designation: ""
  });

  const [courses, setCourses] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await API.get("/college/courses");
      setCourses(res.data?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleCourseChange = (e) => {
    const courseName = e.target.value;

    const selected = courses.find(
      c => c.name === courseName
    );

    setForm({
      ...form,
      courseName,
      specialization: ""
    });

    setSpecializations(selected?.specializations || []);
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await API.post("/users/faculty/invite", form);

      alert("Faculty invited successfully");

      setForm({
        email: "",
        fullName: "",
        courseName: "",
        specialization: "",
        designation: ""
      });

      setSpecializations([]);

    } catch (err) {
      alert(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-[#F9F7F7] p-4 md:p-8 font-sans box-border">
      <div className="w-full max-w-lg bg-white p-8 md:p-10 rounded-md shadow-sm border border-[#DBE2EF] box-border">
        <h2 className="text-2xl md:text-3xl font-semibold text-[#112D4E] mt-0 mb-8 text-center">
          Invite Faculty
        </h2>

        <form
          onSubmit={submit}
          className="flex flex-col gap-5"
        >
          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3.5 text-[15px] text-[#112D4E] bg-[#F9F7F7] border border-[#DBE2EF] rounded-md outline-none transition-colors duration-200 focus:border-[#3F72AF] focus:bg-white placeholder:text-[#3F72AF] placeholder:opacity-60 box-border"
          />

          <input
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            required
            className="w-full px-4 py-3.5 text-[15px] text-[#112D4E] bg-[#F9F7F7] border border-[#DBE2EF] rounded-md outline-none transition-colors duration-200 focus:border-[#3F72AF] focus:bg-white placeholder:text-[#3F72AF] placeholder:opacity-60 box-border"
          />

          <select
            name="courseName"
            value={form.courseName}
            onChange={handleCourseChange}
            className="w-full px-4 py-3.5 text-[15px] text-[#112D4E] bg-[#F9F7F7] border border-[#DBE2EF] rounded-md outline-none transition-colors duration-200 focus:border-[#3F72AF] focus:bg-white box-border cursor-pointer"
          >
            <option value="" className="text-[#3F72AF] opacity-60">Select Course</option>
            {courses.map(c => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            name="specialization"
            value={form.specialization}
            onChange={handleChange}
            disabled={!form.courseName}
            className="w-full px-4 py-3.5 text-[15px] text-[#112D4E] bg-[#F9F7F7] border border-[#DBE2EF] rounded-md outline-none transition-colors duration-200 focus:border-[#3F72AF] focus:bg-white box-border cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <option value="" className="text-[#3F72AF] opacity-60">Select Specialization</option>
            {specializations.map(s => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <input
            name="designation"
            placeholder="Designation"
            value={form.designation}
            onChange={handleChange}
            className="w-full px-4 py-3.5 text-[15px] text-[#112D4E] bg-[#F9F7F7] border border-[#DBE2EF] rounded-md outline-none transition-colors duration-200 focus:border-[#3F72AF] focus:bg-white placeholder:text-[#3F72AF] placeholder:opacity-60 box-border"
          />

          <button 
            disabled={loading}
            className="w-full mt-2 py-4 text-[15px] font-semibold text-white bg-[#3F72AF] border-none rounded-md cursor-pointer transition-all duration-200 hover:bg-[#112D4E] active:translate-y-px disabled:bg-[#DBE2EF] disabled:text-[#112D4E] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Inviting..." : "Invite Faculty"}
          </button>
        </form>
      </div>
    </div>
  );
}