import { Outlet } from "react-router-dom";
import CompanyNavBar from "../components/navbars/CompanyNavBar";
import CompanySidebar from "../components/sidebar/CompanySidebar";

const CompanyLayout = () => {
  return (
    <div className="h-screen flex flex-col bg-[#FFFFFF] text-[#2D3436] overflow-hidden font-['Nunito'] transition-all duration-300">
      <div className="flex-none">
        <CompanyNavBar />
      </div>
      <div className="flex flex-1 overflow-hidden">
        <CompanySidebar />
        <main className="flex-1 bg-[#F5F6FA] overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CompanyLayout;