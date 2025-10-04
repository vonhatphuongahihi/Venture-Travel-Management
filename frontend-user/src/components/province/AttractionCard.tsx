import { Attraction } from "@/global.types";
import React from "react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";

const AttractionCard = ({ attraction }: { attraction: Attraction }) => {
  return (
    <Card className="group overflow-hidden min-w-[200px]  shadow-lg rounded-2xl transition-all hover:-translate-y-1 cursor-pointer">
      <div className="relative">
        <img
          src={attraction.image}
          alt={attraction.name}
          className="min-h-[250px]"
        />

        <div className="absolute top-3 left-3">
          <Badge className="bg-white/90 text-gray-700 text-xs px-2 py-1 rounded-full">
            {attraction.category}
          </Badge>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent transition-opacity duration-300 group-hover:opacity-90" />

        <div className="absolute bottom-4 left-3 text-white transition-opacity duration-300 group-hover:opacity-100 opacity-90 pr-2">
          <span className="bg-white p-1 rounded-tl-md rounded-br-md text-[12px] text-primary">
            <b>{attraction.reviewInfo.rating}</b> / 5
          </span>
          <span className="ml-1 text-[12px] text-white">
            ({attraction.reviewInfo.count} đánh giá)
          </span>
          <h3 className="font-bold text-lg">{attraction.name}</h3>
          <p className="text-[12px] line-clamp-2">{attraction.description}</p>
        </div>
      </div>
    </Card>
  );
};

export default AttractionCard;
