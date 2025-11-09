import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import GoogleAuthSuccess from "./pages/GoogleAuthSuccess";
import Profile from "./pages/Profile";
import BookingHistory from "./pages/BookingHistory";
import NotFound from "./pages/NotFound";
import SplashScreen from "./components/SplashScreen";
import Explore360 from "./pages/Explore360";
import Map from "./pages/Map";
import TourDetail from "./pages/TourDetail";
import ProvincePage from "./pages/ProvincePage";
import { AttractionPage } from "./pages/AttractionPage";
import AboutUs from "./pages/AboutUs";
import TermOfUse from "./pages/TermOfUse";
import PrivacyPolicy from "./pages/PrivacyPolicy";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ToastProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/tour" element={<Index />} />
              <Route path="/tour/:id" element={<TourDetail />} />
              <Route path="/explore-360" element={<Explore360 />} />
              <Route path="/map" element={<Map />} />
              <Route path="/province/:slug" element={<ProvincePage />} />
              <Route path="/attraction/:slug" element={<AttractionPage />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/terms" element={<TermOfUse/>}/>
              <Route path="/policy" element={<PrivacyPolicy/>}/>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/auth/google/success" element={<GoogleAuthSuccess />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/booking-history" element={<BookingHistory />} />
              <Route path="*" element={<NotFound />} />
            </Routes >
          </BrowserRouter >
        </ToastProvider>
      </AuthProvider>
    </TooltipProvider >
  </QueryClientProvider >
);

export default App;
