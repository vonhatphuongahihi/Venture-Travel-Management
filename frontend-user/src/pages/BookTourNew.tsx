import { useNavigate } from 'react-router-dom';
import { TourHero } from '@/components/tour/TourHero';
import { TourInfo } from '@/components/tour/TourInfo';
import { TourGallery } from '@/components/tour/TourGallery';
import { BookingFormCard } from '@/components/booking/BookingFormCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { MOCK_TOUR_DATA, IMAGE_DESCRIPTION } from '@/constants/tour.constants';

export default function BookTourNew() {
  const navigate = useNavigate();

  const handleCheckAvailability = () => {
    // TODO: Call API to check availability
    console.log('Checking availability...');
  };

  const handleBook = () => {
    // Navigate to checkout page
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Navigation */}
      <TourHero
        backgroundImage="https://placehold.co/1440x763"
        title="ĐỒNG HÀNH CÙNG BẠN ĐẾN MỌI MIỀN TỔ QUỐC VIỆT NAM"
      >
        <div className="relative z-10">
          <Header />
        </div>
      </TourHero>

      {/* Main Content */}
      <div className="max-w-[1328px] mx-auto my-[72px] shadow-[0px_4px_48px_12px_rgba(0,0,0,0.09)] bg-white p-[38px]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Tour Info */}
          <div className="lg:col-span-2">
            <TourInfo tour={MOCK_TOUR_DATA} />
            <TourGallery 
              images={MOCK_TOUR_DATA.images} 
              description={IMAGE_DESCRIPTION}
            />
          </div>

          {/* Right Column - Booking Form */}
          <div className="lg:col-span-1">
            <BookingFormCard
              title="Đặt Ngay"
              description='Khám phá Ninh Bình – vùng đất non nước hữu tình được ví như "Hạ Long trên cạn". Tour đưa bạn đến nơi núi đá vôi hùng vĩ soi bóng xuống dòng sông.'
              onCheckAvailability={handleCheckAvailability}
              onBook={handleBook}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
