import { TourRoute, TourStop } from "@/types/tourDetailType";
import { useState } from "react";
import { MapPin } from "lucide-react";
import { Button } from "../ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import ItineraryMap from "../map/ItineraryMap";
import { useTranslation } from "react-i18next";

function StopDetail({
  stop,
  zoomStop,
  isActive,
  openDetail,
  setOpenDetail,
}: {
  stop: TourStop;
  zoomStop: (geom: [number, number]) => void;
  isActive: boolean;
  openDetail: boolean;
  setOpenDetail: (open: boolean) => void;
}) {
  const { t } = useTranslation();
  
  return (
    <div className="w-full min-h-14 flex items-start space-x-5">
      <div
        className="bg-primary flex items-center justify-center w-14 h-14 rounded-full text-white p-2 font-bold text-lg shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => {
          setOpenDetail(!openDetail);
          zoomStop(stop.attractionGeom);
        }}
      >
        {stop.stopOrder}
      </div>
      <div className="flex-1 cursor-pointer">
        <div
          className="flex items-center justify-between mb-2"
          onClick={() => zoomStop(stop.attractionGeom)}
        >
          <p className="font-semibold text-lg">{stop.attractionName}</p>
          {stop.notes && (
            <p className="text-sm text-gray-500">{stop.notes}</p>
          )}
        </div>
        <Collapsible open={openDetail} onOpenChange={setOpenDetail}>
          <CollapsibleContent>
            <div className="mb-5 space-y-3">
              {stop.attractionImage && (
                <img
                  src={stop.attractionImage}
                  alt={stop.attractionName}
                  className="w-full h-48 object-cover rounded-lg"
                />
              )}
              {stop.details && (
                <p className="text-gray-600 leading-relaxed text-justify">{stop.details}</p>
              )}

            </div>
          </CollapsibleContent>
          <CollapsibleTrigger asChild>
            <button className="text-primary hover:underline text-sm font-medium">
              {openDetail ? t('tourDetail.hideLess') : t('tourDetail.viewDetailsAndImages')}
            </button>
          </CollapsibleTrigger>
        </Collapsible>
      </div>
    </div>
  );
}

export default function Itinerary({
  tourId,
  tourStop,
  tourRoute,
  setPUOpen,
  pickUpPoint,
  pickUpGeom,
  endPoint,
  endPointGeom,
}: {
  tourId?: string;
  tourStop: TourStop[];
  tourRoute: TourRoute | null;
  setPUOpen: (open: boolean) => void;
  pickUpPoint?: string;
  pickUpGeom?: [number, number];
  endPoint?: string;
  endPointGeom?: [number, number];
}) {
  const { t } = useTranslation();
  const [activeStop, setActiveStop] = useState<number | null>(null);
  const [openStops, setOpenStops] = useState<Record<number, boolean>>({});

  const zoomStop = (geom: [number, number]) => {
    const stop = tourStop.find(s =>
      s.attractionGeom[0] === geom[0] && s.attractionGeom[1] === geom[1]
    );
    if (stop) {
      setActiveStop(stop.stopOrder);
      // Close all other stops and open only the clicked one
      const newOpenStops: Record<number, boolean> = {};
      tourStop.forEach(s => {
        newOpenStops[s.stopOrder] = s.stopOrder === stop.stopOrder;
      });
      setOpenStops(newOpenStops);
      setTimeout(() => setActiveStop(null), 2000);
    }
  };

  const toggleStopDetail = (stopOrder: number, isOpen: boolean) => {
    if (isOpen) {
      // Close all others when opening this one
      const newOpenStops: Record<number, boolean> = {};
      tourStop.forEach(s => {
        newOpenStops[s.stopOrder] = s.stopOrder === stopOrder;
      });
      setOpenStops(newOpenStops);
    } else {
      // Just close this one
      setOpenStops(prev => ({ ...prev, [stopOrder]: false }));
    }
  };

  return (
    <div className="w-full flex flex-col lg:flex-row gap-6 mt-5">
      {/* Itinerary List - Left Side */}
      <div className="flex-1 space-y-4 max-w-2xl">
        {/* Start Point */}
        {pickUpPoint && (
          <div className="w-full min-h-14 flex items-start space-x-5 bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
            <div className="bg-yellow-400 flex items-center justify-center w-14 h-14 rounded-full text-white p-2 shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-lg">{t('tourDetail.startPoint')}</p>
              </div>
              <p className="text-gray-700 mb-2">{pickUpPoint}</p>
              <button
                className="text-primary hover:underline text-sm font-medium"
                onClick={() => {
                  const el = document.getElementById("pickUp");
                  if (el) {
                    const y = el.getBoundingClientRect().top + window.scrollY - 80;
                    window.scrollTo({ top: y, behavior: "smooth" });
                    setPUOpen(true);
                  }
                }}
              >
                {t('tourDetail.viewPickupDetails')}
              </button>
            </div>
          </div>
        )}

        {/* Tour Stops */}
        {tourStop.map((stop) => (
          <StopDetail
            key={stop.stopOrder}
            stop={stop}
            zoomStop={zoomStop}
            isActive={activeStop === stop.stopOrder}
            openDetail={openStops[stop.stopOrder] || false}
            setOpenDetail={(isOpen) => toggleStopDetail(stop.stopOrder, isOpen)}
          />
        ))}

        {/* End Point */}
        {endPoint && (
          <div className="w-full min-h-14 flex items-start space-x-5 bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
            <div className="bg-yellow-400 flex items-center justify-center w-14 h-14 rounded-full text-white p-2 shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-lg">{t('tourDetail.endPointLabel')}</p>
              </div>
              <p className="text-gray-700">{endPoint}</p>
            </div>
          </div>
        )}
      </div>

      {/* Map - Right Side */}
      <div className="w-full lg:w-[600px]">
        <ItineraryMap
          tourId={tourId}
          tourStop={tourStop}
          tourRoute={tourRoute}
          pickUpPoint={pickUpPoint}
          pickUpGeom={pickUpGeom}
          endPoint={endPoint}
          endPointGeom={endPointGeom}
          onStopClick={zoomStop}
        />
      </div>
    </div>
  );
}
