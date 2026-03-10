import { useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utils/constants";

const SetMentorPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validate = () => {
    if (!password || !confirmPassword) {
      return "All security fields are required";
    }

    if (password.length < 6) {
      return "Entropy too low: Password must be at least 6 characters";
    }

    if (password !== confirmPassword) {
      return "Credential mismatch: Passwords do not match";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${BASE_URL}/api/mentor/set-password`,
        {
          token,
          password,
        }
      );

      setSuccess(res.data.message || "Password uplink successful");

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Uplink failed: Could not set password"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0F19] p-4 font-sans box-border text-white selection:bg-fuchsia-500/30">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="w-full max-w-md bg-white/5 backdrop-blur-xl rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] border border-white/10 p-8 md:p-12 text-center relative z-10">
          <div className="text-[10px] font-bold text-red-400 uppercase tracking-[0.3em] mb-4">Security Protocol</div>
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 mt-0 mb-6 tracking-tight">
            Access Denied
          </h2>
          <div className="px-5 py-4 text-[11px] font-bold text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl uppercase tracking-widest">
            Invalid or missing security token
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0F19] p-4 font-sans box-border text-white selection:bg-fuchsia-500/30 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] border border-white/10 p-8 md:p-12 box-border relative z-10 transition-all duration-300 hover:border-white/20">

        <header className="text-center mb-10 border-b border-white/10 pb-8">
          <div className="text-[10px] font-bold text-violet-400 uppercase tracking-[0.3em] mb-3">Onboarding Terminal</div>
          <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 m-0 tracking-tight">
            Secure Account
          </h2>
          <p className="text-white/40 text-sm mt-3 m-0 tracking-wide font-medium">
            Define your mentor access credentials
          </p>
        </header>

        {error && (
          <div className="mb-8 px-5 py-4 text-[11px] font-bold text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl uppercase tracking-widest text-center animate-pulse">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-8 px-5 py-4 text-[11px] font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-xl uppercase tracking-widest text-center animate-bounce">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest ml-1">
              New Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-300 placeholder:text-white/10"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest ml-1">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-300 placeholder:text-white/10"
              required
            />
          </div>

          <div className="pt-4 border-t border-white/10 mt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 text-xs font-black text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 border-none rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-[0_8px_20px_-6px_rgba(217,70,239,0.5)] hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-[0.2em] flex items-center justify-center gap-3 outline-none"
            >
              {loading && (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              )}
              {loading ? "Authorizing..." : "Initialize Password"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default SetMentorPassword;