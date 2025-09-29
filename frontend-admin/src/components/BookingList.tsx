import { useMemo, useState } from 'react'
import { BookingModal } from './BookingModal'
import { StatusPill } from './StatusPill'
import { ChevronDown,  Pencil, Search, Trash } from 'lucide-react' // dùng icon chuẩn

// --- Types ---
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

// --- Data ---
const initialBookings: Booking[] = [
  {
    id: 'b1',
    customerName: 'Thùy Dương',
    customerAvatarUrl:
      'https://i.pinimg.com/originals/26/82/bf/2682bf05bc23c0b6a1145ab9c966374b.png',
    tourTitle: 'Sapa – Fansipan – Bản Cát Cát',
    bookedAt: '12.09.2019 - 12:53 PM',
    startAt: '12.09.2019 - 12:53 PM',
    status: 'completed',
    email: 'thuongxpxk0904@gmail.com',
    phone: '0324456786',
    address: 'Số 1 Nguyễn Huệ, Q1, TP.HCM',
    quantity: 5,
    paymentStatus: 'paid',
    tourSlug: 'sapa-fansipan',
  },
  {
    id: 'b2',
    customerName: 'Thùy Dương',
    customerAvatarUrl:
      'https://i.pinimg.com/originals/26/82/bf/2682bf05bc23c0b6a1145ab9c966374b.png',
    tourTitle: 'Sapa – Fansipan – Bản Cát Cát',
    bookedAt: '12.09.2019 - 12:53 PM',
    startAt: '12.09.2019 - 12:53 PM',
    status: 'pending',
    email: 'thuongxpxk0904@gmail.com',
    phone: '0324456786',
    address: 'Số 1 Nguyễn Huệ, Q1, TP.HCM',
    quantity: 5,
    paymentStatus: 'unpaid',
    tourSlug: 'sapa-fansipan',
  },
  {
    id: 'b3',
    customerName: 'Thùy Dương',
    customerAvatarUrl:
      'https://i.pinimg.com/originals/26/82/bf/2682bf05bc23c0b6a1145ab9c966374b.png',
    tourTitle: 'Sapa – Fansipan – Bản Cát Cát',
    bookedAt: '12.09.2019 - 12:53 PM',
    startAt: '12.09.2019 - 12:53 PM',
    status: 'canceled',
    email: 'thuongxpxk0904@gmail.com',
    phone: '0324456786',
    address: 'Số 1 Nguyễn Huệ, Q1, TP.HCM',
    quantity: 5,
    paymentStatus: 'refunded',
    tourSlug: 'sapa-fansipan',
  },
]

// --- Options ---
const statusOptions: { label: string; value: BookingStatus | 'all' }[] = [
  { label: 'Chọn trạng thái', value: 'all' },
  { label: 'Đã hoàn thành', value: 'completed' },
  { label: 'Chờ xác nhận', value: 'pending' },
  { label: 'Đã hủy', value: 'canceled' },
]

// --- Component ---
export function BookingList() {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<BookingStatus | 'all'>('all')
  const [tour, setTour] = useState<string>('all')
  const [selected, setSelected] = useState<Booking | null>(null)

  const tourOptions = useMemo(() => {
    const unique = Array.from(new Set(bookings.map(b => b.tourTitle)))
    return ['all', ...unique]
  }, [bookings])

  const filtered = useMemo(() => {
    return bookings.filter(b => {
      const matchesQuery =
        query.trim() === '' ||
        b.customerName.toLowerCase().includes(query.toLowerCase()) ||
        b.tourTitle.toLowerCase().includes(query.toLowerCase())
      const matchesStatus = status === 'all' ? true : b.status === status
      const matchesTour = tour === 'all' ? true : b.tourTitle === tour
      return matchesQuery && matchesStatus && matchesTour
    })
  }, [bookings, query, status, tour])

  function removeBooking(id: string) {
    setBookings(prev => prev.filter(b => b.id !== id))
  }

  function saveBooking(updated: Booking) {
    setBookings(prev => prev.map(b => (b.id === updated.id ? updated : b)))
    setSelected(null)
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <h2 className="text-2xl font-bold text-[#26B8ED]">Đặt tour</h2>

      {/* Filters */}
  <div className="flex items-center gap-3">
  {/* Ô tìm kiếm */}
  <div className="relative flex-1">
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
       <Search size={16} />
    </span>
    <input
      type="text"
      className="h-10 w-full rounded-md border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-[#26B8ED] focus:ring-2 focus:ring-[#26B8ED]/50"
      placeholder="Tìm kiếm"
      value={query}
      onChange={e => setQuery(e.target.value)}
    />
  </div>

  {/* Bộ lọc */}
  <div className="flex items-center gap-3">
    <div className="relative">
      <select
        className="h-10 appearance-none rounded-md border border-gray-200 bg-white pl-3 pr-8 text-sm text-gray-700 focus:border-[#26B8ED] focus:ring-2 focus:ring-[#26B8ED]/50"
        value={status}
        onChange={e => setStatus(e.target.value as any)}
      >
        {statusOptions.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
        <ChevronDown size={16} />
      </span>
    </div>

    <div className="relative">
      <select
        className="h-10 appearance-none rounded-md border border-gray-200 bg-white pl-3 pr-8 text-sm text-gray-700 focus:border-[#26B8ED] focus:ring-2 focus:ring-[#26B8ED]/50"
        value={tour}
        onChange={e => setTour(e.target.value)}
      >
        <option value="all">Chọn tour</option>
        {tourOptions
          .filter(t => t !== 'all')
          .map(t => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
      </select>
      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
        <ChevronDown size={16} />
      </span>
    </div>
  </div>
</div>


      {/* Table */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3">Khách hàng</th>
                <th className="px-4 py-3">Tên Tour</th>
                <th className="px-4 py-3">Ngày đặt</th>
                <th className="px-4 py-3">Ngày khởi hành</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr
                  key={b.id}
                  className="border-t border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <img
                        src={b.customerAvatarUrl}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                      <span>{b.customerName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{b.tourTitle}</td>
                  <td className="px-4 py-3">{b.bookedAt}</td>
                  <td className="px-4 py-3">{b.startAt}</td>
                  <td className="px-4 py-3">
                    <StatusPill status={b.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-gray-600">
                    
                      <button
                        className="inline-flex h-8 w-8 items-center justify-center rounded hover:bg-gray-100"
                        title="Sửa"
                        onClick={() => setSelected(b)}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="inline-flex h-8 w-8 items-center justify-center rounded hover:bg-red-50 text-red-600"
                        title="Xóa"
                        onClick={() => removeBooking(b.id)}
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <BookingModal
          booking={selected}
          onClose={() => setSelected(null)}
          onSave={saveBooking}
        />
      )}
    </div>
  )
}
