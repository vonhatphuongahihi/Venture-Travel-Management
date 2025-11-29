import { Ticket, X } from "lucide-react";
import { useState } from "react";

export type BookingDetail = {
  bookingDetailId: string;
  ticketTypeId: string;
  ticketTypeName: string;
  quantity: number;
  totalPrice: number;
};

export type Booking = {
  bookingId: string;
  userId: string;
  name: string;
  phone: string;
  email: string;
  pickupAddress: string;
  departureDate: string;
  status: "pending" | "completed" | "canceled";
  paymentType: "cash" | "bank" | "momo";
  totalPrice: number;
  specialRequests: string;
  createdAt: string;
  updatedAt: string;
  bookingDetails: BookingDetail[];
};

type Props = {
  booking: Booking | null;
  onClose: () => void;
  onSave: (b: Booking) => void;
};

type TicketTypeOption = {
  ticketTypeId: string;
  title: string;
  price: number;
};

export function BookingModal({ booking, onClose, onSave }: Props) {
  const mockTicketTypes: TicketTypeOption[] = [
    { ticketTypeId: "adult", title: "Vé người lớn", price: 500000 },
    { ticketTypeId: "child", title: "Vé trẻ em", price: 300000 },
    { ticketTypeId: "vip", title: "Vé VIP", price: 1000000 },
  ];

  const [ticketTypes] = useState(mockTicketTypes);

  const [form, setForm] = useState<Booking>(
    booking ?? {
      bookingId: crypto.randomUUID(),
      userId: "",
      name: "",
      phone: "",
      email: "",
      pickupAddress: "",
      departureDate: new Date().toISOString(),
      status: "pending",
      paymentType: "cash",
      totalPrice: 0,
      specialRequests: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      bookingDetails: [],
    }
  );

  const [activeTab, setActiveTab] = useState<"info" | "payment" | "tickets">(
    "info"
  );

  function update<K extends keyof Booking>(key: K, value: Booking[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function updateDetail(index: number, key: keyof BookingDetail, value: any) {
    const copy = [...form.bookingDetails];
    copy[index] = { ...copy[index], [key]: value };
    const detail = copy[index];

    if (key === "ticketTypeId") {
      const type = ticketTypes.find((t) => t.ticketTypeId === value);
      if (type) {
        copy[index].ticketTypeName = type.title;
        copy[index].totalPrice = type.price * detail.quantity;
      }
    }

    if (key === "quantity") {
      const type = ticketTypes.find(
        (t) => t.ticketTypeId === detail.ticketTypeId
      );
      if (type) copy[index].totalPrice = type.price * value;
    }

    const total = copy.reduce((sum, d) => sum + d.totalPrice, 0);
    setForm((prev) => ({ ...prev, bookingDetails: copy, totalPrice: total }));
  }

  function addDetail() {
    setForm((prev) => ({
      ...prev,
      bookingDetails: [
        ...prev.bookingDetails,
        {
          bookingDetailId: crypto.randomUUID(),
          ticketTypeId: "",
          ticketTypeName: "",
          quantity: 1,
          totalPrice: 0,
        },
      ],
    }));
  }

  function removeDetail(id: string) {
    const list = form.bookingDetails.filter((d) => d.bookingDetailId !== id);
    const total = list.reduce((sum, d) => sum + d.totalPrice, 0);
    setForm((prev) => ({ ...prev, bookingDetails: list, totalPrice: total }));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-3xl rounded-xl bg-white shadow-xl overflow-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between bg-sky-500 px-6 py-3">
          <h2 className="text-lg font-semibold text-white">Chi tiết Booking</h2>
          <button
            className="p-2 rounded-full hover:bg-white/20 text-white"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          {["info", "tickets","payment"].map((tab) => (
            <button
              key={tab}
              className={`flex-1 py-2 text-sm font-medium ${
                activeTab === tab
                  ? "border-b-2 border-sky-500 text-sky-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab(tab as any)}
            >
              {tab === "info"
                ? "Thông tin khách"
                : tab === "payment"
                ? "Thanh toán"
                : "Chi tiết vé"}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {activeTab === "info" && (
            <>
              {/* Info */}
              {[
                { label: "Tên khách hàng", key: "name", type: "text" },
                { label: "Email", key: "email", type: "text" },
                { label: "Số điện thoại", key: "phone", type: "text" },
                { label: "Điểm đón", key: "pickupAddress", type: "text" },
              ].map((f) => (
                <div key={f.key} className="flex flex-col gap-1">
                  <label className="text-sm text-gray-600">{f.label}</label>
                  <input
                    type={f.type}
                    className="h-10 rounded-md border px-3 text-sm focus:ring-1 focus:ring-sky-400 focus:outline-none"
                    value={form[f.key as keyof Booking] as string}
                    onChange={(e) =>
                      update(f.key as keyof Booking, e.target.value)
                    }
                  />
                </div>
              ))}

              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-600"> Ngày khởi hành</label>

                <input
                  type="datetime-local"
                  className="h-10 rounded-md border px-3 text-sm focus:ring-1 focus:ring-sky-400 focus:outline-none"
                  value={form.departureDate.slice(0, 16)}
                  onChange={(e) =>
                    update(
                      "departureDate",
                      new Date(e.target.value).toISOString()
                    )
                  }
                />
              </div>
            </>
          )}

          {activeTab === "payment" && (
            <>
              {/* Status & Payment */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-600">Trạng thái</label>
                <select
                  className="h-10 rounded-md border px-3 text-sm focus:ring-1 focus:ring-sky-400 focus:outline-none"
                  value={form.status}
                  onChange={(e) => update("status", e.target.value as any)}
                >
                  <option value="pending">Đang xử lý</option>
                  <option value="completed">Hoàn tất</option>
                  <option value="canceled">Huỷ</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-600">Thanh toán</label>
                <select
                  className="h-10 rounded-md border px-3 text-sm focus:ring-1 focus:ring-sky-400 focus:outline-none"
                  value={form.paymentType}
                  onChange={(e) => update("paymentType", e.target.value as any)}
                >
                  <option value="cash">Tiền mặt</option>
                  <option value="bank">Chuyển khoản</option>
                  <option value="momo">Momo</option>
                </select>
              </div>

              <div className="col-span-2 flex flex-col gap-1">
                <label className="text-sm text-gray-600">Ghi chú</label>
                <textarea
                  className="rounded-md border px-3 py-2 text-sm focus:ring-1 focus:ring-sky-400 focus:outline-none"
                  rows={3}
                  value={form.specialRequests}
                  onChange={(e) => update("specialRequests", e.target.value)}
                />
              </div>
            </>
          )}

          {activeTab === "tickets" && (
            <div className="col-span-2 p-4 border rounded-lg ">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <Ticket />
                  <h3 className="font-semibold text-gray-700">Thông tin vé</h3>
                </div>

                <button
                  className="px-3 py-1 text-sm rounded bg-sky-500 text-white hover:bg-sky-600"
                  onClick={addDetail}
                >
                  + Thêm vé
                </button>
              </div>

              {form.bookingDetails.length === 0 ? (
                <div className="text-sm text-gray-500">Chưa có chi tiết vé</div>
              ) : (
                <div className="space-y-2">
                  {form.bookingDetails.map((d, i) => (
                    <div
                      key={d.bookingDetailId}
                      className="flex flex-wrap sm:flex-nowrap items-center gap-2 p-3 rounded border bg-white shadow-sm"
                    >
                      <select
                        className="flex-1 border rounded px-2 py-1 text-sm focus:ring-1 focus:ring-sky-400 focus:outline-none"
                        value={d.ticketTypeId}
                        onChange={(e) =>
                          updateDetail(i, "ticketTypeId", e.target.value)
                        }
                      >
                        <option value="">-- Chọn loại vé --</option>
                        {ticketTypes.map((t) => (
                          <option key={t.ticketTypeId} value={t.ticketTypeId}>
                            {t.title} ({t.price.toLocaleString()} ₫)
                          </option>
                        ))}
                      </select>

                      <input
                        type="number"
                        className="w-20 border rounded px-2 py-1 text-sm text-center focus:ring-1 focus:ring-sky-400 focus:outline-none"
                        value={d.quantity}
                        min={1}
                        onChange={(e) =>
                          updateDetail(i, "quantity", Number(e.target.value))
                        }
                      />

                      <div className="w-32 text-right font-medium text-gray-700">
                        {d.totalPrice.toLocaleString()} ₫
                      </div>

                      <button
                        className="p-1 text-red-500 hover:text-red-700"
                        onClick={() => removeDetail(d.bookingDetailId)}
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="text-right font-bold text-lg mt-3 text-sky-600">
                Tổng cộng: {form.totalPrice.toLocaleString()} ₫
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t px-6 py-4 bg-gray-50">
          <button
            className="h-10 px-5 rounded-md border bg-white hover:bg-gray-100"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            className="h-10 px-5 rounded-md bg-sky-500 text-white hover:bg-sky-600"
            onClick={() => onSave(form)}
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}
