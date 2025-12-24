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
import { bookingService } from "@/services/booking.service";
import { useAuth } from "@/contexts/AuthContext";
import UserAPI from "@/services/userAPI";
import { useToast } from "@/contexts/ToastContext";
import RequireSignIn from "@/components/detail/RequireSignIn";
import { useTranslation } from "react-i18next";

const TourDetailPage = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, token, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [requireDialogOpen, setRequireDialogOpen] = useState(false);
  ///////////////////// Fetch /////////////////////
  const [tour, setTour] = useState<TourDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [ticketPrices, setTicketPrices] = useState<TicketPrices[]>([]);
  const [userTicket, setUserTicket] = useState({
    currentType: null as TicketType | null,
    priceCategories: [] as any[],
  });
  const totalPrice = userTicket.priceCategories.reduce((sum: number, cat: any) => {
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
  const [minPrice, setMinPrice] = useState<number>()
  const fetch = async (refreshReviews = false) => {
    if (!id) {
      setError(t('tourDetail.invalidTourId'));
      setLoading(false);
      return;
    }

    if (!refreshReviews) {
      setLoading(true);
    }

    try {
      setLoading(true);
      setError(null);

      const tourData = await tourService.getTourById(id);

      console.log(tourData)
      if (!tourData) {
        setError(t('tourDetail.tourNotFound'));
        setLoading(false);
        return;
      }

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
        pickUpAreaGeom: tourData.pickUpAreaGeom || [],
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
        ticketTypes: tourData.ticketTypes || [],
      } as TourDetail);

      if (tourData.tourStops && tourData.tourStops.length > 0) {
        const sortedStops = [...tourData.tourStops].sort((a, b) => a.stopOrder - b.stopOrder);
        setTourStop(sortedStops);

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

          if (user?.userId) {
            const userHasReviewed = formattedReviews.some(review => review.userId === user.userId);
            setHasReviewed(userHasReviewed);
          }
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
        if (tourData.reviews) {
          setReviews(tourData.reviews);
          const avgRating = tourData.reviews.length > 0
            ? tourData.reviews.reduce((sum, r) => sum + r.rate, 0) / tourData.reviews.length
            : 0;
          setRating(parseFloat(avgRating.toFixed(1)));

          if (user?.userId) {
            const userHasReviewed = tourData.reviews.some((review: any) => review.userId === user.userId);
            setHasReviewed(userHasReviewed);
          }
        }
      }

      if (tourData.ticketTypes) {
        setTicketTypes(tourData.ticketTypes);
      }

      if (tourData.ticketPrices) {
        setTicketPrices(tourData.ticketPrices);
      }
    } 
      catch (error) {
      console.error('Error fetching tour detail:', error);
      setError(t('tourDetail.loadError'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMinPrice(ticketPrices.length > 0
        ? Math.min(...ticketPrices.map(tp => tp.price))
        : 0);
  }, [ticketPrices])
  useEffect(() => {
    if (id) {
      setLoading(true);
      setError(null);
      fetch(false).finally(() => {
        setLoading(false);
        window.scrollTo({ top: 0, behavior: "auto" });
      });
    } else {
      setError(t('tourDetail.invalidTourId'));
      setLoading(false);
    }
  }, [id]);

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

          if (user?.userId) {
            const userHasReviewed = formattedReviews.some(review => review.userId === user.userId);
            setHasReviewed(userHasReviewed);
          }
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
      showToast(t('tourDetail.loginRequired'), 'error');
      navigate('/login');
      return;
    }

    if (!id) {
      showToast(t('tourDetail.invalidTourId'), 'error');
      return;
    }

    setIsSavingFavorite(true);
    try {
      const response = await UserAPI.toggleFavoriteTour(token, id);

      if (response.success && response.data) {
        setIsFavorite(response.data.isFavorite);
        showToast(
          response.data.isFavorite
            ? t('tourDetail.addedToFavorites')
            : t('tourDetail.removedFromFavorites'),
          'success'
        );
      } else {
        showToast(response.message || t('tourDetail.saveError'), 'error');
      }
    } catch (error) {
      console.error('Error saving favorite tour:', error);
      showToast(t('tourDetail.saveError'), 'error');
    } finally {
      setIsSavingFavorite(false);
    }
  };

  // Check favorite status on mount or when tour/token changes
  useEffect(() => {
    let isMounted = true;

    const fetchFavoriteStatus = async () => {
      if (!token || !id) {
        if (isMounted) {
          setIsFavorite(false);
        }
        return;
      }

      try {
        const response = await UserAPI.getFavoriteTours(token);
        if (response.success && response.data && isMounted) {
          const isFav = response.data.some(
            (favoriteTour: any) =>
              favoriteTour.tourId === id ||
              favoriteTour.id === id
          );
          setIsFavorite(isFav);
        }
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };

    fetchFavoriteStatus();

    return () => {
      isMounted = false;
    };
  }, [token, id]);

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
    { id: "overview", label: t("tourDetail.tabs.overview") },
    { id: "details", label: t("tourDetail.tabs.details") },
    { id: "itinerary", label: t("tourDetail.tabs.itinerary") },
    { id: "reviews", label: t("tourDetail.tabs.reviews") },
  ];
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
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      let navbarHeight = 64;
      if (showStickyNav) {
        navbarHeight += 56;
      }

      const y = el.getBoundingClientRect().top + window.scrollY - navbarHeight;
      window.scrollTo({ top: y, behavior: "smooth" });

      setSectionChosen(id);
    }
  };
  useEffect(() => {
    const sections = document.querySelectorAll("section");

    const handleScroll = () => {
      let current = "";
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
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
    let formatted = date.toLocaleDateString("vi-VN", options);
    formatted = formatted.replace(/, (\d+)/, (match, p1) => `, ngày ${p1}`);
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }

  ///////////////////// Reviews /////////////////////
  const [filter, setFilter] = useState(t("tourDetail.reviewFilters.mostRecent"));
  const options = [
    t("tourDetail.reviewFilters.mostRecent"),
    t("tourDetail.reviewFilters.mostLiked"),
    t("tourDetail.reviewFilters.highestRated"),
    t("tourDetail.reviewFilters.lowestRated"),
  ];
  const filteredReviews = [...reviews].sort((a, b) => {
    switch (filter) {
      case t("tourDetail.reviewFilters.highestRated"):
        return b.rate - a.rate;
      case t("tourDetail.reviewFilters.lowestRated"):
        return a.rate - b.rate;
      case t("tourDetail.reviewFilters.mostLiked"):
        return b.likesCount - a.likesCount;
      case t("tourDetail.reviewFilters.mostRecent"):
      default:
        return b.createdAt.getTime() - a.createdAt.getTime();
    }
  });
  const [puOpen, setPUOpen] = useState(false);
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [openShareDialog, setOpenShareDialog] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSavingFavorite, setIsSavingFavorite] = useState(false);

  useEffect(() => {
    let mounted = true;
    const check = async () => {
      if (!isAuthenticated || !id) {
        if (mounted) setCanReview(false);
        return;
      }

      try {
        const bookings = await bookingService.getUserBookings();
        const hasBooked = bookings.some((b: any) => (b.tourId === id || b.tourId === id) && b.status !== 'cancelled');
        if (mounted) setCanReview(hasBooked && !hasReviewed);
      } catch (err) {
        console.error('Error checking bookings for review permission', err);
        if (mounted) setCanReview(false);
      }
    };

    check();

    return () => { mounted = false; };
  }, [isAuthenticated, id, hasReviewed]);

  const handleLikeReview = async (reviewId: string) => {
    try {
      const result = await reviewService.likeTourReview(reviewId);
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.reviewId === reviewId
            ? { ...review, likesCount: result.likesCount, liked: result.liked }
            : review
        )
      );
    } catch (error) {
      console.error('Error liking review:', error);
    }
  };

  const handleGoToUser = () => { };
  const isValidTickets = (tickets: {
    currentType: TicketType | null;
    priceCategories: any[];
  }) => {
    if (!tickets || !Array.isArray(tickets.priceCategories)) {
      return false;
    }
    return tickets?.priceCategories.some(item => item.quantity >= 1);
  };

  if (loading) return <Loading />;
  if (error) {
    return (
      <div className="flex flex-col w-full items-center min-h-screen">
        <Header />
        <div className="mt-24 px-4 md:px-8 w-full flex flex-col items-center justify-center h-96">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <Button onClick={() => navigate('/')}>{t("tourDetail.backToHome")}</Button>
        </div>
        <Footer />
      </div>
    );
  }
  if (!tour) {
    return (
      <div className="flex flex-col w-full items-center min-h-screen">
        <Header />
        <div className="mt-24 px-4 md:px-8 w-full flex flex-col items-center justify-center h-96">
          <p className="text-gray-500 text-xl mb-4">{t("tourDetail.tourNotFound")}</p>
          <Button onClick={() => navigate('/')}>{t("tourDetail.backToHome")}</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full items-center min-h-screen space-y-6 md:space-y-10">
      <Header />
      {/* Container chính: Thay đổi px-[120px] thành responsive */}
      <div className="mt-24 px-4 md:px-8 lg:px-[80px] w-full flex flex-col space-y-2 md:space-y-4">
        {/*Title*/}
        <div className="flex text-black text-2xl md:text-3xl font-semibold font-['Inter'] flex-wrap">
          {tour.title}
        </div>
        {/*Rating & Action*/}
        <div className="flex flex-col md:flex-row justify-between w-full lg:max-w-[650px] font-['Inter'] mt-2 md:mt-5 h-auto md:h-10 items-start md:items-center gap-4 md:gap-0">
          <div className="flex items-center space-x-2">
            <RatingDisplay rating={rating} />
            <p className="text-black font-light font-['Inter']">
              ({reviews.length} {t("tourDetail.reviews")})
            </p>
          </div>
          <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <Button
              className="bg-gray-100 text-primary hover:bg-gray-200 flex items-center space-x-1 shrink-0"
              onClick={handleShare}
            >
              <Share2 size={16} />
              <p className="font-['Inter']">{t("tourDetail.share")}</p>
            </Button>
            <Button
              className={`bg-gray-100 text-primary hover:bg-gray-200 flex items-center space-x-1 shrink-0 ${!canReview ? 'opacity-60 cursor-not-allowed' : ''}`}
              onClick={() => {
                if (!isAuthenticated) {
                  showToast(t('tourDetail.loginRequired'), 'error');
                  navigate('/login');
                  return;
                }

                if (hasReviewed) {
                  showToast(t('tourDetail.alreadyReviewed'), 'info');
                  return;
                }

                if (!canReview) {
                  showToast(t('tourDetail.reviewRequiresBooking'), 'error');
                  return;
                }

                setOpenReviewDialog(true);
              }}
              disabled={!canReview}
            >
              {hasReviewed ? <Star size={16} className="fill-yellow-400 text-yellow-400" /> : <PenLine size={16} />}
              <p className="font-['Inter']">
                {hasReviewed ? t("tourDetail.alreadyReviewedShort") : t("tourDetail.writeReview")}
              </p>
            </Button>
            <Button
              className={`${isFavorite
                ? "bg-[#26B8ED] text-white"
                : "hover:bg-gray-200 bg-gray-100 text-primary"
                } flex items-center space-x-1 shrink-0`}
              onClick={handleSave}
              disabled={isSavingFavorite || !user}
            >
              <Bookmark size={16} className={isFavorite ? "fill-white" : ""} />
              <p className="font-['Inter']">
                {isSavingFavorite
                  ? isFavorite
                    ? t("tourDetail.unsaving")
                    : t("tourDetail.saving")
                  : isFavorite
                    ? t("tourDetail.saved")
                    : t("tourDetail.save")}
              </p>
            </Button>
          </div>
        </div>

        {/*Small Gallery: Responsive Grid*/}
        <div className="flex flex-col md:flex-row w-full justify-between gap-2 md:space-x-2">
          {/* Main Image */}
          <img
            className="w-full md:w-2/3 h-[300px] md:h-[500px] rounded-2xl md:rounded-l-2xl md:rounded-r-none object-cover cursor-pointer"
            alt={`${tour.title}1`}
            src={
              tour.images[0] ? tour.images[0] : "https://placehold.co/795x500"
            }
            onClick={() => clickGallery(0)}
          />
          {/* Side Images */}
          <div className="flex flex-row md:flex-col w-full md:w-1/3 justify-between gap-2 md:space-y-2">
            <img
              className="w-1/2 md:w-full h-[150px] md:h-[245px] rounded-l-2xl md:rounded-bl-none md:rounded-tr-2xl object-cover cursor-pointer"
              alt={`${tour.title}2`}
              src={
                tour.images[1] ? tour.images[1] : "https://placehold.co/400x245"
              }
              onClick={() => clickGallery(1)}
            />
            <div
              className="relative w-1/2 md:w-full h-[150px] md:h-[245px] cursor-pointer"
              onClick={() => clickGallery(2)}
            >
              <img
                className="w-full h-full rounded-r-2xl md:rounded-tr-none md:rounded-br-2xl object-cover"
                alt={`${tour.title}3`}
                src={
                  tour.images[2]
                    ? tour.images[2]
                    : "https://placehold.co/400x245"
                }
              />
              {/*Overlay*/}
              {tour.images.length > 3 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-r-2xl md:rounded-tr-none md:rounded-br-2xl">
                  <span className="text-white text-3xl md:text-4xl font-bold">
                    +{tour.images.length - 3}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/*Gallery Modal*/}
        {showGallery && (
          <ImageGallery
            target={targetGallery}
            currentIndex={startImageIndex}
            onClose={() => setShowGallery(false)}
          />
        )}

        {/*Overview & Details & Booking*/}
        <div className="relative">
          {/* Sticky Secondary Navbar - Hidden on mobile, visible on md+ */}
          <div
            className={`hidden md:block fixed top-0 left-0 w-full bg-white shadow z-10 transition-all duration-300 ease-out ${showStickyNav
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-100 pointer-events-none"
              }`}
          >
            <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-14">
              {/* Tabs */}
              <div className="flex gap-6 text-sm font-medium h-full">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => scrollToSection(tab.id)}
                    className={`${sectionChosen === tab.id
                      ? "text-primary border-b-2 border-primary"
                      : "text-black"
                      } w-auto px-2 h-full hover:bg-primary hover:text-white font-['Inter'] font-semibold transition-colors`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Price + button */}
              <div className="flex items-center gap-4">
                <span className="font-semibold hidden lg:inline">
                  {t("tourDetail.startingFrom")} {minPrice.toLocaleString("vi-VN")} ₫
                </span>
                <Button
                  className="bg-primary font-semibold border-2 border-black text-white px-4 py-2 rounded-full hover:bg-primary/50"
                  onClick={() => {
                    const el = document.getElementById("booking");
                    if (el) {
                      const y =
                        el.getBoundingClientRect().top + window.scrollY - 80;
                      window.scrollTo({ top: y, behavior: "smooth" });
                    }
                  }}
                >
                  {t("tourDetail.bookNow")}
                </Button>
              </div>
            </div>
          </div>

          {/* Main Layout Grid */}
          <div className="max-w-7xl mx-auto py-2 grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10 md:mb-40">
            {/* Left content */}
            <div className="col-span-1 lg:col-span-2 flex flex-col">
              {/* Mobile Tabs Scrollable */}
              <div className="flex gap-4 md:gap-6 text-sm font-medium h-10 overflow-x-auto scrollbar-hide w-full mb-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => scrollToSection(tab.id)}
                    className={`${sectionChosen === tab.id
                      ? "text-primary border-b-2 border-primary"
                      : "text-black"
                      } w-auto min-w-[80px] px-2 whitespace-nowrap hover:bg-primary hover:text-white font-['Inter'] font-semibold transition-colors`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <section
                id={"overview"}
                className="rounded-lg mt-2 md:mt-6 px-4 md:px-8 py-6 font-['Inter'] bg-gradient-to-br from-white to-gray-50/50 shadow-sm border border-gray-100"
              >
                <h2 className="text-2xl font-bold mb-6 text-gray-900">
                  {t("tourDetail.aboutTrip")}
                </h2>
                <p className="text-justify text-gray-700 font-normal leading-relaxed text-base mb-6">
                  {tour.description}
                </p>
                <div className="w-full border-t border-primary/20 my-6"></div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/60 transition-colors">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Smile className="w-5 h-5 text-primary shrink-0" />
                    </div>
                    <span className="text-gray-700">
                      <strong className="text-gray-900">{t("tourDetail.age")}: </strong>
                      {`${tour.age} ${t("tourDetail.yearsOld")}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/60 transition-colors">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Users className="w-5 h-5 text-primary shrink-0" />
                    </div>
                    <span className="text-gray-700">
                      <strong className="text-gray-900">{t("tourDetail.groupLimit")}:</strong>{" "}
                      {t("tourDetail.maxPeople", { count: tour.maxGroup })}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/60 transition-colors">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Clock className="w-5 h-5 text-primary shrink-0" />
                    </div>
                    <span className="text-gray-700">
                      <strong className="text-gray-900">{t("tourDetail.duration")}:</strong>{" "}
                      {tour.duration}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/60 transition-colors">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Languages className="w-5 h-5 text-primary shrink-0" />
                    </div>
                    <span className="text-gray-700">
                      <strong className="text-gray-900">{t("tourDetail.tourGuide")}:</strong>{" "}
                      {tour.languages}
                    </span>
                  </div>
                </div>
              </section>
              <section
                id={"details"}
                className="rounded-lg px-4 md:px-8 py-6 font-['Inter'] bg-white mt-4 shadow-sm border border-gray-100"
              >
                <Highlights highlight={tour.highlight} />
                <Inclusions inclusions={tour.inclusions} />
                <Exclusions exclusions={tour.exclusions} />
                <Expectations expectations={tour.expectations} />
                <PickUp
                  id={"pickUp"}
                  pickUpPoint={tour.pickUpPoint}
                  pickUpDetails={tour.pickUpDetails}
                  pickUpPointGeom={tour.pickUpPointGeom}
                  pickUpAreaGeom={tour.pickUpAreaGeom}
                  endPoint={tour.endPoint}
                  open={puOpen}
                  setOpen={setPUOpen}
                />
                <AdditionalInfo additionalInfo={tour.additionalInfo} />
                <CancellationPolicy cancelPolicy={tour.cancelPolicy} />
              </section>
            </div>

            {/* Right sticky price card (Desktop) / Bottom flow (Mobile) */}
            <div
              id={"booking"}
              className="col-span-1 font-['Inter'] mt-6 lg:mt-0"
            >
              <div className="lg:sticky lg:top-24 min-h-[360px] h-auto bg-white rounded-2xl shadow-2xl shadow-primary/10 border-2 border-primary/20 hover:shadow-primary/20 transition-shadow duration-300">
                <div className="flex items-center font-semibold font-xl bg-gradient-to-r from-primary to-primary/90 w-full h-16 text-white rounded-t-2xl px-6 py-4">
                  <p className="font-bold text-xl">{t("tourDetail.selectDateAndQuantity")}</p>
                </div>
                {/*Date and travellers*/}
                <div className="py-5 px-4 w-full flex flex-col sm:flex-row lg:flex-row justify-between gap-4">
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
                <TicketTypePicker
                  userTicket={userTicket}
                  setUserTicket={setUserTicket}
                  ticketPrices={ticketPrices}
                  ticketTypes={ticketTypes}
                  totalPrice={totalPrice}
                />

                {/* Total Price Display */}
                {totalPrice > 0 && (
                  <div className="mx-4 mt-4 p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border-2 border-primary/20">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 font-semibold">
                        {t("tourDetail.total")}:
                      </span>
                      <span className="text-2xl font-bold text-primary">
                        {totalPrice.toLocaleString("vi-VN")} ₫
                      </span>
                    </div>
                  </div>
                )}
                <div className="w-full flex justify-center mt-6 px-4">
                  {isAuthenticated ?
                    <Button
                      onClick={() => {
                        if (!isValidTickets(userTicket)) {
                          showToast(t("tourDetail.selectPassengers"), "error");
                          return;
                        }
                        // Đã chọn vé + đăng nhập -> đi
                        window.scrollTo(0, 0);
                        navigate("/book-tour", {
                          state: {
                            tour,
                            ticketPrices,
                            userTicket,
                            selectedDate,
                            totalPrice
                          },
                        });
                      }}
                      className="flex justify-center items-center space-x-2 w-full text-white rounded-xl hover:bg-primary/90 border-2 border-transparent transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] bg-gradient-to-r from-primary to-primary/90 py-6"
                    >
                      <Ticket size={24} />
                      <p className="text-lg md:text-xl font-semibold">
                        {t("tourDetail.bookNow")}
                      </p>
                    </Button> :
                    <RequireSignIn
                      redirectLink={`/tour/${tour.id}`}
                      open={requireDialogOpen}
                      setOpen={setRequireDialogOpen}
                    />}
                </div>
                <div className="w-full px-5 mt-6">
                  <div className="border-t border-gray-200"></div>
                </div>

                <div className="px-5 flex items-start text-xs gap-2 pb-5 pt-4">
                  <CalendarCog className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-gray-600 leading-relaxed">
                    <PoilcyModal cancelPolicy={tour.cancelPolicy} /> – {t("tourDetail.cancelBefore")}{" "}
                    <span className="font-medium text-primary">
                      {formatDate(
                        new Date(
                          selectedDate.getTime() - 1 * 24 * 60 * 60 * 1000
                        )
                      )}
                    </span>{" "}
                    {t("tourDetail.fullRefund")}.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/*Itinerary*/}
        <div className="flex w-full justify-between space-x-2">
          <section
            id={"itinerary"}
            className="h-full w-full rounded-lg p-4 md:p-8 bg-gradient-to-br from-white to-gray-50/50 shadow-sm border border-gray-100 mt-6"
          >
            <h2 className="text-2xl font-['Inter'] font-bold mb-6 text-gray-900">
              {t("tourDetail.itinerary")}
            </h2>
            <Itinerary
              tourId={id}
              tourStop={tourStop}
              tourRoute={tourRoute}
              setPUOpen={setPUOpen}
              pickUpGeom={tour.pickUpPointGeom}
            />
          </section>
        </div>

        {/*Reviews*/}
        <div className="flex w-full justify-between space-x-2">
          <section
            id={"reviews"}
            className="h-full w-full rounded-lg p-4 md:p-8 bg-gradient-to-br from-white to-gray-50/50 shadow-sm border border-gray-100 mt-6"
          >
            <h2 className="text-2xl font-bold font-['Inter'] mb-6 text-gray-900">
              {t("tourDetail.reviewsTitle")}
            </h2>
            <div className="w-full flex flex-col lg:flex-row justify-between items-start gap-8">
              {/* Filter & Reviews List */}
              <div className="w-full lg:flex-1 flex flex-col order-2 lg:order-1">
                {/*Filter*/}
                <div className="flex flex-col sm:flex-row w-full justify-between items-start sm:items-center gap-4 sm:gap-0">
                  <div className="flex text-lg font-semibold items-center space-x-2">
                    <Filter size={16} />
                    <p>{t("tourDetail.filter")}</p>
                  </div>
                  <ReviewFilter
                    value={filter}
                    setValue={setFilter}
                    options={options}
                  />
                </div>
                {/* Reviews List */}
                <ul className="mt-6 space-y-4">
                  {filteredReviews.map((review) => (
                    <li
                      key={review.reviewId}
                      className="p-5 bg-white rounded-xl border border-gray-200 hover:border-primary/30 hover:shadow-md transition-all duration-300 space-y-4"
                    >
                      {/*General Review Info*/}
                      <div className="w-full flex justify-between items-start">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                          <img
                            src={review.userAvatar}
                            className="w-10 h-10 rounded-full cursor-pointer hover:border-2 border-primary object-cover"
                            onClick={handleGoToUser}
                          />
                          <div className="flex-col">
                            <p
                              className="font-semibold cursor-pointer hover:underline text-sm md:text-base"
                              onClick={handleGoToUser}
                            >
                              {review.userName}
                            </p>
                            <p className="italic text-xs md:text-sm text-gray-500">
                              {t("tourDetail.postedOn")} {formatDate(review.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <RatingDisplay rating={review.rate} />
                          <div
                            className={`flex items-center px-3 py-1.5 rounded-lg transition-all duration-300 cursor-pointer text-sm font-medium ${review.liked
                              ? "text-white bg-primary shadow-md"
                              : "text-primary hover:bg-primary/10 hover:shadow-sm"
                              }`}
                            onClick={() => handleLikeReview(review.reviewId)}
                          >
                            <ThumbsUp
                              size={14}
                              className={`mr-1.5 ${review.liked ? "fill-white" : ""
                                }`}
                            />
                            {review.likesCount}
                          </div>
                        </div>
                      </div>

                      <p className="text-sm md:text-base text-justify">
                        {review.content}
                      </p>

                      {/* Review Images */}
                      {review.images.length > 0 && (
                        <div className="flex space-x-3 overflow-x-auto pb-2">
                          {review.images.map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt={`Review ${review.reviewId} Image ${idx + 1}`}
                              className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg cursor-pointer shrink-0 shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 border-2 border-gray-100 hover:border-primary/30"
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

              {/* Rating Summary - Moves to top on mobile via order-1, right on desktop via order-2 */}
              <div className="w-full lg:w-[350px] order-1 lg:order-2 flex flex-col items-center space-y-5 h-auto lg:h-[250px] bg-gradient-to-br from-primary/5 to-white border-2 border-primary/20 rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-center space-x-2">
                  <RatingDisplay rating={rating} />
                  <p className="text-black font-light font-['Inter']">
                    ({reviews.length} {t("tourDetail.reviews")})
                  </p>
                </div>
                <div className="space-y-2 w-full max-w-[250px]">
                  {ratingCounts.map(({ star, count }) => (
                    <div
                      key={star}
                      className="flex items-center justify-between"
                    >
                      {/* Cột sao */}
                      <div className="flex text-primary">
                        {Array.from({ length: star }).map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className="fill-primary text-primary"
                          />
                        ))}
                      </div>
                      {/* Cột số */}
                      <span className="font-bold text-sm">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      <div className="w-full">
        <Footer />
      </div>

      {/* Dialogs */}
      <ReviewDialog
        open={openReviewDialog}
        setOpen={setOpenReviewDialog}
        tourId={tour?.id}
        tourName={tour?.title}
        tourImage={tour?.images?.[0]}
        tourDescription={tour?.description}
        attractionIds={tourStop
          .map((stop) => stop.attractionId)
          .filter(Boolean)}
        onSuccess={() => {
          if (id) refreshReviews();
        }}
      />

      {tour && (
        <ShareDialog
          open={openShareDialog}
          setOpen={setOpenShareDialog}
          tourId={tour.id}
          tourName={tour.title}
          tourImage={tour.images?.[0]}
        />
      )}
    </div>
  );
};
export default TourDetailPage;