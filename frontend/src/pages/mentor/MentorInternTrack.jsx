import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/api";

export default function MentorInternTrack() {

  const { applicationId } = useParams();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    deadline: "",
    taskType: "internal",
    externalLink: ""
  });

  const [files, setFiles] = useState([]);

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      deadline: "",
      taskType: "internal",
      externalLink: ""
    });
    setFiles([]);
  };

  const fetchTasks = async () => {

    try {

      const res = await API.get(`/tasks/application/${applicationId}`);
      setTasks(res.data?.data || []);

    } catch (err) {

      console.error("Task fetch error", err);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {
    fetchTasks();
  }, [applicationId]);



  const handleChange = (e) => {

    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));

  };


  const handleFileChange = (e) => {

    if (e.target.files.length > 5) {
      alert("Maximum 5 files allowed");
      return;
    }

    setFiles(e.target.files);

  };


  const createTask = async () => {

    if (!form.title.trim()) {
      alert("Task title required");
      return;
    }

    try {

      setCreating(true);

      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("deadline", form.deadline);
      formData.append("taskType", form.taskType);
      formData.append("application", applicationId);

      if (form.externalLink) {
        formData.append("externalLink", form.externalLink);
      }

      for (let i = 0; i < files.length; i++) {
        formData.append("resources", files[i]);
      }

      await API.post("/tasks", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      resetForm();
      setShowCreate(false);

      await fetchTasks();

    } catch (err) {

      alert(err.response?.data?.message || "Failed to create task");

    } finally {

      setCreating(false);

    }

  };


  const getStatusColor = (status) => {

    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "submitted":
        return "bg-blue-100 text-blue-700";
      case "under_review":
        return "bg-yellow-100 text-yellow-700";
      case "revision_requested":
        return "bg-orange-100 text-orange-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }

  };


  if (loading) {

    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Loading tasks...
      </div>
    );

  }


  return (

    <div className="p-8 max-w-6xl mx-auto">


      {/* HEADER */}

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-3xl font-bold">
          Intern Tasks
        </h1>

      <button
          onClick={() => setShowCreate(prev => !prev)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {showCreate ? "Cancel" : "Create Task"}
        </button>

      </div>



      {/* CREATE TASK */}

      {showCreate && (

        <div className="bg-zinc-100 border rounded-lg p-6 mb-8 shadow">

          <div className="grid md:grid-cols-2 gap-4">

            <input
              name="title"
              placeholder="Task title"
              value={form.title}
              onChange={handleChange}
              className="border p-2 rounded"
            />

            <input
              type="date"
              name="deadline"
              value={form.deadline}
              onChange={handleChange}
              className="border p-2 rounded"
            />

            <select
              name="taskType"
              value={form.taskType}
              onChange={handleChange}
              className="border p-2 rounded"
            >
              <option value="internal">Internal Task</option>
              <option value="external">External Task</option>
            </select>

            {form.taskType === "external" && (

              <input
                name="externalLink"
                placeholder="External task link"
                value={form.externalLink}
                onChange={handleChange}
                className="border p-2 rounded"
              />

            )}

          </div>


          {form.taskType === "internal" && (

            <textarea
              name="description"
              placeholder="Task description"
              value={form.description}
              onChange={handleChange}
              className="border p-2 rounded w-full mt-4"
            />

          )}



          {/* FILE UPLOAD */}

          <div className="mt-4">

            <label className="block text-sm font-medium mb-1">
              Upload Resources
            </label>

            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="border p-2 rounded w-full"
            />

            <p className="text-xs text-gray-500 mt-1">
              Max 5 files
            </p>

          </div>


          <button
            onClick={createTask}
            disabled={creating}
            className="mt-5 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {creating ? "Creating..." : "Save Task"}
          </button>

        </div>

      )}



      {/* TASK LIST */}

      {tasks.length === 0 ? (

        <div className="text-gray-500">
          No tasks assigned yet
        </div>

      ) : (

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {tasks.map(task => (

            <div
              key={task._id}
              className="border rounded-lg p-4 bg-white shadow hover:shadow-md transition"
            >

              <h2 className="font-semibold text-lg mb-1">
                {task.title}
              </h2>


              {task.taskType === "internal" && (

                <p className="text-sm text-gray-600">
                  {task.description}
                </p>

              )}


              {task.externalLink && (

                <a
                  href={task.externalLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline text-sm"
                >
                  Open External Task
                </a>

              )}


              <div className="mt-2 text-sm text-gray-500">

                Assigned: {
                  task.assignedAt
                    ? new Date(task.assignedAt).toLocaleDateString()
                    : "-"
                }

              </div>


              <div className="text-sm text-gray-500">

                Deadline: {
                  task.deadline
                    ? new Date(task.deadline).toLocaleDateString()
                    : "No deadline"
                }

              </div>



              {/* RESOURCE FILES */}

              {task.resourceFiles?.length > 0 && (

                <div className="mt-3">

                  <p className="text-xs font-semibold mb-1">
                    Resources
                  </p>

                  <div className="flex flex-wrap gap-2">

                    {task.resourceFiles.map((file, index) => (

                      <a
                        key={index}
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



              <div className="mt-4 flex justify-between items-center">

                <span className={`text-xs px-2 py-1 rounded ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>

                <button
                  onClick={() => navigate(`/mentor/tasks/${task._id}`)}
                  className="px-2 py-1 bg-gray-700 text-white rounded text-sm hover:bg-gray-800"
                >
                  View
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  );

}