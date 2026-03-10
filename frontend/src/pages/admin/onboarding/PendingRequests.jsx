import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../api/api";

export default function PendingRequests() {
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

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/admin/onboarding/pending?type=${filter}`);

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

  const list = [
    ...colleges.map((c) => ({ ...c, type: "college" })),
    ...companies.map((c) => ({ ...c, type: "company" })),
  ];

  const filteredList = list.filter(
    (item) =>
      item.requesterName?.toLowerCase().includes(search.toLowerCase()) ||
      item.requesterEmail?.toLowerCase().includes(search.toLowerCase()) ||
      item.collegeName?.toLowerCase().includes(search.toLowerCase()) ||
      item.companyName?.toLowerCase().includes(search.toLowerCase())
  );

  const approve = async (id, type) => {
    try {
      const url =
        type === "college"
          ? `/college-onboarding/${id}/status`
          : `/company-onboarding/${id}/status`;

      await API.put(url, { status: "approved" });
      fetchData();
    } catch (err) {
      alert("Approve failed");
    }
  };

  const reject = async (id, type) => {
    try {
      const reason = prompt("Enter rejection reason");
      if (!reason) return;

      const url =
        type === "college"
          ? `/college-onboarding/${id}/status`
          : `/company-onboarding/${id}/status`;

      await API.put(url, {
        status: "rejected",
        rejectionReason: reason,
      });

      fetchData();
    } catch (err) {
      alert("Reject failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] p-4 md:p-8 font-sans text-white selection:bg-fuchsia-500/30 selection:text-fuchsia-200">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 border-b border-white/10 pb-6">
          <h2 className="text-3xl md:text-4xl font-black m-0 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 mb-2">
            Pending Requests
          </h2>
          <p className="text-white/40 text-sm font-medium m-0">
            Review and manage incoming onboarding applications.
          </p>
        </header>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 mb-10 flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] transition-all duration-300 hover:border-white/20">
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

          <div className="w-full lg:max-w-md">
            <input
              type="text"
              placeholder="Search by name, email, or org..."
              className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none transition-all duration-300 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 placeholder:text-white/20"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 border-4 border-white/10 border-t-fuchsia-500 rounded-full animate-spin"></div>
            <p className="text-fuchsia-400 font-medium tracking-widest uppercase text-xs animate-pulse m-0">
              Loading Requests
            </p>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="bg-[#0B0F19]/50 border border-white/10 rounded-3xl p-16 text-center shadow-inner">
            <p className="text-white/40 m-0 text-lg font-medium">
              No pending requests found.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredList.map((item) => (
              <div
                key={item._id}
                className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] flex flex-col md:flex-row md:justify-between md:items-center gap-6 transition-all duration-300 hover:border-white/20 hover:-translate-y-1 group"
              >
                <div className="flex flex-col gap-2 flex-grow">
                  <div className="flex items-center gap-4 mb-2">
                    <span
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${
                        item.type === "college"
                          ? "bg-violet-500/20 text-violet-300 border-violet-500/30"
                          : "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30"
                      }`}
                    >
                      {item.type}
                    </span>
                    <h3 className="text-xl font-bold text-white/90 m-0 group-hover:text-fuchsia-300 transition-colors">
                      {item.type === "college"
                        ? item.collegeName
                        : item.companyName}
                    </h3>
                  </div>

                  <div className="flex flex-col gap-1 pl-1">
                    <p className="text-sm font-bold text-white/80 m-0">
                      {item.requesterName}
                    </p>
                    <p className="text-xs font-medium text-white/40 m-0 tracking-wide">
                      {item.requesterEmail}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap md:flex-nowrap gap-3 md:border-l border-white/10 md:pl-6">
                  <button
                    onClick={() =>
                      navigate(`/admin/onboarding/${item.type}/${item._id}`)
                    }
                    className="flex-1 md:flex-none px-5 py-3 text-[10px] font-bold tracking-widest uppercase text-white/80 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer outline-none hover:-translate-y-0.5"
                  >
                    Details
                  </button>

                  <button
                    onClick={() => approve(item._id, item.type)}
                    className="flex-1 md:flex-none px-5 py-3 text-[10px] font-bold tracking-widest uppercase text-white bg-gradient-to-r from-emerald-500 to-emerald-600 border-none rounded-xl hover:shadow-[0_4px_15px_-3px_rgba(16,185,129,0.5)] transition-all duration-300 cursor-pointer outline-none hover:-translate-y-0.5"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => reject(item._id, item.type)}
                    className="flex-1 md:flex-none px-5 py-3 text-[10px] font-bold tracking-widest uppercase text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl hover:bg-red-500/20 transition-all duration-300 cursor-pointer outline-none hover:-translate-y-0.5"
                  >
                    Reject
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