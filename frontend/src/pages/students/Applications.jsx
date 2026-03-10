import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils/constants";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchApplications = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/application/student/applied`,
        { withCredentials: true }
      );

      setApplications(res.data?.data || []);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to load applications"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "applied":
        return "bg-white/10 text-white/90 border border-white/20";
      case "shortlisted":
        return "bg-violet-500/20 text-violet-300 border border-violet-500/30";
      case "interview":
        return "bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30";
      case "accepted":
        return "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]";
      case "rejected":
        return "bg-red-500/10 text-red-400 border border-red-500/20 opacity-80";
      default:
        return "bg-white/5 text-white/50 border border-white/10";
    }
  };

  const renderStipend = (internship) => {
    if (!internship) return "N/A";
    if (internship.stipendType === "paid") {
      return `₹${internship.stipendAmount}`;
    }
    if (internship.stipendType === "unpaid") {
      return "Unpaid";
    }
    return "Not Disclosed";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0B0F19]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-white/10 border-t-fuchsia-500 rounded-full animate-spin"></div>
          <p className="text-fuchsia-400 font-medium tracking-widest uppercase text-sm animate-pulse">
            Loading Applications
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0F19] p-4 font-sans">
        <div className="w-full max-w-md px-5 py-4 text-sm font-bold text-white bg-red-500/10 border border-red-500/20 rounded-xl backdrop-blur-md text-center">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] p-4 md:p-8 font-sans text-white selection:bg-fuchsia-500/30 selection:text-fuchsia-200">
      <div className="max-w-7xl mx-auto bg-white/5 backdrop-blur-xl rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] border border-white/10 p-6 md:p-8 transition-all duration-300 hover:border-white/20">

        <div className="mb-8 border-b border-white/10 pb-6">
          <h1 className="text-3xl font-black m-0 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 mb-2">
            My Internship Applications
          </h1>
          <p className="text-white/40 text-sm font-medium m-0">
            Track your application progress and status updates
          </p>
        </div>

        {applications.length === 0 ? (
          <div className="bg-[#0B0F19]/50 border border-white/10 rounded-2xl p-12 text-center">
            <p className="text-white/40 m-0 text-base font-medium">
              You haven't applied to any internships yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0B0F19]/30 shadow-inner">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-5 text-xs font-bold text-fuchsia-400 uppercase tracking-wider">Internship</th>
                  <th className="px-6 py-5 text-xs font-bold text-fuchsia-400 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-5 text-xs font-bold text-fuchsia-400 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-5 text-xs font-bold text-fuchsia-400 uppercase tracking-wider">Mode</th>
                  <th className="px-6 py-5 text-xs font-bold text-fuchsia-400 uppercase tracking-wider">Stipend</th>
                  <th className="px-6 py-5 text-xs font-bold text-fuchsia-400 uppercase tracking-wider">Applied On</th>
                  <th className="px-6 py-5 text-xs font-bold text-fuchsia-400 uppercase tracking-wider">Mentor</th>
                  <th className="px-6 py-5 text-xs font-bold text-fuchsia-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5">
                {applications.map((app) => (
                  <tr
                    key={app._id}
                    className="hover:bg-white/5 transition-colors duration-300 group"
                  >
                    <td className="px-6 py-5 text-sm font-bold text-white/90 group-hover:text-fuchsia-300 transition-colors">
                      {app?.internship?.title || "N/A"}
                    </td>

                    <td className="px-6 py-5 text-sm font-medium text-white/80">
                      {app?.internship?.company?.companyName || "N/A"}
                    </td>

                    <td className="px-6 py-5 text-sm text-violet-400">
                      {app?.internship?.location || "N/A"}
                    </td>

                    <td className="px-6 py-5 capitalize text-sm text-white/70">
                      {app?.internship?.mode || "N/A"}
                    </td>

                    <td className="px-6 py-5 text-sm font-bold text-white/90">
                      <span className="bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                        {renderStipend(app?.internship)}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-sm text-white/50">
                      {new Date(app.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>

                    <td className="px-6 py-5 text-xs text-white/40 italic">
                      {app?.mentor?.email || "Not Assigned"}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`inline-block px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 ${getStatusColor(
                          app.status
                        )}`}
                      >
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Applications;