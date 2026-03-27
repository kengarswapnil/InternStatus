import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/api";

const ROLES = [
  "",
  "admin",
  "college",
  "faculty",
  "student",
  "company",
  "mentor",
];
const STATUSES = ["", "active", "suspended", "deleted"];

// Applied primary color logic to the role badges
const ROLE_COLORS = {
  admin: "bg-[#6C5CE7] text-[#FFFFFF] shadow-sm",
  college: "bg-[#F5F6FA] border border-transparent text-[#6C5CE7]",
  faculty: "bg-[#F5F6FA] border border-transparent text-[#6C5CE7]",
  student: "bg-[#F5F6FA] border border-transparent text-[#6C5CE7]",
  company: "bg-[#F5F6FA] border border-transparent text-[#6C5CE7]",
  mentor: "bg-[#F5F6FA] border border-transparent text-[#6C5CE7]",
};

const STATUS_COLORS = {
  active: "bg-emerald-50 border-emerald-200 text-emerald-600",
  suspended: "bg-rose-50 border-rose-200 text-rose-600",
  deleted: "bg-slate-100 border-slate-300 text-slate-500",
};

function Badge({ value, map }) {
  const cls =
    map[value] || "bg-[#F5F6FA] border border-transparent text-[#2D3436]";
  return (
    <span
      className={`inline-flex items-center px-3 py-1.5 rounded-[12px] text-[10px] font-black uppercase tracking-widest ${cls}`}
    >
      {value}
    </span>
  );
}

function Spinner({ size = 5 }) {
  return (
    <div
      className={`animate-spin h-${size} w-${size} rounded-full border-2 border-transparent border-t-[#6C5CE7]`}
    ></div>
  );
}

export default function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 1,
  });
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
      await api.patch(`/admin/users/${userId}/status`, {
        accountStatus: newStatus,
      });
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, accountStatus: newStatus } : u,
        ),
      );
      showToast(
        `User ${newStatus === "active" ? "activated" : "suspended"} successfully`,
      );
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
      showToast(
        err?.response?.data?.message || "Failed to send invite",
        "error",
      );
    } finally {
      setActionLoading((prev) => ({ ...prev, [userId]: null }));
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] font-['Nunito'] box-border text-[#2D3436] pb-10 transition-all duration-300">
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-[14px] shadow-lg text-[10px] font-black tracking-widest uppercase border transition-all animate-fade-in-down
          ${toast.type === "error" ? "bg-rose-50 text-rose-600 border-rose-200" : "bg-emerald-50 text-emerald-600 border-emerald-200"}`}
        >
          {toast.message}
        </div>
      )}

      {/* Compact Header & Filters */}
      <div className="bg-[#FFFFFF] border-b border-[#F5F6FA] px-4 md:px-6 py-6 sticky top-0 z-30 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-[26px] font-black m-0 tracking-tight text-[#6C5CE7]">
              User Management
            </h1>
            <p className="text-[13px] font-bold text-[#2D3436] opacity-60 m-0 uppercase tracking-widest">
              {pagination.total.toLocaleString()} total users across all roles
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <input
              ref={searchRef}
              type="text"
              placeholder="Search by email..."
              onChange={handleSearch}
              className="w-full md:w-64 px-5 py-3 text-[13px] font-bold text-[#2D3436] bg-[#F5F6FA] border border-transparent rounded-[14px] outline-none transition-all duration-300 focus:border-[#6C5CE7] focus:ring-1 focus:ring-[#6C5CE7] placeholder-[#2D3436] placeholder-opacity-40"
            />

            {[
              { key: "role", options: ROLES, label: "All Roles" },
              { key: "status", options: STATUSES, label: "All Statuses" },
            ].map(({ key, options, label }) => (
              <select
                key={key}
                value={filters[key]}
                onChange={(e) => handleFilter(key, e.target.value)}
                className="flex-1 md:flex-none px-5 py-3 text-[13px] font-bold text-[#2D3436] bg-[#F5F6FA] border border-transparent rounded-[14px] outline-none transition-all duration-300 focus:border-[#6C5CE7] focus:ring-1 focus:ring-[#6C5CE7] capitalize cursor-pointer appearance-none"
              >
                {options.map((o) => (
                  <option key={o} value={o}>
                    {o === "" ? label : o}
                  </option>
                ))}
              </select>
            ))}

            <select
              value={filters.isVerified}
              onChange={(e) => handleFilter("isVerified", e.target.value)}
              className="flex-1 md:flex-none px-5 py-3 text-[13px] font-bold text-[#2D3436] bg-[#F5F6FA] border border-transparent rounded-[14px] outline-none transition-all duration-300 focus:border-[#6C5CE7] focus:ring-1 focus:ring-[#6C5CE7] cursor-pointer appearance-none"
            >
              <option value="">Verified: All</option>
              <option value="true">Verified</option>
              <option value="false">Unverified</option>
            </select>

            <select
              value={filters.isRegistered}
              onChange={(e) => handleFilter("isRegistered", e.target.value)}
              className="flex-1 md:flex-none px-5 py-3 text-[13px] font-bold text-[#2D3436] bg-[#F5F6FA] border border-transparent rounded-[14px] outline-none transition-all duration-300 focus:border-[#6C5CE7] focus:ring-1 focus:ring-[#6C5CE7] cursor-pointer appearance-none"
            >
              <option value="">Registered: All</option>
              <option value="true">Registered</option>
              <option value="false">Pending Setup</option>
            </select>

            {Object.values(filters).some(
              (v) => v !== "" && v !== 1 && v !== 20,
            ) && (
              <button
                onClick={() => {
                  setFilters({
                    search: "",
                    role: "",
                    status: "",
                    isVerified: "",
                    isRegistered: "",
                    page: 1,
                    limit: 20,
                  });
                  if (searchRef.current) searchRef.current.value = "";
                }}
                className="px-4 py-3 text-[11px] font-black text-[#2D3436] opacity-60 uppercase tracking-widest bg-transparent border-none hover:opacity-100 hover:text-[#6C5CE7] cursor-pointer transition-all outline-none"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="bg-[#FFFFFF] border border-[#F5F6FA] rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(108,92,231,0.08)] overflow-hidden box-border transition-shadow duration-500 animate-fade-in-up">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Spinner size={10} />
              <p className="text-[#6C5CE7] font-black uppercase tracking-widest text-[10px] animate-pulse m-0">
                Loading Users...
              </p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-black text-[#2D3436] opacity-60 text-[13px] uppercase tracking-widest m-0">
                No users found
              </p>
              <p className="text-[12px] text-[#2D3436] opacity-40 mt-2 mb-0 font-bold">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead className="bg-[#F5F6FA] border-b border-[#E5E5E5]">
                  <tr>
                    {[
                      "Email",
                      "Role",
                      "Status",
                      "Verified",
                      "Registered",
                      "Created",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-6 py-5 text-[10px] font-black text-[#6C5CE7] uppercase tracking-widest"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5F6FA]">
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-[#F5F6FA] transition-colors duration-300 group cursor-default"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-[14px] bg-[#FFFFFF] border border-[#F5F6FA] flex items-center justify-center text-[#6C5CE7] font-black text-[14px] shrink-0 shadow-sm transition-all duration-300 group-hover:border-[#6C5CE7]">
                            {user.email[0].toUpperCase()}
                          </div>
                          <span className="font-black text-[#2D3436] text-[13px] truncate max-w-[180px] group-hover:text-[#6C5CE7] transition-colors">
                            {user.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <Badge value={user.role} map={ROLE_COLORS} />
                      </td>
                      <td className="px-6 py-5">
                        <Badge value={user.accountStatus} map={STATUS_COLORS} />
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`text-[10px] font-black uppercase tracking-widest ${user.isVerified ? "text-[#6C5CE7]" : "text-[#2D3436] opacity-40"}`}
                        >
                          {user.isVerified ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`text-[10px] font-black uppercase tracking-widest ${user.isRegistered ? "text-emerald-600" : "text-[#2D3436] opacity-40"}`}
                        >
                          {user.isRegistered ? "Complete" : "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-[#2D3436] opacity-60 text-[12px] font-bold">
                        {new Date(user.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/admin/users/${user._id}`)}
                            className="px-4 py-2 text-[10px] font-black text-[#2D3436] uppercase tracking-widest bg-[#FFFFFF] border border-[#F5F6FA] rounded-[12px] hover:border-[#6C5CE7] hover:text-[#6C5CE7] transition-all duration-300 cursor-pointer outline-none shadow-sm transform hover:-translate-y-0.5"
                          >
                            View
                          </button>

                          {user.accountStatus !== "deleted" && (
                            <button
                              onClick={() =>
                                handleStatusChange(
                                  user._id,
                                  user.accountStatus === "active"
                                    ? "suspended"
                                    : "active",
                                )
                              }
                              disabled={actionLoading[user._id] === "status"}
                              className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-[12px] transition-all duration-300 disabled:opacity-50 disabled:transform-none cursor-pointer min-w-[80px] flex items-center justify-center outline-none shadow-sm transform hover:-translate-y-0.5
                                ${
                                  user.accountStatus === "active"
                                    ? "bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100"
                                    : "bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100"
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

                          {!user.isRegistered &&
                            user.accountStatus !== "deleted" && (
                              <button
                                onClick={() =>
                                  handleResendInvite(user._id, user.email)
                                }
                                disabled={actionLoading[user._id] === "invite"}
                                className="px-4 py-2 text-[10px] font-black text-[#2D3436] uppercase tracking-widest bg-[#FFFFFF] border border-[#F5F6FA] rounded-[12px] hover:border-[#6C5CE7] hover:text-[#6C5CE7] transition-all duration-300 disabled:opacity-50 disabled:transform-none cursor-pointer flex items-center justify-center min-w-[80px] outline-none shadow-sm transform hover:-translate-y-0.5"
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

        {/* Compact Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-in-up">
            <p className="text-[12px] font-bold text-[#2D3436] opacity-60 m-0 uppercase tracking-widest">
              Showing{" "}
              <span className="text-[#6C5CE7] font-black opacity-100">
                {(pagination.page - 1) * filters.limit + 1}–
                {Math.min(pagination.page * filters.limit, pagination.total)}
              </span>{" "}
              of{" "}
              <span className="text-[#6C5CE7] font-black opacity-100">
                {pagination.total.toLocaleString()}
              </span>
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
                disabled={!pagination.hasPrev}
                className="px-4 py-2 text-[10px] font-black text-[#2D3436] uppercase tracking-widest bg-[#FFFFFF] border border-[#F5F6FA] rounded-[12px] hover:border-[#6C5CE7] hover:text-[#6C5CE7] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all duration-300 outline-none shadow-sm"
              >
                Prev
              </button>
              {Array.from(
                { length: Math.min(5, pagination.totalPages) },
                (_, i) => {
                  const p =
                    Math.max(
                      1,
                      Math.min(pagination.page - 2, pagination.totalPages - 4),
                    ) + i;
                  return (
                    <button
                      key={p}
                      onClick={() => setFilters((f) => ({ ...f, page: p }))}
                      className={`w-9 h-9 text-[11px] font-black rounded-[12px] flex items-center justify-center cursor-pointer transition-all duration-300 outline-none shadow-sm ${
                        p === pagination.page
                          ? "bg-[#6C5CE7] text-[#FFFFFF] border-none transform -translate-y-0.5"
                          : "bg-[#FFFFFF] border border-[#F5F6FA] text-[#2D3436] hover:border-[#6C5CE7] hover:text-[#6C5CE7]"
                      }`}
                    >
                      {p}
                    </button>
                  );
                },
              )}
              <button
                onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
                disabled={!pagination.hasNext}
                className="px-4 py-2 text-[10px] font-black text-[#2D3436] uppercase tracking-widest bg-[#FFFFFF] border border-[#F5F6FA] rounded-[12px] hover:border-[#6C5CE7] hover:text-[#6C5CE7] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all duration-300 outline-none shadow-sm"
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
