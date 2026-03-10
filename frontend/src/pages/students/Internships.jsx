import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils/constants";
import { useNavigate } from "react-router-dom";

const Internships = () => {
  const navigate = useNavigate();

  const [internships, setInternships] = useState([]);
  const [appliedSet, setAppliedSet] = useState(new Set());
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    mode: "",
    skill: "",
    page: 1,
  });

  const [totalPages, setTotalPages] = useState(1);

  const fetchInternships = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${BASE_URL}/api/internships`, {
        params: filters,
        withCredentials: true,
      });

      setInternships(res.data.data);
      setTotalPages(res.data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplied = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/application/student/applied`,
        { withCredentials: true }
      );

      const apps = res.data.data || [];

      const ids = new Set(
        apps.map((app) => app.internship?._id?.toString())
      );

      setAppliedSet(ids);
    } catch (err) {
      console.error("Applied fetch error:", err);
    }
  };

  useEffect(() => {
    fetchInternships();
    fetchApplied();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
      page: 1,
    });
  };

  const renderStipend = (internship) => {
    if (internship.stipendType === "paid") {
      return `₹${internship.stipendAmount}`;
    }
    if (internship.stipendType === "unpaid") {
      return "Unpaid";
    }
    return "Not Disclosed";
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] p-4 md:p-8 font-sans text-white selection:bg-fuchsia-500/30 selection:text-fuchsia-200">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 border-b border-white/10 pb-6">
          <h1 className="text-3xl md:text-4xl font-black m-0 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 mb-2">
            Explore Internships
          </h1>
          <p className="text-white/40 text-sm font-medium m-0">
            Find your next career opportunity across top companies
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 md:p-6 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
          <input
            type="text"
            name="search"
            placeholder="Search by title..."
            value={filters.search}
            onChange={handleFilterChange}
            className="w-full px-4 py-3 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-lg outline-none transition-all duration-300 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 placeholder:text-white/20"
          />

          <select
            name="mode"
            value={filters.mode}
            onChange={handleFilterChange}
            className="w-full px-4 py-3 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-lg outline-none transition-all duration-300 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 cursor-pointer appearance-none [&>option]:bg-[#0B0F19]"
          >
            <option value="">All Modes</option>
            <option value="remote">Remote</option>
            <option value="onsite">Onsite</option>
            <option value="hybrid">Hybrid</option>
          </select>

          <input
            type="text"
            name="skill"
            placeholder="Filter by skill..."
            value={filters.skill}
            onChange={handleFilterChange}
            className="w-full px-4 py-3 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-lg outline-none transition-all duration-300 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 placeholder:text-white/20"
          />

          <button
            onClick={fetchInternships}
            className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-[0_8px_20px_-6px_rgba(217,70,239,0.5)] hover:-translate-y-0.5 transition-all duration-300 tracking-wider uppercase text-xs border-none cursor-pointer"
          >
            Apply Filters
          </button>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 border-4 border-white/10 border-t-fuchsia-500 rounded-full animate-spin"></div>
            <p className="text-fuchsia-400 font-medium tracking-widest uppercase text-xs animate-pulse m-0">
              Scanning opportunities
            </p>
          </div>
        ) : internships.length === 0 ? (
          <div className="bg-[#0B0F19]/50 border border-white/10 rounded-2xl p-12 text-center shadow-inner">
            <p className="text-white/40 m-0 text-base font-medium">
              No internships found matching your criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {internships.map((internship) => {
              const isApplied = appliedSet.has(internship._id.toString());

              return (
                <div
                  key={internship._id}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col transition-all duration-300 hover:border-white/20 hover:-translate-y-1 hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] group"
                >
                  <div className="p-5 md:p-6 flex-grow">
                    <div className="flex justify-between items-start mb-3 gap-3">
                      <div className="flex-1">
                        <h2 className="text-lg font-bold text-white/90 mt-0 mb-1 leading-tight group-hover:text-fuchsia-300 transition-colors">
                          {internship.title}
                        </h2>
                        <p className="text-fuchsia-400 font-medium text-xs m-0 tracking-wide uppercase">
                          {internship.company?.companyName}
                        </p>
                      </div>

                      {isApplied && (
                        <span className="shrink-0 bg-white/10 border border-white/20 text-white/90 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md">
                          Applied
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mb-6">
                      <span className="text-[11px] font-bold text-violet-400 uppercase tracking-widest">
                        {internship.location || "Remote"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-5 border-t border-white/10">
                      <div className="flex flex-col gap-1.5 bg-[#0B0F19]/30 p-3 rounded-lg border border-white/5">
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                          Mode
                        </span>
                        <span className="text-xs font-bold text-white/90 capitalize">
                          {internship.mode}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1.5 bg-[#0B0F19]/30 p-3 rounded-lg border border-white/5">
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                          Stipend
                        </span>
                        <span className="text-xs font-bold text-emerald-400">
                          {renderStipend(internship)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 md:p-6 pt-0 mt-auto">
                    <button
                      onClick={() =>
                        navigate(`/student/internships/${internship._id}`)
                      }
                      className="w-full bg-white/5 text-white font-bold py-2.5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300 text-[11px] tracking-widest uppercase cursor-pointer outline-none hover:-translate-y-0.5"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center mt-10 gap-2.5">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setFilters({ ...filters, page: i + 1 })}
                className={`w-10 h-10 rounded-lg font-bold text-sm transition-all duration-300 flex items-center justify-center cursor-pointer outline-none ${
                  filters.page === i + 1
                    ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white border-none shadow-[0_4px_15px_-3px_rgba(217,70,239,0.5)]"
                    : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Internships;