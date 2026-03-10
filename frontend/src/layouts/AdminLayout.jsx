import { Outlet } from "react-router-dom";
import AdminNavBar from "../components/navbars/AdminNavBar";
import AdminSidebar from "../components/sidebar/AdminSidebar";

const AdminLayout = () => (
  <div className="min-h-screen flex flex-col bg-[#0B0F19] text-white">
    <AdminNavBar />
    <div className="flex flex-1 overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 bg-[#0B0F19] overflow-y-auto">
        <Outlet />
      </main>
    </div>
  </div>
);

export default AdminLayout;