import { TourService } from "@/services/tourService";
import { CreateTourRequest } from "@/types/tour";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();
const tourService = new TourService(prisma, process.env.MAPBOX_ACCESS_TOKEN);


async function main() {
    const tourData1: CreateTourRequest = {
        name: "Tour riêng nửa ngày tại Thành phố Hồ Chí Minh",
        images: ["", "", ""],
        about: "Nếu bạn chỉ có thời gian hạn chế ở thành phố thứ hai của Việt Nam, hãy chọn chuyến tham quan nửa ngày để giới thiệu toàn diện về Thành phố Hồ Chí Minh. Lý tưởng cho những du khách lần đầu, chuyến tham quan này sẽ đưa bạn đến những điểm nổi bật như Dinh Thống Nhất, Bảo tàng Chứng tích Chiến tranh và Nhà thờ Đức Bà Sài Gòn trong phòng có máy lạnh thoải mái và cho bạn lựa chọn khởi hành vào buổi sáng hoặc buổi chiều tùy theo lịch trình của bạn.",
        ageRange: "Tuổi 1-80",
        maxGroupSize: 15,
        duration: "4 giờ",
        languages: ["Tiếng Việt", "English"],
        categories: ["Ngắm cảnh", "Văn hóa", "Lịch sử"],
        expectations:
            "Tour bao gồm đi bộ nhiều, nên chuẩn bị giày thoải mái. Thời tiết Sài Gòn nóng ẩm nên mang theo nón, kem chống nắng.",
        pickupPoint: "Nhà hát Thành phố",
        pickupDetails:
            "Tập trung tại cổng chính Nhà hát Thành phố, đối diện khách sạn Continental",
        additionalInformation:
            "Tour không hoạt động vào các ngày lễ lớn. Vui lòng ăn mặc lịch sự khi tham quan nhà thờ.",
        cancellationPolicy:
            "Miễn phí hủy trước 24 giờ. Hủy trong vòng 24 giờ sẽ bị tính phí 50%. Không hoàn tiền nếu không đến.",
        startDate: new Date("2025-01-01"),
        endDate: new Date("2025-12-31"),
        highlights: [
            "Tham quan Dinh Độc Lập",
            "Nhà thờ Đức Bà",
            "Bưu điện Trung tâm, Chợ Bến Thành",
        ],
        pickupPointCoordinates: {
            latitude: 10.776889,
            longitude: 106.704498,
        },
        pickupAreaRadius: 500,
        inclusions: [
            "Xe ô tô điều hòa",
            "Hướng dẫn viên chuyên nghiệp",
            "Vé tham quan các điểm",
            "Nước uống miễn phí",
            "Bảo hiểm du lịch",
        ],
        exclusions: ["Chi phí cá nhân", "Bữa ăn trưa", "Tiền tip cho hướng dẫn viên"],
        tourStops: [
            {
                attractionId: "ATT_HCM_004",
                notes: "Dừng: 30 phút - Đã bao gồm phí vào cửa",
                details: "Vào ngày 30 tháng 4 năm 1975, Chiến tranh chống Mỹ chính thức kết thúc khi xe tăng số 843 đâm xuyên qua cổng dinh thự của Tổng thống Việt Nam Cộng hòa vào thời điểm đó.",
            },
            {
                attractionId: "ATT_HCM_001",
                notes: "Dừng: 60 phút - Đã bao gồm phí vào cửa",
                details: "Nhà thờ Đức Bà Sài Gòn là một nhà thờ nằm ​​ở trung tâm thành phố Hồ Chí Minh, Việt Nam. Được thành lập bởi thực dân Pháp, người ban đầu đặt tên là Cathédrale Notre-Dame de Saigon, nhà thờ được xây dựng từ năm 1863 đến năm 1880. Nó có hai tháp chuông, đạt chiều cao 58 mét (190 feet).",
            },
            {
                attractionId: "ATT_HCM_005",
                notes: "Dừng: 30 phút - Đã bao gồm phí vào cửa",
                details: "Chợ Bến Thành đón hơn 10.000 lượt khách mỗi ngày đến mua sắm và tham quan. Chợ có gần 1.500 gian hàng với hơn 6.000 tiểu thương bán buôn, bán lẻ các mặt hàng từ hàng tiêu dùng đến hàng cao cấp.",
            },
            
        ],

        ticketTypes: [
            {
                name: "Nhóm Riêng 13-15 Người",
                quantity: 100,
                notes: "Đã bao gồm đón khách",
                prices: [
                    {
                        categoryId: "c31f1e6f-1ae1-49f7-88f8-5c442a5d698c",
                        name: "Người lớn",
                        price: 450000,
                        quantity: 60,
                    },
                    {
                        categoryId: "673d8a3c-574d-4b52-9729-2e0f441e94f7",
                        name: "Trẻ em",
                        price: 300000,
                        quantity: 40,
                    },
                ],
            },
            {
                name: "Nhóm Riêng 1-4 Người",
                quantity: 20,
                notes: "Đã bao gồm đón khách",
                prices: [
                    {
                        categoryId: "c31f1e6f-1ae1-49f7-88f8-5c442a5d698c",
                        name: "Người lớn",
                        price: 850000,
                        quantity: 15,
                    },
                    {
                        categoryId: "673d8a3c-574d-4b52-9729-2e0f441e94f7",
                        name: "Trẻ em",
                        price: 600000,
                        quantity: 5,
                    },
                ],
            },
        ],
    };
    const tourData2: CreateTourRequest = {
        name: "Tour tham quan Hà Nội cả ngày TẤT CẢ TRONG MỘT ",
        about: "Khám phá các điểm tham quan đặc trưng của Hà Nội chỉ trong một ngày với hướng dẫn viên địa phương giàu kinh nghiệm và Wi-Fi trên tàu. Không cần phải mạo hiểm tính mạng và tay chân trên xe tay ga: xe đưa đón của bạn đón và trả khách tại các khách sạn ở Phố Cổ. Tham quan Văn Miếu, Hồ Hoàn Kiếm, Lăng Chủ tịch Hồ Chí Minh, Bảo tàng Dân tộc học Việt Nam, v.v., với vé vào cổng và bữa trưa ngon miệng của địa phương.",
        ageRange: "Tuổi 1-78",
        maxGroupSize: 24,
        duration: "8 giờ",
        languages: ["Tiếng Việt", "English"],
        categories: ["Ngắm cảnh", "Văn hóa", "Lịch sử"],
        highlights: [
            "Tham quan Dinh Độc Lập",
            "Nhà thờ Đức Bà",
            "Bưu điện Trung tâm, Chợ Bến Thành",
        ],
        inclusions: [
            "Đón và trả khách tại khách sạn ở khu phố cổ Hà Nội",
            "1 chai nước / mỗi người",
            "Tất cả vé vào cửa miễn phí",
            "Hướng dẫn viên nói tiếng Anh, tiếng Việt",
            "Bữa trưa kiểu Việt Nam",
            "Vé vào cửa - Chùa Trấn Quốc",
            "Vé vào cửa - Lăng Chủ tịch Hồ Chí Minh",
            "Vé vào cửa - Chùa Một Cột",
            "Vé vào cửa - Văn Miếu & Quốc Tử Giám",
        ],
        exclusions: ["Chi phí cá nhân", "Tiền tip cho hướng dẫn viên"],
        expectations:
            "Tham quan chùa Trấn Quốc – được xây dựng lần đầu tiên tại Hà Nội vào thế kỷ thứ 6. Bạn sẽ được nhìn thấy cây Bồ đề lâu đời nhất Việt Nam do Hồ Chí Minh trồng.",
        cancellationPolicy:
            "Miễn phí hủy trước 24 giờ. Hủy trong vòng 24 giờ sẽ bị tính phí 50%. Không hoàn tiền nếu không đến.",
        additionalInformation:
            "Tour không hoạt động vào các ngày lễ lớn. Vui lòng ăn mặc lịch sự khi tham quan nhà thờ.",

        pickupPoint: "Nhà hát Thành phố",
        pickupDetails: "Chúng tôi sẽ đón tất cả khách hàng tại khách sạn ở Trung tâm Phố Cổ Hà Nội. Nếu khách hàng ở ngoài Trung tâm Phố Cổ Hà Nội, vui lòng có mặt tại văn phòng của chúng tôi lúc 07:55 sáng để tham gia tour - Địa chỉ: 33 Ngô Huyền, Hoàn Kiếm, Hà Nội",
        pickupPointCoordinates: {
            latitude: 21.024407,
            longitude: 105.854991,
        },
        pickupAreaRadius: 500,
        startDate: new Date("2025-01-01"),
        endDate: new Date("2025-12-31"),
        images: ["", "", ""],
        tourStops: [
            {
                attractionId: "ATT_HN_006",
                notes: "Dừng: 30 phút - Đã bao gồm phí vào cửa",
                details: "Tham quan chùa Trấn Quốc – được xây dựng lần đầu tiên tại Hà Nội vào thế kỷ thứ 6. Bạn sẽ được nhìn thấy cây Bồ đề lâu đời nhất Việt Nam do Hồ Chí Minh trồng.",
            },
            {
                attractionId: "ATT_HN_003",
                notes: "Dừng: 60 phút - Đã bao gồm phí vào cửa",
                details: "Đến thăm khu phức hợp Hồ Chí Minh, bạn có cơ hội nhìn thấy thi hài Hồ Chí Minh sau đó đi dạo quanh vườn Hồ Chí Minh để xem 2 ngôi nhà nơi Người sống và làm việc từ năm 1954 đến năm 1969.",
            },
            {
                attractionId: "ATT_HN_005",
                notes: "Dừng: 30 phút - Đã bao gồm phí vào cửa",
                details: "Tham quan chùa Một Cột nơi thờ Bồ tát Quan Thế Âm – Ngôi chùa độc đáo nhất thế giới",
            },
            {
                attractionId: "ATT_HN_002",
                notes: "Dừng: 30 phút - Đã bao gồm phí vào cửa",
                details: "Tham quan Văn Miếu Quốc Tử Giám - trường đại học đầu tiên của Việt Nam dưới chế độ phong kiến.",
            },
        ],

        ticketTypes: [
            {
                name: "Xe Limousine: Tối đa 20 khách",
                quantity: 100,
                notes: "Xe Limousine: Tối đa 20 khách",
                prices: [
                    {
                        categoryId: "c31f1e6f-1ae1-49f7-88f8-5c442a5d698c",
                        name: "Người lớn",
                        price: 450000,
                        quantity: 60,
                    },
                    {
                        categoryId: "673d8a3c-574d-4b52-9729-2e0f441e94f7",
                        name: "Trẻ em",
                        price: 300000,
                        quantity: 40,
                    },
                ],
            },
            {
                name: "Xe buýt đưa đón - Tối đa 25 khách",
                quantity: 20,
                notes: "Xe buýt đưa đón - Tối đa 25 khách",
                prices: [
                    {
                        categoryId: "c31f1e6f-1ae1-49f7-88f8-5c442a5d698c",
                        name: "Người lớn",
                        price: 850000,
                        quantity: 15,
                    },
                    {
                        categoryId: "673d8a3c-574d-4b52-9729-2e0f441e94f7",
                        name: "Trẻ em",
                        price: 600000,
                        quantity: 5,
                    },
                ],
            },
        ],
    };
    const tourData3: CreateTourRequest = {
        name: "Tour du lịch lịch sử và di sản Hà Nội nửa ngày",
        about: "Tìm hiểu Việt Nam và tìm hiểu thêm về lịch sử cổ đại và hiện đại trong chuyến tham quan nửa ngày quanh Hà Nội. Với tất cả phí vào cửa đã được thanh toán trước, hãy tiết kiệm thời gian và bỏ qua việc xếp hàng tại Hoàng thành Thăng Long và Bảo tàng Lịch sử Quốc gia Việt Nam. Hãy tận dụng thời gian đó: đi dạo quanh các công trình kiến ​​trúc được UNESCO công nhận là Di sản Thế giới như Hậu Lâu (Chùa Công Chúa) và Điện Kính Thiên hàng thế kỷ, đồng thời khám phá những câu chuyện về quá khứ của Việt Nam thông qua các hiện vật và triển lãm của Bảo tàng Quốc gia.",
        ageRange: "Tuổi 2-75",
        maxGroupSize: 24,
        duration: "4 giờ",
        languages: ["Tiếng Việt", "English"],
        categories: ["Văn hóa", "Lịch sử"],
        highlights: [],
        inclusions: [
            "Các chuyến đi riêng trong tour bằng phương tiện có điều hòa theo lịch trình",
            "Hướng dẫn viên nói tiếng Anh.",
            "01 chai nước khoáng mỗi người",
            "Thuế Chính phủ và phí dịch vụ",
            "Vé vào cửa - Hoàng thành Thăng Long",
        ],
        exclusions: ["Chi phí cá nhân", "Tiền tip cho hướng dẫn viên"],
        expectations:
            "8h30: Hướng dẫn viên và tài xế địa phương đón khách tại khách sạn cho chuyến tham quan lịch sử nửa ngày tại Hà Nội. Bạn bắt đầu tại Hoàng thành Thăng Long, được xây dựng vào thế kỷ 11 để đánh dấu ngày Độc lập của Việt Nam. Nó được xây dựng trên phần còn lại của pháo đài Chiness có niên đại từ thế kỷ thứ 7, trên vùng đất thoát nước được khai hoang từ đồng bằng sông Hồng ở Hà Nội. Thành cổ đã chứng kiến ​​một loạt những thay đổi mạnh mẽ trong suốt lịch sử Việt Nam và đã trải qua nhiều cuộc chiến tranh hủy diệt. Phần đáng chú ý nhất của Hoàng thành Thăng Long là Khu trung tâm, được liệt kê là một trong những Di sản văn hóa của UNESCO năm 2010.",
        cancellationPolicy:
            "Miễn phí hủy trước 24 giờ. Hủy trong vòng 24 giờ sẽ bị tính phí 50%. Không hoàn tiền nếu không đến.",
        additionalInformation:
            "Tour không hoạt động vào các ngày lễ lớn. Vui lòng ăn mặc lịch sự khi tham quan nhà thờ.",
        pickupPoint: "Hàng Trống, Hoàn Kiếm, Hà Nội, Việt Nam",
        pickupDetails:
            "Chúng tôi sẽ đón tất cả khách hàng tại khách sạn ở Trung tâm Phố Cổ Hà Nội. Nếu khách hàng ở ngoài Trung tâm Phố Cổ Hà Nội, vui lòng có mặt tại văn phòng của chúng tôi lúc 07:55 sáng để tham gia tour - Địa chỉ: 33 Ngô Huyền, Hoàn Kiếm, Hà Nội",
        pickupPointCoordinates: {
            latitude: 21.024407,
            longitude: 105.854991,
        },
        pickupAreaRadius: 500,
        startDate: new Date("2025-01-01"),
        endDate: new Date("2025-12-31"),
        images: ["", "", ""],
        tourStops: [
            {
                attractionId: "ATT_HN_004",
                notes: "Dừng: 60 phút - Đã bao gồm phí vào cửa",
                details:
                    "Chúng ta sẽ tham quan: - Hoàng thành Thăng Long, được xây dựng vào thế kỷ 11 bởi nhà Lý Việt, đánh dấu sự độc lập của Đại Việt. Các tòa nhà của Hoàng thành phản ánh nền văn hóa Đông Nam Á độc đáo đặc trưng của vùng hạ lưu sông Hồng, nơi giao thoa giữa những ảnh hưởng đến từ Trung Quốc ở phía bắc và Vương quốc Champa cổ đại ở phía nam",
            },
            {
                attractionId: "ATT_HN_003",
                notes: "Dừng: 2 giờ - Đã bao gồm phí vào cửa",
                details:
                    "Tham quan Quần thể Chủ tịch Hồ Chí Minh (Lăng và Nhà sàn Hồ Chí Minh) - Nơi vị lãnh tụ vĩ đại đã sống và làm việc cho đến những năm cuối đời. Tại đây, các bạn sẽ có cơ hội tìm hiểu về cuộc sống bình dị của Bác Hồ. Ngoài ra, hãy ghé qua chùa Một Cột để chiêm ngưỡng một trong 4 biểu tượng của Hà Nội",
            },
            {
                attractionId: "ATT_HN_002",
                notes: "Dừng: 30 phút - Đã bao gồm phí vào cửa",
                details:
                    "Văn Miếu được xây dựng vào năm 1070, là trường đại học đầu tiên ở Việt Nam. Những khu vườn và kiến ​​trúc được bảo tồn tốt sẽ mang đến cái nhìn thư giãn về quá khứ của Việt Nam.",
            },
        ],

        ticketTypes: [
            {
                name: "Vé thường",
                quantity: 20,
                notes: "Đã bao gồm đón khách",
                prices: [
                    {
                        categoryId: "7537ef0a-c7fb-4a05-ab33-f4b2ab4033cf",
                        name: "Người lớn",
                        price: 450000,
                        quantity: 15,
                    },
                    {
                        categoryId: "ef0e08ba-f086-45b9-8976-203dddbcd9ae",
                        name: "Trẻ em",
                        price: 300000,
                        quantity: 5,
                    },
                ],
            },
        ],
    };
    try {
        const tour = await tourService.createTour(tourData3);
        console.log("✅ Created Tour:", tour.name);
    } catch (error) {
        console.error("❌ Error creating Tour:", error);
    }
}

main()
    .catch((e) => {
        console.error("❌ Seed error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
