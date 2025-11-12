import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PaymentForm } from '@/components/payment/PaymentForm';
import { OrderSummary } from '@/components/payment/OrderSummary';
import { OrderSummary as OrderSummaryType } from '@/types/tour.types';

export default function Checkout() {
  const navigate = useNavigate();
  
  // TODO: Get this from context or route state
  const [orderSummary] = useState<OrderSummaryType>({
    tourName: 'Tour Ninh Bình – Tràng An & Tam Cốc 1 ngày',
    price: 1000000,
    discount: 0,
    tax: 0,
    total: 1000000,
  });

  const handlePaymentSuccess = () => {
    // TODO: Navigate to success page or show success message
    console.log('Payment successful!');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Payment Form */}
          <div>
            <PaymentForm onSubmit={handlePaymentSuccess} />
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <OrderSummary order={orderSummary} />
          </div>
        </div>
      </div>
    </div>
  );
}
