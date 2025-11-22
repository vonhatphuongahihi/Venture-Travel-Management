
import { useNavigate, useParams } from "react-router-dom";
import {
  PriceCategories,
  Review,
  TicketPrices,
  TicketType,
  TourDetail,
  TourRoute,
  TourStop,
} from "@/types/tourDetailType";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Bookmark,
  CalendarCog,
  ChevronDown,
  Clock,
  Filter,
  Languages,
  PenLine,
  Share2,
  Smile,
  Star,
  ThumbsUp,
  Ticket,
  Users,
} from "lucide-react";
import RatingDisplay from "@/components/detail/RatingDisplay";
import Inclusions from "@/components/detail/Inclusions";
import Exclusions from "@/components/detail/Exclusions";
import Highlights from "@/components/detail/Highlights";
import Expectations from "@/components/detail/Expectations";
import PickUp from "@/components/detail/PickUp";
import AdditionalInfo from "@/components/detail/AdditionalInfo";
import CancellationPolicy from "@/components/detail/CancellationPolicy";
import ImageGallery from "@/components/detail/ImageGallery";
import Loading from "@/components/detail/Loading";
import Itinerary from "@/components/detail/Itinerary";
import PoilcyModal from "@/components/detail/PoilcyModal";
import DateTourPicker from "@/components/detail/DateTourPicker";
import TravellerPicker from "@/components/detail/TravellerPicker";
import ReviewFilter from "@/components/detail/ReviewFilter";
import TicketTypePicker from "@/components/detail/TicketTypePicker";
import { tourService } from "@/services/tour.service";
import { reviewService } from "@/services/review.service";
import ReviewDialog from "@/pages/BookingHistory/ReviewDialog";
import ShareDialog from "@/components/detail/ShareDialog";
import { useAuth } from "@/contexts/AuthContext";
import UserAPI from "@/services/userAPI";
import { useToast } from "@/contexts/ToastContext";

const TourDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, token, updateUser } = useAuth();
  const { showToast } = useToast();
  ///////////////////// Fetch /////////////////////
  const [tour, setTour] = useState<TourDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [ticketPrices, setTicketPrices] = useState<TicketPrices[]>([]);
  const [userTicket, setUserTicket] = useState({
    currentType: null as TicketType | null,
    priceCategories: [] as any[],
  });
  const totalPrice = userTicket.priceCategories.reduce((sum: number, cat: any) => {
    // Tìm giá tương ứng với loại vé hiện tại và category
    if (!userTicket.currentType) return sum;
    const priceObj = ticketPrices.find(
      (tp: any) =>
        tp.ticketTypeId === userTicket.currentType?.ticketTypeId &&
        tp.categoryId === cat.categoryId
    );

    return sum + (priceObj?.price || 0) * cat.quantity;
  }, 0);
  const [tourStop, setTourStop] = useState<TourStop[]>([]);
  const [tourRoute, setTourRoute] = useState<TourRoute | null>(null);
  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rate === star).length,
  }));

  const fetch = async (refreshReviews = false) => {
    if (!id) {
      setError('Tour ID không hợp lệ');
      setLoading(false);
      return;
    }

    // If only refreshing reviews, skip loading state
    if (!refreshReviews) {
      setLoading(true);
    }

    try {
      setLoading(true);
      setError(null);

      const tourData = await tourService.getTourById(id);

      if (!tourData) {
        setError('Không tìm thấy tour');
        setLoading(false);
        return;
      }

      // Set tour data
      setTour({
        id: tourData.id,
        provinceId: tourData.provinceId,
        title: tourData.title,
        description: tourData.description,
        images: tourData.images || [],
        age: tourData.age,
        maxGroup: tourData.maxGroup,
        duration: tourData.duration,
        languages: tourData.languages,
        categories: tourData.categories || [],
        highlight: tourData.highlight || [],
        inclusions: tourData.inclusions || [],
        exclusions: tourData.exclusions || [],
        expectations: tourData.expectations || [],
        pickUpPoint: tourData.pickUpPoint,
        pickUpDetails: tourData.pickUpDetails,
        pickUpPointGeom: tourData.pickUpPointGeom,
        endPoint: tourData.endPoint || '',
        endPointGeom: tourData.endPointGeom,
        additionalInfo: tourData.additionalInfo || '',
        cancelPolicy: tourData.cancelPolicy,
        contact: tourData.contact,
        startDate: tourData.startDate,
        endDate: tourData.endDate,
        maxBooking: tourData.maxBooking,
        region: tourData.region,
        isActive: tourData.isActive,
        createdAt: tourData.createdAt,
        updatedAt: tourData.updatedAt,
        createdBy: tourData.createdBy,
      } as TourDetail);

      // Set tour stops
      if (tourData.tourStops && tourData.tourStops.length > 0) {
        // Sort by stopOrder
        const sortedStops = [...tourData.tourStops].sort((a, b) => a.stopOrder - b.stopOrder);
        setTourStop(sortedStops);

        // Create tour route from tour stops
        const routeGeom = sortedStops
          .map((stop: TourStop) => stop.attractionGeom)
          .filter((geom) => geom[0] !== 0 && geom[1] !== 0) as [number, number][];

        if (routeGeom.length > 0) {
          setTourRoute({
            route_id: `route_${tourData.id}`,
            tour_id: tourData.id,
            geom: routeGeom,
            createdAt: new Date(),
          });
        }
      }

      // Set reviews (always fetch fresh reviews)
      try {
        const reviewsData = await reviewService.getTourReviews(id, {
          page: 1,
          limit: 50, // Get more reviews
          sortBy: 'createdAt',
          order: 'desc',
        });

        if (reviewsData.reviews) {
          const formattedReviews = reviewsData.reviews.map((review) => ({
            reviewId: review.reviewId,
            userId: review.user.id,
            userName: review.user.name,
            userAvatar: review.user.avatar || '/default-avatar.png',
            targetType: 'tour',
            targetId: id,
            rate: review.rating,
            content: review.content,
            images: review.images || [],
            likesCount: review.likesCount || 0,
            liked: review.liked || false,
            createdAt: new Date(review.date),
            updatedAt: new Date(review.updatedAt || review.date),
          }));

          setReviews(formattedReviews);
          const avgRating = reviewsData.averageRating || 0;
          setRating(parseFloat(avgRating.toFixed(1)));
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
        // Fallback to reviews from tour data if available
        if (tourData.reviews) {
          setReviews(tourData.reviews);
          const avgRating = tourData.reviews.length > 0
            ? tourData.reviews.reduce((sum, r) => sum + r.rate, 0) / tourData.reviews.length
            : 0;
          setRating(parseFloat(avgRating.toFixed(1)));
        }
      }

      // Set ticket prices
      if (tourData.ticketPrices) {
        setTicketPrices(tourData.ticketPrices);
      }
    } catch (error) {
      console.error('Error fetching tour detail:', error);
      setError('Không thể tải thông tin tour');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (id) {
      setLoading(true);
      setError(null);
      fetch(false).finally(() => {
        setLoading(false);
        window.scrollTo({ top: 0, behavior: "auto" });
      });
    } else {
      setError('Tour ID không hợp lệ');
      setLoading(false);
    }
  }, [id]);

  // Function to refresh reviews (can be called after submitting a review)
  const refreshReviews = async () => {
    if (id) {
      try {
        const reviewsData = await reviewService.getTourReviews(id, {
          page: 1,
          limit: 50,
          sortBy: 'createdAt',
          order: 'desc',
        });

        if (reviewsData.reviews) {
          const formattedReviews = reviewsData.reviews.map((review) => ({
            reviewId: review.reviewId,
            userId: review.user.id,
            userName: review.user.name,
            userAvatar: review.user.avatar || '/default-avatar.png',
            targetType: 'tour',
            targetId: id,
            rate: review.rating,
            content: review.content,
            images: review.images || [],
            likesCount: review.likesCount || 0,
            liked: review.liked || false,
            createdAt: new Date(review.date),
            updatedAt: new Date(review.updatedAt || review.date),
          }));

          setReviews(formattedReviews);
          const avgRating = reviewsData.averageRating || 0;
          setRating(parseFloat(avgRating.toFixed(1)));
        }
      } catch (error) {
        console.error('Error refreshing reviews:', error);
      }
    }
  };

  ///////////////////// Interaction /////////////////////
  const handleShare = () => {
    setOpenShareDialog(true);
  };
  const handleWriteReview = () => {
    setOpenReviewDialog(true);
  };
  const handleSave = async () => {
    if (!user || !token) {
      showToast('Vui lòng đăng nhập để lưu tour yêu thích', 'error');
      navigate('/login');
      return;
    }

    if (!id) {
      showToast('Tour ID không hợp lệ', 'error');
      return;
    }

    setIsSavingFavorite(true);
    try {
      const response = await UserAPI.toggleFavoriteTour(token, id);

      if (response.success && response.data) {
        setIsFavorite(response.data.isFavorite);
        showToast(
          response.data.isFavorite
            ? 'Đã thêm vào danh sách yêu thích'
            : 'Đã xóa khỏi danh sách yêu thích',
          'success'
        );

        // Update user context if favoriteTours is available
        if (user && updateUser && response.data.favoriteTours) {
          updateUser({ ...user, favoriteTours: response.data.favoriteTours });
        }
      } else {
        showToast(response.message || 'Thất bại khi lưu tour', 'error');
      }
    } catch (error) {
      console.error('Error saving favorite tour:', error);
      showToast('Thất bại khi lưu tour', 'error');
    } finally {
      setIsSavingFavorite(false);
    }
  };

  // Check if tour is favorite when component mounts or user changes
  useEffect(() => {
    if (user && user.favoriteTours && id) {
      setIsFavorite(user.favoriteTours.includes(id));
    } else {
      setIsFavorite(false);
    }
  }, [user, id]);

  ///////////////////// Gallery /////////////////////
  const [showGallery, setShowGallery] = useState(false);
  const [targetGallery, setTargetGallery] = useState<string[]>([]);
  const [startImageIndex, setStartImageIndex] = useState(0);
  const clickGallery = (index: number) => {
    setStartImageIndex(index);
    setTargetGallery(tour ? tour.images : []);
    setShowGallery(true);
  };

  ///////////////////// Navigation /////////////////////
  const [sectionChosen, setSectionChosen] = useState("overview");
  const tabs = [
    { id: "overview", label: "Tổng quan" },
    { id: "details", label: "Chi tiết" },
    { id: "itinerary", label: "Hành trình" },
    { id: "reviews", label: "Đánh giá" },
  ];
  // Xử lý scroll - hiện navbar phụ
  const [showStickyNav, setShowStickyNav] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const detailsSection = document.getElementById("details");
      if (!detailsSection) return;

      const rect = detailsSection.getBoundingClientRect();
      setShowStickyNav(rect.bottom <= 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  // Smooth scroll đến section
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      // chiều cao navbar (ví dụ 80px)
      let navbarHeight = 64;
      if (showStickyNav) {
        navbarHeight += 56; // chiều cao navbar phụ
      }

      const y = el.getBoundingClientRect().top + window.scrollY - navbarHeight;
      window.scrollTo({ top: y, behavior: "smooth" });

      setSectionChosen(id);
    }
  };
  // Chuyển sectionChosen khi scroll
  useEffect(() => {
    const sections = document.querySelectorAll("section");

    const handleScroll = () => {
      let current = "";
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        // kiểm tra nếu section đang hiển thị tối thiểu 1 phần trên màn hình
        if (rect.top <= 100 && rect.bottom > 100) {
          current = section.id;
        }
      });
      if (current && current !== sectionChosen) {
        setSectionChosen(current);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sectionChosen]);

  ///////////////////// Booking /////////////////////
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  function formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    // Format theo ngôn ngữ tiếng Việt
    let formatted = date.toLocaleDateString("vi-VN", options);
    // Mặc định `toLocaleDateString` ở vi-VN sẽ ra "thứ ba, 27 tháng 9, 2025"
    formatted = formatted.replace(/, (\d+)/, (match, p1) => `, ngày ${p1}`);
    // Viết hoa chữ cái đầu
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }

  ///////////////////// Reviews /////////////////////
  const [filter, setFilter] = useState("Gần đây nhất");
  const options = [
    "Gần đây nhất",
    "Được thích nhiều nhất",
    "Nhiều sao nhất",
    "Ít sao nhất",
  ];
  const filteredReviews = [...reviews].sort((a, b) => {
    switch (filter) {
      case "Nhiều sao nhất":
        return b.rate - a.rate;
      case "Ít sao nhất":
        return a.rate - b.rate;
      case "Được thích nhiều nhất":
        return b.likesCount - a.likesCount;
      case "Gần đây nhất":
      default:
        return b.createdAt.getTime() - a.createdAt.getTime();
    }
  });
  const [puOpen, setPUOpen] = useState(false);
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [openShareDialog, setOpenShareDialog] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSavingFavorite, setIsSavingFavorite] = useState(false);

  // Handle like/unlike review
  const handleLikeReview = async (reviewId: string) => {
    try {
      const result = await reviewService.likeTourReview(reviewId);

      // Update review state
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.reviewId === reviewId
            ? { ...review, likesCount: result.likesCount, liked: result.liked }
            : review
        )
      );
    } catch (error) {
      console.error('Error liking review:', error);
      // You can show a toast notification here
    }
  };

  const handleGoToUser = () => { };

  if (loading) return <Loading />;
  if (error) {
    return (
      <div className="flex flex-col w-full items-center min-h-screen">
        <Header />
        <div className="mt-24 px-[120px] w-full flex flex-col items-center justify-center h-96">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <Button onClick={() => navigate('/')}>Về trang chủ</Button>
        </div>
        <Footer />
      </div>
    );
  }
  if (!tour) {
    return (
      <div className="flex flex-col w-full items-center min-h-screen">
        <Header />
        <div className="mt-24 px-[120px] w-full flex flex-col items-center justify-center h-96">
          <p className="text-gray-500 text-xl mb-4">Không tìm thấy tour</p>
          <Button onClick={() => navigate('/')}>Về trang chủ</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full items-center min-h-screen space-y-10">
      <Header />
      <div className="mt-24 px-[120px] w-full flex flex-col space-y-2">
        {/*Title*/}
        <div className="flex text-black text-3xl font-semibold font-['Inter'] flex-wrap">
          {tour.title}
        </div>
        {/*Rating & Action*/}
        <div className="flex justify-between w-[650px] font-['Inter'] mt-5 h-10 items-center">
          <div className="flex items-center space-x-2">
            <RatingDisplay rating={rating} />
            <p className="text-black font-light font-['Inter']">
              ({reviews.length} đánh giá)
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              className="bg-white text-primary hover:bg-gray-200 flex items-center space-x-1"
              onClick={handleShare}
            >
              <Share2 size={16} />
              <p className="font-['Inter']">Chia sẻ</p>
            </Button>
            <Button
              className="bg-white text-primary hover:bg-gray-200 flex items-center space-x-1"
              onClick={handleWriteReview}
            >
              <PenLine size={16} />
              <p className="font-['Inter']">Đánh giá</p>
            </Button>
            <Button
              className={`${isFavorite ? 'bg-primary text-white' : 'hover:bg-primary/40 hover:text-white'} flex items-center space-x-1`}
              onClick={handleSave}
              disabled={isSavingFavorite || !user}
            >
              <Bookmark size={16} className={isFavorite ? 'fill-white' : ''} />
              <p className="font-['Inter']">
                {isSavingFavorite ? 'Đang lưu...' : isFavorite ? 'Đã lưu' : 'Lưu'}
              </p>
            </Button>
          </div>
        </div>
        {/*Small Gallery*/}
        <div className="flex w-full justify-between space-x-2">
          <img
            className="w-2/3 h-[500px] rounded-tl-2xl rounded-bl-2xl cursor-pointer"
            alt={`${tour.title}1`}
            src={
              tour.images[0] ? tour.images[0] : "https://placehold.co/795x500"
            }
            onClick={() => clickGallery(0)}
          />
          <div className="flex w-1/3 flex-col justify-between space-y-2">
            <img
              className="w-full h-[245px] rounded-tr-2xl cursor-pointer"
              alt={`${tour.title}2`}
              src={
                tour.images[1] ? tour.images[1] : "https://placehold.co/400x245"
              }
              onClick={() => clickGallery(1)}
            />
            <div
              className="relative h-full cursor-pointer"
              onClick={() => clickGallery(2)}
            >
              <img
                className="w-full h-[245px] rounded-br-2xl"
                alt={`${tour.title}3`}
                src={
                  tour.images[2]
                    ? tour.images[2]
                    : "https://placehold.co/400x245"
                }
              />
              {/*Overlay*/}
              {tour.images.length > 3 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-br-2xl">
                  <span className="text-white text-4xl font-bold">
                    +{tour.images.length - 3}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        {/*Gallery Modal*/}
        {
          showGallery && (
            <ImageGallery
              target={targetGallery}
              currentIndex={startImageIndex}
              onClose={() => setShowGallery(false)}
            />
          )
        }
        {/*Overview & Details & Booking*/}
        <div className="relative">
          {/* Sticky Secondary Navbar */}
          <div
            className={`fixed top-0 left-0 w-full bg-white shadow z-10 transition-all duration-300 ease-out ${showStickyNav
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-100 pointer-events-none"
              }`}
          >
            <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
              {/* Tabs */}
              <div className="flex gap-6 text-sm font-medium h-full">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => scrollToSection(tab.id)}
                    className={`${sectionChosen === tab.id
                      ? "text-primary border-b-2 border-primary"
                      : "text-black"
                      } w-[100px] h-full hover:bg-primary hover:text-white font-['Inter'] font-semibold`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Price + button */}
              <div className="flex items-center gap-4">
                <span className="font-semibold">Chỉ từ 3,000,000 ₫</span>
                <Button
                  className="bg-primary font-semibold border border-2 border-black text-white px-4 py-2 rounded-full hover:bg-primary/50"
                  onClick={() => {
                    const el = document.getElementById("booking");
                    if (el) {
                      const y =
                        el.getBoundingClientRect().top + window.scrollY - 20; // chừa cho navbar
                      window.scrollTo({ top: y, behavior: "smooth" });
                    }
                  }}
                >
                  Đặt chỗ ngay
                </Button>
              </div>
            </div>
          </div>

          {/* Main Layout */}
          <div className="max-w-7xl mx-auto px-4 py-2 grid grid-cols-1 md:grid-cols-3 gap-6 mb-40">
            {/* Left content */}
            <div className="col-span-2 flex flex-col">
              <div className="flex gap-6 text-sm font-medium h-10">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => scrollToSection(tab.id)}
                    className={`${sectionChosen === tab.id
                      ? "text-primary border-b-2 border-primary"
                      : "text-black"
                      } w-[100px] hover:bg-primary hover:text-white font-['Inter'] font-semibold`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <section
                id={"overview"}
                className="rounded mt-6 px-6 font-['Inter']"
              >
                <h2 className="text-xl font-bold mb-4">Về chuyến đi</h2>
                <p className="justify-start text-black font-normal">
                  {tour.description}
                </p>
                <div className="w-full border-t border-primary my-5"></div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Smile className="w-5 h-5 text-gray-700" />
                    <span>
                      <strong>Độ tuổi: </strong>
                      {`${tour.age} tuổi`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-gray-700" />
                    <span>
                      <strong>Giới hạn nhóm:</strong> Tối đa {tour.maxGroup}{" "}
                      người/nhóm
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-700" />
                    <span>
                      <strong>Thời lượng:</strong> {tour.duration}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Languages className="w-5 h-5 text-gray-700" />
                    <span>
                      <strong>Hướng dẫn viên:</strong> {tour.languages}
                    </span>
                  </div>
                </div>
                <div className="w-full border-t border-primary mt-5 mb-2"></div>
              </section>
              <section id={"details"} className="rounded px-6 font-['Inter']">
                <Highlights highlight={tour.highlight} />
                <Inclusions inclusions={tour.inclusions} />
                <Exclusions exclusions={tour.exclusions} />
                <Expectations expectations={tour.expectations} />
                <PickUp
                  id={"pickUp"}
                  pickUpPoint={tour.pickUpPoint}
                  pickUpDetails={tour.pickUpDetails}
                  endPoint={tour.endPoint}
                  open={puOpen}
                  setOpen={setPUOpen}
                />
                <AdditionalInfo additionalInfo={tour.additionalInfo} />
                <CancellationPolicy cancelPolicy={tour.cancelPolicy} />
              </section>
            </div>

            {/* Right sticky price card */}
            <div id={"booking"} className="col-span-1 font-['Inter']">
              <div className="sticky top-2 min-h-[360px] h-auto bg-white rounded-xl shadow-xl shadow-primary">
                <div className="flex items-center font-semibold font-xl bg-primary w-full h-14 text-white rounded-t-xl p-5">
                  <p className="font-bold text-lg">
                    Chọn ngày và số lượng hành khách
                  </p>
                </div>
                {/*Date and travellers*/}
                <div className="py-5 px-4 w-full flex justify-between">
                  <DateTourPicker
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                  />
                  <TravellerPicker
                    userTicket={userTicket}
                    ticketPrices={ticketPrices}
                    setUserTicket={setUserTicket}
                  />
                </div>
                <TicketTypePicker userTicket={userTicket} setUserTicket={setUserTicket} ticketPrices={ticketPrices} totalPrice={totalPrice} />
                <div className="w-full flex justify-center">
                  <Button className="flex justify-center space-x-2 w-80 text-white rounded-2xl hover:bg-primary/50 border border-2 border-gray-300">
                    <Ticket size={24} />
                    <p className=" text-xl font-semibold ">Đặt chỗ ngay</p>
                  </Button>
                </div>
                <div className="w-[360px] ml-[20px] border-t border-primary my-5"></div>
                <div></div>
                <div className="px-5 flex items-start text-xs gap-2 pb-5">
                  <CalendarCog className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <p>
                    <PoilcyModal cancelPolicy={tour.cancelPolicy} /> – Hủy bất
                    cứ lúc nào trước{" "}
                    <span className="font-medium">
                      {formatDate(
                        new Date(
                          selectedDate.getTime() - 1 * 24 * 60 * 60 * 1000
                        )
                      )}
                    </span>{" "}
                    để được hoàn tiền đầy đủ.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*Itinerary*/}
        <div className="flex w-full justify-between space-x-2">
          <section id={"itinerary"} className="h-full w-full rounded p-6">
            <h2 className="text-2xl font-['Inter'] font-bold mb-4">
              Hành trình
            </h2>
            <Itinerary
              tourStop={tourStop}
              tourRoute={tourRoute}
              setPUOpen={setPUOpen}
            />
          </section>
        </div>
        {/*Reviews*/}
        <div className="flex w-full justify-between space-x-2">
          <section id={"reviews"} className="h-full w-full rounded p-6">
            <h2 className="text-2xl font-bold font-['Inter'] mb-4">Đánh giá</h2>
            <div className="w-full flex justify-between items-start">
              {/* Filter & Reviews */}
              <div className="w-[800px] flex flex-col">
                {/*Filter*/}
                <div className="flex w-full justify-between items-center">
                  <div className="flex text-lg font-semibold items-center space-x-2">
                    <Filter size={16} />
                    <p>Bộ lọc</p>
                  </div>
                  <ReviewFilter value={filter} setValue={setFilter} options={options} />
                </div>
                {/* Reviews List */}
                <ul className="mt-4 space-y-2">
                  {filteredReviews.map((review) => (
                    <li
                      key={review.reviewId}
                      className="p-3 border-b border-primary rounded space-y-2"
                    >
                      {/*General Review Info*/}
                      <div className="w-full flex justify-between">
                        <div className="flex-col space-y-2">
                          <div className="flex items-center">
                            <img
                              src={review.userAvatar}
                              className="w-10 h-10 rounded-full mr-3 cursor-pointer hover:border-2 border-primary"
                              onClick={handleGoToUser}
                            />
                            <div className="flex-col space-y-2">
                              <p
                                className="font-semibold cursor-pointer hover:underline"
                                onClick={handleGoToUser}
                              >
                                {review.userName}
                              </p>
                              <p className="italic text-sm text-gray-500">
                                Đăng vào {formatDate(review.createdAt)}
                              </p>
                            </div>
                          </div>
                          <RatingDisplay rating={review.rate} />
                        </div>
                        <div
                          className={`flex items-center h-10 space-x-2 cursor-pointer p-2 rounded-lg justify-end transition-colors ${review.liked
                            ? 'text-white bg-primary'
                            : 'text-primary hover:text-white hover:bg-primary'
                            }`}
                          onClick={() => handleLikeReview(review.reviewId)}
                        >
                          <ThumbsUp
                            size={20}
                            className={`mr-3 ${review.liked ? 'fill-white' : ''}`}
                          />
                          {review.likesCount}
                        </div>
                      </div>

                      <p>{review.content}</p>

                      {/* Review Images */}
                      {review.images.length > 0 && (
                        <div className="flex space-x-2 overflow-x-auto">
                          {review.images.map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt={`Review ${review.reviewId} Image ${idx + 1}`}
                              className="w-32 h-32 object-cover rounded cursor-pointer"
                              onClick={() => {
                                setStartImageIndex(idx);
                                setTargetGallery(review.images);
                                setShowGallery(true);
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              {/* Rating Summary */}
              <div className="flex flex-col items-center space-y-5 w-[350px] h-[250px] outline outline-1 outline-primary rounded-xl bg-background p-6">
                <div className="flex items-center justify-center space-x-2">
                  <RatingDisplay rating={rating} />
                  <p className="text-black font-light font-['Inter']">
                    ({reviews.length} đánh giá)
                  </p>
                </div>
                <div className="space-y-2">
                  {ratingCounts.map(({ star, count }) => (
                    <div key={star} className="flex items-center">
                      {/* Cột sao (cố định chiều rộng để thẳng hàng) */}
                      <div className="flex text-primary justify-end w-28 mr-2">
                        {Array.from({ length: star }).map((_, i) => (
                          <Star key={i} className="fill-primary text-primary" />
                        ))}
                      </div>
                      {/* Cột số */}
                      <span className="font-bold">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div >
      <div className="w-full">
        <Footer />
      </div>

      {/* Review Dialog */}
      <ReviewDialog
        open={openReviewDialog}
        setOpen={setOpenReviewDialog}
        tourId={tour?.id}
        tourName={tour?.title}
        tourImage={tour?.images?.[0]}
        tourDescription={tour?.description}
        attractionIds={tourStop.map((stop) => stop.attractionId).filter(Boolean)}
        onSuccess={() => {
          // Refresh reviews after successful submission
          if (id) {
            refreshReviews();
          }
        }}
      />

      {/* Share Dialog */}
      {tour && (
        <ShareDialog
          open={openShareDialog}
          setOpen={setOpenShareDialog}
          tourId={tour.id}
          tourName={tour.title}
          tourImage={tour.images?.[0]}
        />
      )}
    </div >
  );
};
export default TourDetailPage;
