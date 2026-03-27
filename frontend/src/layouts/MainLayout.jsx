import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#2D3436] font-['Nunito'] transition-all duration-300">
      <NavBar />
      <div className="flex flex-1 bg-[#F5F6FA]">
        <main className="flex-1 bg-[#FFFFFF]">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
