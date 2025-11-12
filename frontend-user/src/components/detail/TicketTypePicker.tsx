import { TicketType } from "@/types/tourDetailType";
import { useEffect, useState } from "react";

function TicketTypePicker({
  userTicket,
  setUserTicket,
  ticketPrices,
  totalPrice,
}) {
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [currentTicketTypes, setCurrentTicketTypes] = useState<TicketType>();
  useEffect(() => {
    const types = ticketPrices.map((ut) => ut.ticketTypeId);
    // Lấy các ticketTypes từ ticketTypeId trong ticketPrices (mảng types)
    const sampleTicketTypes: TicketType[] = [
      {
        ticketTypeId: "tt_001",
        tourId: "tour_12345", // FK -> tours.tour_id
        name: "Vé VIP 2N1D",
        notes: "Khách sạn 5 sao, cabin ban công riêng",
        quantity: 50,
        price: 9000000,
        isActive: true,
        createdAt: new Date("2025-09-01T10:00:00"), // ISO timestamp}
      },
      {
        ticketTypeId: "tt_002",
        tourId: "tour_12345", // FK -> tours.tour_id
        name: "Vé Thường 2N1D",
        notes: "Trọn gói 2 ngày 1 đêm",
        quantity: 50,
        price: 6500000,
        isActive: true,
        createdAt: new Date("2025-09-01T10:00:00"), // ISO timestamp}
      },
    ];
    setTicketTypes(sampleTicketTypes);
    setCurrentTicketTypes(sampleTicketTypes[0]);
    setUserTicket({ ...userTicket, currentType: sampleTicketTypes[0] });
  }, []);
  return (
    <div className="px-5 w-full flex flex-col justify-between">
      {ticketTypes.map((t, i) => {
        return (
          <div
            key={i}
            onClick={() => {
              if (currentTicketTypes?.ticketTypeId !== t.ticketTypeId) {
                setCurrentTicketTypes(t);
                setUserTicket({
                  ...userTicket,
                  currentType: t,
                });
              }
            }}
            className={`flex flex-col w-full px-4 py-2 border ${
              currentTicketTypes?.ticketTypeId === t.ticketTypeId
                ? "border-4 border-primary"
                : "border-1 border-gray-300"
            }`}
          >
            <p className="font-semibold text-lg">{t.name}</p>
            <p className="text-sm">{t?.notes}</p>
            {userTicket?.priceCategories?.length > 0 ? (
              <div>
                {userTicket?.priceCategories?.map((ut, idx) => {
                  const matchedPrice = ticketPrices.find(
                    (tp) =>
                      tp.ticketTypeId === t.ticketTypeId &&
                      tp.categoryId === ut.categoryId
                  );
                  return (
                    <div
                      key={idx}
                      className="flex justify-between items-center"
                    >
                      <p className="text-xs">
                        {ut.quantity} {ut.name} x{" "}
                        {matchedPrice
                          ? matchedPrice.price.toLocaleString("vi-VN")
                          : 0}
                        ₫
                      </p>
                      <p className="text-sm">
                        {(
                          ut.quantity * (matchedPrice?.price || 0)
                        ).toLocaleString("vi-VN")}
                        ₫
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="italic text-sm">*Vui lòng chọn số lượng khách*</p>
            )}
          </div>
        );
      })}
      <div className="flex justify-between font-semibold text-lg my-4">
        <span>Tổng giá tiền: {totalPrice.toLocaleString("vi-VN")}₫</span>
      </div>
    </div>
  );
}

export default TicketTypePicker;
