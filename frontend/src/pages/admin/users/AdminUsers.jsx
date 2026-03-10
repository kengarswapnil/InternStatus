import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/api";

const ROLES = ["", "admin", "college", "faculty", "student", "company", "mentor"];
const STATUSES = ["", "active", "suspended", "deleted"];

const ROLE_COLORS = {
  admin: "bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30",
  college: "bg-violet-500/20 text-violet-300 border border-violet-500/30",
  faculty: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
  student: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
  company: "bg-rose-500/20 text-rose-300 border border-rose-500/30",
  mentor: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
};

const STATUS_COLORS = {
  active: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
  suspended: "bg-red-500/10 text-red-400 border border-red-500/20",
  deleted: "bg-white/5 text-white/40 border border-white/10 opacity-70",
};

function Badge({ value, map }) {
  const cls = map[value] || "bg-white/5 text-white/60 border border-white/10";
  return (
    <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest ${cls}`}>
      {value}
    </span>
  );
}

function Spinner({ size = 5 }) {
  return (
    <div className={`animate-spin h-${size} w-${size} rounded-full border-2 border-white/10 border-t-fuchsia-500`}></div>
  );
}

export default function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [filters, setFilters] = useState({
    search: "",
    role: "",
    status: "",
    isVerified: "",
    isRegistered: "",
    page: 1,
    limit: 20,
  });
  const [actionLoading, setActionLoading] = useState({});
  const [toast, setToast] = useState(null);
  const searchRef = useRef(null);
  const searchTimerRef = useRef(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchUsers = useCallback(async (currentFilters) => {
    setLoading(true);
    try {
      const params = {};
      Object.entries(currentFilters).forEach(([k, v]) => {
        if (v !== "") params[k] = v;
      });
      const { data } = await api.get("/admin/users", { params });
      setUsers(data.data.users);
      setPagination(data.data.pagination);
    } catch (err) {
      showToast("Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers(filters);
  }, [filters, fetchUsers]);

  const handleSearch = (e) => {
    const val = e.target.value;
    clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setFilters((f) => ({ ...f, search: val, page: 1 }));
    }, 400);
  };

  const handleFilter = (key, value) => {
    setFilters((f) => ({ ...f, [key]: value, page: 1 }));
  };

  const handleStatusChange = async (userId, newStatus) => {
    setActionLoading((prev) => ({ ...prev, [userId]: "status" }));
    try {
      await api.patch(`/admin/users/${userId}/status`, { accountStatus: newStatus });
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, accountStatus: newStatus } : u))
      );
      showToast(`User ${newStatus === "active" ? "activated" : "suspended"} successfully`);
    } catch {
      showToast("Failed to update status", "error");
    } finally {
      setActionLoading((prev) => ({ ...prev, [userId]: null }));
    }
  };

  const handleResendInvite = async (userId, email) => {
    setActionLoading((prev) => ({ ...prev, [userId]: "invite" }));
    try {
      await api.post(`/admin/users/${userId}/resend-invite`);
      showToast(`Invite sent to ${email}`);
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to send invite", "error");
    } finally {
      setActionLoading((prev) => ({ ...prev, [userId]: null }));
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] font-sans box-border text-white selection:bg-fuchsia-500/30 selection:text-fuchsia-200">
      
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-6 py-4 rounded-xl shadow-2xl text-[10px] font-bold tracking-widest uppercase border backdrop-blur-md transition-all
          ${toast.type === "error" ? "bg-red-500/20 text-red-300 border-red-500/30" : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"}`}>
          <span className="opacity-70 mr-1">{toast.type === "error" ? "Error:" : "Success:"}</span>
          {toast.message}
        </div>
      )}

      <div className="bg-white/5 backdrop-blur-xl border-b border-white/10 px-4 md:px-8 py-8 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-2 mb-8">
            <h1 className="text-3xl md:text-4xl font-black m-0 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
              User Management
            </h1>
            <p className="text-sm font-medium text-fuchsia-400 m-0 tracking-wide">
              {pagination.total.toLocaleString()} total users across all roles
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="relative w-full md:w-auto">
              <input
                ref={searchRef}
                type="text"
                placeholder="Search by email..."
                onChange={handleSearch}
                className="w-full md:w-64 px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none transition-all duration-300 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 placeholder:text-white/20"
              />
            </div>

            {[
              { key: "role", options: ROLES, label: "All Roles" },
              { key: "status", options: STATUSES, label: "All Statuses" },
            ].map(({ key, options, label }) => (
              <select
                key={key}
                value={filters[key]}
                onChange={(e) => handleFilter(key, e.target.value)}
                className="flex-1 md:flex-none px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none transition-all duration-300 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 capitalize cursor-pointer appearance-none [&>option]:bg-[#0B0F19]"
              >
                {options.map((o) => (
                  <option key={o} value={o}>{o === "" ? label : o}</option>
                ))}
              </select>
            ))}

            <select
              value={filters.isVerified}
              onChange={(e) => handleFilter("isVerified", e.target.value)}
              className="flex-1 md:flex-none px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none transition-all duration-300 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 cursor-pointer appearance-none [&>option]:bg-[#0B0F19]"
            >
              <option value="">Verified: All</option>
              <option value="true">Verified</option>
              <option value="false">Unverified</option>
            </select>

            <select
              value={filters.isRegistered}
              onChange={(e) => handleFilter("isRegistered", e.target.value)}
              className="flex-1 md:flex-none px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none transition-all duration-300 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 cursor-pointer appearance-none [&>option]:bg-[#0B0F19]"
            >
              <option value="">Registered: All</option>
              <option value="true">Registered</option>
              <option value="false">Pending Setup</option>
            </select>

            {Object.values(filters).some((v) => v !== "" && v !== 1 && v !== 20) && (
              <button
                onClick={() => {
                  setFilters({ search: "", role: "", status: "", isVerified: "", isRegistered: "", page: 1, limit: 20 });
                  if (searchRef.current) searchRef.current.value = "";
                }}
                className="px-5 py-4 text-[10px] font-bold text-fuchsia-400 uppercase tracking-widest bg-transparent border-none hover:text-fuchsia-300 cursor-pointer transition-colors outline-none"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] overflow-hidden box-border transition-all duration-300 hover:border-white/20">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 bg-[#0B0F19]/30 shadow-inner">
              <Spinner size={10} />
              <p className="text-fuchsia-400 font-medium tracking-widest uppercase text-xs animate-pulse m-0">Loading Users</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-24 bg-[#0B0F19]/30 shadow-inner">
              <p className="font-bold text-white/90 text-lg m-0">No users found</p>
              <p className="text-sm text-white/40 mt-2 mb-0 font-medium">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto bg-[#0B0F19]/30 shadow-inner">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    {["Email", "Role", "Status", "Verified", "Registered", "Created", "Actions"].map((h) => (
                      <th key={h} className="px-6 py-5 text-[10px] font-bold text-violet-400 uppercase tracking-widest border-b border-white/5">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-white/5 transition-colors duration-300 group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600/30 to-fuchsia-600/30 flex items-center justify-center text-white/90 font-bold text-base shrink-0 border border-white/10">
                            {user.email[0].toUpperCase()}
                          </div>
                          <span className="font-bold text-white/90 text-sm truncate max-w-xs group-hover:text-fuchsia-300 transition-colors">{user.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <Badge value={user.role} map={ROLE_COLORS} />
                      </td>
                      <td className="px-6 py-5">
                        <Badge value={user.accountStatus} map={STATUS_COLORS} />
                      </td>
                      <td className="px-6 py-5">
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${user.isVerified ? "text-emerald-400" : "text-white/30"}`}>
                          {user.isVerified ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${user.isRegistered ? "text-fuchsia-400" : "text-white/30"}`}>
                          {user.isRegistered ? "Complete" : "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-white/50 text-xs font-medium">
                        {new Date(user.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit", month: "short", year: "numeric"
                        })}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => navigate(`/admin/users/${user._id}`)}
                            className="px-4 py-2.5 text-[10px] font-bold text-white/80 uppercase tracking-widest bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all cursor-pointer outline-none hover:-translate-y-0.5"
                          >
                            View
                          </button>

                          {user.accountStatus !== "deleted" && (
                            <button
                              onClick={() =>
                                handleStatusChange(
                                  user._id,
                                  user.accountStatus === "active" ? "suspended" : "active"
                                )
                              }
                              disabled={actionLoading[user._id] === "status"}
                              className={`px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest border rounded-lg transition-all disabled:opacity-50 cursor-pointer min-w-[90px] flex items-center justify-center outline-none hover:-translate-y-0.5
                                ${user.accountStatus === "active"
                                  ? "bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
                                  : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20"
                                }`}
                            >
                              {actionLoading[user._id] === "status" ? (
                                <Spinner size={3} />
                              ) : user.accountStatus === "active" ? (
                                "Suspend"
                              ) : (
                                "Activate"
                              )}
                            </button>
                          )}

                          {!user.isRegistered && user.accountStatus !== "deleted" && (
                            <button
                              onClick={() => handleResendInvite(user._id, user.email)}
                              disabled={actionLoading[user._id] === "invite"}
                              className="px-4 py-2.5 text-[10px] font-bold text-white uppercase tracking-widest bg-gradient-to-r from-violet-600 to-fuchsia-600 border-none rounded-lg hover:shadow-[0_4px_15px_-3px_rgba(217,70,239,0.5)] transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center min-w-[80px] outline-none hover:-translate-y-0.5"
                            >
                              {actionLoading[user._id] === "invite" ? (
                                <Spinner size={3} />
                              ) : (
                                "Resend"
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {!loading && pagination.totalPages > 1 && (
          <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-5 bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-2xl">
            <p className="text-xs font-bold text-white/50 uppercase tracking-widest m-0 ml-2">
              Showing <span className="text-white">{(pagination.page - 1) * filters.limit + 1}–{Math.min(pagination.page * filters.limit, pagination.total)}</span> of <span className="text-fuchsia-400">{pagination.total.toLocaleString()}</span> users
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
                disabled={!pagination.hasPrev}
                className="px-4 py-2.5 text-[10px] font-bold text-white/80 uppercase tracking-widest bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all outline-none"
              >
                Prev
              </button>
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const p = Math.max(1, Math.min(pagination.page - 2, pagination.totalPages - 4)) + i;
                return (
                  <button
                    key={p}
                    onClick={() => setFilters((f) => ({ ...f, page: p }))}
                    className={`w-10 h-10 text-[11px] font-bold rounded-lg flex items-center justify-center cursor-pointer transition-all outline-none ${
                      p === pagination.page 
                        ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white border-none shadow-[0_4px_15px_-3px_rgba(217,70,239,0.5)]" 
                        : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
                disabled={!pagination.hasNext}
                className="px-4 py-2.5 text-[10px] font-bold text-white/80 uppercase tracking-widest bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all outline-none"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}