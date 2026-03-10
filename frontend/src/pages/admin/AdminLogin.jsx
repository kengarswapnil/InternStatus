import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import API from "../../api/api";
import { addUser } from "../../store/userSlice";

export default function AdminLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

      const res = await API.post("/auth/login", form);

      const user = res.data?.data;

      if (!user) {
        alert("Invalid login response");
        return;
      }

      dispatch(addUser(user));

      if (String(user.role).toLowerCase() !== "admin") {
        alert("Not an admin account");
        return;
      }

      navigate("/admin");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-4 selection:bg-fuchsia-500/30 selection:text-fuchsia-200 relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>

      <div className="w-full max-w-[360px] bg-white/5 backdrop-blur-xl p-8 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] border border-white/10 relative z-10 transition-all duration-300 hover:border-white/20">
        <div className="flex justify-center mb-5">
          <span className="px-3 py-1.5 bg-violet-500/20 border border-violet-500/30 text-violet-300 text-[10px] font-bold uppercase tracking-widest rounded-lg">
            Admin Portal
          </span>
        </div>

        <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 text-center mt-0 mb-6 tracking-tight">
          Secure Login
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
              Admin Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="admin@system.com"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-lg outline-none transition-all duration-300 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 placeholder:text-white/20"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter master password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full pl-4 pr-16 py-3 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-lg outline-none transition-all duration-300 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 placeholder:text-white/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-fuchsia-400 uppercase tracking-widest hover:text-fuchsia-300 transition-colors bg-transparent border-none cursor-pointer outline-none p-0"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-3 py-3.5 text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 border-none rounded-lg cursor-pointer transition-all duration-300 hover:shadow-[0_8px_20px_-6px_rgba(217,70,239,0.5)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest flex justify-center items-center gap-2"
          >
            {loading && (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            )}
            {loading ? "Authenticating..." : "Access Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}