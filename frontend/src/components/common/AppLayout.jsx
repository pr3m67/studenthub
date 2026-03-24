import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import MobileNav from "./MobileNav";

export default function AppLayout() {
  return (
    <div className="min-h-screen md:grid md:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="min-w-0 px-4 py-4 md:px-8 md:py-6">
        <Navbar />
        <main className="pt-6">
          <Outlet />
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
