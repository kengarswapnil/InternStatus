import { Outlet } from "react-router-dom";
import StudentNavBar from "../components/navbars/StudentNavBar";

const StudentLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F19] text-white">
      <StudentNavBar />
      <main className="flex-1 bg-[#0B0F19]">
        <Outlet />
      </main>
    </div>
  );
};

export default StudentLayout;