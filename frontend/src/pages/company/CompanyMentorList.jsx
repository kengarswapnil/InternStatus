import React, { useEffect, useState } from "react";
import API from "../../api/api";

export default function CompanyMentorList() {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editForm, setEditForm] = useState({
    designation: "",
    department: "",
    employeeId: "",
  });
  const [saving, setSaving] = useState(false);
  const [removingId, setRemovingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      const res = await API.get("/company/mentors");
      setMentors(res.data.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load mentors");
    } finally {
      setLoading(false);
    }
  };

  const filteredMentors = mentors.filter(m => 
    m.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.employeeId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openEdit = (m) => {
    setError("");
    setSuccess("");
    setSelected(m);
    setEditForm({
      designation: m.designation || "",
      department: m.department || "",
      employeeId: m.employeeId || "",
    });
  };

  const closeEdit = () => {
    setSelected(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!selected) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await API.patch(`/company/mentors/${selected._id}`, editForm);
      setSuccess("Mentor updated successfully");
      await fetchMentors();
      setTimeout(() => closeEdit(), 1000);
    } catch (err) {
      console.error(err);
      setError("Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (mentorId) => {
    const confirm = window.confirm("Remove this mentor from company?");
    if (!confirm) return;
    setRemovingId(mentorId);
    try {
      await API.delete(`/company/mentors/${mentorId}`);
      setMentors((prev) => prev.filter((m) => m._id !== mentorId));
    } catch (err) {
      console.error(err);
      alert("Remove failed");
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center font-['Nunito']">
        <div className="w-8 h-8 border-4 border-[#F5F6FA] border-t-[#6C5CE7] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#2D3436] font-['Nunito'] pb-12">
      <main className="max-w-7xl mx-auto w-full px-4 md:px-8 py-8 flex flex-col gap-6 animate-in fade-in duration-700">
        
        {/* Header & Search */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-[#F5F6FA] pb-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-[26px] font-black text-[#2D3436] tracking-tight">Company Mentors</h1>
            <p className="text-[14px] font-medium text-[#2D3436] opacity-50">Manage your organizational roster</p>
          </div>

          <div className="relative w-full lg:w-80">
            <input 
              type="text"
              placeholder="Search mentors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#F5F6FA] border-2 border-transparent rounded-xl text-[14px] focus:border-[#6C5CE7]/30 focus:bg-white outline-none transition-all shadow-sm"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2D3436] opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </header>

        {/* Table Content */}
        <div className="bg-white border border-[#F5F6FA] rounded-[24px] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F5F6FA]/50">
                  <th className="px-6 py-4 text-[11px] font-black text-[#2D3436] opacity-40 uppercase tracking-widest">Mentor</th>
                  <th className="px-6 py-4 text-[11px] font-black text-[#2D3436] opacity-40 uppercase tracking-widest">Department</th>
                  <th className="px-6 py-4 text-[11px] font-black text-[#2D3436] opacity-40 uppercase tracking-widest text-center">ID</th>
                  <th className="px-6 py-4 text-[11px] font-black text-[#2D3436] opacity-40 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F6FA]">
                {filteredMentors.map((m) => (
                  <tr key={m._id} className="hover:bg-[#F5F6FA]/20 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#6C5CE7]/10 flex items-center justify-center text-[#6C5CE7] font-black text-[13px]">
                          {m.fullName?.charAt(0)}
                        </div>
                        <div>
                          <div className="text-[14px] font-bold text-[#2D3436]">{m.fullName}</div>
                          <div className="text-[11px] font-bold text-[#6C5CE7] opacity-70 uppercase">{m.designation || "Mentor"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[13px] font-medium text-[#2D3436] opacity-70">{m.department || "—"}</span>
                    </td>
                    <td className="px-6 py-4 text-[12px] font-mono font-bold text-[#2D3436] opacity-30 text-center">
                      {m.employeeId || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => openEdit(m)}
                          className="px-4 py-2 text-[11px] font-black text-white bg-[#6C5CE7] rounded-lg shadow-sm shadow-[#6C5CE7]/20 hover:opacity-90 active:scale-95 transition-all uppercase tracking-widest"
                        >
                          View
                        </button>
                        <button
                          disabled={removingId === m._id}
                          onClick={() => handleRemove(m._id)}
                          className="px-4 py-2 text-[11px] font-black text-[#ff7675] bg-[#ff7675]/10 border border-[#ff7675]/20 rounded-lg hover:bg-[#ff7675] hover:text-white active:scale-95 transition-all uppercase tracking-widest disabled:opacity-30"
                        >
                          {removingId === m._id ? "..." : "Remove"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* View/Edit Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D3436]/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-white rounded-[28px] shadow-2xl p-8 flex flex-col gap-6 animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between border-b border-[#F5F6FA] pb-4">
              <h3 className="text-[18px] font-black text-[#2D3436] tracking-tight">Mentor Profile</h3>
              <button onClick={closeEdit} className="text-[#2D3436] opacity-30 hover:opacity-100 transition-opacity">✕</button>
            </div>

            <div className="flex flex-col gap-4">
              {error && <div className="p-3 bg-red-50 text-red-500 rounded-xl text-[12px] font-bold border border-red-100">{error}</div>}
              {success && <div className="p-3 bg-green-50 text-green-500 rounded-xl text-[12px] font-bold border border-green-100">{success}</div>}

              <div className="grid gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-black text-[#2D3436] opacity-30 uppercase tracking-widest px-1">Department</label>
                  <input name="department" value={editForm.department} onChange={handleChange} className="w-full px-4 py-3 bg-[#F5F6FA] border-2 border-transparent rounded-xl text-[14px] text-[#2D3436] focus:border-[#6C5CE7] focus:bg-white outline-none transition-all" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-black text-[#2D3436] opacity-30 uppercase tracking-widest px-1">Designation</label>
                  <input name="designation" value={editForm.designation} onChange={handleChange} className="w-full px-4 py-3 bg-[#F5F6FA] border-2 border-transparent rounded-xl text-[14px] text-[#2D3436] focus:border-[#6C5CE7] focus:bg-white outline-none transition-all" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-black text-[#2D3436] opacity-30 uppercase tracking-widest px-1">Employee ID</label>
                  <input name="employeeId" value={editForm.employeeId} onChange={handleChange} className="w-full px-4 py-3 bg-[#F5F6FA] border-2 border-transparent rounded-xl text-[14px] font-mono text-[#2D3436] focus:border-[#6C5CE7] focus:bg-white outline-none transition-all" />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button onClick={closeEdit} className="flex-1 py-3 text-[12px] font-black text-[#2D3436] bg-[#F5F6FA] rounded-xl hover:bg-[#2D3436]/5 transition-all uppercase tracking-widest">Cancel</button>
              <button onClick={handleUpdate} disabled={saving} className="flex-[2] py-3 text-[12px] font-black text-white bg-[#6C5CE7] rounded-xl shadow-lg shadow-[#6C5CE7]/20 hover:opacity-90 active:scale-95 transition-all uppercase tracking-widest">
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}