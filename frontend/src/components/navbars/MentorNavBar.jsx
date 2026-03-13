import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../utils/logoutUser";

const MentorNavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((s) => s.user?.user) || {};

  const handleLogout = () => {
      logoutUser(dispatch, navigate);
    };
 

  const showCore = user.isRegistered && user.isVerified;

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#0B0F19]/80 backdrop-blur-2xl border-b border-white/10 font-sans box-border transition-all selection:bg-fuchsia-500/30 selection:text-fuchsia-200">
      <div className="w-full px-6 py-4 flex flex-col xl:flex-row xl:justify-between xl:items-center gap-5">
        <div className="flex flex-wrap items-center gap-2 md:gap-3 text-sm font-medium">
          <Link
            to="/mentor"
            className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 mr-2 xl:mr-6 whitespace-nowrap no-underline transition-transform hover:scale-105"
          >
            InternStatus
            <span className="text-white/40 font-medium text-lg ml-3 tracking-wide">
              Mentor
            </span>
          </Link>

          {showCore && (
            <div className="flex flex-wrap items-center gap-1.5 xl:border-l border-white/10 xl:pl-6">
              <Link
                to="/mentor/dashboard"
                className="px-3 py-2.5 rounded-xl text-white/70 font-bold hover:text-fuchsia-300 hover:bg-white/5 transition-all duration-300 no-underline tracking-wide"
              >
                Dashboard
              </Link>
              <Link
                to="/mentor/profile"
                className="px-3 py-2.5 rounded-xl text-white/70 font-bold hover:text-fuchsia-300 hover:bg-white/5 transition-all duration-300 no-underline tracking-wide"
              >
                Profile
              </Link>
              <Link
                to="/mentor/interns"
                className="px-3 py-2.5 rounded-xl text-white/70 font-bold hover:text-fuchsia-300 hover:bg-white/5 transition-all duration-300 no-underline tracking-wide"
              >
                Interns
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center xl:justify-end">
          <button
            onClick={handleLogout}
            className="w-full xl:w-auto px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/80 font-bold tracking-widest uppercase text-xs hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-all duration-300 cursor-pointer outline-none hover:-translate-y-0.5"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default MentorNavBar;