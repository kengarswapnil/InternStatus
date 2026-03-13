import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/api";

export default function StudentTaskDetails() {

const { taskId } = useParams();

const [task, setTask] = useState(null);
const [submissions, setSubmissions] = useState([]);
const [loading, setLoading] = useState(true);
const [submitting, setSubmitting] = useState(false);

const [form, setForm] = useState({
description: "",
githubLink: "",
files: []
});

/* ================= FETCH ================= */

const fetchTask = async () => {

try {

  const taskRes = await API.get(`/tasks/${taskId}`);
  setTask(taskRes.data.data);

  const subRes = await API.get(`/task-submissions/task/${taskId}`);
  setSubmissions(subRes.data.data || []);

} catch (err) {

  console.error("Failed to fetch task", err);

} finally {

  setLoading(false);

}

};

useEffect(() => {

if (!taskId) return;

fetchTask();

}, [taskId]);

/* ================= FILES ================= */

const handleFileChange = (e) => {

if (e.target.files.length > 5) {
  alert("Maximum 5 files allowed");
  return;
}

setForm(prev => ({
  ...prev,
  files: e.target.files
}));

};

/* ================= SUBMIT ================= */

const submitTask = async () => {

if (!form.description.trim()) {
  alert("Description is required");
  return;
}

try {

  setSubmitting(true);

  const formData = new FormData();

  formData.append("taskId", taskId);
  formData.append("description", form.description);
  formData.append("githubLink", form.githubLink);

  for (let i = 0; i < form.files.length; i++) {
    formData.append("files", form.files[i]);
  }

  await API.post("/task-submissions", formData);

  alert("Task submitted successfully");

  setForm({
    description: "",
    githubLink: "",
    files: []
  });

  fetchTask();

} catch (err) {

  alert(err.response?.data?.message || "Submission failed");

} finally {

  setSubmitting(false);

}


};

/* ================= STATUS COLOR ================= */

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
    return "bg-blue-100 text-blue-700";

}

};

/* ================= LOADING ================= */

if (loading) {

return (
  <div className="flex flex-col justify-center items-center h-screen space-y-4">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    <p className="text-gray-500 font-medium">
      Loading task details...
    </p>
  </div>
);
}

if (!task) {
return <div className="p-8">Task not found</div>;
}

const canSubmit =
task.status !== "completed" &&
task.status !== "cancelled" &&
(
submissions.length === 0 ||
submissions[0]?.status === "revision_requested"
);

return (

<div className="p-6 md:p-10 max-w-5xl mx-auto bg-gray-50 min-h-screen">


  {/* ================= TASK HEADER ================= */}

  <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm mb-10">

    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">

      <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
        {task.title}
      </h1>

      <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(task.status)}`}>
        {task.status}
      </span>

    </div>


    {task.description && (

      <p className="text-gray-700 leading-relaxed mb-6 text-lg">
        {task.description}
      </p>

    )}


    {task.externalLink && (

      <div className="mb-6">

        <a
          href={task.externalLink}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium hover:bg-blue-100 transition"
        >
          Open External Task
        </a>

      </div>

    )}


    {task.resourceFiles?.length > 0 && (

      <div className="mb-6">

        <p className="text-sm font-semibold text-gray-600 mb-2">
          Resources
        </p>

        <div className="flex flex-wrap gap-2">

          {task.resourceFiles.map((file, index) => (

            <a
              key={index}
              href={file.url}
              target="_blank"
              rel="noreferrer"
              className="text-xs bg-gray-100 px-3 py-1 rounded hover:bg-gray-200"
            >
              {file.fileName}
            </a>

          ))}

        </div>

      </div>

    )}


    <div className="flex gap-6 text-sm text-gray-500 border-t pt-4">

      <div>
        Assigned:
        <span className="ml-1 font-semibold text-gray-700">
          {task.assignedAt
            ? new Date(task.assignedAt).toLocaleDateString()
            : "-"}
        </span>
      </div>

      <div>
        Deadline:
        <span className="ml-1 font-semibold text-gray-700">
          {task.deadline
            ? new Date(task.deadline).toLocaleDateString()
            : "No deadline"}
        </span>
      </div>

    </div>

  </div>


  <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">


    {/* ================= SUBMISSIONS ================= */}

    <div className="lg:col-span-2">

      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Submission History ({submissions.length})
      </h2>


      {submissions.length === 0 ? (

        <div className="bg-white border-2 border-dashed border-gray-200 rounded-xl p-12 text-center text-gray-400">
          No work has been submitted yet.
        </div>

      ) : (

        <div className="space-y-6">

          {submissions.map((sub) => (

            <div
              key={sub._id}
              className="bg-white border border-gray-200 border-l-4 border-l-blue-500 rounded-r-xl p-6 shadow-sm"
            >

              <div className="flex justify-between items-start mb-4">

                <span className="text-xs font-bold text-blue-600 uppercase">
                  Attempt {sub.attempt}
                </span>

                <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(sub.status)}`}>
                  {sub.status}
                </span>

              </div>

              <p className="text-gray-800 mb-3">
                {sub.description}
              </p>


              {sub.githubLink && (

                <a
                  href={sub.githubLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline text-sm"
                >
                  Repository Link
                </a>

              )}


              {sub.files?.length > 0 && (

                <div className="mt-4">

                  <p className="text-xs font-semibold text-gray-500 mb-1">
                    Files
                  </p>

                  {sub.files.map((file, i) => (

                    <a
                      key={i}
                      href={file.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block text-blue-600 underline text-sm"
                    >
                      {file.fileName}
                    </a>

                  ))}

                </div>

              )}


              {sub.mentorFeedback && (

                <div className="mt-4 bg-amber-50 border border-amber-200 p-3 rounded">

                  <p className="text-xs font-semibold text-amber-800">
                    Mentor Feedback
                  </p>

                  <p className="text-sm text-amber-900">
                    {sub.mentorFeedback}
                  </p>

                </div>

              )}

            </div>

          ))}

        </div>

      )}

    </div>


    {/* ================= SUBMIT FORM ================= */}

    <div className="lg:col-span-1">

      {canSubmit && (

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm sticky top-8">

          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Submit Work
          </h2>

          <textarea
            placeholder="Describe your work..."
            value={form.description}
            onChange={(e)=>setForm({...form,description:e.target.value})}
            className="w-full border p-3 rounded mb-4"
          />

          <input
            placeholder="GitHub Link (optional)"
            value={form.githubLink}
            onChange={(e)=>setForm({...form,githubLink:e.target.value})}
            className="w-full border p-3 rounded mb-4"
          />

          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="mb-4"
          />

          <button
            onClick={submitTask}
            disabled={submitting}
            className="w-full py-2 bg-blue-600 text-white rounded"
          >
            {submitting ? "Submitting..." : "Submit Task"}
          </button>

        </div>

      )}

    </div>

  </div>

</div>
);

}
