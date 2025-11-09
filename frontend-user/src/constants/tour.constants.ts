// Tour constants and mock data
export const MOCK_TOUR_DATA = {
  id: 'ninh-binh-tour',
  name: 'Ninh Bình',
  location: 'Ninh Bình, Việt Nam',
  price: 1000000,
  rating: 5,
  reviewCount: 2300,
  duration: '1 ngày',
  description: `Trải nghiệm hành trình tuyệt vời tại Ninh Bình – vùng đất được mệnh danh là "Hạ Long trên cạn" với khung cảnh non nước hữu tình, nơi núi đá vôi hùng vĩ soi bóng xuống dòng sông uốn lượn. Tour đưa bạn khám phá quần thể danh thắng Tràng An và Tam Cốc – Bích Động, di sản văn hóa và thiên nhiên thế giới được UNESCO công nhận.

Ngoài ra, bạn sẽ ghé thăm cố đô Hoa Lư – kinh đô đầu tiên của Việt Nam dưới triều đại Đinh và Tiền Lê, tìm hiểu những dấu ấn lịch sử hào hùng gắn liền với công cuộc dựng nước và giữ nước. Hành trình còn mang đến trải nghiệm ẩm thực độc đáo, với các món đặc sản trứ danh như cơm cháy giòn rụm, thịt dê núi thơm ngon, và nhiều hương vị đặc sản địa phương khác.`,
  destination: 'Tràng An - Tam Cốc - Bích Động - Cố đô Hoa Lư, Ninh Bình',
  departurePoint: 'Khu phố cổ Hà Nội',
  departureTime: '07:30 sáng',
  returnTime: 'Khoảng 06:30 chiều (cùng ngày)',
  dressCode: 'Quần áo thoải mái, nhẹ nhàng',
  images: [
    'https://placehold.co/670x420',
    'https://placehold.co/236x240',
    'https://placehold.co/237x240',
    'https://placehold.co/236x240',
    'https://placehold.co/237x240',
    'https://placehold.co/236x240',
    'https://placehold.co/236x240',
  ],
  included: [
    'Ăn trưa',
    'Khách sạn',
    'Ăn sáng',
    'Vận chuyển',
    'Hướng dẫn viên',
  ],
  excluded: [
    'Ăn tối',
    'Chi phí cá nhân',
  ],
};

export const TICKET_TYPES = [
  { value: 'adult', label: 'Người lớn' },
  { value: 'child', label: 'Trẻ em' },
] as const;

export const IMAGE_DESCRIPTION = 'Ninh Bình là điểm đến lý tưởng dành cho những ai muốn tìm về thiên nhiên và trải nghiệm văn hóa – lịch sử đặc sắc. Tại đây, bạn sẽ được ngồi thuyền xuôi theo dòng sông Ngô Đồng, chiêm ngưỡng cảnh quan núi đá vôi hùng vĩ, len lỏi qua những hang động kỳ bí và tận hưởng không khí trong lành của "Hạ Long trên cạn".';
