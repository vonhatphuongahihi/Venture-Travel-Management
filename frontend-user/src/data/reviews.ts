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
  },
  {
    id: 11,
    user: {
      id: 11,
      name: "Phan Văn Tùng",
      avatar: "/src/assets/cultural-festival.jpg",
    },
    rating: 3,
    content:
      "Chợ Bến Thành khá đông đúc và ồn ào. Có nhiều món ăn ngon nhưng giá hơi cao so với mặt bằng chung.",
    date: "2024-10-01T12:10:00Z",
    targetId: 5,
    targetType: "attraction",
  },
  {
    id: 12,
    user: {
      id: 12,
      name: "Lý Thị Ngọc",
      avatar: "/src/assets/cultural-festival.jpg",
    },
    rating: 5,
    content:
      "Nhà thờ Đức Bà Sài Gòn thật trang nghiêm và đẹp. Kiến trúc Gothic ấn tượng, là biểu tượng của thành phố.",
    date: "2024-10-02T17:50:00Z",
    targetId: 6,
    targetType: "attraction",
  },
  {
    id: 13,
    user: {
      id: 13,
      name: "Võ Minh Đức",
      avatar: "/src/assets/cultural-festival.jpg",
    },
    rating: 5,
    content:
      "Vịnh Hạ Long xứng danh kỳ quan thiên nhiên! Mỗi hòn đảo đều có vẻ đẹp riêng, thật kỳ vĩ và hùng vĩ.",
    date: "2024-09-17T14:30:00Z",
    targetId: 7,
    targetType: "attraction",
  },
  {
    id: 14,
    user: {
      id: 14,
      name: "Đỗ Thị Xuân",
      avatar: "/src/assets/cultural-festival.jpg",
    },
    rating: 4,
    content:
      "Đảo Cát Bà có cảnh thiên nhiên đẹp và không khí trong lành. Vườn quốc gia rất đáng để khám phá.",
    date: "2024-09-24T11:15:00Z",
    targetId: 8,
    targetType: "attraction",
  },
  {
    id: 15,
    user: {
      id: 15,
      name: "Cao Văn Hùng",
      avatar: "/src/assets/cultural-festival.jpg",
    },
    rating: 5,
    content:
      "Hang Sửng Sốt thật sự làm tôi sửng sốt! Nhũ đá kỳ vĩ, không gian rộng lớn như cung điện tự nhiên.",
    date: "2024-09-29T10:45:00Z",
    targetId: 9,
    targetType: "attraction",
  },
  {
    id: 16,
    user: {
      id: 16,
      name: "Nguyễn Thị Tuyết",
      avatar: "/src/assets/cultural-festival.jpg",
    },
    rating: 4,
    content:
      "Cầu Rồng Đà Nẵng rất ấn tượng, đặc biệt khi có màn phun lửa vào cuối tuần. Thiết kế độc đáo và hiện đại.",
    date: "2024-10-01T20:20:00Z",
    targetId: 10,
    targetType: "attraction",
  },
  {
    id: 17,
    user: {
      id: 17,
      name: "Lâm Văn Thành",
      avatar: "/src/assets/cultural-festival.jpg",
    },
    rating: 5,
    content:
      "Bà Nà Hills như một thế giới thu nhỏ của châu Âu. Cầu Vàng rất nổi tiếng, cáp treo cũng rất thú vị.",
    date: "2024-09-19T16:35:00Z",
    targetId: 11,
    targetType: "attraction",
  },
  {
    id: 18,
    user: {
      id: 18,
      name: "Huỳnh Thị Linh",
      avatar: "/src/assets/cultural-festival.jpg",
    },
    rating: 5,
    content:
      "Bãi biển Mỹ Khê thật sự đẹp! Cát mịn, nước trong, sóng nhỏ. Rất thích hợp để tắm biển và thư giãn.",
    date: "2024-09-27T08:50:00Z",
    targetId: 12,
    targetType: "attraction",
  },
  {
    id: 19,
    user: {
      id: 19,
      name: "Tô Minh Quân",
      avatar: "/src/assets/cultural-festival.jpg",
    },
    rating: 5,
    content:
      "Phố cổ Hội An ban đêm thật kỳ diệu! Đèn lồng rực rỡ, kiến trúc cổ kính, không khí rất lãng mạn.",
    date: "2024-10-02T21:15:00Z",
    targetId: 13,
    targetType: "attraction",
  },
  {
    id: 20,
    user: {
      id: 20,
      name: "Đinh Thị Thu",
      avatar: "/src/assets/cultural-festival.jpg",
    },
    rating: 4,
    content:
      "Chùa Cầu Nhật Bản nhỏ nhưng rất đẹp và có ý nghĩa lịch sử. Biểu tượng đặc trưng của Hội An qua nhiều thế kỷ.",
    date: "2024-09-21T13:40:00Z",
    targetId: 14,
    targetType: "attraction",
  },
  {
    id: 21,
    user: {
      id: 21,
      name: "Phùng Văn Nam",
      avatar: "/src/assets/cultural-festival.jpg",
    },
    rating: 4,
    content:
      "Rừng Dừa Bảy Mẫu rất thú vị với chuyến đi thúng chai. Hệ sinh thái đa dạng, không khí trong lành.",
    date: "2024-09-23T15:25:00Z",
    targetId: 15,
    targetType: "attraction",
  },
  {
    id: 22,
    user: {
      id: 22,
      name: "Vương Thị Hạnh",
      avatar: "/src/assets/cultural-festival.jpg",
    },
    rating: 4,
    content:
      "Tháp Bà Ponagar có kiến trúc Chăm độc đáo và linh thiêng. Tìm hiểu được về văn hóa dân tộc Chăm cổ đại.",
    date: "2024-09-16T11:30:00Z",
    targetId: 16,
    targetType: "attraction",
  },
  {
    id: 23,
    user: {
      id: 23,
      name: "Đào Minh Tuấn",
      avatar: "/src/assets/cultural-festival.jpg",
    },
    rating: 5,
    content:
      "Vinpearl Land rất vui và phù hợp cho cả gia đình. Nhiều trò chơi hấp dẫn, thủy cung đẹp và đa dạng.",
    date: "2024-10-01T14:20:00Z",
    targetId: 17,
    targetType: "attraction",
  },
  {
    id: 24,
    user: {
      id: 24,
      name: "Bạch Thị Yến",
      avatar: "/src/assets/cultural-festival.jpg",
    },
    rating: 5,
    content:
      "Đảo Hòn Mun có san hô rất đẹp và đa dạng. Trải nghiệm lặn ngắm san hô thật tuyệt vời và đáng nhớ.",
    date: "2024-09-25T09:40:00Z",
    targetId: 18,
    targetType: "attraction",
  },
  {
    id: 25,
    user: {
      id: 25,
      name: "Lương Văn Hiếu",
      avatar: "/src/assets/cultural-festival.jpg",
    },
    rating: 4,
    content:
      "Hồ Xuân Hương như trái tim của Đà Lạt. Cảnh đẹp, không khí mát mẻ, rất thích hợp để dạo bộ buổi sáng.",
    date: "2024-09-28T07:55:00Z",
    targetId: 19,
    targetType: "attraction",
  },
  {
    id: 26,
    user: {
      id: 26,
      name: "Trịnh Thị Hải",
      avatar: "/src/assets/cultural-festival.jpg",
    },
    rating: 5,
    content:
      "Thác Elephant thật hùng vĩ! Tiếng nước đổ rầm rập, không khí trong lành, cảnh quan rất đẹp mắt.",
    date: "2024-10-02T12:30:00Z",
    targetId: 20,
    targetType: "attraction",
  },
  {
    id: 27,
    user: {
      id: 27,
      name: "Hồ Minh Đạt",
      avatar: "/src/assets/cultural-festival.jpg",
    },
    rating: 4,
    content:
      "Ga Đà Lạt có kiến trúc Art Deco rất đặc biệt. Một điểm check-in không thể bỏ qua khi đến Đà Lạt.",
    date: "2024-09-20T16:10:00Z",
    targetId: 21,
    targetType: "attraction",
  },
  {
    id: 28,
    user: {
      id: 28,
      name: "Mai Thị Phương",
      avatar: "/src/assets/cultural-festival.jpg",
    },
    rating: 5,
    content:
      "Ruộng bậc thang Mường Hoa đẹp như trong tranh! Đặc biệt tuyệt đẹp vào mùa lúa chín vàng óng.",
    date: "2024-09-14T14:50:00Z",
    targetId: 22,
    targetType: "attraction",
  },
  {
    id: 29,
    user: {
      id: 29,
      name: "Ông Văn Sơn",
      avatar: "/src/assets/cultural-festival.jpg",
    },
    rating: 5,
    content:
      "Đỉnh Fansipan - nóc nhà Đông Dương! Cảm giác chinh phục đỉnh núi cao nhất Việt Nam thật tuyệt vời.",
    date: "2024-09-22T17:25:00Z",
    targetId: 23,
    targetType: "attraction",
  },
  {
    id: 30,
    user: {
      id: 30,
      name: "Dương Thị Lan",
      avatar: "/src/assets/cultural-festival.jpg",
    },
    rating: 4,
    content:
      "Bản Cát Cát có văn hóa dân tộc H'Mông rất đặc sắc. Thác Cát Cát cũng rất đẹp và hùng vĩ.",
    date: "2024-10-01T10:35:00Z",
    targetId: 24,
    targetType: "attraction",
  },
];
