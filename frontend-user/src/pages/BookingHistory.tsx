import avatarImg from "@/assets/beach-destination.jpg";
import halongImg from "@/assets/hero-vietnam-1.jpg";
import fansipanImg from "@/assets/fansipan.jpg";
import festivalImg from "@/assets/cultural-festival.jpg";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const BookingHistory = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [selectedFilter, setSelectedFilter] = useState('all');

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Hoàn tất';
      case 'processing':
        return 'Đang xử lý';
      case 'cancelled':
        return 'Bị hủy';
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatBookingDateTime = (dateString) => {
    const date = new Date(dateString);
    const dateStr = date.toLocaleDateString('vi-VN');
    const timeStr = date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
    return `${dateStr} ${timeStr}`;
  };

  const handleLogout = () => {
    logout();
    showToast('Đã đăng xuất thành công', 'success');
    navigate('/login');
  };

  // Check authentication on component mount
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  // Dữ liệu tour mẫu
  const sampleBookings = [
    {
      id: 1,
      tourCode: "T001",
      tourName: "Du lịch Hạ Long 3N2Đ",
      bookingDate: "2024-11-01T17:25:00",
      startDate: "2024-11-15",
      status: "processing",
      totalPrice: 2500000,
      participants: 2,
      tourImage: halongImg
    },
    {
      id: 2,
      tourCode: "T002",
      tourName: "Tour Sapa 2N1Đ",
      bookingDate: "2024-10-15T14:30:00",
      startDate: "2024-10-28",
      status: "completed",
      totalPrice: 1800000,
      participants: 1,
      tourImage: fansipanImg
    },
    {
      id: 3,
      tourCode: "T003",
      tourName: "Phú Quốc 4N3Đ",
      bookingDate: "2024-09-20T09:15:00",
      startDate: "2024-10-05",
      status: "completed",
      totalPrice: 3200000,
      participants: 3,
      tourImage: avatarImg
    },
    {
      id: 4,
      tourCode: "T004",
      tourName: "Đà Nẵng - Hội An 3N2Đ",
      bookingDate: "2024-12-01T20:45:00",
      startDate: "2024-12-20",
      status: "cancelled",
      totalPrice: 2100000,
      participants: 2,
      tourImage: festivalImg
    }
  ];

  // Filter tours based on selected filter
  const filteredBookings = selectedFilter === 'all' 
    ? sampleBookings 
    : sampleBookings.filter(booking => booking.status === selectedFilter);

  const filterOptions = [
    { value: 'all', label: 'Tất cả', count: sampleBookings.length },
    { value: 'processing', label: 'Đang xử lý', count: sampleBookings.filter(b => b.status === 'processing').length },
    { value: 'completed', label: 'Hoàn tất', count: sampleBookings.filter(b => b.status === 'completed').length },
    { value: 'cancelled', label: 'Bị hủy', count: sampleBookings.filter(b => b.status === 'cancelled').length }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="text-center mt-8 md:mt-12 mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Lịch Sử <span className="text-gradient">Đặt Tour</span>
        </h2>
      </div>

      <main className="container py-12">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 bg-white/80 rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow duration-200 self-start sticky top-4">
            <div className="flex items-center gap-3 mb-6 mt-6">
              <img src={user?.profile_photo || avatarImg} alt="avatar" className="h-12 w-12 rounded-full object-cover" />
              <div>
                <div className="text-m font-medium">{user?.name || 'Người dùng'}</div>
                <div className="text-xs text-slate-600">Thành viên</div>
              </div>
            </div>

            <nav className="space-y-2">
              <Link to="/profile" className="block text-m text-slate-600 py-2 px-3 rounded-md hover:bg-primary/10">Hồ sơ của tôi</Link>
              <Link to="#" className="block text-m text-slate-600 py-2 px-3 rounded-md hover:bg-primary/10">Thông báo</Link>
              <Link to="/booking-history" className="block text-m py-2 px-3 rounded-md border text-primary border border-primary/50">Lịch sử đặt tour</Link>
              <Link to="#" className="block text-m text-slate-600 py-2 px-3 rounded-md hover:bg-primary/10">Cài đặt</Link>
            </nav>

            <div className="mt-6 border-t border-border pt-4">
              <button className="w-full text-m text-slate-600 text-left py-2 px-3 rounded-md hover:bg-primary/10">Điều khoản sử dụng</button>
              <button className="w-full text-m mt-3 text-slate-600 text-left py-2 px-3 rounded-md hover:bg-primary/10">Chính sách bảo mật</button>
              <Link to="/about" className="block w-full text-m mt-3 text-slate-600 text-left py-2 px-3 rounded-md hover:bg-primary/10">Về VENTURE</Link>
              <button 
                onClick={handleLogout}
                className="w-full text-l text-red-500 text-center py-2 px-3 rounded-md mt-12 bg-red-50 text-red-600 transform transition-transform duration-500 hover:scale-105 hover:bg-red-500 hover:text-white"
              >
                Đăng xuất
              </button>
            </div>
          </aside>

          {/* Main card */}
          <section className="flex-1">
            <div className="bg-white/90 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 p-8">
              <h2 className="text-lg font-medium mb-3">Lịch sử đặt tour</h2>
              <p className="text-sm text-slate-600 mb-6">
                Xem tất cả các tour bạn đã đặt
              </p>

              {/* Filter tabs */}
              <div className="flex gap-6 mb-6 border-b border-gray-200">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedFilter(option.value)}
                    className={`pb-3 px-2 text-sm font-medium border-b-2 transition-colors ${
                      selectedFilter === option.value
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {option.label} ({option.count})
                  </button>
                ))}
              </div>
              
              {/* Booking history content */}
              <div className="space-y-4">
                {filteredBookings.map((booking) => (
                  <div key={booking.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    {/* Tour Code */}
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-sm font-medium text-gray-500">
                        #{booking.tourCode} - {formatBookingDateTime(booking.bookingDate)}
                      </p>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusText(booking.status)}
                      </span>
                    </div>
                    
                    <div className="flex gap-4">
                      {/* Tour Image */}
                      <div className="w-24 h-24 flex-shrink-0">
                        <img 
                          src={booking.tourImage} 
                          alt={booking.tourName}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      
                      {/* Booking Details */}
                      <div className="flex-1">
                        <div className="mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{booking.tourName}</h3>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                          <div>
                            <span className="font-medium">Ngày bắt đầu:</span> {formatDate(booking.startDate)}
                          </div>
                          <div>
                            <span className="font-medium">Loại vé:</span> {booking.participants} người
                          </div>
                        </div>
                        
                        {/* Price section */}
                        <div className="flex justify-between items-start mb-3">
                          <div className="text-sm font-bold text-primary">
                              {formatPrice(booking.totalPrice / booking.participants)}
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-primary">
                              Tổng: {formatPrice(booking.totalPrice)}
                            </div>
                          </div>
                        </div>
                        
                        {/* Divider line */}
                        <div className="border-t border-gray-200 mb-3"></div>
                        
                        <div className="flex justify-end">
                          <div className="flex gap-2">
                            {booking.status === 'completed' ? (
                              <button className="px-4 py-1 text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors">
                                Đánh giá tour
                              </button>
                            ) : booking.status === 'cancelled' ? (
                              <button className="px-4 py-1 text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors">
                                Đặt lại
                              </button>
                            ) : null}
                            {booking.status === 'processing' && (
                              <button className="px-4 py-1 text-red-500 border border-red-500 bg-white rounded-lg hover:bg-red-50 transition-colors">
                                Hủy tour
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookingHistory;
