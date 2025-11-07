import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
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
import DashboardLayout from "./components/DashboardLayout";
import { ToastProvider } from "./contexts/ToastContext";


// Protected Route
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading)
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  if (!isAuthenticated) {
    window.location.href = "/login";
    return null;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <AuthProvider>
       <ToastProvider>
      <BrowserRouter>
        <Routes>
          {/* Login route */}
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="tours" element={<ToursManage />} />
            <Route path="tours/create-tour" element={<TourCreate />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="attractions" element={<Places />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
