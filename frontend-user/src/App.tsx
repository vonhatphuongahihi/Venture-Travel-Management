import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { ProvinceProvider } from "@/contexts/ProvinceContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { BookingProvider } from "./contexts/BookingContext";
import SplashScreen from "./components/SplashScreen";
import "./i18n/config";
import AboutUs from "./pages/AboutUs";
import { AttractionPage } from "./pages/AttractionPage";
import BookingHistory from "./pages/BookingHistory/BookingHistory";
import BookTourNew from "./pages/BookTourNew";
import Checkout from "./pages/Checkout";
import Contact from "./pages/Contact";
import Explore360 from "./pages/Explore360";
import GoogleAuthSuccess from "./pages/GoogleAuthSuccess";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Map from "./pages/Map";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Profile from "./pages/Profile";
import ExploreProvince from "./pages/Province/ExploreProvince";
import ProvincePage from "./pages/Province/ProvincePage";
import ProvinceTours from "./pages/Province/ProvinceTours";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import TermOfUse from "./pages/TermOfUse";
import TourDetail from "./pages/TourDetail";
import VerifyEmail from "./pages/VerifyEmail";
import FavoriteTour from "./pages/FavoriteTour";
import Settings from "./pages/Settings";
import ScrollToTopButton from "@/components/ScrollToTopButton";

const queryClient = new QueryClient();

const App = () => {
  const hideScrollButtonPaths = ["/login", "/register"];
  const currentPath = window.location.pathname;
  const showScrollButton = !hideScrollButtonPaths.includes(currentPath);

  return (
    <QueryClientProvider client={queryClient}>
      <BookingProvider>
        <TooltipProvider>
          <AuthProvider>
            <ProvinceProvider>
              <ToastProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<SplashScreen />} />
                    <Route path="/tour" element={<Index />} />
                    <Route path="/tour/:id" element={<TourDetail />} />
                    <Route path="/book-tour" element={<BookTourNew />} />
                    <Route path="/explore-360" element={<Explore360 />} />
                    <Route path="/map" element={<Map />} />
                    <Route path="/province/:slug" element={<ProvincePage />}>
                      <Route index element={<ExploreProvince />} />
                      <Route path="tours-activities" element={<ProvinceTours />} />
                    </Route>
                    <Route path="/attraction/:slug" element={<AttractionPage />} />
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/terms" element={<TermOfUse />} />
                    <Route path="/policy" element={<PrivacyPolicy />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/verify-email" element={<VerifyEmail />} />
                    <Route
                      path="/auth/google/success"
                      element={<GoogleAuthSuccess />}
                    />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/booking-history" element={<BookingHistory />} />
                    <Route path="/favorite-tours" element={<FavoriteTour />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
                {showScrollButton && <ScrollToTopButton />}
              </ToastProvider>
            </ProvinceProvider>
          </AuthProvider>
        </TooltipProvider>
      </BookingProvider>
    </QueryClientProvider>
  );
};

export default App;
