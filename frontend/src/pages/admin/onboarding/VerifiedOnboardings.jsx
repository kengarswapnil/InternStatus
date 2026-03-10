import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../api/api";

export default function VerifiedOnboardings() {
  const navigate = useNavigate();

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const [colleges, setColleges] = useState([]);
  const [companies, setCompanies] = useState([]);

  const [counts, setCounts] = useState({
    all: 0,
    college: 0,
    company: 0,
  });

  const [loading, setLoading] = useState(true);

  /* ================= FETCH ================= */

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await API.get(`/admin/onboarding/verified?type=${filter}`);

      const collegeList = res.data?.data?.colleges || [];
      const companyList = res.data?.data?.companies || [];

      setColleges(collegeList);
      setCompanies(companyList);

      setCounts({
        all: collegeList.length + companyList.length,
        college: collegeList.length,
        company: companyList.length,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filter]);

  /* ================= MERGE ================= */

  const list = [
    ...colleges.map((c) => ({ ...c, type: "college" })),
    ...companies.map((c) => ({ ...c, type: "company" })),
  ];

  /* ================= SEARCH ================= */

  const filteredList = list.filter(
    (item) =>
      item.requesterName?.toLowerCase().includes(search.toLowerCase()) ||
      item.requesterEmail?.toLowerCase().includes(search.toLowerCase()) ||
      item.collegeName?.toLowerCase().includes(search.toLowerCase()) ||
      item.companyName?.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-[#0B0F19] p-4 md:p-8 font-sans text-white selection:bg-fuchsia-500/30 selection:text-fuchsia-200">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 border-b border-white/10 pb-6">
          <h2 className="text-3xl md:text-4xl font-black m-0 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 mb-2">
            Verified Onboardings
          </h2>
          <p className="text-white/40 text-sm font-medium m-0">
            Manage and view officially verified colleges and companies.
          </p>
        </header>

        {/* CONTROLS (SEARCH & FILTERS) */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 mb-10 flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] transition-all duration-300 hover:border-white/20">
          <div className="w-full lg:max-w-md">
            <input
              type="text"
              placeholder="Search by name, email, or institution..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none transition-all duration-300 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 placeholder:text-white/20"
            />
          </div>

          <div className="flex flex-wrap gap-3 w-full lg:w-auto">
            <button
              onClick={() => setFilter("all")}
              className={`flex-1 lg:flex-none px-6 py-3.5 text-xs font-bold rounded-xl transition-all duration-300 uppercase tracking-widest cursor-pointer outline-none ${
                filter === "all"
                  ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white border-none shadow-[0_4px_15px_-3px_rgba(217,70,239,0.5)]"
                  : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              All ({counts.all})
            </button>

            <button
              onClick={() => setFilter("college")}
              className={`flex-1 lg:flex-none px-6 py-3.5 text-xs font-bold rounded-xl transition-all duration-300 uppercase tracking-widest cursor-pointer outline-none ${
                filter === "college"
                  ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white border-none shadow-[0_4px_15px_-3px_rgba(217,70,239,0.5)]"
                  : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              Colleges ({counts.college})
            </button>

            <button
              onClick={() => setFilter("company")}
              className={`flex-1 lg:flex-none px-6 py-3.5 text-xs font-bold rounded-xl transition-all duration-300 uppercase tracking-widest cursor-pointer outline-none ${
                filter === "company"
                  ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white border-none shadow-[0_4px_15px_-3px_rgba(217,70,239,0.5)]"
                  : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              Companies ({counts.company})
            </button>
          </div>
        </div>

        {/* LIST */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 border-4 border-white/10 border-t-fuchsia-500 rounded-full animate-spin"></div>
            <p className="text-fuchsia-400 font-medium tracking-widest uppercase text-xs animate-pulse m-0">
              Loading Records
            </p>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="bg-[#0B0F19]/50 border border-white/10 rounded-3xl p-16 text-center shadow-inner">
            <p className="text-white/40 m-0 text-lg font-medium">
              No verified onboardings found.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredList.map((item) => (
              <div
                key={item._id}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col transition-all duration-300 hover:border-white/20 hover:-translate-y-1 hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] group"
              >
                <div className="flex justify-between items-start mb-6">
                  <span
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${
                      item.type === "college"
                        ? "bg-violet-500/20 text-violet-300 border-violet-500/30"
                        : "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30"
                    }`}
                  >
                    {item.type}
                  </span>
                </div>

                <div className="flex flex-col flex-grow mb-8">
                  <h3 className="text-xl font-bold text-white/90 mt-0 mb-2 leading-tight group-hover:text-fuchsia-300 transition-colors">
                    {item.type === "college" ? item.collegeName : item.companyName}
                  </h3>
                  
                  <div className="flex flex-col gap-1.5 mt-2">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                      Requester
                    </span>
                    <span className="text-sm font-medium text-white/80">
                      {item.requesterName || "—"}
                    </span>
                    <span className="text-xs text-fuchsia-400 font-medium">
                      {item.requesterEmail}
                    </span>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10 mt-auto">
                  <button
                    onClick={() =>
                      navigate(`/admin/onboarding/${item.type}/${item._id}`)
                    }
                    className="w-full px-4 py-3.5 text-xs font-bold text-white bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300 hover:-translate-y-0.5 tracking-widest uppercase cursor-pointer outline-none"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}