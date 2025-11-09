import { useState } from 'react';
import { PaymentFormData } from '@/types/tour.types';

interface ValidationErrors {
  [key: string]: string;
}

export const usePaymentForm = (initialData?: Partial<PaymentFormData>) => {
  const [formData, setFormData] = useState<PaymentFormData>({
    cardName: initialData?.cardName || '',
    cardNumber: initialData?.cardNumber || '',
    expiry: initialData?.expiry || '',
    cvc: initialData?.cvc || '',
    promoCode: initialData?.promoCode || '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof PaymentFormData, value: string) => {
    let processedValue = value;

    // Format card number
    if (field === 'cardNumber') {
      processedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (processedValue.length > 19) return; // Max 16 digits + 3 spaces
    }

    // Format expiry
    if (field === 'expiry') {
      processedValue = value.replace(/\s/g, '').replace(/(\d{2})/, '$1 / ');
      if (processedValue.length > 7) return; // MM / YY
    }

    // Format CVC
    if (field === 'cvc') {
      processedValue = value.replace(/\D/g, '');
      if (processedValue.length > 3) return;
    }

    setFormData((prev) => ({
      ...prev,
      [field]: processedValue,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validate = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.cardName.trim()) {
      newErrors.cardName = 'Vui lòng nhập tên chủ thẻ';
    }

    const cardNumberDigits = formData.cardNumber.replace(/\s/g, '');
    if (!cardNumberDigits) {
      newErrors.cardNumber = 'Vui lòng nhập số thẻ';
    } else if (cardNumberDigits.length !== 16) {
      newErrors.cardNumber = 'Số thẻ phải có 16 chữ số';
    }

    if (!formData.expiry) {
      newErrors.expiry = 'Vui lòng nhập ngày hết hạn';
    } else {
      const [month, year] = formData.expiry.split(' / ');
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;

      if (!month || !year || parseInt(month) < 1 || parseInt(month) > 12) {
        newErrors.expiry = 'Tháng không hợp lệ';
      } else if (parseInt(year) < currentYear || 
                (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        newErrors.expiry = 'Thẻ đã hết hạn';
      }
    }

    if (!formData.cvc) {
      newErrors.cvc = 'Vui lòng nhập CVC';
    } else if (formData.cvc.length !== 3) {
      newErrors.cvc = 'CVC phải có 3 chữ số';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const applyPromoCode = async () => {
    if (!formData.promoCode.trim()) return null;

    try {
      // TODO: Call API to validate promo code
      // const result = await paymentAPI.validatePromoCode(formData.promoCode);
      // return result;
      return { discount: 0, message: 'Mã giảm giá không hợp lệ' };
    } catch (error) {
      console.error('Promo code error:', error);
      return null;
    }
  };

  const handleSubmit = async (onSuccess?: (data: PaymentFormData) => void) => {
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      // TODO: Call payment API here
      // await paymentAPI.process(formData);
      
      if (onSuccess) {
        onSuccess(formData);
      }
    } catch (error) {
      console.error('Payment error:', error);
      // Handle error
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setFormData({
      cardName: '',
      cardNumber: '',
      expiry: '',
      cvc: '',
      promoCode: '',
    });
    setErrors({});
  };

  return {
    formData,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    applyPromoCode,
    validate,
    reset,
  };
};
