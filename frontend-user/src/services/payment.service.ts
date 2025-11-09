import { apiClient } from './api.client';
import { API_ENDPOINTS } from './api.config';
import { PaymentFormData } from '@/types/tour.types';

interface PaymentResponse {
  success: boolean;
  transactionId: string;
  redirectUrl?: string;
}

interface PromoCodeResponse {
  valid: boolean;
  discount: number;
  message: string;
}

export const paymentService = {
  // Process payment
  async processPayment(data: PaymentFormData & { bookingId: string }): Promise<PaymentResponse> {
    return apiClient.post<PaymentResponse>(API_ENDPOINTS.payments.process, data);
  },

  // Validate promo code
  async validatePromoCode(code: string): Promise<PromoCodeResponse> {
    return apiClient.post<PromoCodeResponse>(API_ENDPOINTS.payments.validatePromo, { code });
  },
};
