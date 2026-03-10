import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUser } from "../store/userSlice";
import { useNavigate } from "react-router-dom";

const AccessRevoked = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await axios.post(
        BASE_URL + "/api/auth/logout",
        {},
        { withCredentials: true }
      );
      dispatch(removeUser());
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-[#FFEDC7]/20 flex items-center justify-center px-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-md shadow-xl border border-[#FFEDC7] p-8 md:p-10 transition-all">

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-[#EB4C4C]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold tracking-tight text-[#EB4C4C]">
            Access Revoked
          </h2>
        </div>

        {/* Message */}
        <p className="text-center text-gray-600 text-sm mb-4 leading-relaxed">
          Your role access has been revoked by the administrator.
          You currently do not have permission to access the dashboard
          or perform role-based actions.
        </p>

        <p className="text-center text-gray-500 text-sm mb-8">
          If you believe this is a mistake or need access restored,
          please contact your institution or system administrator.
        </p>

        {/* Logout Button */}
        <button
          className="w-full px-6 py-4 rounded-md bg-[#EB4C4C] text-white font-bold text-base tracking-wide hover:bg-[#FF7070] shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AccessRevoked;
