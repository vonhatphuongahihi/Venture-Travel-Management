import { useLocation, useNavigate } from 'react-router-dom';
import { PaymentForm } from '@/components/payment/PaymentForm';
import { OrderSummary } from '@/components/payment/OrderSummary';
import { OrderSummary as OrderSummaryType } from '@/types/tour.types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Default test data for testing checkout page
const DEFAULT_TEST_DATA: OrderSummaryType = {
  tourName: 'Tour Ninh Bình – Tràng An & Tam Cốc 1 ngày',
  price: 1000000,
  discount: 0,
  tax: 0,
  total: 1000000,
};

export default function Checkout() {
  const navigate = useNavigate();
  const { state } = useLocation();
  
  // Get order summary from route state or use default test data
  const orderSummary: OrderSummaryType = state?.orderSummary || DEFAULT_TEST_DATA;

  const handlePaymentSuccess = () => {
    // TODO: Navigate to success page or show success message
    console.log('Payment successful!', { orderSummary });
    navigate('/booking-history', {
      state: { 
        paymentSuccess: true,
        orderSummary 
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      <Header />
      <div className="max-w-6xl mx-auto my-6 md:my-10 pt-6 md:pt-10 pb-8 md:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
          {/* Left Column - Payment Form */}
          <div className="w-full order-2 lg:order-1">
            <PaymentForm onSubmit={handlePaymentSuccess} />
          </div>

          {/* Right Column - Order Summary */}
          <div className="w-full lg:sticky lg:top-8 lg:self-start order-1 lg:order-2">
            <OrderSummary order={orderSummary} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
