import { Outlet } from "react-router-dom";
import CollegeNavBar from "../components/navbars/CollegeNavBar";

const CollegeLayout = () => (
  <div className="min-h-screen flex flex-col bg-[#0B0F19] text-white">
    <CollegeNavBar />
    <main className="flex-1 bg-[#0B0F19]">
      <Outlet />
    </main>
  </div>
);

export default CollegeLayout;