import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/api";

export default function TaskDetails() {

const { taskId } = useParams();
const navigate = useNavigate();

const [task, setTask] = useState(null);
const [submissions, setSubmissions] = useState([]);
const [loading, setLoading] = useState(true);
const [reviewLoading, setReviewLoading] = useState(null);
const [reviewState, setReviewState] = useState({});

/* ================= FETCH DATA ================= */

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
fetchTask();
}, [taskId]);

/* ================= REVIEW STATE ================= */

const updateReviewField = (submissionId, field, value) => {

setReviewState(prev => ({
  ...prev,
  [submissionId]: {
    ...prev[submissionId],
    [field]: value
  }
}));

};

/* ================= REVIEW SUBMISSION ================= */

const reviewSubmission = async (submissionId) => {

const review = reviewState[submissionId] || {};

if (!review.status) {
  alert("Please select review decision");
  return;
}

try {

  setReviewLoading(submissionId);

  await API.patch(
    `/task-submissions/${submissionId}/review`,
    {
      status: review.status,
      mentorFeedback: review.mentorFeedback || "",
      score: review.score ? Number(review.score) : undefined
    }
  );

  alert("Submission reviewed");

  setReviewState(prev => {
    const updated = { ...prev };
    delete updated[submissionId];
    return updated;
  });

  fetchTask();

} catch (err) {

  alert(err.response?.data?.message || "Review failed");

} finally {

  setReviewLoading(null);

}

};

/* ================= CANCEL TASK ================= */

const cancelTask = async () => {

if (!window.confirm("Cancel this task?")) return;

try {

  await API.patch(`/tasks/${taskId}/cancel`);

  alert("Task cancelled");

  fetchTask();

} catch (err) {

  alert(err.response?.data?.message || "Cancel failed");

}

};

/* ================= LOADING ================= */

if (loading) {
return <div className="p-8">Loading task...</div>;
}

/* ================= UI ================= */

return (

<div className="max-w-4xl mx-auto p-8">

  <h1 className="text-3xl font-bold mb-6">
    Task Details
  </h1>


  {/* TASK INFO */}

  <div className="space-y-4 mb-10">

    <div>
      <label className="text-sm text-gray-500">Title</label>
      <div className="border p-2 rounded bg-gray-100">
        {task.title}
      </div>
    </div>


    {task.taskType === "internal" && (

      <div>
        <label className="text-sm text-gray-500">Description</label>
        <div className="border p-2 rounded bg-gray-100">
          {task.description}
        </div>
      </div>

    )}


    {task.externalLink && (

      <div>
        <label className="text-sm text-gray-500">External Task</label>
        <a
          href={task.externalLink}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 underline block"
        >
          Open Task Link
        </a>
      </div>

    )}


    <div>
      <label className="text-sm text-gray-500">Assigned</label>
      <div className="border p-2 rounded bg-gray-100">
        {task.assignedAt
          ? new Date(task.assignedAt).toLocaleDateString()
          : "-"}
      </div>
    </div>


    <div>
      <label className="text-sm text-gray-500">Deadline</label>
      <div className="border p-2 rounded bg-gray-100">
        {task.deadline
          ? new Date(task.deadline).toLocaleDateString()
          : "No deadline"}
      </div>
    </div>


    {/* RESOURCE FILES */}

    {task.resourceFiles?.length > 0 && (

      <div>

        <label className="text-sm text-gray-500">
          Resources
        </label>

        <div className="space-y-1">

          {task.resourceFiles.map((file, index) => (

            <a
              key={index}
              href={file.url}
              target="_blank"
              rel="noreferrer"
              className="block text-blue-600 underline text-sm"
            >
              {file.fileName}
            </a>

          ))}

        </div>

      </div>

    )}


    {task.status === "assigned" && (

      <button
        onClick={cancelTask}
        className="px-4 py-2 bg-red-600 text-white rounded"
      >
        Cancel Task
      </button>

    )}

  </div>


  {/* SUBMISSIONS */}

  <h2 className="text-2xl font-semibold mb-4">
    Student Submissions
  </h2>


  {submissions.length === 0 ? (

    <div className="text-gray-500">
      No submissions yet
    </div>

  ) : (

    submissions.map((sub) => {

      const review = reviewState[sub._id] || {};

      return (

        <div
          key={sub._id}
          className="border p-4 rounded mb-6 bg-white shadow"
        >

          <div className="flex justify-between">

            <span className="text-sm text-gray-500">
              Attempt {sub.attempt}
            </span>

            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
              {sub.status}
            </span>

          </div>


          <p className="mt-2">{sub.description}</p>


          {sub.githubLink && (
            <a
              href={sub.githubLink}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline text-sm"
            >
              GitHub Link
            </a>
          )}


          {sub.files?.length > 0 && (

            <div className="mt-3">

              <p className="text-sm font-semibold mb-1">
                Uploaded Files
              </p>

              {sub.files.map((file, index) => (

                <a
                  key={index}
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


          {(task.status !== "completed") &&
          (sub.status === "submitted" ||
            sub.status === "under_review") && (

            <div className="mt-4 space-y-2">

              <select
                value={review.status || ""}
                onChange={(e)=>
                  updateReviewField(
                    sub._id,
                    "status",
                    e.target.value
                  )
                }
                className="border p-2 rounded w-full"
              >

                <option value="">
                  Select review decision
                </option>

                <option value="approved">
                  Approve
                </option>

                <option value="revision_requested">
                  Request Revision
                </option>

              </select>


              <textarea
                placeholder="Feedback"
                value={review.mentorFeedback || ""}
                onChange={(e)=>
                  updateReviewField(
                    sub._id,
                    "mentorFeedback",
                    e.target.value
                  )
                }
                className="border p-2 rounded w-full"
              />


              <input
                type="number"
                placeholder="Score (0-10)"
                min="0"
                max="10"
                value={review.score || ""}
                onChange={(e)=>
                  updateReviewField(
                    sub._id,
                    "score",
                    e.target.value
                  )
                }
                className="border p-2 rounded w-full"
              />


              <button
                onClick={() =>
                  reviewSubmission(sub._id)
                }
                disabled={reviewLoading === sub._id}
                className="px-3 py-1 bg-green-600 text-white rounded"
              >

                {reviewLoading === sub._id
                  ? "Reviewing..."
                  : "Submit Review"}

              </button>

            </div>

          )}

        </div>

      );

    })

  )}

</div>
);

}
