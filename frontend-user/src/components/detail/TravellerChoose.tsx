import { PriceCategories, TicketType } from "@/types/tourDetailType";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";

export default function TravellerChoose({
  userTicket,
  ticketPrices,
  onConfirm,
}) {
  const [priceCategories, setPriceCategories] = useState([]);
  useEffect(() => {
    if (userTicket?.priceCategories && userTicket?.priceCategories.length > 0) {
      setPriceCategories(userTicket?.priceCategories);
      return;
    }
    const categories = ticketPrices.map((ut) => ut.categoryId);
    // Lấy các priceCategory từ categoryId trong ticketPrices (mảng categories)
    const samplePriceCategories: PriceCategories[] = [
      {
        categoryId: "7537ef0a-c7fb-4a05-ab33-f4b2ab4033cf",
        name: "Người lớn",
        description: "Trên 140cm",
        createdAt: new Date("2025-09-01T10:00:00"),
      },
      {
        categoryId: "ef0e08ba-f086-45b9-8976-203dddbcd9ae",
        name: "Trẻ em",
        description: "Dưới 140cm",
        createdAt: new Date("2025-09-01T10:00:00"),
      },
    ];
    setPriceCategories(samplePriceCategories?.map((pc) => {
      return {
        ...pc,
        quantity: 1,
      }
    }));
  }, []);
  const addOne = (t) => {
    setPriceCategories((prev) =>
      prev.map((pc) =>
        pc.categoryId === t.categoryId
          ? { ...pc, quantity: pc.quantity + 1 }
          : pc
      )
    );
  };
  const minusOne = (t) => {
    setPriceCategories((prev) =>
      prev.map((pc) =>
        pc.categoryId === t.categoryId
          ? { ...pc, quantity: pc.quantity - 1 }
          : pc
      )
    );
  };

  return (
    <div
      className="w-[400px] bg-white rounded-lg outline outline-1 outline-primary p-5"
    >
      {priceCategories?.map((t, i) => {
        return (
          <div className="w-full flex justify-between p-2" key={i}>
            <div className="text-left space-y-1 flex-col">
              <p className="capitalize text font-semibold">{t.name}</p>
              <p className="text-sm text-gray-500">{t.description}</p>
            </div>
            <div className="space-x-2 flex items-center">
              <button
                className="w-6 h-6 bg-primary rounded text-white hover:bg-[#0891B2] disabled:bg-gray-400"
                disabled={priceCategories.find((pc) => pc.categoryId === t.categoryId)?.quantity === 0}
                onClick={() => minusOne(t)}
              >
                -
              </button>
              <span className="w-10 text-center text-lg font-semibold">
                {priceCategories.find((pc) => pc.categoryId === t.categoryId)?.quantity ? priceCategories.find((pc) => pc.categoryId === t.categoryId)?.quantity : 0}
              </span>
              <button
                className="w-6 h-6 bg-primary rounded text-white hover:bg-[#0891B2] disabled:bg-gray-400"
                disabled={
                  priceCategories.find((pc) => pc.categoryId === t.categoryId)?.quantity ===
                  ticketPrices.find((tp) =>
                    tp.categoryId === t.categoryId &&
                    tp.ticketTypeId === userTicket.currentType?.ticketTypeId
                  )?.quantity
                }
                onClick={() => addOne(t)}
              >
                +
              </button>
            </div>
          </div>
        );
      })}
      <Button
        className="w-full bg-primary rounded-lg text-white hover:bg-[#0891B2] mt-5"
        onClick={() => onConfirm(priceCategories)}
      >
        Xác nhận
      </Button>
    </div>
  );
}
