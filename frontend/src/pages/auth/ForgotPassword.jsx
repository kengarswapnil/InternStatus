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
        state: { email }
      });

    } catch (err) {

      alert(err.response?.data?.message || "Error sending OTP");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-500">

      <form
        onSubmit={handleSubmit}
        className="bg-amber-200 p-8 shadow-lg rounded-xl w-[380px]"
      >

        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          Forgot Password
        </h2>

        <input
          type="email"
          placeholder="Enter your email"
          className="border p-3 rounded-lg w-full mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button
          className="bg-red-500 text-white py-3 w-full rounded-lg hover:bg-red-600"
          disabled={loading}
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>

      </form>

    </div>
  );
}