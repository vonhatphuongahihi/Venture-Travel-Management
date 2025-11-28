"use client";

import { useState } from "react";
import { Trash,  MapPin } from "lucide-react";
import DeleteConfirm from "./DeleteConfirm";
import PlaceDetailModal from "./PlaceDetailModal";
import type { Attraction } from "@/services/AttractionAPI";

interface PlaceCardProps {
  place: Attraction;
  onDelete: (p: Attraction) => void;
}

export default function PlaceCard({ place, onDelete }: PlaceCardProps) {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);

 

  return (
    <>
      <div
        className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer group"
        onClick={() => setOpenDetail(true)}
      >
        {/* ==== IMAGE AREA ==== */}
        <div className="relative h-44 w-full">
          <img
            src={place.images[0] || "https://via.placeholder.com/400x200"}
            alt={place.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60"></div>

          {/* Category Tag */}
          <span className="absolute left-3 top-3 px-2 py-1 text-xs font-medium bg-white/90 backdrop-blur rounded shadow text-sky-700">
            {place.category}
          </span>

          {/* Delete Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpenConfirm(true);
            }}
            className="absolute right-3 top-3 bg-rose-500 hover:bg-rose-600 text-white p-1.5 rounded shadow"
          >
            <Trash size={16} />
          </button>
        </div>

        {/* ==== BODY ==== */}
        <div className="p-4 space-y-3">
          {/* Name */}
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
            {place.name}
          </h3>

          {/* Province + Rating */}
          <div className="flex justify-between items-center text-sm text-gray-500">

            {/* Province */}
            <div className="flex items-center gap-1">
              <MapPin size={14} className="text-sky-600" />
              <span>{place.province?.name ?? place.provinceId}</span>
            </div>

           
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2">
            {place.description}
          </p>
        </div>

        {/* Delete Modal */}
        <DeleteConfirm
          open={openConfirm}
          onClose={() => setOpenConfirm(false)}
          onConfirm={() => onDelete(place)}
          itemName={place.name}
        />
      </div>

      {/* Detail Modal */}
      <PlaceDetailModal
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        place={place}
      />
    </>
  );
}
