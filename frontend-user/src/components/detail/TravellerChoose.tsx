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

    const categoryIds = [...new Set(ticketPrices.map(tp => tp.categoryId))];

    const categories: PriceCategories[] = categoryIds.map((categoryId, index) => ({
      categoryId,
      name: index === 0 ? "Người lớn" : index === 1 ? "Trẻ em" : `Loại ${index + 1}`,
      description: index === 0 ? "Trên 140cm" : index === 1 ? "Dưới 140cm" : "",
      createdAt: new Date(),
    }));

    setPriceCategories(categories?.map((pc) => {
      return {
        ...pc,
        quantity: 1,
      }
    }));
  }, [ticketPrices, userTicket?.priceCategories]);
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
                  priceCategories.find((pc) => pc.categoryId === t.categoryId)?.quantity >=
                  (ticketPrices.find((tp) =>
                    tp.categoryId === t.categoryId &&
                    tp.ticketTypeId === userTicket.currentType?.ticketTypeId
                  )?.quantity || 10)
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
