import { useEffect, useState } from "react";
import API from "../../api/api";
import { useNavigate } from "react-router-dom";

const MentorInterns = () => {
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchInterns = async () => {
    try {
      const res = await API.get("/mentor/interns");
      setInterns(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch interns", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.patch(`/mentor/interns/${id}/status`, { status });
      fetchInterns();
    } catch (err) {
      console.error("Status update failed", err);
    }
  };

  useEffect(() => {
    fetchInterns();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Loading interns...
      </div>
    );
  }

  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold mb-6">My Interns</h1>

      {interns.length === 0 ? (
        <div className="text-gray-500 text-center mt-20">
          No interns assigned yet
        </div>
      ) : (

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {interns.map((intern) => (

            <div
              key={intern.applicationId}
              className="bg-white rounded-xl shadow-md p-6 border hover:shadow-lg transition"
            >

              {/* Student */}

              <div className="flex justify-between items-center mb-4">

                <h2 className="text-xl font-semibold text-black text-ellipsis overflow-hidden">
                  {intern.studentName}
                </h2>

                <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-600">
                  {intern.status}
                </span>

              </div>

              {/* Student info */}

              <div className="text-sm text-gray-600 space-y-1">

                <p>
                  <span className="font-medium">Email:</span>{" "}
                  {intern.studentEmail}
                </p>

                {intern.resumeUrl && (
                  <p>
                    <a
                      href={intern.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline"
                    >
                      View Resume
                    </a>
                  </p>
                )}

              </div>

              {/* Internship */}

              <div className="mt-4 border-t pt-4 text-sm text-gray-700 space-y-1">

                <p>
                  <span className="font-medium">Internship:</span>{" "}
                  {intern.internshipTitle}
                </p>

                <p>
                  <span className="font-medium">Mode:</span>{" "}
                  {intern.mode}
                </p>

                <p>
                  <span className="font-medium">Location:</span>{" "}
                  {intern.location}
                </p>

              </div>

              {/* Duration */}

              <div className="mt-4 text-sm">

                <p>
                  <span className="font-medium">Duration:</span>{" "}
                  {intern.startDate
                    ? new Date(intern.startDate).toLocaleDateString()
                    : "-"}
                  {" - "}
                  {intern.endDate
                    ? new Date(intern.endDate).toLocaleDateString()
                    : "Ongoing"}
                </p>

                <p>
                  <span className="font-medium">Evaluation:</span>{" "}
                  {intern.evaluationScore ?? "Not evaluated"}
                </p>

              </div>

              {/* Actions */}

            <div className="mt-5 flex gap-2 flex-wrap">

  {intern.status === "offer_accepted" && (
    <button
      onClick={() => updateStatus(intern.applicationId, "ongoing")}
      className="px-3 py-1 bg-green-600 text-white rounded text-sm"
    >
      Start
    </button>
  )}

  {intern.status === "ongoing" && (
    <>
      <button
        onClick={() => updateStatus(intern.applicationId, "completed")}
        className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
      >
        Complete
      </button>

      <button
        onClick={() => updateStatus(intern.applicationId, "terminated")}
        className="px-3 py-1 bg-red-600 text-white rounded text-sm"
      >
        Terminate
      </button>
    </>
  )}

  {/* View Intern */}
  <button
    onClick={() => navigate(`/mentor/intern/${intern.applicationId}`)}
    className="px-3 py-1 bg-gray-700 text-white rounded text-sm"
  >
    View
  </button>

  {/* Assign Task */}
 <button
  onClick={() =>
    navigate(`/mentor/intern/${intern.applicationId}/track`)
  }
  className="px-3 py-1 bg-purple-600 text-white rounded text-sm"
>
  Track
</button>


</div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
};

export default MentorInterns;