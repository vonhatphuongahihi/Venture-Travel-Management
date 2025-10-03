import { Attraction } from "@/global.types";

export const mockAttractions: Attraction[] = [
  // Hà Nội
  {
    id: 1,
    name: "Hồ Hoàn Kiếm",
    description:
      "Hồ nước ngọt tự nhiên nằm ở trung tâm Hà Nội, là biểu tượng của thủ đô với tháp Rùa và đền Ngọc Sơn nổi tiếng.",
    type: "Hồ nước",
    image: "/src/assets/cultural-festival.jpg",
    reviewInfo: {
      rating: 4.6,
      count: 1245,
    },
  },
  {
    id: 2,
    name: "Văn Miếu - Quốc Tử Giám",
    description:
      "Ngôi đền đầu tiên của Việt Nam, được xây dựng để thờ Khổng Tử và các bậc hiền tài, là trường đại học đầu tiên của Việt Nam.",
    type: "Di tích lịch sử",
    image: "/src/assets/cultural-festival.jpg",
    reviewInfo: {
      rating: 4.5,
      count: 892,
    },
  },
  {
    id: 3,
    name: "Phố cổ Hà Nội",
    description:
      "Khu phố cổ với 36 phố phường truyền thống, nơi lưu giữ nét văn hóa đặc trưng và ẩm thực đường phố phong phú.",
    type: "Khu phố cổ",
    image: "/src/assets/cultural-festival.jpg",
    reviewInfo: {
      rating: 4.7,
      count: 2156,
    },
  },

  // TP. Hồ Chí Minh
  {
    id: 4,
    name: "Dinh Độc Lập",
    description:
      "Cung điện của Tổng thống miền Nam Việt Nam trước năm 1975, nay là bảo tàng lịch sử với kiến trúc độc đáo.",
    type: "Di tích lịch sử",
    image: "/src/assets/cultural-festival.jpg",
    reviewInfo: {
      rating: 4.4,
      count: 1567,
    },
  },
  {
    id: 5,
    name: "Chợ Bến Thành",
    description:
      "Khu chợ truyền thống nổi tiếng nhất Sài Gòn với đủ loại hàng hóa từ thực phẩm, quần áo đến đồ lưu niệm.",
    type: "Chợ truyền thống",
    image: "/src/assets/cultural-festival.jpg",
    reviewInfo: {
      rating: 4.2,
      count: 2341,
    },
  },
  {
    id: 6,
    name: "Nhà thờ Đức Bà Sài Gòn",
    description:
      "Nhà thờ Công giáo Roman nổi tiếng với kiến trúc Gothic và hai thánh đường cao vút, là biểu tượng của thành phố.",
    type: "Kiến trúc tôn giáo",
    image: "/src/assets/cultural-festival.jpg",
    reviewInfo: {
      rating: 4.3,
      count: 1876,
    },
  },

  // Hạ Long
  {
    id: 7,
    name: "Vịnh Hạ Long",
    description:
      "Di sản thiên nhiên thế giới với hơn 1600 hòn đảo đá vôi kỳ vĩ nổi lên từ nước biển xanh trong.",
    type: "Di sản thiên nhiên",
    image: "/src/assets/cultural-festival.jpg",
    reviewInfo: {
      rating: 4.8,
      count: 3245,
    },
  },
  {
    id: 8,
    name: "Đảo Cát Bà",
    description:
      "Đảo lớn nhất trong quần đảo Cát Bà với vườn quốc gia, bãi biển đẹp và làng chài truyền thống.",
    type: "Đảo du lịch",
    image: "/src/assets/cultural-festival.jpg",
    reviewInfo: {
      rating: 4.5,
      count: 987,
    },
  },
  {
    id: 9,
    name: "Hang Sửng Sốt",
    description:
      "Hang động tự nhiên rộng lớn với nhũ đá kỳ vĩ, được ví như cung điện dưới lòng đất.",
    type: "Hang động",
    image: "/src/assets/cultural-festival.jpg",
    reviewInfo: {
      rating: 4.6,
      count: 1432,
    },
  },

  // Đà Nẵng
  {
    id: 10,
    name: "Cầu Rồng",
    description:
      "Cây cầu biểu tượng của Đà Nẵng với thiết kế hình rồng, có màn biểu diễn phun lửa và nước vào cuối tuần.",
    type: "Cầu kiến trúc",
    image: "/src/assets/cultural-festival.jpg",
    reviewInfo: {
      rating: 4.4,
      count: 1654,
    },
  },
  {
    id: 11,
    name: "Bà Nà Hills",
    description:
      "Khu du lịch trên núi với cầu Vàng nổi tiếng, làng Pháp cổ kính và hệ thống cáp treo hiện đại.",
    type: "Khu du lịch sinh thái",
    image: "/src/assets/cultural-festival.jpg",
    reviewInfo: {
      rating: 4.3,
      count: 2987,
    },
  },
  {
    id: 12,
    name: "Bãi biển Mỹ Khê",
    description:
      "Một trong những bãi biển đẹp nhất thế giới với cát trắng mịn, nước biển trong xanh và sóng nhỏ.",
    type: "Bãi biển",
    image: "/src/assets/cultural-festival.jpg",
    reviewInfo: {
      rating: 4.7,
      count: 1876,
    },
  },

  // Hội An
  {
    id: 13,
    name: "Phố cổ Hội An",
    description:
      "Thị trấn cổ được UNESCO công nhận di sản văn hóa thế giới với kiến trúc cổ kính và đèn lồng rực rỡ.",
    type: "Phố cổ",
    image: "/src/assets/cultural-festival.jpg",
    reviewInfo: {
      rating: 4.8,
      count: 4567,
    },
  },
  {
    id: 14,
    name: "Chùa Cầu Nhật Bản",
    description:
      "Cây cầu cổ được xây dựng bởi cộng đồng người Nhật vào thế kỷ 16, là biểu tượng của Hội An.",
    type: "Di tích kiến trúc",
    image: "/src/assets/cultural-festival.jpg",
    reviewInfo: {
      rating: 4.5,
      count: 2134,
    },
  },
  {
    id: 15,
    name: "Rừng Dừa Bảy Mẫu",
    description:
      "Rừng dừa nước tự nhiên rộng lớn với hệ sinh thái đa dạng, có thể tham quan bằng thúng chai.",
    type: "Rừng sinh thái",
    image: "/src/assets/cultural-festival.jpg",
    reviewInfo: {
      rating: 4.6,
      count: 1234,
    },
  },

  // Nha Trang
  {
    id: 16,
    name: "Tháp Bà Ponagar",
    description:
      "Quần thể tháp Chăm cổ được xây dựng từ thế kỷ 7-12, thờ nữ thần Ponagar của người Chăm.",
    type: "Tháp Chăm",
    image: "/src/assets/cultural-festival.jpg",
    reviewInfo: {
      rating: 4.3,
      count: 1567,
    },
  },
  {
    id: 17,
    name: "Vinpearl Land",
    description:
      "Khu vui chơi giải trí lớn nhất Việt Nam với công viên nước, trò chơi cảm giác mạnh và thủy cung.",
    type: "Công viên giải trí",
    image: "/src/assets/cultural-festival.jpg",
    reviewInfo: {
      rating: 4.4,
      count: 3456,
    },
  },
  {
    id: 18,
    name: "Đảo Hòn Mun",
    description:
      "Khu bảo tồn biển đầu tiên của Việt Nam với san hô đa dạng, lý tưởng cho lặn ngắm san hô.",
    type: "Đảo san hô",
    image: "/src/assets/cultural-festival.jpg",
    reviewInfo: {
      rating: 4.7,
      count: 987,
    },
  },

  // Đà Lạt
  {
    id: 19,
    name: "Hồ Xuân Hương",
    description:
      "Hồ nhân tạo nằm ở trung tâm thành phố Đà Lạt, được mệnh danh là trái tim của thành phố ngàn hoa.",
    type: "Hồ nước",
    image: "/src/assets/cultural-festival.jpg",
    reviewInfo: {
      rating: 4.5,
      count: 1876,
    },
  },
  {
    id: 20,
    name: "Thác Elephant",
    description:
      "Thác nước hùng vĩ cao 30m với dòng nước chảy mạnh, được bao quanh bởi rừng thông xanh mướt.",
    type: "Thác nước",
    image: "/src/assets/cultural-festival.jpg",
    reviewInfo: {
      rating: 4.4,
      count: 1234,
    },
  },
  {
    id: 21,
    name: "Ga Đà Lạt",
    description:
      "Nhà ga xe lửa cổ kính được xây dựng năm 1938 với kiến trúc Art Deco độc đáo.",
    type: "Di tích kiến trúc",
    image: "/src/assets/cultural-festival.jpg",
    reviewInfo: {
      rating: 4.2,
      count: 876,
    },
  },

  // Sapa
  {
    id: 22,
    name: "Ruộng bậc thang Mường Hoa",
    description:
      "Hệ thống ruộng bậc thang tuyệt đẹp của người dân tộc H'Mông và Dao, đặc biệt đẹp vào mùa lúa chín.",
    type: "Cảnh quan nông nghiệp",
    image: "/src/assets/cultural-festival.jpg",
    reviewInfo: {
      rating: 4.9,
      count: 2345,
    },
  },
  {
    id: 23,
    name: "Đỉnh Fansipan",
    description:
      "Nóc nhà Đông Dương cao 3143m, có thể chinh phục bằng cáp treo hoặc trekking.",
    type: "Đỉnh núi",
    image: "/src/assets/cultural-festival.jpg",
    reviewInfo: {
      rating: 4.7,
      count: 1987,
    },
  },
  {
    id: 24,
    name: "Bản Cát Cát",
    description:
      "Làng của người H'Mông với nét văn hóa truyền thống đặc sắc và thác nước Cát Cát hùng vĩ.",
    type: "Làng văn hóa",
    image: "/src/assets/cultural-festival.jpg",
    reviewInfo: {
      rating: 4.6,
      count: 1456,
    },
  },

  // Huế
  {
    id: 25,
    name: "Đại Nội Huế",
    description:
      "Quần thể cung đình của triều Nguyễn với kiến trúc cung đình độc đáo, di sản văn hóa thế giới.",
    type: "Cung đình",
    image: "/src/assets/cultural-festival.jpg",
    reviewInfo: {
      rating: 4.6,
      count: 2876,
    },
  },
  {
    id: 26,
    name: "Lăng Khải Định",
    description:
      "Lăng tẩm của vua Khải Định với kiến trúc kết hợp phương Đông và phương Tây độc đáo.",
    type: "Lăng tẩm",
    image: "/src/assets/cultural-festival.jpg",
    reviewInfo: {
      rating: 4.5,
      count: 1654,
    },
  },
  {
    id: 27,
    name: "Sông Hương",
    description:
      "Dòng sông thơ mộng chảy qua thành phố Huế, có thể du ngoạn bằng thuyền rồng.",
    type: "Sông nước",
    image: "/src/assets/cultural-festival.jpg",
    reviewInfo: {
      rating: 4.4,
      count: 1876,
    },
  },

  // Phú Quốc
  {
    id: 28,
    name: "Bãi Sao",
    description:
      "Bãi biển đẹp nhất Phú Quốc với cát trắng mịn như bột, nước biển trong xanh như ngọc bích.",
    type: "Bãi biển",
    image: "/src/assets/cultural-festival.jpg",
    reviewInfo: {
      rating: 4.8,
      count: 2134,
    },
  },
  {
    id: 29,
    name: "Cáp treo Hòn Thơm",
    description:
      "Cáp treo vượt biển dài nhất thế giới nối từ An Thới đến Hòn Thơm với view tuyệt đẹp.",
    type: "Cáp treo",
    image: "/src/assets/cultural-festival.jpg",
    reviewInfo: {
      rating: 4.7,
      count: 1765,
    },
  },
  {
    id: 30,
    name: "Chợ đêm Dinh Cậu",
    description:
      "Chợ đêm sôi động với hải sản tươi ngon và đặc sản địa phương, gần dinh Cậu linh thiêng.",
    type: "Chợ đêm",
    image: "/src/assets/cultural-festival.jpg",
    reviewInfo: {
      rating: 4.3,
      count: 1456,
    },
  },
];
