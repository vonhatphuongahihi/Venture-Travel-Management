import { Review } from "@/global.types";

export const mockReviews: Review[] = [
  // Reviews cho Tours
  {
    id: 1,
    user: {
      id: 1,
      name: "Nguyễn Minh Anh",
      avatar: "/src/assets/cultural-festival.jpg",
    },
    rating: 5,
    content:
      "Tour Hạ Long tuyệt vời! Cảnh đẹp không tưởng, hướng dẫn viên nhiệt tình và chuyên nghiệp. Tôi sẽ quay lại lần nữa!",
    date: "2024-09-15T08:30:00Z",
    targetId: 1,
    targetType: "tour",
    tour: {
      id: "tour-001",
      title: "Du thuyền Hạ Long 2N1Đ",
      image: "/src/assets/cultural-festival.jpg",
    },
    images: [
      "/src/assets/hero-vietnam-1.jpg",
      "/src/assets/hero-vietnam-2.jpg",
      "/src/assets/beach-destination.jpg",
      "/src/assets/hero-vietnam-1.jpg",
      "/src/assets/hero-vietnam-2.jpg",
      "/src/assets/beach-destination.jpg",
    ],
  },
  {
    id: 2,
    user: {
      id: 2,
      name: "Trần Thị Hương",
      avatar: "/src/assets/cultural-festival.jpg",
    },
    rating: 4,
    content:
      "Chuyến đi Sapa rất đáng nhớ. Ruộng bậc thang đẹp như tranh vẽ, chỉ có điều thời tiết hơi lạnh một chút.",
    date: "2024-09-20T14:45:00Z",
    targetId: 2,
    targetType: "tour",
    tour: {
      id: "tour-002",
      title: "Sapa - Fansipan 3N2Đ",
      image: "/src/assets/cultural-festival.jpg",
    },
    images: [
      "/src/assets/explore-360/tour-1.jpg",
      "/src/assets/explore-360/tour-2.jpg",
    ],
  },
  {
    id: 3,
    user: {
      id: 3,
      name: "Lê Văn Đức",
      avatar: "/src/assets/cultural-festival.jpg",
    },
    rating: 5,
    content:
      "Phú Quốc thật sự là thiên đường! Biển xanh, cát trắng, món ăn ngon. Dịch vụ khách sạn cũng rất tốt.",
    date: "2024-09-25T10:20:00Z",
    targetId: 3,
    targetType: "tour",
    tour: {
      id: "tour-003",
      title: "Phú Quốc - Đảo Ngọc 4N3Đ",
      image: "/src/assets/cultural-festival.jpg",
    },
    images: [
      "/src/assets/beach-destination.jpg",
      "/src/assets/explore-360/tour-3.jpg",
      "/src/assets/explore-360/tour-4.jpg",
    ],
  },
  {
    id: 4,
    user: {
      id: 4,
      name: "Phạm Thị Lan",
      avatar: "/src/assets/cultural-festival.jpg",
    },
    rating: 4,
    content:
      "Đà Lạt thơ mộng và lãng mạn. Khí hậu mát mẻ, hoa đẹp, thức ăn ngon. Phù hợp cho cặp đôi đi honeymoon.",
    date: "2024-09-28T16:15:00Z",
    targetId: 4,
    targetType: "tour",
    tour: {
      id: "tour-004",
      title: "Đà Lạt Romantic 3N2Đ",
      image: "/src/assets/cultural-festival.jpg",
    },
    images: [
      "/src/assets/explore-360/banner-1.jpg",
      "/src/assets/explore-360/banner-2.jpg",
    ],
  },
  {
    id: 5,
    user: {
      id: 5,
      name: "Vũ Minh Tuấn",
      avatar: "/src/assets/cultural-festival.jpg",
    },
    rating: 5,
    content:
      "Hội An ban đêm thật kỳ diệu với những chiếc đèn lồng rực rỡ. Phố cổ có nét kiến trúc độc đáo, ẩm thực phong phú.",
    date: "2024-10-01T19:30:00Z",
    targetId: 5,
    targetType: "tour",
    tour: {
      id: "tour-005",
      title: "Hội An - Phố Cổ 2N1Đ",
      image: "/src/assets/cultural-festival.jpg",
    },
    images: [
      "/src/assets/cultural-festival.jpg",
      "/src/assets/explore-360/tour-5.jpg",
    ],
  },
  {
    id: 6,
    user: {
      id: 6,
      name: "Hoàng Thị Mai",
      avatar: "/src/assets/cultural-festival.jpg",
    },
    rating: 4,
    content:
      "Nha Trang có biển đẹp và nhiều hoạt động vui chơi. Tuy nhiên đông khách một chút, nhưng vẫn rất đáng để trải nghiệm.",
    date: "2024-10-02T11:45:00Z",
    targetId: 6,
    targetType: "tour",
    tour: {
      id: "tour-006",
      title: "Nha Trang Biển Xanh 3N2Đ",
      image: "/src/assets/cultural-festival.jpg",
    },
    images: [
      "/src/assets/beach-destination.jpg",
      "/src/assets/explore-360/tour-6.jpg",
    ],
  },

  // Reviews cho Attractions
  {
    id: 7,
    user: {
      id: 7,
      name: "Đặng Văn Hải",
      avatar: "/src/assets/cultural-festival.jpg",
    },
    rating: 5,
    content:
      "Hồ Hoàn Kiếm thật yên bình, đặc biệt đẹp vào buổi sáng sớm. Tháp Rùa và đền Ngọc Sơn rất linh thiêng.",
    date: "2024-09-18T07:15:00Z",
    targetId: 1,
    targetType: "attraction",
    images: [
      "/src/assets/hero-vietnam.jpg",
      "/src/assets/top-2-destination.png",
    ],
  },
  {
    id: 8,
    user: {
      id: 8,
      name: "Ngô Thị Bích",
      avatar: "/src/assets/cultural-festival.jpg",
    },
    rating: 4,
    content:
      "Văn Miếu - Quốc Tử Giám là nơi rất có ý nghĩa lịch sử. Kiến trúc cổ kính, không gian trang nghiêm.",
    date: "2024-09-22T13:20:00Z",
    targetId: 2,
    targetType: "attraction",
    images: ["/src/assets/cultural-festival.jpg"],
  },
  {
    id: 9,
    user: {
      id: 9,
      name: "Bùi Minh Khôi",
      avatar: "/src/assets/cultural-festival.jpg",
    },
    rating: 5,
    content:
      "Phố cổ Hà Nội sầm uất và đầy sức sống. Có rất nhiều quán ăn ngon và cửa hàng lưu niệm thú vị.",
    date: "2024-09-26T15:40:00Z",
    targetId: 3,
    targetType: "attraction",
    images: [
      "/src/assets/top-3-destination.png",
      "/src/assets/explore-360/banner-3.jpg",
    ],
  },
  {
    id: 10,
    user: {
      id: 10,
      name: "Trương Thị Hoa",
      avatar: "/src/assets/cultural-festival.jpg",
    },
    rating: 4,
    content:
      "Dinh Độc Lập có kiến trúc độc đáo và nhiều phòng trưng bày thú vị. Tìm hiểu được nhiều về lịch sử.",
    date: "2024-09-30T09:25:00Z",
    targetId: 4,
    targetType: "attraction",
    images: ["/src/assets/explore-360/tour-3.png"],
  },
];
