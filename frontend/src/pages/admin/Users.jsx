import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import AdminNavBar from "../../components/navbars/AdminNavBar";
import { BASE_URL } from "../../utils/constants";

const roleBadge = {
  student: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
  faculty: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
  company: "bg-rose-500/20 text-rose-300 border border-rose-500/30",
  admin: "bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30",
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/admin/users`, {
          withCredentials: true,
        });
        setUsers(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase().trim();

    return users.filter((u) => {
      const userRole = u.role?.toLowerCase().trim();

      const searchableText = `
        ${u.email}
        ${u.role}
        ${u.roleStatus}
        ${u.isVerified ? "verified" : "not verified"}
      `.toLowerCase();

      const matchSearch = searchableText.includes(q);

      const matchRole = roleFilter === "all" || userRole === roleFilter;

      return matchSearch && matchRole;
    });
  }, [users, search, roleFilter]);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#0B0F19] font-sans flex flex-col box-border selection:bg-fuchsia-500/30 selection:text-fuchsia-200">
        <AdminNavBar />
        <main className="w-full flex-grow flex flex-col items-center justify-center px-4">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-white/10 border-t-fuchsia-500 rounded-full animate-spin"></div>
            <p className="text-fuchsia-400 font-bold tracking-widest uppercase text-[10px] animate-pulse m-0">
              Loading Users
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-[#0B0F19] font-sans flex flex-col box-border selection:bg-fuchsia-500/30 selection:text-fuchsia-200">
        <AdminNavBar />
        <main className="w-full max-w-7xl mx-auto flex-grow px-4 md:px-8 py-10 flex items-center justify-center">
          <div className="px-6 py-4 text-[11px] font-bold text-red-300 bg-red-500/10 border border-red-500/30 rounded-xl uppercase tracking-widest">
            {error}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#0B0F19] font-sans flex flex-col box-border text-white selection:bg-fuchsia-500/30 selection:text-fuchsia-200 relative overflow-hidden">
      {/* Ambient Backgrounds */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <AdminNavBar />

        <main className="w-full max-w-7xl mx-auto flex-grow px-4 md:px-8 py-10 md:py-16 max-w-[100vw]">
          <div className="mb-10 border-b border-white/10 pb-6">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 mb-3 mt-0">
              User Management
            </h1>
            <p className="text-white/40 font-medium text-sm md:text-base m-0 tracking-wide">
              View, filter, and manage all platform accounts
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 mb-10 flex flex-col md:flex-row gap-5 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] transition-all hover:border-white/20 w-full box-border">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by email, role, status..."
              className="w-full md:flex-1 px-5 py-4 rounded-xl border border-white/10 bg-[#0B0F19]/50 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-300 text-sm text-white placeholder:text-white/20 box-border outline-none"
            />

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full md:w-64 px-5 py-4 rounded-xl border border-white/10 bg-[#0B0F19]/50 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-300 text-sm text-white outline-none cursor-pointer appearance-none box-border [&>option]:bg-[#0B0F19]"
            >
              <option value="all">All Roles</option>
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="company">Company</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="bg-[#0B0F19]/50 border border-white/10 rounded-3xl p-16 text-center shadow-inner mt-8">
              <p className="text-white/40 m-0 text-base font-medium">
                No users found matching your criteria.
              </p>
            </div>
          ) : (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] overflow-hidden box-border transition-all duration-300 hover:border-white/20 w-full max-w-full">
              {/* Fix for overflow: added max-w-full and w-full, ensuring inner div scrolls properly */}
              <div className="overflow-x-auto bg-[#0B0F19]/30 shadow-inner w-full no-scrollbar">
                <table className="w-full text-left border-collapse whitespace-nowrap min-w-max">
                  <thead className="bg-white/5 border-b border-white/10">
                    <tr>
                      <th className="px-6 py-5 text-[10px] font-bold text-violet-400 uppercase tracking-widest">
                        Email
                      </th>
                      <th className="px-6 py-5 text-[10px] font-bold text-violet-400 uppercase tracking-widest">
                        Role
                      </th>
                      <th className="px-6 py-5 text-[10px] font-bold text-violet-400 uppercase tracking-widest">
                        Verified
                      </th>
                      <th className="px-6 py-5 text-[10px] font-bold text-violet-400 uppercase tracking-widest">
                        Status
                      </th>
                      <th className="px-6 py-5 text-[10px] font-bold text-violet-400 uppercase tracking-widest">
                        Joined
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-white/5">
                    {filteredUsers.map((u) => (
                      <tr
                        key={u._id}
                        className="hover:bg-white/5 transition-colors duration-300 group"
                      >
                        <td className="px-6 py-5">
                          {/* Truncate long emails to prevent layout blowing out */}
                          <div 
                            className="font-bold text-white/90 text-sm truncate max-w-[200px] md:max-w-xs lg:max-w-sm group-hover:text-fuchsia-300 transition-colors"
                            title={u.email}
                          >
                            {u.email}
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`inline-block px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest ${
                              roleBadge[u.role] ||
                              "bg-white/5 border border-white/10 text-white/60"
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          {u.isVerified ? (
                            <span className="inline-block px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              Verified
                            </span>
                          ) : (
                            <span className="inline-block px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-amber-500/10 border border-amber-500/30 text-amber-400">
                              Pending
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-5 font-bold capitalize text-xs tracking-wide">
                           <span className={u.roleStatus === 'active' ? 'text-emerald-400' : 'text-white/60'}>
                             {u.roleStatus || "—"}
                           </span>
                        </td>

                        <td className="px-6 py-5 text-white/50 text-xs font-medium tracking-wide">
                          {new Date(u.createdAt).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
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

export default Users;