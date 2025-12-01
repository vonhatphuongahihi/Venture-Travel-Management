import halongImg from "@/assets/hero-vietnam-1.jpg";
import fansipanImg from "@/assets/fansipan.jpg";
import festivalImg from "@/assets/cultural-festival.jpg";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import UserSidebar from "@/components/UserSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ReviewDialog from "./ReviewDialog";
import { bookingService } from "@/services/booking.service";
import { BookingHistoryItem } from "@/types/tour.types";
import { Loader2 } from "lucide-react";

const BookingHistory = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedFilter, setSelectedFilter] = useState("all");
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [bookings, setBookings] = useState<BookingHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State quản lý đóng mở sidebar trên mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Hoàn tất";
      case "processing":
        return "Đang xử lý";
      case "cancelled":
        return "Bị hủy";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const formatBookingDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const dateStr = date.toLocaleDateString("vi-VN");
    const timeStr = date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return `${dateStr} ${timeStr}`;
  };

  const handleLogout = () => {
    logout();
    showToast("Đã đăng xuất thành công", "success");
    navigate("/login");
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy tour này không?")) {
      return;
    }

    try {
      await bookingService.cancelBooking(bookingId);
      showToast("Hủy tour thành công", "success");

      // Refresh bookings list
      const data = await bookingService.getUserBookings();
      const mappedBookings: any[] = data.map((booking) => ({
        id: booking.bookingId,
        tourCode: booking.bookingId.substring(0, 4).toUpperCase(),
        tourName: booking.tourName,
        bookingDate: booking.bookingDate,
        startDate: booking.startDate,
        status: booking.status,
        totalPrice: booking.totalPrice,
        participants: booking.participants,
        tourImage: booking.tourImage || halongImg,
        tourId: booking.tourId,
      }));
      setBookings(mappedBookings);
    } catch (err: unknown) {
      console.error("Error canceling booking:", err);
      const errorMessage = (err as any)?.response?.data?.message || "Không thể hủy tour. Vui lòng thử lại.";
      showToast(errorMessage, "error");
    }
  };

  // Check authentication on component mount
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
  }, [user, navigate]);

  // Fetch bookings from API
  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;

      setLoading(true);
      setError(null);

      try {
        const data = await bookingService.getUserBookings();

        // Map API data to component format
        const mappedBookings = data.map((booking) => ({
          ...booking,
          tourImage: booking.tourImage || halongImg,
        }));

        setBookings(mappedBookings);

        // Check if there's a new booking from navigation state
        if (location.state?.newBooking) {
          showToast("Đặt tour thành công!", "success");
          // Clear navigation state
          window.history.replaceState({}, document.title);
        }
      } catch (err: unknown) {
        console.error("Error fetching bookings:", err);
        const errorMessage = (err as any)?.response?.data?.message || "Không thể tải lịch sử đặt tour";
        setError(errorMessage);
        showToast(errorMessage, "error");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, location.state, showToast]);

  // Filter tours based on selected filter
  const filteredBookings =
    selectedFilter === "all"
      ? bookings
      : bookings.filter((booking) => booking.status === selectedFilter);

  const filterOptions = [
    { value: "all", label: "Tất cả", count: bookings.length },
    {
      value: "processing",
      label: "Đang xử lý",
      count: bookings.filter((b) => b.status === "processing").length,
    },
    {
      value: "completed",
      label: "Hoàn tất",
      count: bookings.filter((b) => b.status === "completed").length,
    },
    {
      value: "cancelled",
      label: "Bị hủy",
      count: bookings.filter((b) => b.status === "cancelled").length,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="text-center mt-8 md:mt-12 mb-8 md:mb-12 px-4">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
          Lịch Sử <span className="text-gradient">Đặt Tour</span>
        </h2>
      </div>

      <main className="container mx-auto px-4 py-6 md:py-12">
        {/* RESPONSIVE: flex-col trên mobile, flex-row trên desktop (lg) */}
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">

          {/* Sidebar */}
          {/* RESPONSIVE: Width full trên mobile, fixed width trên desktop */}
          <UserSidebar user={user} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} handleLogout={handleLogout} activeLink="booking-history" />

          {/* Main card */}
          <section className="flex-1 min-w-0">
            <div className="bg-white/90 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 p-4 md:p-8">
              <h2 className="text-lg font-medium mb-3">Lịch sử đặt tour</h2>
              <p className="text-sm text-slate-600 mb-6">
                Xem tất cả các tour bạn đã đặt
              </p>

              {/* Filter tabs - Responsive: Scroll ngang trên mobile */}
              <div className="flex gap-4 md:gap-6 mb-6 border-b border-gray-200 overflow-x-auto scrollbar-hide">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedFilter(option.value)}
                    className={`pb-3 px-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${selectedFilter === option.value
                        ? "border-primary text-primary"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                  >
                    {option.label} ({option.count})
                  </button>
                ))}
              </div>

              {/* Booking history content */}
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="animate-spin text-primary" size={48} />
                </div>
              ) : error ? (
                <div className="text-center py-10 text-red-500">
                  {error}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredBookings.map((booking) => (
                    <div
                      key={booking.bookingId}
                      className="border border-gray-200 rounded-lg p-4 md:p-6 hover:shadow-md transition-shadow"
                    >
                      {/* Tour Code & Status */}
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 gap-2">
                        <p className="text-xs md:text-sm font-medium text-gray-500 truncate">
                          #{booking.bookingId.substring(0, 4).toUpperCase()} -{" "}
                          {formatBookingDateTime(booking.bookingDate)}
                        </p>
                        <span
                          className={`px-3 py-1 rounded-full text-xs md:text-sm font-medium w-fit ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {getStatusText(booking.status)}
                        </span>
                      </div>

                      <div className="flex gap-4">
                        {/* Tour Image */}
                        <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0">
                          <img
                            src={booking.tourImage}
                            alt={booking.tourName}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>

                        {/* Booking Details */}
                        <div className="flex-1 min-w-0">
                          <div className="mb-2">
                            <h3 className="text-base md:text-lg font-semibold text-gray-900 line-clamp-2">
                              {booking.tourName}
                            </h3>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-4 text-xs md:text-sm text-gray-600 mb-3">
                            <div>
                              <span className="font-medium">Ngày đi:</span>{" "}
                              {formatDate(booking.startDate)}
                            </div>
                            <div>
                              <span className="font-medium">Số lượng:</span>{" "}
                              {booking.participants} người
                            </div>
                          </div>

                          {/* Price section - Responsive layout */}
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-1">
                            <div className="text-xs md:text-sm text-gray-500">
                              Đơn giá: {formatPrice(booking.totalPrice / booking.participants)}
                            </div>
                            <div className="text-left sm:text-right">
                              <div className="text-sm md:text-base font-bold text-primary">
                                Tổng: {formatPrice(booking.totalPrice)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Divider line */}
                      <div className="border-t border-gray-200 mt-2 mb-3"></div>

                      {/* Action Buttons */}
                      <div className="flex justify-end">
                        <div className="flex flex-wrap gap-2 justify-end">
                          {booking.status === "completed" ? (
                            <button
                              className="px-4 py-1.5 text-xs md:text-sm text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors"
                              onClick={() => {
                                setSelectedBooking(booking);
                                setOpenReviewDialog(true);
                              }}
                            >
                              Đánh giá tour
                            </button>
                          ) : booking.status === "cancelled" ? (
                            <button className="px-4 py-1.5 text-xs md:text-sm text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors">
                              Đặt lại
                            </button>
                          ) : null}

                          {booking.status === "processing" && (
                            <button
                              className="px-4 py-1.5 text-xs md:text-sm text-red-500 border border-red-500 bg-white rounded-lg hover:bg-red-50 transition-colors"
                              onClick={() => handleCancelBooking(booking.bookingId)}
                            >
                              Hủy tour
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  ))}

                  {filteredBookings.length === 0 && (
                    <div className="text-center py-10 text-gray-500">
                      Chưa có lịch sử đặt tour nào.
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <Footer />

      <ReviewDialog
        open={openReviewDialog}
        setOpen={setOpenReviewDialog}
        tourId={selectedBooking?.tourId || selectedBooking?.tourCode}
        tourName={selectedBooking?.tourName}
        tourImage={selectedBooking?.tourImage}
        tourDescription={selectedBooking?.description}
      />
    </div>
  );
};

export default BookingHistory;