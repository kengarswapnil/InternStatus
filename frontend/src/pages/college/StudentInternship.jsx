import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";

export default function StudentInternships() {

  const navigate = useNavigate();

  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      const res = await API.get("/students/internships"); // your API
      setInternships(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-10">Loading internships...</div>;
  }

  if (!internships.length) {
    return <div className="p-10">No internships found</div>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">
        My Internships
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {internships.map((internship) => {

          const isCompleted = internship.status === "completed";
          const isOngoing = internship.status === "ongoing";

          return (
            <div
              key={internship._id}
              className="border rounded-lg p-5 shadow bg-white"
            >

              <h2 className="text-lg font-semibold">
                {internship.internship?.title}
              </h2>

              <p className="text-sm text-gray-600">
                Company: {internship.company?.name}
              </p>

              <p className="text-sm text-gray-600">
                Mentor: {internship.mentor?.fullName || "Not assigned"}
              </p>

              <p className="text-sm mt-2 capitalize">
                Status: <span className="font-medium">{internship.status}</span>
              </p>

              {/* 🔥 ACTION BUTTON */}
              <div className="mt-4">

                {/* 🟢 ONGOING */}
                {isOngoing && (
                  <button
                    onClick={() =>
                      navigate(`/student/task/${internship.currentTaskId}`)
                    }
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                  >
                    View Task
                  </button>
                )}

                {/* 🔵 COMPLETED */}
                {isCompleted && (
                  <button
                    onClick={() =>
                      navigate(`/student/academic/${internship._id}`)
                    }
                    className="px-4 py-2 bg-green-600 text-white rounded"
                  >
                    View Internship
                  </button>
                )}

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}