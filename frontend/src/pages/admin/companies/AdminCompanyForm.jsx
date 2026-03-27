import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../../api/api";
import AdminNavBar from "../../../components/navbars/AdminNavBar";

export default function AdminCompanyForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    website: "",
    emailDomain: "",
    industry: "",
    companySize: "",
    description: "",
    locations: [],
  });

  const fetchCompany = async () => {
    try {
      const res = await API.get(`/admin/companies/${id}`);
      setForm(res.data?.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load company");
    }
  };

  useEffect(() => {
    if (isEdit) fetchCompany();
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const addLocation = () => {
    setForm({
      ...form,
      locations: [...form.locations, { city: "", state: "", country: "" }],
    });
  };

  const updateLocation = (index, field, value) => {
    const updated = [...form.locations];
    updated[index][field] = value;
    setForm({
      ...form,
      locations: updated,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (isEdit) {
        await API.put(`/admin/companies/${id}`, form);
      } else {
        await API.post(`/admin/companies`, form);
      }
      navigate("/admin/companies");
    } catch (err) {
      console.error(err);
      alert("Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#2D3436] flex flex-col font-['Nunito'] selection:bg-[#6C5CE7]/20 selection:text-[#6C5CE7] transition-all duration-300">
      <main className="max-w-4xl mx-auto w-full p-4 md:p-10 flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="bg-[#FFFFFF] border border-[#F5F6FA] p-6 md:p-10 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-all duration-500">
          <header className="mb-10 border-b border-[#F5F6FA] pb-6">
            <h2 className="text-3xl font-black m-0 tracking-tighter text-[#6C5CE7] uppercase">
              {isEdit ? "Edit Company Profile" : "Add New Company"}
            </h2>
            <p className="text-[12px] font-black text-[#2D3436] opacity-40 uppercase tracking-[0.2em] mt-2">
              Update institutional partnership details
            </p>
          </header>

          <form onSubmit={handleSubmit} className="flex flex-col gap-10">
            <div className="flex flex-col gap-6">
              <h3 className="text-[11px] font-black text-[#6C5CE7] m-0 uppercase tracking-widest border-l-4 border-[#6C5CE7] pl-4">
                Basic Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-[12px] font-black text-[#2D3436] opacity-60 uppercase tracking-wider px-1">
                    Company Name
                  </label>
                  <input
                    name="name"
                    placeholder="e.g. Acme Corporation"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full px-5 py-4 text-[14px] font-bold text-[#2D3436] bg-[#F5F6FA] border border-transparent rounded-[16px] outline-none transition-all duration-300 focus:border-[#6C5CE7] focus:ring-1 focus:ring-[#6C5CE7] placeholder-[#2D3436] placeholder-opacity-30"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[12px] font-black text-[#2D3436] opacity-60 uppercase tracking-wider px-1">
                    Industry
                  </label>
                  <input
                    name="industry"
                    placeholder="e.g. Software, Finance"
                    value={form.industry || ""}
                    onChange={handleChange}
                    className="w-full px-5 py-4 text-[14px] font-bold text-[#2D3436] bg-[#F5F6FA] border border-transparent rounded-[16px] outline-none transition-all duration-300 focus:border-[#6C5CE7] focus:ring-1 focus:ring-[#6C5CE7] placeholder-[#2D3436] placeholder-opacity-30"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[12px] font-black text-[#2D3436] opacity-60 uppercase tracking-wider px-1">
                    Company Size
                  </label>
                  <input
                    name="companySize"
                    placeholder="e.g. 50-200, 1000+"
                    value={form.companySize || ""}
                    onChange={handleChange}
                    className="w-full px-5 py-4 text-[14px] font-bold text-[#2D3436] bg-[#F5F6FA] border border-transparent rounded-[16px] outline-none transition-all duration-300 focus:border-[#6C5CE7] focus:ring-1 focus:ring-[#6C5CE7] placeholder-[#2D3436] placeholder-opacity-30"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[12px] font-black text-[#2D3436] opacity-60 uppercase tracking-wider px-1">
                    Email Domain
                  </label>
                  <input
                    name="emailDomain"
                    placeholder="e.g. acmecorp.com"
                    value={form.emailDomain || ""}
                    onChange={handleChange}
                    className="w-full px-5 py-4 text-[14px] font-bold text-[#2D3436] bg-[#F5F6FA] border border-transparent rounded-[16px] outline-none transition-all duration-300 focus:border-[#6C5CE7] focus:ring-1 focus:ring-[#6C5CE7] placeholder-[#2D3436] placeholder-opacity-30 font-mono"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[12px] font-black text-[#2D3436] opacity-60 uppercase tracking-wider px-1">
                    Website
                  </label>
                  <input
                    name="website"
                    placeholder="e.g. https://www.acmecorp.com"
                    value={form.website || ""}
                    onChange={handleChange}
                    className="w-full px-5 py-4 text-[14px] font-bold text-[#2D3436] bg-[#F5F6FA] border border-transparent rounded-[16px] outline-none transition-all duration-300 focus:border-[#6C5CE7] focus:ring-1 focus:ring-[#6C5CE7] placeholder-[#2D3436] placeholder-opacity-30"
                  />
                </div>

                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-[12px] font-black text-[#2D3436] opacity-60 uppercase tracking-wider px-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    placeholder="Brief overview of the company"
                    value={form.description || ""}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-5 py-4 text-[14px] font-bold text-[#2D3436] bg-[#F5F6FA] border border-transparent rounded-[16px] outline-none transition-all duration-300 focus:border-[#6C5CE7] focus:ring-1 focus:ring-[#6C5CE7] placeholder-[#2D3436] placeholder-opacity-30 resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6 pt-8 border-t border-[#F5F6FA]">
              <div className="flex justify-between items-center px-1">
                <h3 className="text-[11px] font-black text-[#6C5CE7] m-0 uppercase tracking-widest border-l-4 border-[#6C5CE7] pl-4">
                  Office Locations
                </h3>
                <button
                  type="button"
                  onClick={addLocation}
                  className="px-6 py-2.5 text-[10px] font-black text-[#6C5CE7] bg-[#F5F6FA] border border-transparent rounded-[12px] hover:border-[#6C5CE7] hover:shadow-sm transition-all duration-300 uppercase tracking-widest cursor-pointer outline-none active:scale-95"
                >
                  + Add Location
                </button>
              </div>

              <div className="flex flex-col gap-5">
                {form.locations.length === 0 && (
                  <div className="p-12 text-center bg-[#F5F6FA] border-2 border-dashed border-[#6C5CE7]/20 rounded-[24px]">
                    <p className="text-[13px] font-black text-[#2D3436] opacity-30 uppercase tracking-widest m-0">
                      No locations documented yet.
                    </p>
                  </div>
                )}

                {form.locations.map((loc, index) => (
                  <div
                    key={index}
                    className="bg-[#FFFFFF] border border-[#F5F6FA] p-6 rounded-[24px] grid grid-cols-1 md:grid-cols-3 gap-5 shadow-sm hover:shadow-md hover:border-[#6C5CE7]/30 transition-all duration-300 group"
                  >
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-[#2D3436] opacity-40 uppercase tracking-widest px-1">
                        City
                      </label>
                      <input
                        placeholder="e.g. Pune"
                        value={loc.city}
                        onChange={(e) =>
                          updateLocation(index, "city", e.target.value)
                        }
                        className="w-full px-5 py-3 text-[13px] font-bold text-[#2D3436] bg-[#F5F6FA] border border-transparent rounded-[14px] outline-none transition-all duration-300 focus:border-[#6C5CE7] focus:ring-1 focus:ring-[#6C5CE7]"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-[#2D3436] opacity-40 uppercase tracking-widest px-1">
                        State / Province
                      </label>
                      <input
                        placeholder="e.g. Maharashtra"
                        value={loc.state}
                        onChange={(e) =>
                          updateLocation(index, "state", e.target.value)
                        }
                        className="w-full px-5 py-3 text-[13px] font-bold text-[#2D3436] bg-[#F5F6FA] border border-transparent rounded-[14px] outline-none transition-all duration-300 focus:border-[#6C5CE7] focus:ring-1 focus:ring-[#6C5CE7]"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-[#2D3436] opacity-40 uppercase tracking-widest px-1">
                        Country
                      </label>
                      <input
                        placeholder="e.g. India"
                        value={loc.country}
                        onChange={(e) =>
                          updateLocation(index, "country", e.target.value)
                        }
                        className="w-full px-5 py-3 text-[13px] font-bold text-[#2D3436] bg-[#F5F6FA] border border-transparent rounded-[14px] outline-none transition-all duration-300 focus:border-[#6C5CE7] focus:ring-1 focus:ring-[#6C5CE7]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-[#F5F6FA]">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 text-[12px] font-black text-[#FFFFFF] bg-[#6C5CE7] border-none rounded-[16px] cursor-pointer hover:shadow-[0_10px_25px_-5px_rgba(108,92,231,0.4)] hover:-translate-y-1 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-[0.2em] shadow-md flex items-center justify-center gap-3 outline-none"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-[#FFFFFF]/30 border-t-[#FFFFFF] rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  "Save Company Profile"
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
