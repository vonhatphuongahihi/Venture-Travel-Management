import exampleImage from "@/assets/saigon.jpg";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { Clock, Languages, Smile, Users } from "lucide-react";
import Highlights from "../detail/Highlights";
import Inclusions from "../detail/Inclusions";
import Exclusions from "../detail/Exclusions";
import Expectations from "../detail/Expectations";
import PickUp from "../detail/PickUp";
import AdditionalInfo from "../detail/AdditionalInfo";
import CancellationPolicy from "../detail/CancellationPolicy";
import { useState } from "react";
import { useTranslation } from "react-i18next";

function TourDetailDialog({ tour }) {
  const [puOpen, setPUOpen] = useState(false);
  const { t } = useTranslation();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex gap-4 items-center">
          <p className="w-3/4 truncate">{tour.description}</p>
          <button className="w-1/4 text-left hover:text-primary underline">
            {t('common.seeDetails')}
          </button>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            {tour.title}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="px-2 flex flex-col max-h-[500px]">
          <img
            src={tour.images[0] ? tour.images[0] : exampleImage}
            alt={tour.title}
            className="w-full h-[400px] object-cover"
          />
          <div className="space-y-2 mt-2">
            <h2 className="mx-2 text-xl font-bold text-gray-900">{t('tourDetail.aboutTrip')}</h2>
            <p className="mx-4 text-justify text-gray-700 font-normal leading-relaxed text-base mb-6">
              {tour.description}
            </p>
          </div>
          <div className="w-full border-t border-primary/20 my-2"></div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/60 transition-colors">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Smile className="w-5 h-5 text-primary shrink-0" />
              </div>
              <span className="text-gray-700">
                <strong className="text-gray-900">{t('tourDetail.age')}: </strong>
                {`${tour.age} ${t('tourDetail.yearsOld')}`}
              </span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/60 transition-colors">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="w-5 h-5 text-primary shrink-0" />
              </div>
              <span className="text-gray-700">
                <strong className="text-gray-900">{t('tourDetail.groupLimit')}:</strong>{" "}
                {t('tourDetail.maxPeople', { count: tour.maxGroup })}
              </span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/60 transition-colors">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Clock className="w-5 h-5 text-primary shrink-0" />
              </div>
              <span className="text-gray-700">
                <strong className="text-gray-900">{t('tourDetail.duration')}:</strong>{" "}
                {tour.duration}
              </span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/60 transition-colors">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Languages className="w-5 h-5 text-primary shrink-0" />
              </div>
              <span className="text-gray-700">
                <strong className="text-gray-900">{t('tourDetail.tourGuide')}:</strong>{" "}
                {tour.languages}
              </span>
            </div>
          </div>
          <div className="rounded-lg px-4 py-6 font-['Inter'] bg-white mt-4">
            <Highlights highlight={tour.highlight} />
            <Inclusions inclusions={tour.inclusions} />
            <Exclusions exclusions={tour.exclusions} />
            <Expectations expectations={tour.expectations} />
            <PickUp
              id={"pickUp"}
              pickUpPoint={tour.pickUpPoint || ''}
              pickUpDetails={tour.pickUpDetails || ''}
              pickUpPointGeom={tour.pickUpPointGeom || [0, 0]}
              pickUpAreaGeom={tour.pickUpAreaGeom || []}
              endPoint={tour.endPoint || ''}
              open={puOpen}
              setOpen={setPUOpen}
            />
            <AdditionalInfo additionalInfo={tour.additionalInfo} />
            <CancellationPolicy cancelPolicy={tour.cancelPolicy} />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default TourDetailDialog;
