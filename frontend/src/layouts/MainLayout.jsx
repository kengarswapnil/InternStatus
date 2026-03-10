import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F19] text-white">
      <NavBar />
      <div className="flex flex-1 bg-[#0B0F19]">
        <main className="flex-1 bg-[#0B0F19]">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;