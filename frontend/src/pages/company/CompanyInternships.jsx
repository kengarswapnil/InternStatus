import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { useNavigate } from "react-router-dom";

export default function CompanyInternships() {
  const [data, setData] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  const navigate = useNavigate();

  const fetchData = async () => {
    const res = await API.get("/internships/company");
    setData(res.data.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleStatus = async (id, currentStatus) => {
    try {
      setLoadingId(id);

      const newStatus = currentStatus === "open" ? "closed" : "open";

      await API.patch(`/internships/${id}/status`, {
        status: newStatus
      });

      fetchData();
    } catch (err) {
      alert(err.response?.data?.message);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#F9F7F7] p-4 md:p-8 font-sans box-border">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-[#112D4E] text-2xl md:text-3xl font-semibold mt-0 mb-6">
          My Internships
        </h2>

        {data.length === 0 && (
          <div className="bg-white p-8 rounded-md shadow-sm border border-[#DBE2EF] text-center">
            <p className="text-[#112D4E] opacity-70 m-0 text-[15px]">
              No internships posted yet
            </p>
          </div>
        )}

        <div className="flex flex-col gap-5">
          {data.map((item) => {
            const isOpen = item.status === "open";

            return (
              <div
                key={item._id}
                className="bg-white p-6 md:p-8 rounded-md shadow-sm border border-[#DBE2EF] box-border transition-all duration-200 hover:shadow-md"
              >
                <h3 className="text-[#112D4E] text-xl font-semibold mt-0 mb-5">
                  {item.title}
                </h3>

                <div className="flex flex-col gap-3 mb-6">
                  <p className="m-0 text-[15px] text-[#112D4E]">
                    <b className="font-semibold inline-block w-36">Status:</b>
                    <span
                      className={`font-bold ${
                        isOpen ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {item.status.toUpperCase()}
                    </span>
                  </p>

                  <p className="m-0 text-[15px] text-[#112D4E]">
                    <b className="font-semibold inline-block w-36">Positions:</b>
                    <span className="opacity-90">{item.positions}</span>
                  </p>

                  <p className="m-0 text-[15px] text-[#112D4E]">
                    <b className="font-semibold inline-block w-36">Max Applicants:</b>
                    <span className="opacity-90">{item.maxApplicants}</span>
                  </p>

                  <p className="m-0 text-[15px] text-[#112D4E]">
                    <b className="font-semibold inline-block w-36">Deadline:</b>
                    <span className="opacity-90">
                      {new Date(item.applicationDeadline).toDateString()}
                    </span>
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 pt-5 border-t border-[#DBE2EF]">
                  <button
                    onClick={() =>
                      navigate(`/company/internship/${item._id}/applicants`)
                    }
                    className="px-5 py-2.5 text-sm font-medium text-white bg-[#3F72AF] rounded-md hover:bg-[#112D4E] transition-colors duration-200"
                  >
                    View Applicants
                  </button>

                  <button
                    onClick={() =>
                      navigate(`/company/internship/${item._id}/edit`)
                    }
                    className="px-5 py-2.5 text-sm font-medium text-[#112D4E] bg-[#DBE2EF] rounded-md hover:bg-[#3F72AF] hover:text-white transition-colors duration-200"
                  >
                    Edit
                  </button>

                  <button
                    disabled={loadingId === item._id}
                    onClick={() => toggleStatus(item._id, item.status)}
                    className="px-5 py-2.5 text-sm font-medium text-[#112D4E] bg-transparent border border-[#DBE2EF] rounded-md hover:bg-[#112D4E] hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
                  >
                    {loadingId === item._id
                      ? "Updating..."
                      : isOpen
                      ? "Close Internship"
                      : "Open Internship"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}