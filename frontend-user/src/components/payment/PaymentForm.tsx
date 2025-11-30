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
    <div className="relative">
      {/* Decorative background element */}
      <div className="absolute -top-4 -left-4 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10" />
      
      <div className="relative bg-card/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg border border-border/50">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-3">
            Thanh toán
          </h1>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            Để bắt đầu đăng ký, vui lòng nhập thông tin thẻ của bạn để thực hiện thanh toán.
            Bạn sẽ được chuyển hướng đến trang xác thực của ngân hàng.
          </p>
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          {/* Card Name */}
          <div className="space-y-2">
            <label className="text-foreground text-sm font-semibold flex items-center gap-2">
              Tên chủ thẻ
            </label>
            <div className="relative group">
              <Input
                value={formData.cardName}
                onChange={(e) => handleChange('cardName', e.target.value)}
                className={`h-12 bg-muted/50 border-2 transition-all duration-200 text-base ${
                  errors.cardName 
                    ? 'border-destructive focus:border-destructive' 
                    : 'border-transparent focus:border-primary hover:bg-muted'
                } focus:ring-2 focus:ring-primary/20 rounded-lg`}
                placeholder="Nhập tên trên thẻ"
              />
            </div>
            {errors.cardName && (
              <p className="text-destructive text-xs mt-1 flex items-center gap-1">{errors.cardName}</p>
            )}
          </div>

          {/* Card Number */}
          <div className="space-y-2">
            <label className="text-foreground text-sm font-semibold flex items-center gap-2">
              Số thẻ
            </label>
            <div className="relative group">
              <CreditCard className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 transition-colors group-focus-within:text-primary" />
              <Input
                value={formData.cardNumber}
                onChange={(e) => handleChange('cardNumber', e.target.value)}
                className={`h-12 bg-muted/50 border-2 transition-all duration-200 text-base pl-12 ${
                  errors.cardNumber 
                    ? 'border-destructive focus:border-destructive' 
                    : 'border-transparent focus:border-primary hover:bg-muted'
                } focus:ring-2 focus:ring-primary/20 rounded-lg`}
                placeholder="0000 0000 0000 0000"
              />
            </div>
            {errors.cardNumber && (
              <p className="text-destructive text-xs mt-1 flex items-center gap-1">{errors.cardNumber}</p>
            )}
          </div>

          {/* Expiry & CVC */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-foreground text-sm font-semibold flex items-center gap-2">
                Hết hạn
              </label>
              <div className="relative group">
                <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 transition-colors group-focus-within:text-primary" />
                <Input
                  value={formData.expiry}
                  onChange={(e) => handleChange('expiry', e.target.value)}
                  className={`h-12 bg-muted/50 border-2 transition-all duration-200 text-base pl-12 ${
                    errors.expiry 
                      ? 'border-destructive focus:border-destructive' 
                      : 'border-transparent focus:border-primary hover:bg-muted'
                  } focus:ring-2 focus:ring-primary/20 rounded-lg`}
                  placeholder="MM / YY"
                />
              </div>
              {errors.expiry && (
                <p className="text-destructive text-xs mt-1">{errors.expiry}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-foreground text-sm font-semibold flex items-center gap-2">
                CVC
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 transition-colors group-focus-within:text-primary" />
                <Input
                  value={formData.cvc}
                  onChange={(e) => handleChange('cvc', e.target.value)}
                  className={`h-12 bg-muted/50 border-2 transition-all duration-200 text-base pl-12 ${
                    errors.cvc 
                      ? 'border-destructive focus:border-destructive' 
                      : 'border-transparent focus:border-primary hover:bg-muted'
                  } focus:ring-2 focus:ring-primary/20 rounded-lg`}
                  placeholder="123"
                  maxLength={3}
                />
              </div>
              {errors.cvc && (
                <p className="text-destructive text-xs mt-1">{errors.cvc}</p>
              )}
            </div>
          </div>

          {/* Promo Code */}
          <div className="space-y-2">
            <label className="text-foreground text-sm font-semibold flex items-center gap-2">
              Mã giảm giá
            </label>
            <div className="relative group">
              <Input
                value={formData.promoCode}
                onChange={(e) => handleChange('promoCode', e.target.value)}
                className="h-12 bg-muted/50 border-2 border-transparent focus:border-primary hover:bg-muted focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-base pr-24 rounded-lg"
                placeholder="Nhập mã giảm giá"
              />
              <button
                type="button"
                onClick={handleApplyPromo}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary font-semibold rounded-md transition-all duration-200 text-sm"
              >
                Apply
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="button"
              onClick={handlePayment}
              disabled={isSubmitting}
              className="w-full h-12 md:h-14 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white text-base md:text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isSubmitting ? 'Đang xử lý...' : 'Thanh toán'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
