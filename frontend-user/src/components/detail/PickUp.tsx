import { List, MapPin } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import PickUpAreaMap from "./PickUpAreaMap";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

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
            <h2 className="text-xl font-bold">{t('tourDetail.pickUp')}</h2>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4">
            <p className="font-bold">{t('tourDetail.pickUpPoint')}: </p>
            <div className="flex space-x-2">
              <MapPin className="w-6 h-6 text-primary" />
              <div className="flex-col space-y-1">
                <p className="font-semibold">{t('tourDetail.pickUpLocation')}</p>
                <p className="text-gray-500 max-w-3xl text-justify">{pickUpPoint}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <List className="w-6 h-6 text-primary" />
              <div className="flex-col space-y-1">
                <p className="font-semibold">{t('tourDetail.pickUpDetails')}</p>
                <p className="text-gray-500 max-w-3xl text-justify">{pickUpDetails}</p>
              </div>
            </div>

            {/* Pickup Area Map */}
            {pickUpAreaGeom && pickUpAreaGeom.length > 0 && (
              <div className="mt-4">
                <p className="font-semibold mb-2 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  {t('tourDetail.freePickupArea')}
                </p>
                <PickUpAreaMap
                  pickupPoint={pickUpPointGeom}
                  pickupAreaCoordinates={pickUpAreaGeom}
                />
              </div>
            )}

            <p className="font-bold mt-4">{t('tourDetail.endPoint')}: </p>
            <div className="flex space-x-2">
              <MapPin className="w-6 h-6 text-primary" />
              <div className="flex-col space-y-1">
                <p className="font-semibold">{t('tourDetail.pickUpLocation')}</p>
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
