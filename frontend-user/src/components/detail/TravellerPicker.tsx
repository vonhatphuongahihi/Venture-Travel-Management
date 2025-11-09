import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Users } from "lucide-react";
import { useState } from "react";
import TravellerChoose from "./TravellerChoose";

function TravellerPicker({
  ticketPrices,
  userTicket,
  setUserTicket
}) {
  const [open, setOpen] = useState(false);
  const [totalPeople, setTotalPeople] = useState(2);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button className="flex items-center justify-center w-20 h-12 bg-white hover:bg-gray-300 text-primary relative rounded-3xl outline outline-1 outline-offset-[-1px] outline-primary">
          <Users size={24} />
          <p>{totalPeople}</p>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <TravellerChoose
          userTicket={userTicket}
          ticketPrices={ticketPrices}
          onConfirm={(pc) => {
            setOpen(false);
            setTotalPeople(pc.reduce((sum, curr) => sum + curr.quantity, 0));
            setUserTicket((prev)=>{return {...prev, priceCategories: pc }});
            console.log(pc?.map(tc => ({ categoryId: tc.categoryId, name: tc.name, quantity: tc.quantity })))
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

export default TravellerPicker;
