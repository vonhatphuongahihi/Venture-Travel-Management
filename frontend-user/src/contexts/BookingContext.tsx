import { createContext, useState, ReactNode } from 'react';
import { BookingFormData } from '@/types/tour.types';

interface BookingContextType {
  bookingData: Partial<BookingFormData> | null;
  setBookingData: (data: Partial<BookingFormData>) => void;
  tourId: string | null;
  setTourId: (id: string) => void;
  clearBooking: () => void;
}

export const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [bookingData, setBookingDataState] = useState<Partial<BookingFormData> | null>(null);
  const [tourId, setTourIdState] = useState<string | null>(null);

  const setBookingData = (data: Partial<BookingFormData>) => {
    setBookingDataState((prev) => ({ ...prev, ...data }));
  };

  const setTourId = (id: string) => {
    setTourIdState(id);
  };

  const clearBooking = () => {
    setBookingDataState(null);
    setTourIdState(null);
  };

  return (
    <BookingContext.Provider
      value={{
        bookingData,
        setBookingData,
        tourId,
        setTourId,
        clearBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
