import { Ticket, X } from "lucide-react";
import { useState, useEffect } from "react";

import type { Booking, BookingDetail, TourOption, TicketTypeOption } from "@/services/BookingAPI";
import { BookingAPI } from "@/services/BookingAPI";
import { useToast } from "@/contexts/ToastContext";

type Props = {
  booking: Booking | null;
  onClose: () => void;
  onSave: (b: Booking) => void;
};

export function BookingModal({ booking, onClose, onSave }: Props) {
  const { showToast } = useToast();
  const [tours, setTours] = useState<TourOption[]>([]);
  const [ticketTypes, setTicketTypes] = useState<TicketTypeOption[]>([]);
  const [loadingTours, setLoadingTours] = useState(false);
  const [loadingTicketTypes, setLoadingTicketTypes] = useState(false);
  const [saving, setSaving] = useState(false);

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
      specialRequests: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tour: null,
      ticketType: {
        ticketTypeId: "",
        name: "",
        notes: null,
      },
      bookingDetails: [],
    }
  );

  const [activeTab, setActiveTab] = useState<"info" | "payment" | "tickets">(
    "info"
  );

  // Load tours khi mở modal (nếu là thêm mới)
  useEffect(() => {
    if (!booking) {
      loadTours();
    } else if (booking.tour) {
      // Nếu đã có tour, load ticket types của tour đó
      loadTicketTypes(booking.tour.tourId);
    }
  }, [booking]);

  const loadTours = async () => {
    setLoadingTours(true);
    try {
      const data = await BookingAPI.getTours();
      setTours(data);
    } catch (err) {
      console.error("Error loading tours:", err);
    } finally {
      setLoadingTours(false);
    }
  };

  const loadTicketTypes = async (tourId: string) => {
    if (!tourId) {
      setTicketTypes([]);
      return;
    }
    setLoadingTicketTypes(true);
    try {
      const data = await BookingAPI.getTourTicketTypes(tourId);
      setTicketTypes(data);
      // Nếu có ticket types, tự động chọn ticket type đầu tiên (chỉ khi thêm mới)
      if (data.length > 0 && !booking) {
        setForm((prev) => ({
          ...prev,
          ticketType: {
            ticketTypeId: data[0].ticketTypeId,
            name: data[0].name,
            notes: data[0].notes,
          },
        }));
      }
    } catch (err) {
      console.error("Error loading ticket types:", err);
      setTicketTypes([]);
    } finally {
      setLoadingTicketTypes(false);
    }
  };

  const handleTourChange = async (tourId: string) => {
    if (!tourId) {
      setForm((prev) => ({
        ...prev,
        tour: null,
        ticketType: { ticketTypeId: "", name: "", notes: null },
        bookingDetails: [],
        totalPrice: 0,
      }));
      setTicketTypes([]);
      return;
    }

    // Load đầy đủ thông tin tour
    const fullTourInfo = await BookingAPI.getTourById(tourId);
    if (fullTourInfo) {
      setForm((prev) => ({
        ...prev,
        tour: fullTourInfo,
        bookingDetails: [],
        totalPrice: 0,
      }));
    } else {
      // Fallback nếu không load được, dùng thông tin cơ bản
      const selectedTour = tours.find((t) => t.tourId === tourId);
      if (selectedTour) {
        setForm((prev) => ({
          ...prev,
          tour: {
            tourId: selectedTour.tourId,
            name: selectedTour.name,
            images: [],
            duration: "",
            about: "",
          },
          bookingDetails: [],
          totalPrice: 0,
        }));
      }
    }

    await loadTicketTypes(tourId);
  };

  function update<K extends keyof Booking>(key: K, value: Booking[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function updateDetail(index: number, key: keyof BookingDetail, value: any) {
    let copy = [...form.bookingDetails];
    copy[index] = { ...copy[index], [key]: value };
    const detail = copy[index];

    if (key === "ticketPriceId") {
      // Tìm ticket price được chọn
      const selectedTicketType = ticketTypes.find((tt) =>
        tt.ticketPrices.some((tp) => tp.ticketPriceId === value)
      );
      if (selectedTicketType) {
        const selectedPrice = selectedTicketType.ticketPrices.find(
          (tp) => tp.ticketPriceId === value
        );
        if (selectedPrice) {
          copy[index].price = selectedPrice.price;
          copy[index].ticketTypeName = selectedTicketType.name;
          copy[index].priceCategory = selectedPrice.priceCategory;
          copy[index].totalPrice = selectedPrice.price * (detail.quantity || 1);
        }
      }
      
      // Sau khi chọn vé, kiểm tra và gộp các vé trùng
      copy = mergeDuplicateTickets(copy);
    }

    if (key === "quantity") {
      // Tính lại totalPrice dựa trên price và quantity
      copy[index].totalPrice = (detail.price || 0) * value;
      // Sau khi thay đổi số lượng, kiểm tra và gộp các vé trùng
      copy = mergeDuplicateTickets(copy);
    }

    const total = copy.reduce((sum, d) => sum + d.totalPrice, 0);
    setForm((prev) => ({ ...prev, bookingDetails: copy, totalPrice: total }));
  }

  // Hàm gộp các vé trùng (cùng ticketPriceId) - trả về mảng mới
  function mergeDuplicateTickets(details: BookingDetail[]): BookingDetail[] {
    const mergedMap = new Map<string, BookingDetail>();
    
    details.forEach(detail => {
      if (!detail.ticketPriceId) {
        // Vé chưa chọn, giữ nguyên
        const key = `unselected-${detail.bookingDetailId}`;
        mergedMap.set(key, { ...detail });
        return;
      }
      
      const key = detail.ticketPriceId;
      if (mergedMap.has(key)) {
        // Nếu đã có vé này, cộng thêm quantity
        const existing = mergedMap.get(key)!;
        existing.quantity += detail.quantity;
        existing.totalPrice = existing.price * existing.quantity;
      } else {
        // Nếu chưa có, thêm vào map
        mergedMap.set(key, { ...detail });
      }
    });
    
    // Trả về mảng mới
    return Array.from(mergedMap.values());
  }

  function addDetail() {
    // Đảm bảo đã chọn tour trước khi thêm vé
    if (!form.tour?.tourId) {
      showToast("Vui lòng chọn tour trước khi thêm vé", "error");
      return;
    }

    // Nếu chưa load ticket types, load ngay
    if (ticketTypes.length === 0 && form.tour.tourId) {
      loadTicketTypes(form.tour.tourId);
    }

    setForm((prev) => {
      const newDetails = [
        ...prev.bookingDetails,
        {
          bookingDetailId: crypto.randomUUID(),
          ticketPriceId: "",
          ticketTypeName: prev.ticketType?.name || "",
          quantity: 1,
          totalPrice: 0,
          price: 0,
          priceCategory: null,
        },
      ];
      
      // Tính lại tổng
      const total = newDetails.reduce((sum, d) => sum + d.totalPrice, 0);
      
      return {
        ...prev,
        bookingDetails: newDetails,
        totalPrice: total,
      };
    });
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
              {/* Chọn Tour (chỉ hiển thị khi thêm mới) */}
              {!booking && (
                <div className="col-span-2 flex flex-col gap-1">
                  <label className="text-sm text-gray-600">Chọn Tour *</label>
                  <select
                    className="h-10 rounded-md border px-3 text-sm focus:ring-1 focus:ring-sky-400 focus:outline-none"
                    value={form.tour?.tourId || ""}
                    onChange={(e) => handleTourChange(e.target.value)}
                    disabled={loadingTours}
                  >
                    <option value="">
                      {loadingTours ? "Đang tải..." : "-- Chọn tour --"}
                    </option>
                    {tours.map((tour) => (
                      <option key={tour.tourId} value={tour.tourId}>
                        {tour.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Thông tin Tour */}
             {form.tour && (
  <div className="col-span-2 p-4 bg-gray-50 rounded-lg border">
    <h3 className="font-semibold text-gray-700 mb-3">Thông tin Tour</h3>

    <div className="grid grid-cols-3 gap-3">

      {/* TÊN TOUR — chiếm 2 cột */}
      <div className="col-span-2">
        <p className="text-sm text-gray-600">Tên tour:</p>
        <p className="font-medium line-clamp-2" title={form.tour.name}>
          {form.tour.name}
        </p>
      </div>

      {/* THỜI LƯỢNG — cột nhỏ */}
      {form.tour.duration && (
        <div className="col-span-1">
          <p className="text-sm text-gray-600">Thời lượng:</p>
          <p className="font-medium">{form.tour.duration}</p>
        </div>
      )}

      {/* ẢNH — full width */}
      {form.tour.images?.length > 0 && (
        <div className="col-span-3">
          <img
            src={form.tour.images[0]}
            alt={form.tour.name}
            className="w-full h-30 object-cover rounded-lg"
          />
        </div>
      )}
    </div>
  </div>
)}


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
    {/* Status */}
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-600">Trạng thái</label>
      <select
        className="h-10 rounded-md border px-3 text-sm focus:ring-1 focus:ring-sky-400 focus:outline-none"
        value={form.status}   // dùng trực tiếp backend status
        onChange={(e) => update("status", e.target.value as any)}
      >
        <option value="pending">Đang xử lý</option>
        <option value="confirmed">Hoàn tất</option>
        <option value="cancelled">Huỷ</option>
      </select>
    </div>

    {/* Payment */}
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

    {/* Notes */}
    <div className="col-span-2 flex flex-col gap-1">
      <label className="text-sm text-gray-600">Ghi chú</label>
      <textarea
        className="rounded-md border px-3 py-2 text-sm focus:ring-1 focus:ring-sky-400 focus:outline-none"
        rows={3}
        value={form.specialRequests || ""}
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

               {!form.tour ? (
                 <div className="text-sm text-gray-500">
                   Vui lòng chọn tour trước khi thêm vé
                 </div>
               ) : loadingTicketTypes ? (
                 <div className="text-sm text-gray-500">Đang tải loại vé...</div>
               ) : ticketTypes.length === 0 ? (
                 <div className="text-sm text-gray-500">
                   Tour này chưa có loại vé nào. Vui lòng chọn tour khác hoặc thêm loại vé cho tour này.
                 </div>
               ) : form.bookingDetails.length === 0 ? (
                 <div className="text-sm text-gray-500">
                   Chưa có chi tiết vé. Nhấn nút "Thêm vé" để thêm vé cho tour đã chọn.
                 </div>
               ) : (
                <div className="space-y-2">
                  {form.bookingDetails.map((d, i) => (
                    <div
                      key={d.bookingDetailId}
                      className="p-3 rounded border bg-white shadow-sm"
                    >
                      <div className="space-y-2">
                        <div className="flex flex-col gap-1">
                          <label className="text-sm text-gray-600">Chọn loại vé và giá *</label>
                          <select
                            className="h-10 border rounded px-3 text-sm focus:ring-1 focus:ring-sky-400 focus:outline-none"
                            value={d.ticketPriceId || ""}
                            onChange={(e) =>
                              updateDetail(i, "ticketPriceId", e.target.value)
                            }
                          >
                            <option value="">-- Chọn loại vé và giá --</option>
                            {ticketTypes.map((tt) =>
                              tt.ticketPrices.map((tp) => (
                                <option key={tp.ticketPriceId} value={tp.ticketPriceId}>
                                  {tt.name} - {tp.priceCategory.name} ({tp.price.toLocaleString()} ₫)
                                </option>
                              ))
                            )}
                          </select>
                        </div>

                        {d.ticketPriceId && (
                          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-700">
                                {d.ticketTypeName || form.ticketType?.name || "Loại vé"}
                              </p>
                              {d.priceCategory && (
                                <p className="text-xs text-gray-500">
                                  {d.priceCategory.name}
                                  {d.priceCategory.description && ` - ${d.priceCategory.description}`}
                                </p>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <label className="text-sm text-gray-600">Số lượng:</label>
                              <input
                                type="number"
                                className="w-20 border rounded px-2 py-1 text-sm text-center focus:ring-1 focus:ring-sky-400 focus:outline-none"
                                value={d.quantity}
                                min={1}
                                onChange={(e) =>
                                  updateDetail(i, "quantity", Number(e.target.value))
                                }
                              />
                            </div>

                            <div className="text-right">
                              <p className="text-sm text-gray-600">Đơn giá:</p>
                              <p className="font-medium text-gray-700">
                                {d.price.toLocaleString()} ₫
                              </p>
                            </div>

                            <div className="text-right">
                              <p className="text-sm text-gray-600">Thành tiền:</p>
                              <p className="font-medium text-gray-700">
                                {d.totalPrice.toLocaleString()} ₫
                              </p>
                            </div>

                            <button
                              className="p-1 text-red-500 hover:text-red-700"
                              onClick={() => removeDetail(d.bookingDetailId)}
                            >
                              <X size={18} />
                            </button>
                          </div>
                        )}
                      </div>
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
            className="h-10 px-5 rounded-md bg-sky-500 text-white hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={async () => {
              // Validate form
              if (!form.name || !form.email || !form.phone) {
                showToast("Vui lòng điền đầy đủ thông tin khách hàng", "error");
                return;
              }
              if (!booking && !form.tour) {
                showToast("Vui lòng chọn tour", "error");
                return;
              }
              
              // Lọc các vé đã chọn (có ticketPriceId)
              const validBookingDetails = form.bookingDetails.filter(
                (d) => d.ticketPriceId && d.quantity > 0
              );
              
              if (validBookingDetails.length === 0) {
                showToast("Vui lòng thêm ít nhất một vé đã chọn loại và giá", "error");
                return;
              }
              
              // Tính lại tổng từ các vé hợp lệ
              const validTotal = validBookingDetails.reduce((sum, d) => sum + d.totalPrice, 0);
              
              setSaving(true);
              try {
                // Gửi form với bookingDetails đã lọc và tổng đã tính lại
                await onSave({
                  ...form,
                  bookingDetails: validBookingDetails,
                  totalPrice: validTotal,
                });
              } catch (err: any) {
                showToast("Lưu thất bại", "error");
              } finally {
                setSaving(false);
              }
            }}
            disabled={saving}
          >
            {saving ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </div>
    </div>
  );
}
