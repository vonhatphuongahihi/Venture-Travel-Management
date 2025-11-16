import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Outlet /> {/* nơi render các route con */}
      </div>
    </div>
  );
}
