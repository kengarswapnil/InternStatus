import React, { useState } from "react";
import API from "../../api/api";

export default function InviteMentor() {
  const [form, setForm] = useState({
    email: "",
    fullName: "",
    designation: "",
    department: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await API.post("/users/mentor/invite", form);

      alert("Mentor invited successfully. Setup email sent.");

      setForm({
        email: "",
        fullName: "",
        designation: "",
        department: "",
      });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to invite mentor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-[#F9F7F7] p-4 md:p-8 font-sans box-border">
      <div className="w-full max-w-lg bg-white p-8 md:p-10 rounded-md shadow-sm border border-[#DBE2EF] box-border">
        <h2 className="text-2xl md:text-3xl font-semibold text-[#112D4E] mt-0 mb-8 text-center">
          Add Mentor
        </h2>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5"
        >
          <input
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            required
            className="w-full px-4 py-3.5 text-[15px] text-[#112D4E] bg-[#F9F7F7] border border-[#DBE2EF] rounded-md outline-none transition-colors duration-200 focus:border-[#3F72AF] focus:bg-white placeholder:text-[#3F72AF] placeholder:opacity-60 box-border"
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3.5 text-[15px] text-[#112D4E] bg-[#F9F7F7] border border-[#DBE2EF] rounded-md outline-none transition-colors duration-200 focus:border-[#3F72AF] focus:bg-white placeholder:text-[#3F72AF] placeholder:opacity-60 box-border"
          />

          <input
            name="designation"
            placeholder="Designation"
            value={form.designation}
            onChange={handleChange}
            className="w-full px-4 py-3.5 text-[15px] text-[#112D4E] bg-[#F9F7F7] border border-[#DBE2EF] rounded-md outline-none transition-colors duration-200 focus:border-[#3F72AF] focus:bg-white placeholder:text-[#3F72AF] placeholder:opacity-60 box-border"
          />

          <input
            name="department"
            placeholder="Department"
            value={form.department}
            onChange={handleChange}
            className="w-full px-4 py-3.5 text-[15px] text-[#112D4E] bg-[#F9F7F7] border border-[#DBE2EF] rounded-md outline-none transition-colors duration-200 focus:border-[#3F72AF] focus:bg-white placeholder:text-[#3F72AF] placeholder:opacity-60 box-border"
          />

          <button
            disabled={loading}
            className="w-full mt-2 py-4 text-[15px] font-semibold text-white bg-[#3F72AF] border-none rounded-md cursor-pointer transition-all duration-200 hover:bg-[#112D4E] active:translate-y-px disabled:bg-[#DBE2EF] disabled:text-[#112D4E] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Sending..." : "Invite Mentor"}
          </button>
        </form>
      </div>
    </div>
  );
}