import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  CalendarClock,
  Flag,
  Hotel,
  LandPlot,
  Layers,
  MapPin,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { DateChooser } from "@/components/map/DateChooser";
import InteractiveMap from "@/components/map/InteractiveMap";
import { TourType, DestinationType, EventType, HotelType } from "@/types"; // các kiểu dữ liệu được khai báo trong types/index.d.ts

type Layer = "tour" | "destination" | "event" | "hotel";
type Area = "all" | "north" | "centre" | "south";

type FilterData = Record<Layer, number>;
type FilterState = Record<Area, FilterData>;

const Map = () => {
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  const [destinations, setDestinations] = useState<DestinationType[]>([]);
  const [events, setEvents] = useState<EventType[]>([]);
  const [hotels, setHotels] = useState<HotelType[]>([]);
  const [tours, setTours] = useState<TourType[]>([]);
  const [filter, setFilter] = useState<FilterState>({
    all: { tour: 237, destination: 85, event: 32, hotel: 1326 },
    north: { tour: 89, destination: 32, event: 16, hotel: 562 },
    centre: { tour: 76, destination: 24, event: 9, hotel: 353 },
    south: { tour: 72, destination: 29, event: 7, hotel: 411 },
  });

  const [currentLayer, setCurrentLayer] = useState("tour" as Layer);
  const [currentArea, setCurrentArea] = useState("all" as Area);
  const [startDate, setStart] = useState<Date>(new Date());
  const [endDate, setEnd] = useState<Date>(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  );

  const fetch = async (startDate, endDate) => {
    //////////// use hard-core data 'cause no BE
    const resTours: TourType[] = [
      {
        name: "Tour Hà Nội → Hạ Long",
        description:
          "Tour khám phá Hà Nội, qua các điểm nổi bật và Vịnh Hạ Long",
        region: "north",
        coords: [
          // Hà Nội trung tâm
          [21.0285, 105.8542], // Hồ Hoàn Kiếm, Hà Nội
          [21.03, 105.834], // Văn Miếu – Quốc Tử Giám
          [21.0245, 105.824], // Nhà thờ Lớn Hà Nội (gần trung tâm)
          // Đi hướng ra ngoại thành / đi qua cao tốc
          [20.98, 106.04], // Cầu Nhật Tân hoặc khu ven đô (gần đường ra Hạ Long)
          [21.14, 106.37], // Đông Triều / Uông Bí (qua Quảng Ninh)
          // Trên đường tới Hạ Long
          [20.95, 106.074], // Bãi Cháy Bridge (Cầu Bãi Cháy) :contentReference[oaicite:0]{index=0}
          [20.92, 106.9865], // Đảo Tuần Châu :contentReference[oaicite:1]{index=1}
          // Trong vùng Hạ Long
          [20.9175, 107.1839], // Vịnh Hạ Long (gần trung tâm vịnh) :contentReference[oaicite:2]{index=2}
          [20.95, 107.0746], // Bãi Cháy (phía ven) :contentReference[oaicite:3]{index=3}
          [20.961, 107.125], // Khu vực Sun World / Dragon Park Hạ Long :contentReference[oaicite:4]{index=4}
          [20.915, 107.05], // Khu hang động / đá vôi giữa vịnh
        ],
      },
      {
        name: "Tour Đà Nẵng → Hội An",
        description:
          "Khám phá Đà Nẵng hiện đại, biển Mỹ Khê, Ngũ Hành Sơn và phố cổ Hội An",
        region: "centre",
        coords: [
          [16.0544, 108.2022], // Trung tâm Đà Nẵng (Cầu Rồng, Bạch Đằng)
          [16.0614, 108.2294], // Cầu Rồng / Sông Hàn
          [16.0739, 108.2498], // Biển Mỹ Khê
          [16.0065, 108.263], // Ngũ Hành Sơn
          [15.9771, 108.3193], // Làng đá mỹ nghệ Non Nước
          [15.9442, 108.3287], // Cửa Đại (ven biển)
          [15.915, 108.335], // Cẩm Thanh (rừng dừa nước)
          [15.8801, 108.338], // Phố cổ Hội An
        ],
      },
      {
        name: "Tour Nội Thành TP.Hồ Chí Minh",
        description: "",
        region: "south",
        coords: [
          [10.7769942, 106.6953021], //Dinh Độc Lập
          [10.780963, 106.7000734], //Duong sach Nguyen Van Binh
          [10.7797855, 106.6990189], //Nha tho Duc Ba
          [10.7760193, 106.7015489], // Tuong Chu Tich Ho Chi Minh
          [10.7772882, 106.7066269], //Bao Tang Ton Duc Thang
        ],
      },
      {
        name: "Tour Bạc Liêu - Cà Mau",
        description: "",
        region: "south",
        coords: [
          [9.227615474981983, 105.3969353744967],
          [9.188121880153181, 105.14040598362006],
          [9.198185876689186, 104.95918199146024],
          [9.293609938991091, 104.99838336482277],
          [9.284306982419066, 105.20222621234235],
        ],
      },
      {
        name: "Tour TP.HCM → Mỹ Tho → Vĩnh Long → Cần Thơ → Hậu Giang → Sóc Trăng",
        description:
          "Vĩnh Long - Thưởng thức ẩm thực tiêu biểu Việt Nam - Cần Thơ - Nghỉ dưỡng resort tương đương 4 sao",
        region: "south",
        coords: [
          [10.804108878465385, 106.69752317737738],
          [10.193069199079849, 105.8776396108681],
          [10.275252249788082, 105.90743489511212],
          [10.245413012420794, 105.98551808299526],
          [10.258316165985471, 105.95856228017756],
          [10.193069199079849, 105.8775323225041],
          [9.959235476789516, 105.68895726947945],
          [10.005363825929543, 105.74593868017497],
          [9.992340479792329, 105.68599512250202],
          [10.804108878465385, 106.69752317737738],
        ],
      },
    ];
    const resDest: DestinationType[] = [
      {
        region: "north",
        name: "Hà Nội",
        description: "Hồ Hoàn Kiếm",
        coords: [21.0285, 105.8542],
      },
      {
        region: "north",
        name: "Hà Nội",
        description: "Văn Miếu",
        coords: [21.0287, 105.835],
      },
      {
        region: "north",
        name: "Hà Nội",
        description: "Lăng Chủ tịch Hồ Chí Minh",
        coords: [21.0379, 105.8342],
      },
      {
        region: "north",
        name: "Hà Nội",
        description: "Nhà thờ Lớn",
        coords: [21.0289, 105.8496],
      },
      {
        region: "north",
        name: "Hà Nội",
        description: "Chùa Một Cột",
        coords: [21.0338, 105.8354],
      },
      {
        region: "north",
        name: "Sa Pa",
        description: "Fansipan",
        coords: [22.304, 103.77],
      },
      {
        region: "north",
        name: "Sa Pa",
        description: "Thác Bạc",
        coords: [22.3566, 103.7784],
      },
      {
        region: "north",
        name: "Sa Pa",
        description: "Bản Cát Cát",
        coords: [22.3297, 103.8283],
      },
      {
        region: "north",
        name: "Sa Pa",
        description: "Nhà thờ Đá",
        coords: [22.335, 103.8436],
      },
      {
        region: "north",
        name: "Hạ Long",
        description: "Vịnh Hạ Long",
        coords: [20.9101, 107.1839],
      },
      {
        region: "north",
        name: "Hạ Long",
        description: "Bãi Cháy",
        coords: [20.951, 107.0746],
      },
      {
        region: "north",
        name: "Hạ Long",
        description: "Đảo Tuần Châu",
        coords: [20.921, 106.999],
      },
      {
        region: "north",
        name: "Ninh Bình",
        description: "Tràng An",
        coords: [20.2546, 105.9029],
      },
      {
        region: "north",
        name: "Ninh Bình",
        description: "Tam Cốc Bích Động",
        coords: [20.24, 105.922],
      },
      {
        region: "north",
        name: "Ninh Bình",
        description: "Hang Múa",
        coords: [20.234, 105.934],
      },
      {
        region: "north",
        name: "Ninh Bình",
        description: "Cố đô Hoa Lư",
        coords: [20.25, 105.89],
      },
      {
        region: "north",
        name: "Mộc Châu",
        description: "Đồi chè",
        coords: [20.85, 104.7],
      },
      {
        region: "north",
        name: "Mộc Châu",
        description: "Thác Dải Yếm",
        coords: [20.8333, 104.7333],
      },
      {
        region: "north",
        name: "Mộc Châu",
        description: "Đỉnh Pha Luông",
        coords: [20.5611, 104.6567],
      },
      {
        region: "north",
        name: "Hà Giang",
        description: "Cao nguyên đá Đồng Văn",
        coords: [23.2785, 105.361],
      },
      {
        region: "north",
        name: "Hà Giang",
        description: "Cột cờ Lũng Cú",
        coords: [23.3667, 105.3167],
      },
      {
        region: "north",
        name: "Hà Giang",
        description: "Phố cổ Đồng Văn",
        coords: [23.2833, 105.3667],
      },
      {
        region: "north",
        name: "Hà Giang",
        description: "Sông Nho Quế",
        coords: [23.25, 105.4],
      },
      {
        region: "north",
        name: "Bắc Kạn",
        description: "Hồ Ba Bể",
        coords: [22.4167, 105.6167],
      },
      {
        region: "north",
        name: "Cao Bằng",
        description: "Thác Bản Giốc",
        coords: [22.8522, 106.7286],
      },
      {
        region: "north",
        name: "Cao Bằng",
        description: "Động Ngườm Ngao",
        coords: [22.8667, 106.7167],
      },
      {
        region: "north",
        name: "Yên Bái",
        description: "Mù Cang Chải",
        coords: [21.776, 104.132],
      },
      {
        region: "north",
        name: "Lạng Sơn",
        description: "Ải Chi Lăng",
        coords: [21.72, 106.6],
      },
      {
        region: "north",
        name: "Quảng Ninh",
        description: "Yên Tử",
        coords: [21.14, 107.05],
      },
      {
        region: "north",
        name: "Thái Nguyên",
        description: "Hồ Núi Cốc",
        coords: [21.6333, 105.6833],
      },
      {
        region: "north",
        name: "Hòa Bình",
        description: "Thung Nai",
        coords: [20.72, 105.3],
      },

      {
        region: "centre",
        name: "Đà Nẵng",
        description: "Cầu Rồng",
        coords: [16.0544, 108.2022],
      },
      {
        region: "centre",
        name: "Đà Nẵng",
        description: "Bà Nà Hills",
        coords: [15.9976, 107.9964],
      },
      {
        region: "centre",
        name: "Đà Nẵng",
        description: "Ngũ Hành Sơn",
        coords: [16.0023, 108.2747],
      },
      {
        region: "centre",
        name: "Đà Nẵng",
        description: "Biển Mỹ Khê",
        coords: [16.0678, 108.2477],
      },
      {
        region: "centre",
        name: "Hội An",
        description: "Phố cổ",
        coords: [15.8801, 108.338],
      },
      {
        region: "centre",
        name: "Hội An",
        description: "Chùa Cầu",
        coords: [15.8789, 108.3309],
      },
      {
        region: "centre",
        name: "Huế",
        description: "Kinh thành",
        coords: [16.4637, 107.5909],
      },
      {
        region: "centre",
        name: "Huế",
        description: "Lăng Tự Đức",
        coords: [16.434, 107.56],
      },
      {
        region: "centre",
        name: "Huế",
        description: "Chùa Thiên Mụ",
        coords: [16.4675, 107.5639],
      },
      {
        region: "centre",
        name: "Quảng Bình",
        description: "Phong Nha",
        coords: [17.5936, 106.2872],
      },
      {
        region: "centre",
        name: "Quảng Bình",
        description: "Động Thiên Đường",
        coords: [17.556, 106.287],
      },
      {
        region: "centre",
        name: "Quảng Trị",
        description: "Thành cổ Quảng Trị",
        coords: [16.75, 107.2],
      },
      {
        region: "centre",
        name: "Nha Trang",
        description: "Tháp Bà Ponagar",
        coords: [12.2584, 109.1967],
      },
      {
        region: "centre",
        name: "Nha Trang",
        description: "Vinpearl Land",
        coords: [12.2167, 109.2333],
      },
      {
        region: "centre",
        name: "Nha Trang",
        description: "Hòn Mun",
        coords: [12.1833, 109.3],
      },
      {
        region: "centre",
        name: "Nha Trang",
        description: "Dốc Lết",
        coords: [12.5833, 109.2333],
      },
      {
        region: "centre",
        name: "Đà Lạt",
        description: "Hồ Xuân Hương",
        coords: [11.9404, 108.4583],
      },
      {
        region: "centre",
        name: "Đà Lạt",
        description: "Thung lũng Tình Yêu",
        coords: [11.9667, 108.4667],
      },
      {
        region: "centre",
        name: "Đà Lạt",
        description: "Langbiang",
        coords: [12.0, 108.45],
      },
      {
        region: "centre",
        name: "Đà Lạt",
        description: "Đồi chè Cầu Đất",
        coords: [11.8667, 108.55],
      },

      {
        region: "south",
        name: "TP. Hồ Chí Minh",
        description: "Nhà thờ Đức Bà",
        coords: [10.7769, 106.7009],
      },
      {
        region: "south",
        name: "TP. Hồ Chí Minh",
        description: "Dinh Độc Lập",
        coords: [10.7772, 106.695],
      },
      {
        region: "south",
        name: "TP. Hồ Chí Minh",
        description: "Chợ Bến Thành",
        coords: [10.772, 106.6983],
      },
      {
        region: "south",
        name: "TP. Hồ Chí Minh",
        description: "Phố đi bộ Nguyễn Huệ",
        coords: [10.7731, 106.7042],
      },
      {
        region: "south",
        name: "Cần Thơ",
        description: "Bến Ninh Kiều",
        coords: [10.0342, 105.7875],
      },
      {
        region: "south",
        name: "Cần Thơ",
        description: "Chợ nổi Cái Răng",
        coords: [9.9896, 105.7579],
      },
      {
        region: "south",
        name: "Phú Quốc",
        description: "Bãi Sao",
        coords: [10.1036, 104.0183],
      },
      {
        region: "south",
        name: "Phú Quốc",
        description: "Vinpearl Safari",
        coords: [10.3728, 103.9725],
      },
      {
        region: "south",
        name: "Phú Quốc",
        description: "Dinh Cậu",
        coords: [10.227, 103.9633],
      },
      {
        region: "south",
        name: "Phú Quốc",
        description: "Bãi Dài",
        coords: [10.3189, 103.8947],
      },
      {
        region: "south",
        name: "Vũng Tàu",
        description: "Bãi Sau",
        coords: [10.4114, 107.1362],
      },
      {
        region: "south",
        name: "Vũng Tàu",
        description: "Tượng Chúa Kitô",
        coords: [10.3453, 107.0867],
      },
      {
        region: "south",
        name: "Côn Đảo",
        description: "Hòn Bảy Cạnh",
        coords: [8.6955, 106.609],
      },
      {
        region: "south",
        name: "Côn Đảo",
        description: "Nhà tù Côn Đảo",
        coords: [8.6769, 106.6],
      },
      {
        region: "south",
        name: "Đồng Tháp",
        description: "Tràm Chim",
        coords: [10.7, 105.5],
      },
      {
        region: "south",
        name: "An Giang",
        description: "Núi Sam - Miếu Bà Chúa Xứ",
        coords: [10.68, 105.0833],
      },
      {
        region: "south",
        name: "An Giang",
        description: "Rừng tràm Trà Sư",
        coords: [10.5833, 105.0833],
      },
      {
        region: "south",
        name: "Kiên Giang",
        description: "Hà Tiên",
        coords: [10.3833, 104.4833],
      },
      {
        region: "south",
        name: "Sóc Trăng",
        description: "Chùa Dơi",
        coords: [9.6, 105.9833],
      },
      {
        region: "south",
        name: "Bạc Liêu",
        description: "Nhà công tử Bạc Liêu",
        coords: [9.2833, 105.7167],
      },
      {
        region: "south",
        name: "Cà Mau",
        description: "Mũi Cà Mau",
        coords: [8.6267, 104.9044],
      },
      {
        region: "south",
        name: "Tiền Giang",
        description: "Cồn Thới Sơn",
        coords: [10.3333, 106.3667],
      },
      {
        region: "south",
        name: "Bến Tre",
        description: "Cồn Phụng",
        coords: [10.2333, 106.3833],
      },
      {
        region: "south",
        name: "Trà Vinh",
        description: "Ao Bà Om",
        coords: [9.9333, 106.35],
      },
      {
        region: "south",
        name: "Long An",
        description: "Làng nổi Tân Lập",
        coords: [10.7, 105.9],
      },
      {
        region: "south",
        name: "Tây Ninh",
        description: "Núi Bà Đen",
        coords: [11.3667, 106.1333],
      },
    ];
    const resEvent: EventType[] = [
      {
        name: "Hanoi Beverage Festival 2025",
        description: "Lễ hội đồ uống Hà Nội tại Tây Hồ Creative Cultural Space, thưởng thức trà, bia thủ công, đồ uống sáng tạo",
        region: "north",
        coords: [21.0735, 105.8343], // Tây Hồ, Hà Nội (Trịnh Công Sơn walking street)
      },
      {
        name: "ITE HCMC 2025 (International Travel Expo HCM City)",
        description: "Hội chợ Du lịch Quốc tế tại SECC, TP. Hồ Chí Minh",
        region: "south",
        coords: [10.7431, 106.7210], // SECC, District 7, HCM (approx)
      },
      {
        name: "8Wonder Music Festival",
        description: "Đại nhạc hội âm nhạc quốc tế 8Wonder tại Phú Quốc,…",
        region: "south",
        coords: [10.1970, 103.9700], // Phú Quốc – chọn 1 điểm làm đại diện (ví dụ Grand World Phú Quốc)
      },
      {
        name: "VietFood & Beverage Hanoi 2025",
        description: "Triển lãm thực phẩm & đồ uống tại Cung Văn hóa I.C.E. Hà Nội",
        region: "north",
        coords: [21.0285, 105.8510], // I.C.E Hanoi (Cung Văn hóa), gần khu phố cổ
      },
    ];    
    const resHotel: HotelType[] = [
      {
        region: "north",
        name: "Sofitel Legend Metropole Hanoi",
        description: "Khách sạn Metropole Hà Nội",
        coords: [21.02546, 105.856068],
      },
      {
        region: "north",
        name: "Hilton Hanoi Opera",
        description: "Hilton / Waldorf Astoria Hà Nội",
        coords: [21.024, 105.855], // gần Opera
      },
      {
        region: "north",
        name: "Capella Hanoi",
        description: "Khách sạn cao cấp Hà Nội",
        coords: [21.03, 105.85], // ước lượng
      },
      {
        region: "centre",
        name: "Hyatt Regency Danang Resort & Spa",
        description: "Hyatt Đà Nẵng",
        coords: [16.047, 108.245],
      },
      {
        region: "centre",
        name: "Four Seasons Resort The Nam Hai",
        description: "Resort Hội An",
        coords: [15.88, 108.3333], // gần Hội An
      },
      {
        region: "centre",
        name: "Azerai La Residence Hue",
        description: "La Residence Huế",
        coords: [16.468, 107.585], // gần Kinh thành Huế
      },
      {
        region: "centre",
        name: "Banyan Tree Lang Co",
        description: "Resort Bãi biển Lăng Cô",
        coords: [16.259, 107.606],
      },
      {
        region: "centre",
        name: "Mia Resort Nha Trang",
        description: "Mia Resort Nha Trang",
        coords: [12.238, 109.195],
      },
      {
        region: "south",
        name: "Hotel Majestic Saigon",
        description: "Khách sạn Majestic Sài Gòn",
        coords: [10.7775, 106.7],
      },
      {
        region: "south",
        name: "Hotel Continental Saigon",
        description: "Khách sạn Continental Sài Gòn",
        coords: [10.778, 106.7005],
      },
      {
        region: "south",
        name: "Caravelle Hotel Saigon",
        description: "Khách sạn Caravelle Sài Gòn",
        coords: [10.779, 106.703],
      },
      {
        region: "south",
        name: "Park Hyatt Saigon",
        description: "Khách sạn Park Hyatt Thành phố HCM",
        coords: [10.775, 106.701],
      },
      {
        region: "south",
        name: "InterContinental Phu Quoc Long Beach Resort",
        description: "InterContinental Phú Quốc",
        coords: [10.197, 103.97],
      },
      {
        region: "south",
        name: "Six Senses Con Dao",
        description: "Six Senses Côn Đảo",
        coords: [8.703, 106.616],
      },
      {
        region: "centre",
        name: "Pilgrimage Village Boutique Resort & Spa Hue",
        description: "Resort Huế Boutique",
        coords: [16.453, 107.586],
      },
    ];
    //////////// end of fetch data

    setDestinations(resDest);
    setEvents(resEvent);
    setHotels(resHotel);
    setTours(resTours);

    // build filter ngay tại đây
    setFilter(buildFilter(resTours, resDest, resEvent, resHotel));
    setIsPageLoaded(true);
  };
  const buildFilter = (
    tours: TourType[],
    destinations: DestinationType[],
    events: EventType[],
    hotels: HotelType[]
  ): FilterState => {
    const count = (arr: { region: string }[], region: string) =>
      arr.filter((item) => item.region === region).length;
    const regions: Area[] = ["all", "north", "centre", "south"];
    const data: FilterState = {} as FilterState;
    regions.forEach((region) => {
      data[region] = {
        tour: region === "all" ? tours.length : count(tours, region),
        destination:
          region === "all" ? destinations.length : count(destinations, region),
        event: region === "all" ? events.length : count(events, region),
        hotel: region === "all" ? hotels.length : count(hotels, region),
      };
    });
    return data;
  };

  useEffect(() => {
    if (!startDate || !endDate) return;
    let adjustedEndDate = endDate;
    // Nếu endDate < startDate => gán endDate = startDate
    if (startDate > endDate) {
      setEnd(startDate);
      adjustedEndDate = startDate;
    }
    // Gọi fetch data
    fetch(startDate, adjustedEndDate);
  }, [startDate, endDate]);

  return (
    <div className="flex flex-col min-h-screen space-y-10">
      <div
        className={`transition-all duration-1000 delay-200 ${
          isPageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <Header />
      </div>
      {/*Title*/}
      <div
        className={`flex flex-col text-center justify-center font-['Inter'] transition-all duration-1000 delay-200 ${
          isPageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <h2 className="text-2xl md:text-3xl font-bold">
          BẢN ĐỒ DU LỊCH TƯƠNG TÁC
        </h2>
        <p className="text-[#7b8b9d] text-lg">
          Khám phá các tour, điểm đến và sự kiện trên bản đồ Việt Nam. Theo dõi
          trạng thái tour theo thời gian thực.
        </p>
      </div>
      {/*Main*/}
      <div
        className={`flex self-center w-4/5 h-full justify-between transition-all duration-1000 delay-200 ${
          isPageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="flex flex-col space-y-4">
          {/*Ô chọn Lớp bản đồ*/}
          <div className="w-[300px] bg-white outline outline-1 outline-[#26B8ED] rounded-xl p-5 space-y-2">
            <div className="flex gap-4">
              <Layers className="w-4 h-4 mt-[4px] text-primary" />
              <p className="font-bold font-['Inter']">Lớp bản đồ</p>
            </div>
            <Button
              className={`${
                currentLayer == "tour"
                  ? "text-white"
                  : "text-black bg-white hover:bg-gray-400"
              } flex justify-between w-full px-2 py-1 rounded font-['Inter'] font-medium`}
              onClick={() => setCurrentLayer("tour")}
            >
              <div className="flex space-x-2 justify-center align-center">
                <Send className="w-4 h-4 mt-[2px]" />
                <p className="font-['Inter']">Tours</p>
              </div>
              <div className="w-[45px] h-[22px] bg-[#f0faff] rounded-full px-2 py-1">
                <div className="text-center justify-center text-[#1d2530] text-xs font-bold font-['Inter']">
                  {filter[currentArea]["tour"]}
                </div>
              </div>
            </Button>
            <Button
              className={`${
                currentLayer == "destination"
                  ? "text-white"
                  : "text-black bg-white hover:bg-gray-200"
              } flex justify-between w-full px-2 py-1 rounded font-['Inter'] font-medium`}
              onClick={() => setCurrentLayer("destination")}
            >
              <div className="flex space-x-2 justify-center align-center">
                <MapPin className="w-4 h-4 mt-[2px]" />
                <p className="font-normal font-['Inter']">Điểm đến</p>
              </div>
              <div className="w-[45px] h-[22px] bg-[#f0faff] rounded-full px-2 py-1">
                <div className="text-center justify-center text-[#1d2530] text-xs font-bold font-['Inter']">
                  {filter[currentArea]["destination"]}
                </div>
              </div>
            </Button>
            <Button
              className={`${
                currentLayer == "event"
                  ? "text-white"
                  : "text-black bg-white hover:bg-gray-200"
              } flex justify-between w-full px-2 py-1 rounded font-['Inter'] font-medium`}
              onClick={() => setCurrentLayer("event")}
            >
              <div className="flex space-x-2 justify-center align-center">
                <Flag className="w-4 h-4 mt-[2px]" />
                <p className="font-normal font-['Inter']">Sự kiện</p>
              </div>
              <div className="w-[45px] h-[22px] bg-[#f0faff] rounded-full px-2 py-1">
                <div className="text-center justify-center text-[#1d2530] text-xs font-bold font-['Inter']">
                  {filter[currentArea]["event"]}
                </div>
              </div>
            </Button>
            <Button
              className={`${
                currentLayer == "hotel"
                  ? "text-white"
                  : "text-black bg-white hover:bg-gray-200"
              } flex justify-between w-full px-2 py-1 rounded font-['Inter'] font-medium`}
              onClick={() => setCurrentLayer("hotel")}
            >
              <div className="flex space-x-2 justify-center align-center">
                <Hotel className="w-4 h-4 mt-[2px]" />
                <p className="font-normal font-['Inter']">Khách sạn</p>
              </div>
              <div className="w-[45px] h-[22px] bg-[#f0faff] rounded-full px-2 py-1">
                <div className="text-center justify-center text-[#1d2530] text-xs font-bold font-['Inter']">
                  {filter[currentArea]["hotel"]}
                </div>
              </div>
            </Button>
          </div>
          {/*Ô chọn Khu vực*/}
          <div className="w-[300px] bg-white outline outline-1 outline-[#26B8ED] rounded-xl p-5 space-y-2">
            <div className="flex gap-4">
              <LandPlot className="w-4 h-4 mt-[4px] text-primary" />
              <p className="font-bold font-['Inter']">Khu vực</p>
            </div>
            <Button
              className={`${
                currentArea == "all"
                  ? "text-white"
                  : "text-black bg-white hover:bg-gray-400"
              } flex justify-between w-full px-2 py-1 rounded font-['Inter'] font-medium`}
              onClick={() => setCurrentArea("all")}
            >
              <p className="font-['Inter']">Tất cả</p>
              <div className="w-[45px] h-[22px] bg-[#f0faff] rounded-full px-2 py-1">
                <div className="text-center justify-center text-[#1d2530] text-xs font-bold font-['Inter']">
                  {filter["all"][currentLayer]}
                </div>
              </div>
            </Button>
            <Button
              className={`${
                currentArea == "north"
                  ? "text-white"
                  : "text-black bg-white hover:bg-gray-200"
              } flex justify-between w-full px-2 py-1 rounded font-['Inter'] font-medium`}
              onClick={() => setCurrentArea("north")}
            >
              <p className="font-normal font-['Inter']">Miền Bắc</p>
              <div className="w-[45px] h-[22px] bg-[#f0faff] rounded-full px-2 py-1">
                <div className="text-center justify-center text-[#1d2530] text-xs font-bold font-['Inter']">
                  {filter["north"][currentLayer]}
                </div>
              </div>
            </Button>
            <Button
              className={`${
                currentArea == "centre"
                  ? "text-white"
                  : "text-black bg-white hover:bg-gray-200"
              } flex justify-between w-full px-2 py-1 rounded font-['Inter'] font-medium`}
              onClick={() => setCurrentArea("centre")}
            >
              <p className="font-normal font-['Inter']">Miền Trung</p>
              <div className="w-[45px] h-[22px] bg-[#f0faff] rounded-full px-2 py-1">
                <div className="text-center justify-center text-[#1d2530] text-xs font-bold font-['Inter']">
                  {filter["centre"][currentLayer]}
                </div>
              </div>
            </Button>
            <Button
              className={`${
                currentArea == "south"
                  ? "text-white"
                  : "text-black bg-white hover:bg-gray-200"
              } flex justify-between w-full px-2 py-1 rounded font-['Inter'] font-medium`}
              onClick={() => setCurrentArea("south")}
            >
              <p className="font-normal font-['Inter']">Miền Nam</p>
              <div className="w-[45px] h-[22px] bg-[#f0faff] rounded-full px-2 py-1">
                <div className="text-center justify-center text-[#1d2530] text-xs font-bold font-['Inter']">
                  {filter["south"][currentLayer]}
                </div>
              </div>
            </Button>
          </div>
          {/*Ô chọn Thời gian*/}
          <div className="w-[300px] bg-white outline outline-1 outline-[#26B8ED] rounded-xl p-5 space-y-2">
            <div className="flex gap-4">
              <CalendarClock className="w-4 h-4 mt-[4px] text-primary" />
              <p className="font-bold font-['Inter']">Thời gian</p>
            </div>
            <DateChooser selectedDate={startDate} onDateChange={setStart} />
            <DateChooser
              selectedDate={endDate}
              onDateChange={setEnd}
              startDate={startDate}
            />
          </div>
        </div>
        <div
          className={`w-[900px] h-[600px] rounded rounded-[12px] bg-red-400 ${
            isPageLoaded
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <InteractiveMap
            area={currentArea}
            layer={currentLayer}
            tours={tours}
            destinations={destinations}
            events={events}
            hotels={hotels}
          />
        </div>
      </div>

      <div
        className={`transition-all duration-1000 delay-400 ${
          isPageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <Footer />
      </div>
    </div>
  );
};

export default Map;
