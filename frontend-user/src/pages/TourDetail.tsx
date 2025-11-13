
import { useParams } from "react-router-dom";
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

const TourDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  ///////////////////// Fetch /////////////////////
  const [tour, setTour] = useState<TourDetail | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [ticketPrices, setTicketPrices] = useState<TicketPrices[]>([]);
  const [userTicket, setUserTicket] = useState({
    currentType: null as TicketType | null,
    priceCategories: [],
  });
  const totalPrice = userTicket.priceCategories.reduce((sum, cat) => {
    // Tìm giá tương ứng với loại vé hiện tại và category
    const priceObj = ticketPrices.find(
      tp =>
        tp.ticketTypeId === userTicket.currentType.ticketTypeId &&
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

  const fetch = async () => {
    // Fetch tours, tourStops, tourRoutes, reviews, ticketTypes, ticketPrices, priceCategories theo id
    const sampleTour: TourDetail = {
      id: "tour_12345",
      provinceId: "Ha Long",
      title: "Du thuyền 5 Sao Lan Hạ – Hạ Long, Cabin Ban Công Riêng (2N1Đ)",
      description:
        "Hãy bắt đầu hành trình trekking 2 ngày 1 đêm để khám phá vẻ đẹp nguyên sơ của Sapa. Bạn sẽ đi bộ qua những thửa ruộng bậc thang xanh mướt và rừng tre, ghé thăm các bản làng dân tộc thiểu số xa xôi để tìm hiểu cuộc sống thường nhật và nét văn hóa truyền thống đặc sắc. Qua đêm tại homestay ấm cúng cùng gia đình tôi hoặc bungalow riêng tư, thưởng thức những bữa ăn địa phương ngon miệng được chế biến bằng cả tấm lòng. Với quy mô nhóm nhỏ, chuyến đi mang lại trải nghiệm gần gũi và kết nối ý nghĩa. Hãy để chúng tôi đồng hành cùng bạn khám phá những ‘viên ngọc ẩn giấu’ của Sapa và tạo nên những kỷ niệm khó quên trên hành trình độc đáo này!",
      images: [
        "https://media-cdn.tripadvisor.com/media/attractions-splice-spp-720x480/07/86/45/53.jpg",
        "https://media-cdn.tripadvisor.com/media/attractions-splice-spp-720x480/16/c0/41/e9.jpg",
        "https://media-cdn.tripadvisor.com/media/attractions-splice-spp-720x480/13/2b/f1/f3.jpg",
        "https://media-cdn.tripadvisor.com/media/attractions-splice-spp-720x480/14/83/6f/90.jpg",
      ],
      age: "0-50",
      maxGroup: 30,
      duration: "2 ngày",
      languages: "Tiếng Việt",
      categories: ["Văn hóa", "Biển đảo"],
      highlight: ["Cảng Tuần Châu", "Vịnh Hạ Long", "Vịnh Lan Hạ"],
      inclusions: [
        "Bữa trưa",
        "Bữa sáng",
        "Bữa tối",
        "Bữa trưa",
        "Tất cả hoạt động: Tham quan hang động, chèo kayak, bơi lội, lớp học nấu ăn + bao gồm toàn bộ vé vào cửa và phí tham quan",
        "Cabin riêng có phòng tắm khép kín, ban công hướng biển",
        "Bánh sinh nhật (nếu tổ chức trên tàu – cần yêu cầu trước chuyến đi)",
        "Trang trí cabin trăng mật (cần yêu cầu trước chuyến đi)",
        "Vé vào cửa/Phí tham quan – Vịnh Lan Hạ",
        "Vé vào cửa/Phí tham quan – Vịnh Lan Hạ",
        "Vé vào cửa/Phí tham quan – Vịnh Lan Hạ",
        "Vé vào cửa/Phí tham quan – Vịnh Lan Hạ",
        "Vé vào cửa/Phí tham quan – Động Trung Trang",
      ],
      exclusions: [
        "Chi phí cá nhân, tiền tip",
        "Phụ thu cho các dịp lễ Giáng Sinh/Tết Dương lịch/Tết Nguyên Đán",
        "Xe đưa đón khứ hồi từ Hà Nội (25 USD/người) nếu có yêu cầu",
        "Đồ uống gọi thêm (tính riêng)",
      ],
      expectations: [
        "Hành trình:\nĐây là hành trình điển hình của sản phẩm này",
        "Điểm dừng: Phố Cổ, Hà Nội, Việt Nam",
        "8:30-9:00: Đón khách tại khách sạn trong khu Phố Cổ/Nhà hát Lớn Hà Nội để khởi hành đi Vịnh Hạ Long",
        "Hành trình của chúng tôi đi theo đường cao tốc Hà Nội - Hải Phòng - Tuần Châu (khoảng 2,5 giờ lái xe).",
        "Xin lưu ý rằng quý khách sẽ có thời gian nghỉ ngơi trước khi đến cảng nếu đến sớm vì tàu chỉ hoạt động vào khoảng 12 giờ trưa.",
        "Thời gian: 3 giờ",
      ],
      pickUpPoint: "13 Mã Mây, Hàng Buồm, Hoàn Kiếm, Hà Nội 100000, Vietnam",
      pickUpDetails:
        "Chúng tôi sẽ đón quý khách tại khách sạn trong khu vực Phố Cổ Hà Nội hoặc tại điểm hẹn. Khi làm thủ tục trả phòng, quý khách có thể chọn khách sạn trong danh sách khách sạn đã bao gồm.",
      pickUpPointGeom: [105.85323026871829, 21.03604512688992], // [long, lat]
      endPoint: "Tuần Châu, Hạ Long, Quảng Ninh, Việt Nam",
      endPointGeom: [107.02902141429385, 20.94392238123315],
      additionalInfo:
        "Xác nhận sẽ được gửi ngay sau khi đặt tour.\nHầu hết du khách đều có thể tham gia.\nCó cung cấp thực đơn riêng cho khách ăn chay (Vegan). Nếu khách có dị ứng thực phẩm, vui lòng thông báo trước.\nTrải nghiệm này phụ thuộc vào điều kiện thời tiết. Nếu hủy do thời tiết xấu, bạn sẽ được đề nghị đổi sang ngày khác hoặc hoàn tiền 100%.\nTour/hoạt động này tối đa 30 khách.",
      cancelPolicy:
        "Để được hoàn tiền 100%, bạn cần hủy ít nhất 24 giờ trước giờ khởi hành.\nNếu hủy trong vòng 24 giờ trước giờ khởi hành, số tiền đã thanh toán sẽ không được hoàn lại.\nMọi thay đổi được thực hiện trong vòng 24 giờ trước giờ khởi hành sẽ không được chấp nhận.\nThời hạn được tính theo giờ địa phương tại điểm diễn ra trải nghiệm.\nTrải nghiệm này phụ thuộc vào điều kiện thời tiết. Nếu bị hủy do thời tiết xấu, bạn sẽ được đề nghị đổi sang ngày khác hoặc hoàn tiền 100%.",
      contact: "+84 987 654 321",
      startDate: new Date("2025-10-15T18:00:00Z"),
      endDate: new Date("2025-10-15T22:00:00Z"),
      maxBooking: 5,
      region: "Nam",
      isActive: true,
      createdAt: new Date("2025-09-01T08:30:00Z"),
      updatedAt: new Date("2025-09-20T10:00:00Z"),
      createdBy: "admin_user",
    };
    setTour(sampleTour);
    // Nhớ khi fetch review gộp luôn cả thông tin user
    const sampleReviews: Review[] = [
      {
        reviewId: "rev_001",
        userId: "user_001",
        userName: "Nguyen Van A",
        userAvatar: "https://i.pravatar.cc/150?img=1",
        targetType: "tour",
        targetId: "tour_12345",
        rate: 5,
        content:
          "Chuyến đi rất tuyệt vời, hướng dẫn viên nhiệt tình, lịch trình hợp lý! Chuyến đi rất tuyệt vời, hướng dẫn viên nhiệt tình, lịch trình hợp lý!",
        images: ["https://picsum.photos/200/300?1"],
        likesCount: 12,
        createdAt: new Date("2025-09-01T10:00:00"),
        updatedAt: new Date("2025-09-01T10:00:00"),
      },
      {
        reviewId: "rev_002",
        userId: "user_002",
        userName: "Nguyen Van A",
        userAvatar: "https://i.pravatar.cc/150?img=1",
        targetType: "tour",
        targetId: "tour_12345",
        rate: 4,
        content: "Khá ổn, đồ ăn ngon nhưng xe di chuyển hơi lâu.",
        images: ["https://picsum.photos/200/300?2"],
        likesCount: 5,
        createdAt: new Date("2025-09-02T11:20:00"),
        updatedAt: new Date("2025-09-02T11:20:00"),
      },
      {
        reviewId: "rev_003",
        userId: "user_003",
        userName: "Nguyen Van A",
        userAvatar: "https://i.pravatar.cc/150?img=1",
        targetType: "tour",
        targetId: "tour_12345",
        rate: 3,
        content:
          "Cảnh đẹp nhưng dịch vụ chưa tốt, check-in khách sạn mất nhiều thời gian.",
        images: [],
        likesCount: 2,
        createdAt: new Date("2025-09-03T09:15:00"),
        updatedAt: new Date("2025-09-03T09:15:00"),
      },
      {
        reviewId: "rev_004",
        userId: "user_004",
        userName: "Nguyen Van A",
        userAvatar: "https://i.pravatar.cc/150?img=1",
        targetType: "tour",
        targetId: "tour_12345",
        rate: 5,
        content: "Rất thích trải nghiệm này, sẽ giới thiệu cho bạn bè!",
        images: ["https://picsum.photos/200/300?3"],
        likesCount: 20,
        createdAt: new Date("2025-09-04T14:30:00"),
        updatedAt: new Date("2025-09-04T14:30:00"),
      },
      {
        reviewId: "rev_005",
        userId: "user_005",
        userName: "Nguyen Van A",
        userAvatar: "https://i.pravatar.cc/150?img=1",
        targetType: "tour",
        targetId: "tour_12345",
        rate: 4,
        content: "Điểm đến đẹp, có nhiều hoạt động vui chơi. Giá hơi cao.",
        images: ["https://picsum.photos/200/300?4"],
        likesCount: 8,
        createdAt: new Date("2025-09-05T16:45:00"),
        updatedAt: new Date("2025-09-05T16:45:00"),
      },
      {
        reviewId: "rev_006",
        userId: "user_006",
        userName: "Nguyen Van A",
        userAvatar: "https://i.pravatar.cc/150?img=1",
        targetType: "tour",
        targetId: "tour_12345",
        rate: 2,
        content: "Không hài lòng lắm, hướng dẫn viên thiếu chuyên nghiệp.",
        images: [],
        likesCount: 1,
        createdAt: new Date("2025-09-06T12:10:00"),
        updatedAt: new Date("2025-09-06T12:10:00"),
      },
      {
        reviewId: "rev_007",
        userId: "user_007",
        userName: "Nguyen Van A",
        userAvatar: "https://i.pravatar.cc/150?img=1",
        targetType: "tour",
        targetId: "tour_12345",
        rate: 5,
        content: "Lịch trình dày nhưng hợp lý, đáng tiền!",
        images: [
          "https://picsum.photos/200/300?5",
          "https://picsum.photos/200/300?6",
        ],
        likesCount: 15,
        createdAt: new Date("2025-09-07T18:00:00"),
        updatedAt: new Date("2025-09-07T18:00:00"),
      },
      {
        reviewId: "rev_008",
        userId: "user_008",
        userName: "Nguyen Van A",
        userAvatar: "https://i.pravatar.cc/150?img=1",
        targetType: "tour",
        targetId: "tour_12345",
        rate: 4,
        content:
          "Gia đình mình rất vui, các bé thích thú khi tham gia hoạt động ngoài trời.",
        images: [],
        likesCount: 10,
        createdAt: new Date("2025-09-08T09:40:00"),
        updatedAt: new Date("2025-09-08T09:40:00"),
      },
      {
        reviewId: "rev_009",
        userId: "user_009",
        userName: "Nguyen Van A",
        userAvatar: "https://i.pravatar.cc/150?img=1",
        targetType: "tour",
        targetId: "tour_12345",
        rate: 4,
        content: "Ổn, nhưng mong có thêm thời gian tự do để khám phá.",
        images: ["https://picsum.photos/200/300?7"],
        likesCount: 4,
        createdAt: new Date("2025-09-09T20:20:00"),
        updatedAt: new Date("2025-09-09T20:20:00"),
      },
      {
        reviewId: "rev_010",
        userId: "user_010",
        userName: "Nguyen Van A",
        userAvatar: "https://i.pravatar.cc/150?img=1",
        targetType: "tour",
        targetId: "tour_12345",
        rate: 5,
        content: "Một trải nghiệm tuyệt vời, chắc chắn sẽ quay lại!",
        images: ["https://picsum.photos/200/300?8"],
        likesCount: 30,
        createdAt: new Date("2025-09-10T22:10:00"),
        updatedAt: new Date("2025-09-10T22:10:00"),
      },
    ];
    setReviews(sampleReviews);
    const avgRating =
      sampleReviews.reduce((sum, r) => sum + r.rate, 0) / sampleReviews.length;
    setRating(parseFloat(avgRating.toFixed(1)));
    // Giá vé theo loại vé và hạng mục (người lớn, trẻ em)
    const sampleTicketPrices: TicketPrices[] = [{
      ticketPriceId: "tp_001",
      ticketTypeId: "tt_001", // FK -> ticket_types.ticket_type_id
      categoryId: "pc_001", // FK -> price_categories.category_id
      notes: "Vé VIP cho người lớn",
      price: 9000000,
      quantity: 30,
      isActive: true,
      createdAt: new Date("2025-09-01T10:00:00"),
    },
    {
      ticketPriceId: "tp_002",
      ticketTypeId: "tt_001", // FK -> ticket_types.ticket_type_id
      categoryId: "pc_002", // FK -> price_categories.category_id
      notes: "Vé VIP cho trẻ em",
      price: 7000000,
      quantity: 20,
      isActive: true,
      createdAt: new Date("2025-09-01T10:00:00"),
    },
    {
      ticketPriceId: "tp_003",
      ticketTypeId: "tt_002", // FK -> ticket_types.ticket_type_id
      categoryId: "pc_001", // FK -> price_categories.category_id
      notes: "Vé Thường cho người lớn",
      price: 6500000,
      quantity: 30,
      isActive: true,
      createdAt: new Date("2025-09-01T10:00:00"),
    },
    {
      ticketPriceId: "tp_004",
      ticketTypeId: "tt_002", // FK -> ticket_types.ticket_type_id
      categoryId: "pc_002", // FK -> price_categories.category_id
      notes: "Vé Thường cho trẻ em",
      price: 5000000,
      quantity: 20,
      isActive: true,
      createdAt: new Date("2025-09-01T10:00:00"),
    }]
    setTicketPrices(sampleTicketPrices);
    const sampleTourStop: TourStop[] = [
      {
        stopId: "stop_001",
        tourId: "tour_12345",
        attractionId: "attraction_001",
        attractionName: "Đảo Tuần Châu",
        attractionImage:
          "https://media-cdn.tripadvisor.com/media/photo-c/2560x500/07/00/11/54/tuan-chau-island.jpg",
        attractionGeom: [106.98488883643692, 20.92942105340734],
        stopOrder: 1,
        notes: "Dừng chân: 15 phút",
        details:
          "Đến Cảng Quốc tế Tuần Châu - làm thủ tục check-in tại phòng chờ.",
        created_at: new Date("2025-09-01T10:00:00"),
      },
      {
        stopId: "stop_003",
        tourId: "tour_12345",
        attractionId: "attraction_003",
        attractionName: "Làng chài Trà Báu",
        attractionImage:
          "https://media-cdn.tripadvisor.com/media/photo-c/2560x500/06/e1/4c/39/ha-long-bay.jpg",
        attractionGeom: [105.85328990524339, 21.036013671851823],
        stopOrder: 3,
        notes: "Dừng chân: 2 giờ",
        details:
          "Du thuyền di chuyển đến gần bãi biển Ba Trái Đào (hoặc đảo Đầu Bê hoặc đảo Trà Bầu) ở vịnh Lan Hạ.",
        created_at: new Date("2025-09-01T10:00:00"),
      },
      {
        stopId: "stop_004",
        tourId: "tour_12345",
        attractionId: "attraction_004",
        attractionName: "Vịnh Lan Hạ",
        attractionImage:
          "https://media-cdn.tripadvisor.com/media/photo-o/15/6e/b6/30/amazing-bay-and-floating.jpg",
        attractionGeom: [107.06085380690975, 20.76128804425612],
        stopOrder: 4,
        notes: "Dừng chân: 90 phút - Đã bao gồm vé vào cửa",
        details: "Thời gian chèo thuyền kayak và bơi lội",
        created_at: new Date("2025-09-01T10:00:00"),
      },
      {
        stopId: "stop_005",
        tourId: "tour_12345",
        attractionId: "attraction_004",
        attractionName: "Vịnh Lan Hạ",
        attractionImage:
          "https://media-cdn.tripadvisor.com/media/photo-o/15/6e/b6/30/amazing-bay-and-floating.jpg",
        attractionGeom: [107.09587272892044, 20.76353523208261],
        stopOrder: 5,
        notes: "Dừng chân: 2 giờ - Đã bao gồm vé vào cửa",
        details:
          "Thời gian tự do thư giãn trên du thuyền. Đừng bỏ lỡ khu vực boong tàu để ngắm hoàng hôn, thưởng thức tiệc hoàng hôn và tham gia lớp học nấu ăn các món ăn Việt Nam chính thống.",
        created_at: new Date("2025-09-01T10:00:00"),
      },
      {
        stopId: "stop_002",
        tourId: "tour_12345",
        attractionId: "attraction_002",
        attractionName: "Vịnh Hạ Long",
        attractionImage:
          "https://media-cdn.tripadvisor.com/media/photo-o/01/31/05/a5/baie-d-halong.jpg",
        attractionGeom: [107.02965002429204, 20.966664346785805],
        stopOrder: 2,
        notes: "Dừng chân: 25 phút",
        details: "Di chuyển đến Du thuyền bằng tàu cao tốc",
        created_at: new Date("2025-09-01T10:00:00"),
      },
      {
        stopId: "stop_006",
        tourId: "tour_12345",
        attractionId: "attraction_004",
        attractionName: "Vịnh Lan Hạ",
        attractionImage:
          "https://media-cdn.tripadvisor.com/media/photo-o/15/6e/b6/30/amazing-bay-and-floating.jpg",
        attractionGeom: [107.1446245607712, 20.7367273140495],
        stopOrder: 6,
        notes: "Dừng chân: 2 giờ - Đã bao gồm vé vào cửa",
        details:
          "Giải trí buổi tối với các trò chơi trên du thuyền (chơi bài, cờ vua, karaoke, câu mực) hoặc thư giãn với dịch vụ mát-xa.",
        created_at: new Date("2025-09-01T10:00:00"),
      },
    ];
    sampleTourStop.sort((a, b) => a.stopOrder - b.stopOrder);
    setTourStop(sampleTourStop);
    const sampleTourRoute: TourRoute = {
      route_id: "route_001",
      tour_id: "tour_12345",
      geom: [
        [106.98488883643692, 20.92942105340734],
        [107.02965002429204, 20.966664346785805],
        [105.85328990524339, 21.036013671851823],
        [107.06085380690975, 20.76128804425612],
        [107.09587272892044, 20.76353523208261],
        [107.1446245607712, 20.7367273140495],
      ],
      created_at: new Date("2025-09-01T10:00:00"),
    };
    setTourRoute(sampleTourRoute);
  };
  useEffect(() => {
    fetch();
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  ///////////////////// Interaction /////////////////////
  const handleShare = () => {};
  const handleWriteReview = () => {};
  const handleSave = () => {};

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

  const handleLikeReview = () => {};
  const handleGoToUser = () => {};

  if (!tour) return <Loading />;

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
              className="hover:bg-primary/40 hover:text-white flex items-center space-x-1"
              onClick={handleSave}
            >
              <Bookmark size={16} />
              <p className="font-['Inter']">Lưu</p>
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
        {showGallery && (
          <ImageGallery
            target={targetGallery}
            currentIndex={startImageIndex}
            onClose={() => setShowGallery(false)}
          />
        )}
        {/*Overview & Details & Booking*/}
        <div className="relative">
          {/* Sticky Secondary Navbar */}
          <div
            className={`fixed top-0 left-0 w-full bg-white shadow z-10 transition-all duration-300 ease-out ${
              showStickyNav
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
                    className={`${
                      sectionChosen === tab.id
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
                    className={`${
                      sectionChosen === tab.id
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
                <TicketTypePicker userTicket={userTicket} setUserTicket={setUserTicket} ticketPrices={ticketPrices} totalPrice={totalPrice}/>
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
                  <ReviewFilter value={filter} setValue={setFilter} options={options}/>
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
                        <div className="flex items-center h-10 space-x-2 cursor-pointer text-primary hover:text-white hover:bg-primary p-2 rounded-lg justify-end">
                          <ThumbsUp size={20} className="mr-3" />
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
                          <Star key={i} />
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
      </div>
      <div className="w-full">
        <Footer />
      </div>
    </div>
  );
};
export default TourDetailPage;
