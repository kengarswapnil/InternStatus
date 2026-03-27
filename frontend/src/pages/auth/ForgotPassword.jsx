import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await API.post("/auth/forgot-password", { email });

      alert("OTP sent to your email");

      navigate("/reset-password", {
        state: { email },
      });
    } catch (err) {
      alert(err.response?.data?.message || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center p-4 font-['Nunito'] transition-all duration-300">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[360px] bg-[#FFFFFF] p-8 rounded-[20px] border border-[#F5F6FA] shadow-sm hover:shadow-md transition-shadow duration-500 flex flex-col gap-3"
      >
        <h2 className="text-[23px] font-black text-[#6C5CE7] text-center m-0 mb-4 tracking-tight">
          Forgot Password
        </h2>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-bold text-[#2D3436] opacity-80">
            Email Address
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-3 text-[13px] font-bold text-[#2D3436] bg-[#F5F6FA] border border-transparent rounded-[14px] outline-none transition-all duration-300 hover:border-[#6C5CE7] focus:border-[#6C5CE7] focus:ring-1 focus:ring-[#6C5CE7] placeholder-[#2D3436] placeholder-opacity-40"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full mt-3 py-3 text-[14px] font-black text-[#FFFFFF] bg-[#6C5CE7] border-none rounded-[14px] cursor-pointer hover:bg-opacity-90 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex justify-center items-center shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          disabled={loading}
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>
      </form>
    </div>
  );
}