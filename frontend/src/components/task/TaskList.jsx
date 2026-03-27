import { useNavigate } from "react-router-dom";

export default function TaskList({
  tasks = [],
  role = "mentor",
  onSubmitTask,
}) {
  const navigate = useNavigate();

  if (!tasks.length) {
    return (
      <div className="text-[14px] font-black text-[#2D3436] opacity-60 py-12 text-center border-2 border-dashed border-[#F5F6FA] bg-[#F5F6FA] bg-opacity-50 rounded-[24px] uppercase tracking-widest font-['Nunito'] animate-fade-in-up">
        No tasks assigned yet
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-['Nunito']">
      {tasks.map((task) => (
        <div
          key={task._id}
          className="bg-[#FFFFFF] border border-[#F5F6FA] rounded-[24px] p-6 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(108,92,231,0.08)] hover:border-[#6C5CE7] hover:border-opacity-50 transition-all duration-500 transform hover:-translate-y-1 group cursor-default animate-fade-in-up"
        >
          <div>
            <h2 className="text-[18px] font-black text-[#2D3436] m-0 mb-2 leading-tight line-clamp-1 group-hover:text-[#6C5CE7] transition-colors duration-300">
              {task.title}
            </h2>

            {task.taskType === "internal" && (
              <p className="text-[13px] font-bold text-[#2D3436] opacity-70 leading-relaxed m-0 mt-2 line-clamp-2">
                {task.description}
              </p>
            )}

            {task.taskType === "external" && (
              <a
                href={task.externalLink}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-3 text-[13px] font-black text-[#6C5CE7] underline decoration-[#6C5CE7] decoration-2 underline-offset-4 hover:opacity-80 transition-opacity"
              >
                External Task ↗
              </a>
            )}

            <div className="mt-5 text-[11px] font-black text-[#2D3436] opacity-50 uppercase tracking-widest">
              Deadline:{" "}
              <span className="text-[#6C5CE7] opacity-100 ml-1">
                {task.deadline
                  ? new Date(task.deadline).toLocaleDateString()
                  : "None"}
              </span>
            </div>
          </div>

          <div className="mt-6 flex justify-between items-center pt-5 border-t border-[#F5F6FA]">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#2D3436] bg-[#F5F6FA] border border-transparent px-3 py-1.5 rounded-[12px] shadow-sm">
              {task.status}
            </span>

            {role === "mentor" && (
              <button
                onClick={() => navigate(`/mentor/tasks/${task._id}`)}
                className="px-5 py-2.5 bg-[#6C5CE7] text-[#FFFFFF] rounded-[14px] text-[12px] font-black hover:bg-opacity-90 hover:shadow-lg transition-all duration-300 cursor-pointer border-none shadow-md transform hover:-translate-y-0.5 outline-none"
              >
                View
              </button>
            )}

            {role === "student" && (
              <button
                onClick={() => onSubmitTask(task)}
                className="px-5 py-2.5 bg-[#6C5CE7] text-[#FFFFFF] rounded-[14px] text-[12px] font-black hover:bg-opacity-90 hover:shadow-lg transition-all duration-300 cursor-pointer border-none shadow-md transform hover:-translate-y-0.5 outline-none"
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
