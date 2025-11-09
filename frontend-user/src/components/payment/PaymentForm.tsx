import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { usePaymentForm } from '@/hooks/usePaymentForm';
import { CreditCard, Calendar, Lock } from 'lucide-react';

interface PaymentFormProps {
  onSubmit?: () => void;
}

export const PaymentForm = ({ onSubmit }: PaymentFormProps) => {
  const { 
    formData, 
    errors, 
    isSubmitting, 
    handleChange, 
    handleSubmit,
    applyPromoCode 
  } = usePaymentForm();

  const handlePayment = () => {
    handleSubmit((data) => {
      console.log('Payment data:', data);
      onSubmit?.();
    });
  };

  const handleApplyPromo = async () => {
    const result = await applyPromoCode();
    if (result) {
      console.log('Promo applied:', result);
    }
  };

  return (
    <div>
      <h1 className="text-[40px] font-bold text-black mb-8">Thanh toán</h1>
      <p className="text-[#575757] text-[24px] mb-12 max-w-[773px]">
        Để bắt đầu đăng ký, vui lòng nhập thông tin thẻ của bạn để thực hiện thanh toán.
        Bạn sẽ được chuyển hướng đến trang xác thực của ngân hàng.
      </p>

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        {/* Card Name */}
        <div>
          <label className="text-[#575757] text-[20px] mb-2 block">
            Tên chủ thẻ
          </label>
          <Input
            value={formData.cardName}
            onChange={(e) => handleChange('cardName', e.target.value)}
            className={`h-[66px] bg-[#EEEEEE] border-b-2 border-[#54C6EE] text-[23px] ${
              errors.cardName ? 'border-red-500' : ''
            }`}
            placeholder="Nhập tên trên thẻ"
          />
          {errors.cardName && (
            <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>
          )}
        </div>

        {/* Card Number */}
        <div>
          <label className="text-[#575757] text-[20px] mb-2 block">
            Số thẻ
          </label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              value={formData.cardNumber}
              onChange={(e) => handleChange('cardNumber', e.target.value)}
              className={`h-[65px] bg-[#EEEEEE] border-b-2 border-[#54C6EE] text-[23px] pl-12 ${
                errors.cardNumber ? 'border-red-500' : ''
              }`}
              placeholder="0000 0000 0000 0000"
            />
          </div>
          {errors.cardNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
          )}
        </div>

        {/* Expiry & CVC */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-[#575757] text-[20px] mb-2 block">
              Hết hạn
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                value={formData.expiry}
                onChange={(e) => handleChange('expiry', e.target.value)}
                className={`h-[67px] bg-[#EEEEEE] border-b-2 border-[#54C6EE] text-[23px] pl-12 ${
                  errors.expiry ? 'border-red-500' : ''
                }`}
                placeholder="MM / YY"
              />
            </div>
            {errors.expiry && (
              <p className="text-red-500 text-sm mt-1">{errors.expiry}</p>
            )}
          </div>
          <div>
            <label className="text-[#575757] text-[20px] mb-2 block">CVC</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                value={formData.cvc}
                onChange={(e) => handleChange('cvc', e.target.value)}
                className={`h-[67px] bg-[#EEEEEE] border-b-2 border-[#54C6EE] text-[23px] pl-12 ${
                  errors.cvc ? 'border-red-500' : ''
                }`}
                placeholder="123"
                maxLength={3}
              />
            </div>
            {errors.cvc && (
              <p className="text-red-500 text-sm mt-1">{errors.cvc}</p>
            )}
          </div>
        </div>

        {/* Promo Code */}
        <div>
          <label className="text-[#575757] text-[20px] mb-2 block">
            Mã giảm giá
          </label>
          <div className="relative">
            <Input
              value={formData.promoCode}
              onChange={(e) => handleChange('promoCode', e.target.value)}
              className="h-[65px] bg-[#EEEEEE] border-b-2 border-[#54C6EE] text-[20px] pr-24"
              placeholder="Nhập mã giảm giá"
            />
            <button
              type="button"
              onClick={handleApplyPromo}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black text-[20px] font-bold hover:text-[#54C6EE]"
            >
              Apply
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="button"
          onClick={handlePayment}
          disabled={isSubmitting}
          className="w-[242px] h-[66px] bg-[#54C6EE] hover:bg-[#54C6EE]/90 text-black text-[24px] font-bold rounded-lg"
        >
          {isSubmitting ? 'Đang xử lý...' : 'Thanh toán'}
        </Button>
      </form>
    </div>
  );
};
