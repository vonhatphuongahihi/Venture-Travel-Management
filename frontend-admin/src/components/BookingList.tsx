import { useEffect, useMemo, useState } from "react";
import { BookingModal } from "./BookingModal";
import { ChevronDown, Pencil, Search, Trash, Plus } from "lucide-react";
import { BookingAPI } from "@/services/BookingAPI";
import type { Booking } from "@/services/BookingAPI";
import DeleteConfirm from "./DeleteConfirm";
import { useToast } from "@/contexts/ToastContext";

export function BookingList() {
  const { showToast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<Booking["status"] | "all">("all");
  const [selected, setSelected] = useState<Booking | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Booking | null>(null);

  // Normalize status từ backend sang frontend
  const normalizeStatus = (
    status: string
  ): "pending" | "confirmed" | "cancelled" => {
    if (status === "completed") return "confirmed";
    if (status === "canceled" || status === "cancelled") return "cancelled";
    if (status === "processing") return "pending";
    return status as "pending" | "confirmed" | "cancelled";
  };

  const statusOptions = [
    { label: "Chọn trạng thái", value: "all" },
    { label: "Hoàn tất", value: "confirmed" },
    { label: "Đang xử lý", value: "pending" },
    { label: "Huỷ", value: "cancelled" },
  ];

  // --- Load bookings từ backend ---
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await BookingAPI.getBookings();
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return bookings.filter((b) => {
      const ticketNames = b.bookingDetails
        .map((d) => d.ticketTypeName)
        .join(" ")
        .toLowerCase();
      const tourName = b.tour?.name?.toLowerCase() || "";
      const matchesQuery =
        b.name.toLowerCase().includes(q) ||
        b.email.toLowerCase().includes(q) ||
        ticketNames.includes(q) ||
        tourName.includes(q);

      // Normalize status để so sánh
      const normalizedBookingStatus = normalizeStatus(b.status);
      const matchesStatus =
        status === "all" ? true : normalizedBookingStatus === status;
      return matchesQuery && matchesStatus;
    });
  }, [bookings, query, status]);

  const removeBooking = async (id: string) => {
    try {
      await BookingAPI.deleteBooking(id);
      setBookings((prev) => prev.filter((b) => b.bookingId !== id));
      showToast("Xóa booking thành công", "success");
    } catch (err: any) {
      console.error(err);
      showToast(
        err?.response?.data?.message || "Xóa booking thất bại",
        "error"
      );
    }
  };

  const saveBooking = async (b: Booking, isNew = false) => {
    try {
      let updated: Booking;
      if (isNew) {
        updated = await BookingAPI.createBooking(b);
        setBookings((prev) => [...prev, updated]);
        showToast("Thêm booking thành công", "success");
      } else {
        updated = await BookingAPI.updateBooking(b.bookingId, b);
        setBookings((prev) =>
          prev.map((item) =>
            item.bookingId === updated.bookingId ? updated : item
          )
        );
        showToast("Cập nhật booking thành công", "success");
      }
      setSelected(null);
      setIsAdding(false);
    } catch (err: any) {
      console.error(err);
      showToast(
        err?.response?.data?.message ||
          (isNew ? "Thêm booking thất bại" : "Cập nhật booking thất bại"),
        "error"
      );
    }
  };

  const updateStatus = async (bookingId: string, newStatus: string) => {
    try {
      // Backend đã hỗ trợ "confirmed" nên không cần convert
      const updated = await BookingAPI.updateBookingStatus(
        bookingId,
        newStatus
      );
      setBookings((prev) =>
        prev.map((item) =>
          item.bookingId === updated.bookingId ? updated : item
        )
      );
      showToast("Cập nhật trạng thái thành công", "success");
    } catch (err: any) {
      console.error("Error updating status:", err);
      showToast(
        err?.response?.data?.message || "Cập nhật trạng thái thất bại",
        "error"
      );
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <p className="text-[18px] text-primary font-semibold ml-2">
          Danh sách booking
        </p>
        <button
          className="inline-flex items-center gap-2 rounded bg-sky-500 px-4 py-2 text-white hover:bg-sky-600"
          onClick={() => setIsAdding(true)}
        >
          <Plus size={16} /> Thêm Booking
        </button>
      </div>

      <div className="rounded-[12.75px] border border-black/10 bg-white p-4">
        {/* Search + Filter */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              className="h-10 w-full rounded-md border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm"
              placeholder="Tìm tên, email, ..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="relative">
            <select
              className="h-10 appearance-none rounded-md border border-gray-200 bg-white pl-3 pr-8 text-sm text-gray-700"
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
              <ChevronDown size={16} />
            </span>
          </div>
        </div>

        {loading ? (
          <p className="text-center py-4 text-gray-500">Đang tải dữ liệu...</p>
        ) : (
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-4 py-3">Tour</th>
                    <th className="px-4 py-3">Khách hàng</th>
                    <th className="px-4 py-3">Số điện thoại</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Ngày đặt</th>

                    <th className="px-4 py-3">Tổng giá</th>
                    <th className="px-4 py-3">Trạng thái</th>
                    <th className="px-4 py-3">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b) => (
                    <tr
                      key={b.bookingId}
                      className="border-t border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3">
                        {b.tour ? (
                          <div className="flex items-center gap-2">
                            {b.tour.images && b.tour.images.length > 0 && (
                              <img
                                src={b.tour.images[0]}
                                alt={b.tour.name}
                                className="w-10 h-10 object-cover rounded"
                              />
                            )}
                            <div>
                              <p className="font-medium text-gray-900 line-clamp-1 max-w-[120px]">
                                {b.tour.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {b.tour.duration}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">{b.name}</td>
                      <td className="px-4 py-3">{b.phone}</td>
                      <td className="px-4 py-3">{b.email}</td>
                      <td className="px-4 py-3">
                        {(() => {
                          const d = b.createdAt.slice(0, 10);
                          const [y, m, day] = d.split("-");
                          return `${day}-${m}-${y}`;
                        })()}
                      </td>

                      <td className="px-4 py-3">
                        <span className="font-medium">
                          {b.totalPrice.toLocaleString()} ₫
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {(() => {
                          const normalizedStatus = normalizeStatus(b.status);
                          return (
                            <select
                              className={`h-8 rounded-md border px-2 text-xs font-medium focus:ring-1 focus:ring-sky-400 focus:outline-none cursor-pointer ${
                                normalizedStatus === "confirmed"
                                  ? "bg-[#00B69B] text-white border-[#00B69B]"
                                  : normalizedStatus === "pending"
                                  ? "bg-[#FCBE2D] text-white border-[#FCBE2D]"
                                  : "bg-[#FD5454] text-white border-[#FD5454]"
                              }`}
                              value={normalizedStatus}
                              onChange={(e) =>
                                updateStatus(b.bookingId, e.target.value)
                              }
                              onClick={(e) => e.stopPropagation()}
                            >
                              <option value="pending">Đang xử lý</option>
                              <option value="confirmed">Hoàn tất</option>
                              <option value="cancelled">Huỷ</option>
                            </select>
                          );
                        })()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 text-gray-600">
                          <button
                            className="inline-flex h-8 w-8 items-center justify-center rounded hover:bg-gray-100"
                            onClick={() => setSelected(b)}
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            className="inline-flex h-8 w-8 items-center justify-center rounded hover:bg-red-50 text-red-600"
                            onClick={() => setDeleteTarget(b)}
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
        )}

        {selected && (
          <BookingModal
            booking={selected}
            onClose={() => setSelected(null)}
            onSave={saveBooking}
          />
        )}

        {isAdding && (
          <BookingModal
            booking={null}
            onClose={() => setIsAdding(false)}
            onSave={(b) => saveBooking(b, true)}
          />
        )}
      </div>

      <DeleteConfirm
        open={!!deleteTarget}
        itemName={deleteTarget?.name ?? ""}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (!deleteTarget) return;
          await removeBooking(deleteTarget.bookingId);
          setDeleteTarget(null);
        }}
      />
    </div>
  );
}
