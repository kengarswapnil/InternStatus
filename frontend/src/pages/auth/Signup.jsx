import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

import { BASE_URL } from "../../utils/constants";
import { addUser } from "../../store/userSlice";

const ROLE_ENDPOINT_MAP = {
  Student: "/signup/student",
  Faculty: "/signup/faculty",
  Company: "/signup/company",
};

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const redirectAfterSignup = (role) => {
    if (role === "Student") return "/student/profile";
    if (role === "Faculty") return "/faculty/register";
    if (role === "Company") return "/company/register";
    return "/login";
  };

  const handleSignup = async () => {
    setError("");

    if (!email || !password || !role) {
      setError("All fields are required.");
      return;
    }

    const endpoint = ROLE_ENDPOINT_MAP[role];
    if (!endpoint) {
      setError("Invalid role selected.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/api/auth${endpoint}`,
        { email, password },
        { withCredentials: true }
      );

      const userData = res.data?.data;
      if (!userData) {
        setError("Invalid response from server.");
        setSubmitting(false);
        return;
      }

      dispatch(addUser(userData));
      navigate(redirectAfterSignup(userData.role));
    } catch (err) {
      const msg =
        err?.response?.data?.message || "Signup failed. Please try again.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-4 selection:bg-fuchsia-500/30 selection:text-fuchsia-200 relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>

      <div className="w-full max-w-[360px] bg-white/5 backdrop-blur-xl p-8 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] border border-white/10 relative z-10 transition-all duration-300 hover:border-white/20">
        <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 text-center mt-0 mb-6 tracking-tight">
          Create Account
        </h2>

        {error && (
          <div className="mb-5 px-4 py-3 text-[11px] font-bold text-white bg-red-500/10 border border-red-500/20 rounded-lg backdrop-blur-md">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div className="relative flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
              Account Type
            </label>

            <button
              type="button"
              onClick={() => setIsRoleOpen((prev) => !prev)}
              disabled={submitting}
              className="w-full px-4 py-3 text-sm bg-[#0B0F19]/50 border border-white/10 rounded-lg outline-none transition-all duration-300 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 flex justify-between items-center text-left"
            >
              <span className={role ? "text-white" : "text-white/20"}>
                {role || "Select Role"}
              </span>
              <span className="text-[10px] text-white/40 transform transition-transform duration-200">
                ▼
              </span>
            </button>

            {isRoleOpen && (
              <div className="absolute top-full left-0 mt-2 w-full bg-[#0B0F19]/90 backdrop-blur-2xl border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden">
                {["Student", "Faculty", "Company"].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      setRole(r);
                      setIsRoleOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors duration-200 border-none cursor-pointer"
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
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
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting}
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
            onClick={handleSignup}
            disabled={submitting}
            className="w-full mt-3 py-3.5 text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 border-none rounded-lg cursor-pointer transition-all duration-300 hover:shadow-[0_8px_20px_-6px_rgba(217,70,239,0.5)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest flex justify-center items-center gap-2"
          >
            {submitting && (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            )}
            {submitting ? "Creating..." : "Sign Up"}
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs font-medium text-white/50 m-0">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-fuchsia-400 hover:text-fuchsia-300 transition-colors no-underline font-bold"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;