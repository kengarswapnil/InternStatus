import axios from "axios";
import AdminNavBar from "../../components/navbars/AdminNavBar";
import { BASE_URL } from "../../utils/constants";
import { useState } from "react";

const AddCollege = () => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleAddCollege = async () => {
    if (!name.trim() || !location.trim()) {
      alert("College name and location are required");
      return;
    }

    try {
      setSubmitting(true);
      await axios.post(
        `${BASE_URL}/api/college/add-college`,
        { name, location },
        { withCredentials: true },
      );
      alert("College added successfully");
      setName("");
      setLocation("");
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FFFFFF] flex flex-col font-['Nunito'] text-[#2D3436] transition-all duration-300">
      <AdminNavBar />

      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="text-center mb-8 animate-fade-in-up">
          <h1 className="text-[26px] font-black text-[#6C5CE7] m-0 mb-2 leading-tight tracking-tight">
            Add College
          </h1>
          <p className="text-[14px] font-bold text-[#2D3436] opacity-60 m-0 uppercase tracking-widest">
            Register a new institution into InternStatus
          </p>
        </div>

        <div className="w-full max-w-[400px] bg-[#FFFFFF] border border-[#F5F6FA] rounded-[24px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(108,92,231,0.08)] transition-all duration-500 flex flex-col gap-6 transform hover:-translate-y-1">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-black text-[#2D3436] opacity-60 uppercase tracking-widest px-1">
              College Name
            </label>
            <input
              type="text"
              value={name}
              placeholder="e.g. Institute of Technology"
              onChange={(e) => setName(e.target.value)}
              className="w-full px-5 py-3.5 text-[14px] font-bold text-[#2D3436] bg-[#F5F6FA] border border-transparent rounded-[16px] outline-none transition-all duration-300 hover:border-[#6C5CE7] focus:border-[#6C5CE7] focus:ring-1 focus:ring-[#6C5CE7] placeholder-[#2D3436] placeholder-opacity-40 disabled:opacity-50"
              disabled={submitting}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-black text-[#2D3436] opacity-60 uppercase tracking-widest px-1">
              Location
            </label>
            <input
              type="text"
              value={location}
              placeholder="e.g. Mumbai, Maharashtra"
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-5 py-3.5 text-[14px] font-bold text-[#2D3436] bg-[#F5F6FA] border border-transparent rounded-[16px] outline-none transition-all duration-300 hover:border-[#6C5CE7] focus:border-[#6C5CE7] focus:ring-1 focus:ring-[#6C5CE7] placeholder-[#2D3436] placeholder-opacity-40 disabled:opacity-50"
              disabled={submitting}
            />
          </div>

          <button
            onClick={handleAddCollege}
            disabled={submitting}
            className="w-full mt-4 py-4 text-[13px] font-black uppercase tracking-widest text-[#FFFFFF] bg-[#6C5CE7] border-none rounded-[16px] cursor-pointer hover:bg-opacity-90 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex justify-center items-center shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {submitting ? "Submitting..." : "Submit College"}
          </button>
        </div>
      </main>
    </div>
  );
};

export default AddCollege;
