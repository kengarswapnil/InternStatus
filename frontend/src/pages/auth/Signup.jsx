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
        { withCredentials: true },
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
    <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center p-4 font-['Nunito'] transition-all duration-300">
      <div className="w-full max-w-[360px] bg-[#FFFFFF] p-8 rounded-[20px] border border-[#F5F6FA] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(108,92,231,0.08)] transition-shadow duration-500 flex flex-col gap-3">
        <h2 className="text-[23px] font-black text-[#6C5CE7] text-center m-0 mb-4 tracking-tight">
          Create Account
        </h2>

        {error && (
          <div className="px-4 py-3 text-[13px] font-bold text-rose-600 bg-rose-50 border border-rose-200 rounded-[14px] animate-pulse shadow-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div className="relative flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-[#2D3436] opacity-80">
              Account Type
            </label>

            <button
              type="button"
              onClick={() => setIsRoleOpen((prev) => !prev)}
              disabled={submitting}
              className="w-full px-4 py-3 text-[13px] font-bold bg-[#F5F6FA] border border-transparent hover:border-[#6C5CE7] focus:border-[#6C5CE7] focus:ring-1 focus:ring-[#6C5CE7] rounded-[14px] outline-none flex justify-between items-center text-left transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <span className="text-[#2D3436]">{role || "Select Role"}</span>
            </button>

            {isRoleOpen && (
              <div className="absolute top-full left-0 mt-2 w-full bg-[#FFFFFF] border border-[#F5F6FA] rounded-[14px] shadow-lg z-50 overflow-hidden transform origin-top animate-fade-in-down">
                {["Student", "Faculty", "Company"].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      setRole(r);
                      setIsRoleOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-[13px] font-bold text-[#2D3436] hover:bg-[#F5F6FA] hover:text-[#6C5CE7] transition-colors duration-200 border-none cursor-pointer"
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-[#2D3436] opacity-80">
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
              className="w-full px-4 py-3 text-[13px] font-bold text-[#2D3436] bg-[#F5F6FA] border border-transparent rounded-[14px] outline-none transition-all duration-300 hover:border-[#6C5CE7] focus:border-[#6C5CE7] focus:ring-1 focus:ring-[#6C5CE7] placeholder-[#2D3436] placeholder-opacity-40 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-[#2D3436] opacity-80">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting}
                className="w-full pl-4 pr-16 py-3 text-[13px] font-bold text-[#2D3436] bg-[#F5F6FA] border border-transparent rounded-[14px] outline-none transition-all duration-300 hover:border-[#6C5CE7] focus:border-[#6C5CE7] focus:ring-1 focus:ring-[#6C5CE7] placeholder-[#2D3436] placeholder-opacity-40 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] font-black uppercase tracking-widest text-[#6C5CE7] bg-transparent border-none cursor-pointer outline-none p-0 hover:opacity-70 transition-opacity"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            onClick={handleSignup}
            disabled={submitting}
            className="w-full mt-3 py-3 text-[14px] font-black text-[#FFFFFF] bg-[#6C5CE7] border-none rounded-[14px] cursor-pointer hover:bg-opacity-90 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex justify-center items-center shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {submitting ? "Creating..." : "Sign Up"}
          </button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-[13px] font-bold text-[#2D3436] opacity-80 m-0">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#6C5CE7] hover:opacity-80 no-underline font-black transition-opacity"
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
