import { TicketType } from "@/types/tourDetailType";
import { useEffect, useState } from "react";

function TicketTypePicker({
  userTicket,
  setUserTicket,
  ticketPrices,
  ticketTypes,
  totalPrice,
}) {
  const [currentTicketTypes, setCurrentTicketTypes] = useState<TicketType>();
  useEffect(() => {
    if (ticketTypes && ticketTypes.length > 0) {
      setCurrentTicketTypes(ticketTypes[0]);
      setUserTicket({ ...userTicket, currentType: ticketTypes[0] });
    }
  }, [ticketTypes]);
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
    </div>
  );
}

export default TicketTypePicker;
