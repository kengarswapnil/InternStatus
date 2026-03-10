import { Outlet } from "react-router-dom";
import FacultyNavBar from "../components/navbars/FacultyNavBar";

const FacultyLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F19] text-white">
      <FacultyNavBar />
      <main className="flex-1 bg-[#0B0F19] w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default FacultyLayout;