import { useState } from 'react';
import { BookingFormData } from '@/types/tour.types';
import { validateEmail, validatePhone } from '@/utils/formatters';

interface ValidationErrors {
  [key: string]: string;
}

export const useBookingForm = (initialData?: Partial<BookingFormData>) => {
  const [formData, setFormData] = useState<BookingFormData>({
    name: initialData?.name || '',
    email: initialData?.email || '',
    confirmEmail: initialData?.confirmEmail || '',
    phone: initialData?.phone || '',
    date: initialData?.date || '',
    tickets: initialData?.tickets || 1,
    ticketType: initialData?.ticketType || '',
    note: initialData?.note || '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof BookingFormData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validate = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Vui lòng nhập tên';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.confirmEmail.trim()) {
      newErrors.confirmEmail = 'Vui lòng xác nhận email';
    } else if (formData.email !== formData.confirmEmail) {
      newErrors.confirmEmail = 'Email xác nhận không khớp';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    if (!formData.date) {
      newErrors.date = 'Vui lòng chọn ngày';
    }

    if (!formData.tickets || formData.tickets < 1) {
      newErrors.tickets = 'Vui lòng chọn số vé';
    }

    if (!formData.ticketType) {
      newErrors.ticketType = 'Vui lòng chọn loại vé';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (onSuccess?: (data: BookingFormData) => void) => {
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      // TODO: Call API here
      // await bookingAPI.create(formData);
      
      if (onSuccess) {
        onSuccess(formData);
      }
    } catch (error) {
      console.error('Booking error:', error);
      // Handle error
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setFormData({
      name: '',
      email: '',
      confirmEmail: '',
      phone: '',
      date: '',
      tickets: 1,
      ticketType: '',
      note: '',
    });
    setErrors({});
  };

  return {
    formData,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    validate,
    reset,
  };
};
