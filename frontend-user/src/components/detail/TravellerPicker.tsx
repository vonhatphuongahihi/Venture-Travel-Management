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
  totalPeople,
  ticketTypes,
  setTicketTypes,
  setTotalPeople,
}) {
  const [open, setOpen] = useState(false);
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
          ticketTypes={ticketTypes}
          setTicketTypes={setTicketTypes}
          onConfirm={() => {
            setOpen(false);
            setTotalPeople(
              ticketTypes.reduce((sum, tt) => sum + tt.quantity, 0)
            );
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

export default TravellerPicker;
