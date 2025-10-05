import { BookingFormData } from '@/types/tour.types';

// Separate hook file to avoid Fast Refresh warnings
export { BookingProvider } from './BookingContext';

export interface BookingContextType {
  bookingData: Partial<BookingFormData> | null;
  setBookingData: (data: Partial<BookingFormData>) => void;
  tourId: string | null;
  setTourId: (id: string) => void;
  clearBooking: () => void;
}
