import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../utils/logoutUser";

const AdminNavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

    const handleLogout = () => {
      logoutUser(dispatch, navigate);
    };

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#0B0F19]/80 backdrop-blur-2xl border-b border-white/10 font-sans box-border transition-all selection:bg-fuchsia-500/30 selection:text-fuchsia-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-5">
        <h1 className="text-2xl font-black tracking-tight whitespace-nowrap m-0">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
            InternStatus
          </span>
          <span className="text-white/40 font-medium text-lg ml-3 tracking-wide">
            Admin
          </span>
        </h1>
        <div className="flex gap-3 items-center">
          <button onClick={handleLogout}>
            logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavBar;