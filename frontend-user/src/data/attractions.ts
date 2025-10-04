import { Attraction } from "@/global.types";

export const mockAttractions: Attraction[] = [
  // Hà Nội
  {
    id: 1,
    name: "Hồ Hoàn Kiếm",
    slug: "ho-hoan-kiem",
    description:
      "Hồ nước ngọt tự nhiên nằm ở trung tâm Hà Nội, là biểu tượng của thủ đô với tháp Rùa và đền Ngọc Sơn nổi tiếng.",
    category: "Hồ nước",
    image: "/src/assets/cultural-festival.jpg",
    images: [
      "/src/assets/hero-vietnam.jpg",
      "/src/assets/top-2-destination.png",
      "/src/assets/cultural-festival.jpg",
    ],
    location: {
      province: "Hà Nội",
      slug: "ha-noi",
      address: "Hoàn Kiếm, Hà Nội",
      coordinates: {
        lat: 21.0285,
        lng: 105.8542,
      },
    },
    reviewInfo: {
      rating: 4.6,
      count: 1245,
    },
  },
  {
    id: 2,
    name: "Văn Miếu - Quốc Tử Giám",
    slug: "van-mieu-quoc-tu-giam",
    description:
      "Ngôi đền đầu tiên của Việt Nam, được xây dựng để thờ Khổng Tử và các bậc hiền tài, là trường đại học đầu tiên của Việt Nam.",
    category: "Di tích lịch sử",
    image: "/src/assets/cultural-festival.jpg",
    images: [
      "/src/assets/cultural-festival.jpg",
      "/src/assets/explore-360/banner-1.jpg",
      "/src/assets/explore-360/banner-2.jpg",
    ],
    location: {
      province: "Hà Nội",
      slug: "ha-noi",
      address: "58 Quốc Tử Giám, Đống Đa, Hà Nội",
      coordinates: {
        lat: 21.0267,
        lng: 105.8355,
      },
    },
    reviewInfo: {
      rating: 4.5,
      count: 892,
    },
  },
  {
    id: 3,
    name: "Phố cổ Hà Nội",
    slug: "pho-co-ha-noi",
    description:
      "Khu phố cổ với 36 phố phường truyền thống, nơi lưu giữ nét văn hóa đặc trưng và ẩm thực đường phố phong phú.",
    category: "Khu phố cổ",
    image: "/src/assets/cultural-festival.jpg",
    images: [
      "/src/assets/top-3-destination.png",
      "/src/assets/explore-360/banner-3.jpg",
      "/src/assets/hero-vietnam-1.jpg",
    ],
    location: {
      province: "Hà Nội",
      slug: "ha-noi",
      address: "Hoàn Kiếm, Hà Nội",
      coordinates: {
        lat: 21.0313,
        lng: 105.8516,
      },
    },
    reviewInfo: {
      rating: 4.7,
      count: 2156,
    },
  },

  // TP. Hồ Chí Minh
  {
    id: 4,
    name: "Dinh Độc Lập",
    slug: "dinh-doc-lap",
    description:
      "Cung điện của Tổng thống miền Nam Việt Nam trước năm 1975, nay là bảo tàng lịch sử với kiến trúc độc đáo.",
    category: "Di tích lịch sử",
    image: "/src/assets/cultural-festival.jpg",
    images: [
      "/src/assets/explore-360/tour-3.png",
      "/src/assets/cultural-festival.jpg",
      "/src/assets/explore-360/tour-4.jpg",
    ],
    location: {
      province: "TP. Hồ Chí Minh",
      slug: "tp-ho-chi-minh",
      address: "135 Nam Kỳ Khởi Nghĩa, Bến Thành, Quận 1, TP. Hồ Chí Minh",
      coordinates: {
        lat: 10.7769,
        lng: 106.6955,
      },
    },
    reviewInfo: {
      rating: 4.4,
      count: 1567,
    },
  },
  {
    id: 5,
    name: "Chợ Bến Thành",
    slug: "cho-ben-thanh",
    description:
      "Khu chợ truyền thống nổi tiếng nhất Sài Gòn với đủ loại hàng hóa từ thực phẩm, quần áo đến đồ lưu niệm.",
    category: "Chợ truyền thống",
    image: "/src/assets/cultural-festival.jpg",
    images: [
      "/src/assets/cultural-festival.jpg",
      "/src/assets/explore-360/tour-5.jpg",
      "/src/assets/explore-360/tour-6.jpg",
    ],
    location: {
      province: "TP. Hồ Chí Minh",
      slug: "tp-ho-chi-minh",
      address: "Lê Lợi, Bến Thành, Quận 1, TP. Hồ Chí Minh",
      coordinates: {
        lat: 10.772,
        lng: 106.6981,
      },
    },
    reviewInfo: {
      rating: 4.2,
      count: 2341,
    },
  },
  {
    id: 6,
    name: "Nhà thờ Đức Bà Sài Gòn",
    slug: "nha-tho-duc-ba-sai-gon",
    description:
      "Nhà thờ Công giáo Roman nổi tiếng với kiến trúc Gothic và hai thánh đường cao vút, là biểu tượng của thành phố.",
    category: "Kiến trúc tôn giáo",
    image: "/src/assets/cultural-festival.jpg",
    images: [
      "/src/assets/cultural-festival.jpg",
      "/src/assets/hero-vietnam-2.jpg",
      "/src/assets/explore-360/banner-1.jpg",
    ],
    location: {
      province: "TP. Hồ Chí Minh",
      slug: "tp-ho-chi-minh",
      address: "01 Công xã Paris, Bến Nghé, Quận 1, TP. Hồ Chí Minh",
      coordinates: {
        lat: 10.7797,
        lng: 106.6991,
      },
    },
    reviewInfo: {
      rating: 4.3,
      count: 1876,
    },
  },

  // Hạ Long
  {
    id: 7,
    name: "Vịnh Hạ Long",
    slug: "vinh-ha-long",
    description:
      "Di sản thiên nhiên thế giới với hơn 1600 hòn đảo đá vôi kỳ vĩ nổi lên từ nước biển xanh trong.",
    category: "Di sản thiên nhiên",
    image: "/src/assets/cultural-festival.jpg",
    images: [
      "/src/assets/hero-vietnam-1.jpg",
      "/src/assets/hero-vietnam-2.jpg",
      "/src/assets/beach-destination.jpg",
      "/src/assets/hero-vietnam.jpg",
    ],
    location: {
      province: "Quảng Ninh",
      slug: "quang-ninh",
      address: "Hạ Long, Quảng Ninh",
      coordinates: {
        lat: 20.9101,
        lng: 107.1839,
      },
    },
    reviewInfo: {
      rating: 4.8,
      count: 3245,
    },
  },
  {
    id: 8,
    name: "Đảo Cát Bà",
    slug: "dao-cat-ba",
    description:
      "Đảo lớn nhất trong quần đảo Cát Bà với vườn quốc gia, bãi biển đẹp và làng chài truyền thống.",
    category: "Đảo du lịch",
    image: "/src/assets/cultural-festival.jpg",
    images: [
      "/src/assets/beach-destination.jpg",
      "/src/assets/explore-360/tour-1.jpg",
      "/src/assets/explore-360/tour-2.jpg",
    ],
    location: {
      province: "Hải Phòng",
      slug: "hai-phong",
      address: "Đảo Cát Bà, Cát Hải, Hải Phòng",
      coordinates: {
        lat: 20.7896,
        lng: 107.0444,
      },
    },
    reviewInfo: {
      rating: 4.5,
      count: 987,
    },
  },
  {
    id: 9,
    name: "Hang Sửng Sốt",
    slug: "hang-sung-sot",
    description:
      "Hang động tự nhiên rộng lớn với nhũ đá kỳ vĩ, được ví như cung điện dưới lòng đất.",
    category: "Hang động",
    image: "/src/assets/cultural-festival.jpg",
    images: [
      "/src/assets/explore-360/tour-3.jpg",
      "/src/assets/explore-360/tour-4.jpg",
      "/src/assets/hero-vietnam.jpg",
    ],
    location: {
      province: "Quảng Ninh",
      slug: "quang-ninh",
      address: "Đảo Bồ Hòn, Vịnh Hạ Long, Quảng Ninh",
      coordinates: {
        lat: 20.8058,
        lng: 107.0836,
      },
    },
    reviewInfo: {
      rating: 4.6,
      count: 1432,
    },
  },

  {
    id: 10,
    name: "Cát Cát",
    slug: "cat-cat",
    description:
      "Một trong những bản người H'Mông đẹp nhất Sapa, nơi lưu giữ những nét văn hóa truyền thống độc đáo. Bản Cát Cát là một trong những bản làng đẹp nhất ở Sapa, cách trung tâm thị trấn khoảng 3km về phía Tây Nam. Đây là nơi sinh sống của đồng bào dân tộc H'Mông đen, nơi lưu giữ những nét văn hóa truyền thống độc đáo và phong cảnh thiên nhiên tuyệt đẹp.",
    category: "Làng văn hóa",
    image: "/images/cat-cat.jpg",
    images: [
      "/images/cat-cat-1.jpg",
      "/images/cat-cat-2.jpg",
      "/images/cat-cat-3.jpg",
    ],
    location: {
      province: "Lào Cai",
      slug: "lao-cai",
      address: "Bản Cát Cát, Xã San Sả Hồ, Sapa, Lào Cai",
      coordinates: {
        lat: 22.3362,
        lng: 103.8474,
      },
    },
    reviewInfo: {
      rating: 4.7,
      count: 206,
    },
  },
];
