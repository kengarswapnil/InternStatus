import { Outlet } from "react-router-dom";
import FacultyNavBar from "../components/navbars/FacultyNavBar";
import FacultySidebar from "../components/sidebar/FacultySidebar";

const FacultyLayout = () => {
  return (
    <div className="h-screen flex flex-col bg-[#FFFFFF] text-[#2D3436] overflow-hidden font-['Nunito'] transition-all duration-300">
      <div className="flex-none">
        <FacultyNavBar />
      </div>
      <div className="flex flex-1 overflow-hidden">
        <FacultySidebar />
        <main className="flex-1 bg-[#F5F6FA] overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default FacultyLayout;