
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Users from "./pages/Users";

import Settings from "./pages/Settings";
import TourCreate from "./pages/TourCreate";
import ToursManage from "./pages/ToursManage";
import Bookings from "./pages/Bookings";
import Places from "./pages/Places";
import Reports from "./pages/Reports";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="tours">
          <Route index element={<ToursManage />} />
          <Route path="create-tour" element={<TourCreate />} />
        </Route>
        <Route path="/settings" element={<Settings />}></Route>
        <Route path="*" element={<NotFound />} />
             <Route path="/bookings" element={<Bookings />} />
              <Route path="/attractions" element={<Places />} />
               <Route path="/reports" element={<Reports />} />
      </Routes>
    </BrowserRouter>
  );
}

