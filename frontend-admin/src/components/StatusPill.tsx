import type { BookingStatus } from '../types'

export function StatusPill({ status }: { status: BookingStatus }) {
  const label =
    status === 'completed'
      ? 'Đã hoàn thành'
      : status === 'pending'
      ? 'Chờ xác nhận'
      : 'Đã hủy'

  return (
    <span
      className={
        `inline-flex h-7 w-28 items-center justify-center rounded-full text-sm font-semibold ` +
        (status === 'completed'
          ? 'bg-[#00B69B] text-white'
          : status === 'pending'
          ? 'bg-[#FCBE2D] text-white'
          : 'bg-[#FD5454] text-white')
      }
    >
      {label}
    </span>
  )
}
