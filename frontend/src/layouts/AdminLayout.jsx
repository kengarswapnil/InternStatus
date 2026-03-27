import { Outlet } from "react-router-dom";
import AdminNavBar from "../components/navbars/AdminNavBar";
import AdminSidebar from "../components/sidebar/AdminSidebar";

const AdminLayout = () => (
  <div className="h-screen flex flex-col bg-[#FFFFFF] text-[#2D3436] overflow-hidden font-['Nunito'] transition-all duration-300">
    <AdminNavBar />

    <div className="flex flex-1 overflow-hidden">
      <AdminSidebar />

      <main className="flex-1 bg-[#F5F6FA] overflow-y-auto custom-scrollbar">
        <Outlet />
      </main>
    </div>
  </div>
);

export default AdminLayout;
