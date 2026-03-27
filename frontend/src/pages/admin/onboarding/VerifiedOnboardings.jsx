import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../api/api";

export default function VerifiedOnboardings() {
  const navigate = useNavigate();
  const controllerRef = useRef(null);

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [list, setList] = useState([]);
  const [counts, setCounts] = useState({ all: 0, college: 0, company: 0 });

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const [loading, setLoading] = useState(true);

  /* ---------------- DEBOUNCE ---------------- */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  /* ---------------- FETCH ---------------- */
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      if (controllerRef.current) {
        controllerRef.current.abort();
      }

      const controller = new AbortController();
      controllerRef.current = controller;

      const res = await API.get(`/admin/onboarding/verified`, {
        params: {
          type: filter,
          search: debouncedSearch,
          page,
          limit,
          sortField,
          sortOrder,
        },
        signal: controller.signal,
      });

      const data = res.data?.data?.data || [];
setList(Array.isArray(data) ? data : []);
      
      setCounts(res.data?.data?.counts || { all: 0, college: 0, company: 0 });
setTotalPages(res.data?.data?.pagination?.totalPages || 1);

    } catch (err) {
      if (err.name !== "CanceledError") {
        console.error("Fetch Error:", err);
      }
    } finally {
      setLoading(false);
    }
  }, [filter, debouncedSearch, page, limit, sortField, sortOrder]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* ---------------- SORT ---------------- */
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-[#6C5CE7] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#2D3436] pb-10">
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col gap-8">

        <h1 className="text-3xl font-black">Verified Onboardings</h1>

        {/* SEARCH + FILTER */}
        <div className="bg-[#F5F6FA] p-6 rounded-2xl flex flex-col lg:flex-row gap-4 justify-between">

          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-5 py-3 rounded-xl w-full lg:max-w-md"
          />

          <div className="flex gap-2">
            {["all", "college", "company"].map((t) => (
              <button
                key={t}
                onClick={() => {
                  setFilter(t);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-bold ${
                  filter === t
                    ? "bg-[#6C5CE7] text-white"
                    : "bg-white opacity-60"
                }`}
              >
                {t} ({counts[t] || 0})
              </button>
            ))}
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto border rounded-2xl">
          <table className="w-full text-left">

            <thead className="bg-[#F5F6FA] text-xs uppercase">
              <tr>
                <th className="p-4 cursor-pointer" onClick={() => handleSort("type")}>Type</th>
                <th className="p-4 cursor-pointer" onClick={() => handleSort("name")}>Name</th>
                <th className="p-4 cursor-pointer" onClick={() => handleSort("requesterName")}>Requester</th>
                <th className="p-4">Email</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {list.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center opacity-50">
                    No data found
                  </td>
                </tr>
              ) : (
                list.map((item) => (
                  <tr key={item._id || Math.random()} className="border-t hover:bg-gray-50">

                    <td className="p-4 capitalize">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        item.type === "college"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-green-100 text-green-600"
                      }`}>
                        {item.type || "N/A"}
                      </span>
                    </td>

                    <td className="p-4 font-bold">
                      {item.name || item.collegeName || item.companyName || "N/A"}
                    </td>

                    <td className="p-4">
                      {item.requesterName || "N/A"}
                    </td>

                    <td className="p-4 text-[#6C5CE7] text-sm">
                      {item.requesterEmail || "N/A"}
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() =>
                          navigate(`/admin/onboarding/${item.type}/${item._id}`)
                        }
                        className="px-4 py-2 bg-[#6C5CE7] text-white rounded-lg text-xs font-bold"
                      >
                        View
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex justify-between items-center">

          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-40"
          >
            Prev
          </button>

          <span className="text-sm font-bold">
            Page {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-40"
          >
            Next
          </button>

        </div>

      </main>
    </div>
  );
}