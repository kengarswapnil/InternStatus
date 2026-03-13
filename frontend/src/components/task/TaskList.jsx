import { useNavigate } from "react-router-dom";

export default function TaskList({
tasks = [],
role = "mentor",
onSubmitTask
}) {

const navigate = useNavigate();

if (!tasks.length) {
return ( <div className="text-gray-500">
No tasks assigned yet </div>
);
}

return (

<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

  {tasks.map((task) => (

    <div
      key={task._id}
      className="border rounded-lg p-4 bg-white shadow flex flex-col justify-between"
    >

      <div>

        <h2 className="font-semibold text-lg">
          {task.title}
        </h2>

        {task.taskType === "internal" && (
          <p className="text-sm text-gray-600 mt-1">
            {task.description}
          </p>
        )}

        {task.taskType === "external" && (
          <a
            href={task.externalLink}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline text-sm"
          >
            External Task
          </a>
        )}

        <div className="mt-3 text-sm text-gray-500">
          Deadline: {task.deadline
            ? new Date(task.deadline).toLocaleDateString()
            : "No deadline"}
        </div>

      </div>

      <div className="mt-4 flex justify-between items-center">

        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
          {task.status}
        </span>

        {role === "mentor" && (

          <button
            onClick={() => navigate(`/mentor/tasks/${task._id}`)}
            className="px-2 py-1 bg-gray-700 text-white rounded text-sm"
          >
            View
          </button>

        )}

        {role === "student" && (

          <button
            onClick={() => onSubmitTask(task)}
            className="px-2 py-1 bg-green-600 text-white rounded text-sm"
          >
            Submit
          </button>

        )}

      </div>

    </div>

  ))}

</div>
);
}
