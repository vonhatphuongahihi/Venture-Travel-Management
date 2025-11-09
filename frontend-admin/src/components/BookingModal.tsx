import { ChevronDown } from "lucide-react";
import { useState } from "react";

// --- Types ---
export type BookingStatus = "completed" | "pending" | "canceled";
export type PaymentStatus = "unpaid" | "paid" | "refunded";

export type Booking = {
  id: string;
  customerName: string;
  customerAvatarUrl: string;
  tourTitle: string;
  bookedAt: string;
  startAt: string;
  status: BookingStatus;
  email: string;
  phone: string;
  address: string;
  quantity: number;
  paymentStatus: PaymentStatus;
  tourSlug: string;
  note?: string;
};

type Props = {
  booking: Booking;
  onClose: () => void;
  onSave: (b: Booking) => void;
};

// --- Component ---
export function BookingModal({ booking, onClose, onSave }: Props) {
  const [form, setForm] = useState<Booking>({ ...booking });

  function update<K extends keyof Booking>(key: K, value: Booking[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="text-lg font-bold">Chi tiết booking</div>
          <button
            className="inline-flex h-8 w-8 items-center justify-center rounded hover:bg-gray-100"
            onClick={onClose}
            aria-label="Đóng"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Khách hàng</label>
            <input
              className="h-9 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20"
              value={form.customerName}
              onChange={(e) => update("customerName", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">
              Trạng thái thanh toán
            </label>
            <div className="relative">
              <select
                className="h-9 w-full appearance-none rounded-md border border-gray-300 bg-white px-3 pr-8 text-sm focus:outline-none"
                value={form.paymentStatus}
                onChange={(e) =>
                  update("paymentStatus", e.target.value as PaymentStatus)
                }
              >
                <option value="unpaid">Chưa thanh toán</option>
                <option value="paid">Đã thanh toán</option>
                <option value="refunded">Hoàn tiền</option>
              </select>

              {/* Mũi tên */}
              <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-500">
                <ChevronDown size={16} />
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              className="h-9 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Số điện thoại</label>
            <input
              type="tel"
              className="h-9 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Địa chỉ</label>
            <input
              className="h-9 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20"
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Số lượng vé</label>
            <input
              type="number"
              className="h-9 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none"
              value={form.quantity}
              onChange={(e) => update("quantity", Number(e.target.value))}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Tên tour đăng ký</label>
            <input
              className="h-9 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20"
              value={form.tourTitle}
              onChange={(e) => update("tourTitle", e.target.value)}
            />
          </div>

          <div className="sm:col-span-2 flex flex-col gap-1">
            <label className="text-sm text-gray-600">
              Thông tin tour chi tiết
            </label>
            <textarea
              className="min-h-[80px] rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20"
              value={form.note ?? ""}
              onChange={(e) => update("note", e.target.value)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t px-4 py-3">
          <button
            className="inline-flex h-9 items-center justify-center rounded-md border border-gray-300 bg-white px-4 text-sm hover:bg-gray-50"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            className="inline-flex h-9 items-center justify-center rounded-md bg-[#26B8ED] px-4 text-sm text-white hover:bg-gray-800"
            onClick={() => onSave(form)}
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}
