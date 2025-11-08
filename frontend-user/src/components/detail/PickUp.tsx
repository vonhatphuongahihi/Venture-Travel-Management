import { List, MapPin } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

export default function PickUp({
  id,
  pickUpPoint,
  pickUpDetails,
  endPoint,
  open,
  setOpen,
}) {
  return (
    <div className="mb-2" id={id}>
      <Accordion
        type="single"
        collapsible
        value={open ? "pickup" : ""}
        onValueChange={(val) => setOpen(val === "pickup")}
      >
        <AccordionItem value="pickup" className="border-none">
          <AccordionTrigger className="w-full text-left font-medium">
            <h2 className="text-xl font-bold">Điểm đón</h2>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-2">
            <p className="font-bold">Khởi hành: </p>
            <div className="flex space-x-2">
              <MapPin className="w-6 h-6 text-primary" />
              <div className="flex-col space-y-1">
                <p className="font-semibold">Vị trí</p>
                <p className="text-gray-500 max-w-3xl">{pickUpPoint}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <List className="w-6 h-6 text-primary" />
              <div className="flex-col space-y-1">
                <p className="font-semibold">Chi tiết đón</p>
                <p className="text-gray-500 max-w-3xl">{pickUpDetails}</p>
              </div>
            </div>
            <p className="font-bold">Kết thúc: </p>
            <div className="flex space-x-2">
              <MapPin className="w-6 h-6 text-primary" />
              <div className="flex-col space-y-1">
                <p className="font-semibold">Vị trí</p>
                <p className="text-gray-500 max-w-3xl">{endPoint}</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div className="w-full border-t border-primary my-2" />
    </div>
  );
}
