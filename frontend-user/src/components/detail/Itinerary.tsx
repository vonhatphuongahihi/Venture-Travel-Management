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

function StopDetail({
  stop,
  zoomStop,
  isActive,
}: {
  stop: TourStop;
  zoomStop: (geom: [number, number]) => void;
  isActive: boolean;
}) {
  const [openDetail, setOpenDetail] = useState<boolean>(false);
  return (
    <div className={`w-full min-h-14 flex items-start space-x-5 transition-all ${isActive ? 'bg-primary/5 rounded-lg p-3' : ''}`}>
      <div className="bg-primary flex items-center justify-center w-14 h-14 rounded-full text-white p-2 font-bold text-lg shrink-0">
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
                <p className="text-gray-600 leading-relaxed">{stop.details}</p>
              )}
              <Button className="bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors">
                Tìm hiểu thêm về {stop.attractionName}
              </Button>
            </div>
          </CollapsibleContent>
          <CollapsibleTrigger asChild>
            <button className="text-primary hover:underline text-sm font-medium">
              {openDetail ? "Ẩn bớt" : "Xem chi tiết và hình ảnh"}
            </button>
          </CollapsibleTrigger>
        </Collapsible>
      </div>
    </div>
  );
}

export default function Itinerary({
  tourStop,
  tourRoute,
  setPUOpen,
  pickUpPoint,
  pickUpGeom,
  endPoint,
  endPointGeom,
}: {
  tourStop: TourStop[];
  tourRoute: TourRoute | null;
  setPUOpen: (open: boolean) => void;
  pickUpPoint?: string;
  pickUpGeom?: [number, number];
  endPoint?: string;
  endPointGeom?: [number, number];
}) {
  const [activeStop, setActiveStop] = useState<number | null>(null);

  const zoomStop = (geom: [number, number]) => {
    const stop = tourStop.find(s =>
      s.attractionGeom[0] === geom[0] && s.attractionGeom[1] === geom[1]
    );
    if (stop) {
      setActiveStop(stop.stopOrder);
      setTimeout(() => setActiveStop(null), 2000);
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
                <p className="font-semibold text-lg">Điểm khởi hành</p>
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
                Xem chi tiết khởi hành
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
                <p className="font-semibold text-lg">Điểm kết thúc</p>
              </div>
              <p className="text-gray-700">{endPoint}</p>
            </div>
          </div>
        )}
      </div>

      {/* Map - Right Side */}
      <div className="w-full lg:w-[600px]">
        <ItineraryMap
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
