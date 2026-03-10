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
        { withCredentials: true }
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
    <div className="min-h-screen w-full bg-[#0B0F19] font-sans flex flex-col box-border selection:bg-fuchsia-500/30 selection:text-fuchsia-200 relative overflow-hidden text-white">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <AdminNavBar />

        <main className="w-full flex-grow flex flex-col items-center justify-center px-4 md:px-6 py-16">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 mb-3 mt-0">
              Add College
            </h1>
            <p className="text-white/40 font-medium text-sm md:text-base m-0 tracking-wide">
              Register a new institution into InternStatus
            </p>
          </div>

          <div className="w-full max-w-xl bg-white/5 backdrop-blur-xl rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] border border-white/10 p-8 md:p-10 box-border transition-all duration-300 hover:border-white/20">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
                  College Name
                </label>
                <input
                  type="text"
                  value={name}
                  placeholder="e.g. Institute of Technology"
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-5 py-4 rounded-xl border border-white/10 bg-[#0B0F19]/50 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-300 text-sm text-white placeholder:text-white/20 box-border outline-none"
                  disabled={submitting}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  placeholder="e.g. Mumbai, Maharashtra"
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-5 py-4 rounded-xl border border-white/10 bg-[#0B0F19]/50 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-300 text-sm text-white placeholder:text-white/20 box-border outline-none"
                  disabled={submitting}
                />
              </div>

              <div className="pt-6 mt-2 border-t border-white/10">
                <button
                  onClick={handleAddCollege}
                  disabled={submitting}
                  className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold text-xs uppercase tracking-widest hover:shadow-[0_8px_20px_-6px_rgba(217,70,239,0.5)] transition-all duration-300 cursor-pointer border-none outline-none hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3"
                >
                  {submitting && (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  )}
                  {submitting ? "Submitting..." : "Submit College"}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddCollege;