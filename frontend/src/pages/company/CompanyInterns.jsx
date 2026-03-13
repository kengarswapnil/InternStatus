import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { useNavigate } from "react-router-dom";

export default function CompanyInterns() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchInterns = async () => {
    try {
      const res = await API.get("/company/interns");
      setData(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterns();
  }, []);

  const getStatusBadge = (status) => {
    let colorClass = "bg-white/10 text-white/80 border-white/20";

    if (status === "ongoing")
      colorClass = "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30";

    else if (status === "completed")
      colorClass = "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";

    else if (status === "terminated")
      colorClass = "bg-red-500/10 text-red-400 border-red-500/20";

    else if (status === "offer_accepted")
      colorClass = "bg-violet-500/20 text-violet-300 border-violet-500/30";

    return (
      <span
        className={`inline-block px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${colorClass}`}
      >
        {status.replace("_", " ")}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0B0F19]">
        <div className="w-10 h-10 border-4 border-white/10 border-t-fuchsia-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] p-8 text-white">
      <div className="max-w-5xl mx-auto flex flex-col gap-6">

        <header className="border-b border-white/10 pb-6">
          <h2 className="text-3xl font-bold">Company Interns</h2>
          <p className="text-white/40 text-sm">
            Monitor all interns currently associated with your internships
          </p>
        </header>

        {data.length === 0 ? (
          <div className="text-center text-white/40 py-20">
            No interns found
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {data.map((item) => (
              <div
                key={item._id}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-5"
              >

                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-semibold">
                      {item.student?.fullName}
                    </h3>
                    <p className="text-white/50 text-sm">
                      {item.internship?.title}
                    </p>
                  </div>

                  {getStatusBadge(item.status)}
                </div>

                <div className="grid md:grid-cols-2 gap-4">

                  <div className="text-sm text-white/70">
                    <span className="block text-white/40 text-xs uppercase tracking-wider">
                      Mentor
                    </span>
                    {item.mentor?.fullName || "Not Assigned"}
                  </div>

                  <div className="text-sm text-white/70">
                    <span className="block text-white/40 text-xs uppercase tracking-wider">
                      Internship Mode
                    </span>
                    {item.internship?.mode || "N/A"}
                  </div>

                  <div className="text-sm text-white/70">
                    <span className="block text-white/40 text-xs uppercase tracking-wider">
                      Start Date
                    </span>
                    {item.internshipStartDate
                      ? new Date(item.internshipStartDate).toLocaleDateString()
                      : "-"}
                  </div>

                  <div className="text-sm text-white/70">
                    <span className="block text-white/40 text-xs uppercase tracking-wider">
                      End Date
                    </span>
                    {item.internshipEndDate
                      ? new Date(item.internshipEndDate).toLocaleDateString()
                      : "Ongoing"}
                  </div>

                </div>

                <div className="flex justify-end pt-4 border-t border-white/10">
                  <button
                    onClick={() => navigate(`/company/intern/${item._id}`)}
                    className="px-5 py-2 text-xs uppercase tracking-widest border border-white/10 rounded-lg hover:bg-white/10 transition"
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