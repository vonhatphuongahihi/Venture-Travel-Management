export type BookingStatus = 'completed' | 'pending' | 'canceled'
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded'

export type Booking = {
  id: string
  customerName: string
  customerAvatarUrl: string
  tourTitle: string
  bookedAt: string
  startAt: string
  status: BookingStatus
  email: string
  phone: string
  address: string
  quantity: number
  paymentStatus: PaymentStatus
  tourSlug: string
  note?: string
} 