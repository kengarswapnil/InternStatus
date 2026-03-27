import { useEffect, useState } from "react";
import AdminNavBar from "../../../components/navbars/AdminNavBar";
import { useNavigate } from "react-router-dom";

// Note: API is assumed to be imported or available in scope as per previous logic
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
      item.companyName?.toLowerCase().includes(search.toLowerCase()),
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
    <div className="min-h-screen bg-[#FFFFFF] text-[#2D3436] flex flex-col font-['Nunito'] pb-10 transition-colors duration-500">

      <main className="max-w-7xl mx-auto w-full px-4 md:px-8 py-8 flex flex-col gap-8 animate-in fade-in duration-700">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#F5F6FA] pb-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl font-black text-[#2D3436] m-0 tracking-tighter leading-tight">
              Pending Requests
            </h1>
          </div>

          <div className="relative group">
            <input
              type="text"
              placeholder="Search registrations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-96 px-6 py-3.5 text-[14px] font-bold text-[#2D3436] bg-[#F5F6FA] border-2 border-transparent rounded-[16px] outline-none transition-all duration-300 focus:bg-[#FFFFFF] focus:border-[#6C5CE7] focus:ring-4 focus:ring-[#6C5CE7]/10 placeholder-[#2D3436] placeholder-opacity-30 shadow-sm"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-3">
          {[
            { id: "all", label: "All", count: counts.all },
            { id: "college", label: "Colleges", count: counts.college },
            { id: "company", label: "Companies", count: counts.company },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              className={`px-6 py-3 rounded-[16px] text-[12px] font-black uppercase tracking-widest transition-all duration-300 cursor-pointer border-none shadow-sm hover:-translate-y-1 active:scale-95 ${
                filter === t.id
                  ? "bg-[#6C5CE7] text-[#FFFFFF] shadow-[#6C5CE7]/20 shadow-lg"
                  : "bg-[#F5F6FA] text-[#2D3436] hover:bg-[#FFFFFF] hover:shadow-md"
              }`}
            >
              {t.label}{" "}
              <span
                className={filter === t.id ? "opacity-70" : "text-[#6C5CE7]"}
              >
                ({t.count})
              </span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-[#F5F6FA] border-t-[#6C5CE7] rounded-full animate-spin"></div>
            <p className="text-[14px] font-black text-[#6C5CE7] tracking-widest uppercase animate-pulse">
              Syncing verification queue...
            </p>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="bg-[#F5F6FA] border-2 border-dashed border-[#6C5CE7]/20 rounded-[32px] p-16 text-center animate-in zoom-in duration-500">
            <p className="text-[15px] font-black text-[#2D3436] opacity-40 uppercase tracking-widest m-0">
              No pending requests found in this registry.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredList.map((item, idx) => (
              <div
                key={item._id}
                style={{ animationDelay: `${idx * 50}ms` }}
                className="bg-[#FFFFFF] border border-[#F5F6FA] rounded-[28px] p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(108,92,231,0.08)] hover:border-[#6C5CE7]/30 transition-all duration-500 flex flex-col md:flex-row md:justify-between md:items-center gap-6 transform hover:-translate-y-1 group animate-in slide-in-from-bottom-4"
              >
                <div className="flex flex-col gap-4 flex-1">
                  <div className="flex items-center gap-4 flex-wrap">
                    <span
                      className={`px-3 py-1.5 rounded-[12px] text-[10px] font-black uppercase tracking-widest border shadow-sm transition-all duration-300 ${
                        item.type === "college"
                          ? "bg-blue-50 text-blue-600 border-blue-100"
                          : "bg-emerald-50 text-emerald-600 border-emerald-100"
                      }`}
                    >
                      {item.type}
                    </span>
                    <h3 className="text-[20px] font-black text-[#2D3436] m-0 tracking-tight group-hover:text-[#6C5CE7] transition-colors duration-300">
                      {item.type === "college"
                        ? item.collegeName
                        : item.companyName}
                    </h3>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#F5F6FA] flex items-center justify-center text-[#6C5CE7] font-black text-[12px]">
                        {item.requesterName?.charAt(0)}
                      </div>
                      <span className="text-[14px] font-black text-[#2D3436]">
                        {item.requesterName}
                      </span>
                    </div>
                    <span className="text-[13px] font-bold text-[#2D3436] opacity-50 bg-[#F5F6FA] px-3 py-1 rounded-full">
                      {item.requesterEmail}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 md:border-l-2 border-[#F5F6FA] md:pl-8">
                  <button
                    onClick={() =>
                      navigate(`/admin/onboarding/${item.type}/${item._id}`)
                    }
                    className="flex-1 md:flex-none px-6 py-3 text-[11px] font-black uppercase tracking-widest bg-[#F5F6FA] border border-transparent text-[#2D3436] rounded-[14px] hover:bg-[#FFFFFF] hover:border-[#6C5CE7] hover:text-[#6C5CE7] hover:shadow-md transition-all duration-300 cursor-pointer outline-none active:scale-95"
                  >
                    Details
                  </button>

                  <button
                    onClick={() => approve(item._id, item.type)}
                    className="flex-1 md:flex-none px-8 py-3 text-[11px] font-black uppercase tracking-widest bg-[#6C5CE7] text-[#FFFFFF] border-none rounded-[14px] hover:shadow-[0_10px_25px_-5px_rgba(108,92,231,0.4)] hover:bg-opacity-90 transition-all duration-300 cursor-pointer outline-none active:scale-95 shadow-md"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => reject(item._id, item.type)}
                    className="flex-1 md:flex-none px-8 py-3 text-[11px] font-black uppercase tracking-widest bg-[#FFFFFF] border-2 border-[#cc0000] text-[#cc0000] rounded-[14px] hover:bg-[#cc0000] hover:text-[#FFFFFF] hover:shadow-lg transition-all duration-300 cursor-pointer outline-none active:scale-95"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Stats Footer */}
        <footer className="mt-8 flex justify-end">
          <div className="bg-[#F5F6FA] px-6 py-4 rounded-[20px] shadow-sm border border-transparent hover:border-[#6C5CE7]/20 transition-all duration-300">
            <p className="text-[11px] font-black text-[#2D3436] opacity-40 uppercase tracking-widest m-0">
              Verification Queue size:{" "}
              <span className="text-[#6C5CE7] opacity-100 text-[14px] ml-1">
                {filteredList.length}
              </span>
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
