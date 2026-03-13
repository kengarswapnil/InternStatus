import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/api";

export default function TrackInternship() {

  const { applicationId } = useParams();
  const navigate = useNavigate();

  const [internship, setInternship] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {

    try {

      const res = await API.get(
        `/students/internship/${applicationId}/track`
      );

      setInternship(res.data.data);

      const taskRes = await API.get(
        `/tasks/application/${applicationId}`
      );

      const filteredTasks =
        (taskRes.data.data || []).filter(
          t => t.status !== "cancelled"
        );

      setTasks(filteredTasks);

    } catch (err) {

      console.error("Failed to load internship", err);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {
    fetchData();
  }, [applicationId]);


  const getStatusColor = (status) => {

    switch (status) {

      case "completed":
        return "bg-green-100 text-green-700";

      case "submitted":
      case "under_review":
        return "bg-yellow-100 text-yellow-700";

      case "revision_requested":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";

    }

  };


  if (loading) {

    return (
      <div className="flex justify-center items-center h-screen">
        Loading internship...
      </div>
    );

  }


  return (

    <div className="p-8 max-w-6xl mx-auto">


      {/* Internship Info */}

      <div className="bg-white border rounded-lg p-6 shadow mb-8">

        <h1 className="text-2xl font-bold mb-2">
          {internship?.internship?.title}
        </h1>

        <p className="text-gray-600">
          Company: {internship?.company?.name}
        </p>

        <p className="text-gray-600">
          Mentor: {internship?.mentor?.fullName || "Not assigned"}
        </p>

        <p className="text-gray-600">
          Status: {internship?.status}
        </p>

      </div>


      {/* Tasks */}

      <h2 className="text-xl font-semibold mb-4">
        Assigned Tasks
      </h2>

      {tasks.length === 0 ? (

        <div className="text-gray-500">
          No tasks assigned yet
        </div>

      ) : (

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {tasks.map((task) => (

            <div
              key={task._id}
              className="border rounded-lg p-4 bg-white shadow hover:shadow-md transition"
            >

              <h3 className="font-semibold text-lg">
                {task.title}
              </h3>


              {/* Description */}

              {task.description && (
                <p className="text-sm text-gray-600 mt-1">
                  {task.description}
                </p>
              )}


              {/* External link */}

              {task.externalLink && (
                <a
                  href={task.externalLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline text-sm"
                >
                  Open Task
                </a>
              )}


              {/* Assigned Date */}

              <div className="mt-2 text-sm text-gray-500">
                Assigned: {new Date(task.assignedAt).toLocaleDateString()}
              </div>


              {/* Deadline */}

              <div className="text-sm text-gray-500">
                Deadline: {
                  task.deadline
                    ? new Date(task.deadline).toLocaleDateString()
                    : "No deadline"
                }
              </div>


              {/* Mentor resources */}

              {task.resourceFiles?.length > 0 && (

                <div className="mt-2">

                  <p className="text-xs font-semibold mb-1">
                    Resources
                  </p>

                  <div className="flex flex-wrap gap-2">

                    {task.resourceFiles.map(file => (

                      <a
                        key={file._id}
                        href={file.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200"
                      >
                        {file.fileName}
                      </a>

                    ))}

                  </div>

                </div>

              )}


              {/* Status */}

              <div className="mt-3">

                <span className={`text-xs px-2 py-1 rounded ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>

              </div>


              {/* View Button */}

              <button
                onClick={() =>
                  navigate(`/student/task/${task._id}`)
                }
                className="mt-3 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
              >
                View Task
              </button>

            </div>

          ))}

        </div>

      )}

    </div>

  );

}