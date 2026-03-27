import axios from "axios";
import { BASE_URL } from "../../utils/constants";
import { useEffect, useState } from "react";
import AdminNavBar from "../../components/navbars/AdminNavBar";

const Colleges = () => {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchColleges = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/college`, {
        withCredentials: true,
      });
      setColleges(res.data.colleges);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load colleges");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, []);

  const filteredColleges = colleges.filter(
    (college) =>
      college.name.toLowerCase().includes(search.toLowerCase()) ||
      college.location.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#FFFFFF] font-['Nunito'] flex flex-col box-border transition-all duration-300">
        <AdminNavBar />
        <main className="w-full flex-grow flex flex-col items-center justify-center px-4">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-[#F5F6FA] border-t-[#6C5CE7] rounded-full animate-spin"></div>
            <p className="text-[#6C5CE7] font-black tracking-widest uppercase text-[10px] animate-pulse m-0">
              Loading Colleges
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-[#FFFFFF] font-['Nunito'] flex flex-col box-border transition-all duration-300">
        <AdminNavBar />
        <main className="w-full max-w-7xl mx-auto flex-grow px-4 md:px-8 py-10 flex items-center justify-center">
          <div className="px-6 py-4 text-[11px] font-black text-rose-600 bg-rose-50 border border-rose-200 rounded-[14px] uppercase tracking-widest shadow-sm animate-pulse">
            {error}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#FFFFFF] font-['Nunito'] flex flex-col box-border text-[#2D3436] transition-all duration-300 relative overflow-hidden">
      <div className="relative z-10 flex flex-col min-h-screen">
        <AdminNavBar />

        <main className="w-full max-w-7xl mx-auto flex-grow px-4 md:px-8 py-10 md:py-16">
          <div className="mb-10 border-b border-[#F5F6FA] pb-6 animate-fade-in-up">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-[#6C5CE7] mb-3 mt-0">
              Colleges
            </h1>
            <p className="text-[#2D3436] opacity-60 font-bold text-sm md:text-base m-0 tracking-wide">
              List of all registered colleges
            </p>
          </div>

          <div className="mb-8 animate-fade-in-up">
            <input
              type="text"
              placeholder="Search by college name or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-xl px-5 py-4 rounded-[16px] border border-transparent bg-[#F5F6FA] focus:border-[#6C5CE7] focus:ring-1 focus:ring-[#6C5CE7] transition-all duration-300 text-sm font-bold text-[#2D3436] placeholder-[#2D3436] placeholder-opacity-40 box-border outline-none shadow-sm hover:shadow-md"
            />
          </div>

          {filteredColleges.length === 0 ? (
            <div className="bg-[#F5F6FA] border border-transparent rounded-[24px] p-16 text-center shadow-inner mt-8 animate-fade-in-up">
              <p className="text-[#2D3436] opacity-60 m-0 text-[13px] font-black uppercase tracking-widest">
                No colleges found matching your search.
              </p>
            </div>
          ) : (
            <div className="bg-[#FFFFFF] border border-[#F5F6FA] rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(108,92,231,0.08)] overflow-hidden box-border transition-all duration-500 animate-fade-in-up">
              <div className="overflow-x-auto bg-[#FFFFFF] custom-scrollbar">
                <table className="min-w-full text-left border-collapse whitespace-nowrap">
                  <thead className="bg-[#F5F6FA] border-b border-[#E5E5E5]">
                    <tr>
                      <th className="px-6 py-5 text-[10px] font-black text-[#6C5CE7] uppercase tracking-widest">
                        College Name
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black text-[#6C5CE7] uppercase tracking-widest">
                        Location
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#F5F6FA]">
                    {filteredColleges.map((college) => (
                      <tr
                        key={college._id}
                        className="hover:bg-[#F5F6FA] transition-colors duration-300 group cursor-default"
                      >
                        <td className="px-6 py-5 font-black text-[#2D3436] text-sm group-hover:text-[#6C5CE7] transition-colors">
                          {college.name}
                        </td>
                        <td className="px-6 py-5 text-[#2D3436] opacity-80 text-xs font-bold tracking-wide">
                          {college.location}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Colleges;
