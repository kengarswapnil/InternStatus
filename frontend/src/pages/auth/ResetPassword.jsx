import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../../api/api";

export default function ResetPassword() {

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await API.post("/auth/reset-password", {
        email,
        otp,
        password
      });

      alert("Password reset successful");
      navigate("/login");

    } catch (err) {
      alert(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 shadow-xl rounded-xl w-[380px] border"
      >

        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Reset Password
        </h2>

        {/* Email */}
        <label className="block text-sm font-semibold mb-1 text-gray-700">
          Email
        </label>
        <input
          type="email"
          value={email}
          disabled
          className="border border-gray-400 p-3 rounded-lg w-full mb-4 bg-gray-100 text-gray-700"
        />

        {/* OTP */}
        <label className="block text-sm font-semibold mb-1 text-gray-700">
          OTP
        </label>
        <input
          type="text"
          placeholder="Enter OTP"
          className="border border-gray-400 p-3 rounded-lg w-full mb-4 focus:outline-none focus:ring-2 focus:ring-red-400"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />

        {/* Password */}
        <label className="block text-sm font-semibold mb-1 text-gray-700">
          New Password
        </label>
        <input
          type="password"
          placeholder="Enter new password"
          className="border border-gray-400 p-3 rounded-lg w-full mb-6 focus:outline-none focus:ring-2 focus:ring-red-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="bg-red-500 text-white py-3 w-full rounded-lg hover:bg-red-600 transition"
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

      </form>

    </div>
  );
}