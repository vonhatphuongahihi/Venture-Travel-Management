import { TicketType } from "@/types/tourDetailType";
import { Button } from "../ui/button";

export default function TravellerChoose({ticketTypes , setTicketTypes, onConfirm}:{ticketTypes: TicketType[] | undefined, setTicketTypes: (ticketTypes: TicketType[]) => void, onConfirm : () => void}) {
    const addOne = (t : TicketType) => {
        setTicketTypes(ticketTypes.map(ticket => ticket.ticketTypeId === t.ticketTypeId ? {...ticket, quantity: ticket.quantity + 1} : ticket));
    }
    const minusOne = (t : TicketType) => {
        setTicketTypes(ticketTypes.map(ticket => ticket.ticketTypeId === t.ticketTypeId ? {...ticket, quantity: ticket.quantity - 1} : ticket));
    }
    return (
    <div className="w-[400px] bg-white rounded-lg outline outline-1 outline-primary p-5" onClick={()=>{}}>
      {ticketTypes?.map((t, i) => {
        return (
          <div className="w-full flex justify-between p-2">
            <div className="text-left space-y-1 flex-col">
              <p className="capitalize text font-semibold">{t.name}</p>
              <p className="text-sm text-gray-500">{t.notes}</p>
            </div>
            <div className="space-x-2 flex items-center">
                <button className="w-6 h-6 bg-primary rounded text-white hover:bg-[#0891B2] disabled:bg-gray-400" disabled={t.quantity===0}
                onClick={()=>minusOne(t)}>
                    -
                </button>
                <span className="w-10 text-center text-lg font-semibold">{t.quantity}</span>
                <button className="w-6 h-6 bg-primary rounded text-white hover:bg-[#0891B2] disabled:bg-gray-400" disabled={t.quantity===15}
                onClick={()=>addOne(t)}>
                    +
                </button>
            </div>
          </div>
        );
      })}
      <Button className="w-full bg-primary rounded-lg text-white hover:bg-[#0891B2] mt-5" onClick={onConfirm}>
        Xác nhận
      </Button>
    </div>
  );
}
