import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../../api/api";

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
    <div className="min-h-screen bg-[#0B0F19] p-4 md:p-8 font-sans text-white selection:bg-fuchsia-500/30 selection:text-fuchsia-200">
      <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-xl p-6 md:p-10 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] border border-white/10 transition-all duration-300 hover:border-white/20">
        <header className="mb-10 border-b border-white/10 pb-6">
          <h2 className="text-3xl font-black m-0 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
            {isEdit ? "Edit Company Profile" : "Add New Company"}
          </h2>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-10">
          <div className="flex flex-col gap-6">
            <h3 className="text-sm font-bold text-violet-400 m-0 uppercase tracking-widest">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
                  Company Name
                </label>
                <input
                  name="name"
                  placeholder="e.g. Acme Corporation"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none transition-all duration-300 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 placeholder:text-white/20"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
                  Industry
                </label>
                <input
                  name="industry"
                  placeholder="e.g. Software, Finance, Healthcare"
                  value={form.industry || ""}
                  onChange={handleChange}
                  className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none transition-all duration-300 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 placeholder:text-white/20"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
                  Company Size
                </label>
                <input
                  name="companySize"
                  placeholder="e.g. 50-200, 1000+"
                  value={form.companySize || ""}
                  onChange={handleChange}
                  className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none transition-all duration-300 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 placeholder:text-white/20"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
                  Email Domain
                </label>
                <input
                  name="emailDomain"
                  placeholder="e.g. acmecorp.com"
                  value={form.emailDomain || ""}
                  onChange={handleChange}
                  className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none transition-all duration-300 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 placeholder:text-white/20"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
                  Website
                </label>
                <input
                  name="website"
                  placeholder="e.g. https://www.acmecorp.com"
                  value={form.website || ""}
                  onChange={handleChange}
                  className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none transition-all duration-300 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 placeholder:text-white/20"
                />
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
                  Description
                </label>
                <textarea
                  name="description"
                  placeholder="Brief overview of the company"
                  value={form.description || ""}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-5 py-4 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none transition-all duration-300 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 placeholder:text-white/20 resize-y"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 pt-8 border-t border-white/10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="text-sm font-bold text-violet-400 m-0 uppercase tracking-widest">
                Locations
              </h3>
              <button
                type="button"
                onClick={addLocation}
                className="px-5 py-3 text-[10px] font-bold text-white bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap cursor-pointer uppercase tracking-widest"
              >
                Add Location
              </button>
            </div>

            <div className="flex flex-col gap-5">
              {form.locations.length === 0 && (
                <div className="p-10 text-center bg-[#0B0F19]/30 border border-white/5 rounded-2xl">
                  <p className="text-sm text-white/40 font-medium m-0">
                    No locations added yet.
                  </p>
                </div>
              )}

              {form.locations.map((loc, index) => (
                <div
                  key={index}
                  className="bg-[#0B0F19]/30 border border-white/5 p-6 rounded-2xl flex flex-col sm:flex-row gap-5 box-border transition-all hover:border-white/10"
                >
                  <div className="flex-1 flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-fuchsia-400 uppercase tracking-widest">
                      City
                    </label>
                    <input
                      placeholder="e.g. Pune"
                      value={loc.city}
                      onChange={(e) =>
                        updateLocation(index, "city", e.target.value)
                      }
                      className="w-full px-5 py-3.5 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none transition-all duration-300 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 placeholder:text-white/20"
                    />
                  </div>

                  <div className="flex-1 flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-fuchsia-400 uppercase tracking-widest">
                      State
                    </label>
                    <input
                      placeholder="e.g. Maharashtra"
                      value={loc.state}
                      onChange={(e) =>
                        updateLocation(index, "state", e.target.value)
                      }
                      className="w-full px-5 py-3.5 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none transition-all duration-300 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 placeholder:text-white/20"
                    />
                  </div>

                  <div className="flex-1 flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-fuchsia-400 uppercase tracking-widest">
                      Country
                    </label>
                    <input
                      placeholder="e.g. India"
                      value={loc.country}
                      onChange={(e) =>
                        updateLocation(index, "country", e.target.value)
                      }
                      className="w-full px-5 py-3.5 text-sm text-white bg-[#0B0F19]/50 border border-white/10 rounded-xl outline-none transition-all duration-300 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 placeholder:text-white/20"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-8 border-t border-white/10">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 border-none rounded-xl cursor-pointer transition-all duration-300 hover:shadow-[0_8px_20px_-6px_rgba(217,70,239,0.5)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest flex items-center justify-center gap-3"
            >
              {loading && (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              )}
              {loading ? "Saving Company..." : "Save Company Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}