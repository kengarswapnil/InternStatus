import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import API from "../../api/api";
import { addUser } from "../../store/userSlice";

export default function AdminLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    email: "admin@gmail.com",
    password: "Admin@123",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await API.post("/auth/login", form);

      const user = res.data?.data;

      if (!user) {
        alert("Invalid login response");
        return;
      }

      // 🚨 enforce admin only
      if (String(user.role).toLowerCase() !== "admin") {
        alert("Access denied: not an admin");
        return;
      }

      // ✅ fetch profile AFTER login
      const profileRes = await API.get("/users/profile");

      dispatch(
        addUser({
          user,
          profile: profileRes.data?.profile,
          token: null,
        }),
      );

      navigate("/admin/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFFFF] p-4 font-['Nunito'] transition-all duration-300">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[360px] bg-[#FFFFFF] p-8 rounded-[24px] border border-[#F5F6FA] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(108,92,231,0.08)] transition-all duration-500 flex flex-col gap-6 transform hover:-translate-y-1"
      >
        <div className="flex justify-center mb-2">
          <div className="w-25 h-16 rounded-[20px] bg-[#F5F6FA] border border-transparent flex items-center justify-center text-[#6C5CE7] font-black text-2xl shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#6C5CE7]">
            Admin
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-black text-[#2D3436] opacity-60 uppercase tracking-widest px-1">
            Admin Email
          </label>
          <input
            type="email"
            placeholder="Admin Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="w-full px-4 py-3.5 text-[13px] font-bold text-[#2D3436] bg-[#F5F6FA] border border-transparent rounded-[14px] outline-none transition-all duration-300 hover:border-[#6C5CE7] focus:border-[#6C5CE7] focus:ring-1 focus:ring-[#6C5CE7] placeholder-[#2D3436] placeholder-opacity-40"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-black text-[#2D3436] opacity-60 uppercase tracking-widest px-1">
            Password
          </label>
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            className="w-full px-4 py-3.5 text-[13px] font-bold text-[#2D3436] bg-[#F5F6FA] border border-transparent rounded-[14px] outline-none transition-all duration-300 hover:border-[#6C5CE7] focus:border-[#6C5CE7] focus:ring-1 focus:ring-[#6C5CE7] placeholder-[#2D3436] placeholder-opacity-40"
          />
        </div>

        <button
          disabled={loading}
          className="w-full mt-2 py-3.5 text-[13px] font-black uppercase tracking-widest text-[#FFFFFF] bg-[#6C5CE7] border-none rounded-[14px] cursor-pointer hover:bg-opacity-90 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex justify-center items-center shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? "Loading..." : "Login as Admin"}
        </button>
      </form>
    </div>
  );
}
