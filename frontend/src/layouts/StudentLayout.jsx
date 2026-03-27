import { Outlet } from "react-router-dom";
import StudentNavBar from "../components/navbars/StudentNavBar";
import StudentSidebar from "../components/sidebar/StudentSidebar";

const StudentLayout = () => {
  return (
    <div className="h-screen flex flex-col bg-[#FFFFFF] text-[#2D3436] overflow-hidden font-['Nunito'] transition-all duration-300">
      <div className="flex-none">
        <StudentNavBar />
      </div>
      <div className="flex flex-1 overflow-hidden">
        <StudentSidebar />
        <main className="flex-1 bg-[#F5F6FA] overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
