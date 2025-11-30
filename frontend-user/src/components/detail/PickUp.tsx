import { List, MapPin } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import PickUpAreaMap from "./PickUpAreaMap";

export default function PickUp({
  id,
  pickUpPoint,
  pickUpDetails,
  pickUpPointGeom,
  pickUpAreaGeom,
  endPoint,
  open,
  setOpen,
}: {
  id: string;
  pickUpPoint: string;
  pickUpDetails: string;
  pickUpPointGeom: [number, number];
  pickUpAreaGeom: [number, number][];
  endPoint: string;
  open: boolean;
  setOpen: (open: boolean) => void;
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
          <AccordionContent className="flex flex-col gap-4">
            <p className="font-bold">Khởi hành: </p>
            <div className="flex space-x-2">
              <MapPin className="w-6 h-6 text-primary" />
              <div className="flex-col space-y-1">
                <p className="font-semibold">Vị trí</p>
                <p className="text-gray-500 max-w-3xl text-justify">{pickUpPoint}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <List className="w-6 h-6 text-primary" />
              <div className="flex-col space-y-1">
                <p className="font-semibold">Chi tiết đón</p>
                <p className="text-gray-500 max-w-3xl text-justify">{pickUpDetails}</p>
              </div>
            </div>

            {/* Pickup Area Map */}
            {pickUpAreaGeom && pickUpAreaGeom.length > 0 && (
              <div className="mt-4">
                <p className="font-semibold mb-2 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Khu vực đón miễn phí
                </p>
                <PickUpAreaMap
                  pickupPoint={pickUpPointGeom}
                  pickupAreaCoordinates={pickUpAreaGeom}
                />
              </div>
            )}

            <p className="font-bold mt-4">Kết thúc: </p>
            <div className="flex space-x-2">
              <MapPin className="w-6 h-6 text-primary" />
              <div className="flex-col space-y-1">
                <p className="font-semibold">Vị trí</p>
                <p className="text-gray-500 max-w-3xl text-justify">{endPoint}</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div className="w-full border-t border-primary my-2" />
    </div>
  );
}
