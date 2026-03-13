import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/api";

export default function CreateTask() {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    deadline: "",
    taskType: "internal",
    externalLink: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const createTask = async () => {
    if (!form.title) {
      alert("Task title required");
      return;
    }

    try {
      setLoading(true);

      await API.post("/tasks", {
        ...form,
        application: applicationId
      });

      navigate(`/mentor/intern/${applicationId}/track`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center p-6">

      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-gray-200 p-8">

        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Create New Task
        </h1>

        <div className="grid grid-cols-2 gap-5">

          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Task Title</label>
            <input
              name="title"
              placeholder="Enter task title"
              value={form.title}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Deadline</label>
            <input
              name="deadline"
              type="date"
              value={form.deadline}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Task Type</label>
            <select
              name="taskType"
              value={form.taskType}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
            >
              <option value="internal">Internal Task</option>
              <option value="external">External Task</option>
            </select>
          </div>

          {form.taskType === "external" && (
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">
                External Link
              </label>
              <input
                name="externalLink"
                placeholder="Paste task link"
                value={form.externalLink}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
              />
            </div>
          )}
        </div>

        {form.taskType === "internal" && (
          <div className="mt-5 flex flex-col">
            <label className="text-sm text-gray-600 mb-1">
              Task Description
            </label>
            <textarea
              name="description"
              placeholder="Write detailed task instructions..."
              value={form.description}
              onChange={handleChange}
              rows="4"
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>
        )}

        <div className="flex justify-end mt-8">
          <button
            onClick={createTask}
            disabled={loading}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow transition"
          >
            {loading ? "Creating Task..." : "Create Task"}
          </button>
        </div>

      </div>
    </div>
  );
}