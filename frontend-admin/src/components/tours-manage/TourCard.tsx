
import { MapPin, Edit, Trash2 } from "lucide-react";

const TourCard: React.FC<any> = ({ tour }: any) => {

    return (
        <div className="bg-white rounded-md relative shadow-md border flex flex-col border-gray-100">
            {tour.isActive ? (
                <div className="absolute top-2 right-2">
                    <span className="px-2 py-[2px] text-xs rounded-full bg-green-100 text-green-600 font-medium">
                        active
                    </span>
                </div>
            ) : (
                <div className="absolute top-2 right-2">
                    <span className="px-2 py-[2px] text-xs rounded-full bg-green-100 text-red-400 font-medium">
                        unactive
                    </span>
                </div>
            )}
            <div className="h-[168px] flex">
                <img
                    src={tour.images[0] ? tour.images[0] : "https://placehold.co/600x400?text=Hello+World"}
                    alt=""
                    className="h-full w-full object-cover rounded-t-md"
                />
            </div>

            {/* Content */}
            <div className="p-3 flex flex-col gap-1">
                <h3 className="text-sm font-semibold line-clamp-2">{tour.name}</h3>

                <div className="flex items-center text-gray-500 text-xs gap-1">
                    <MapPin className="w-3 h-3" />
                    Việt Nam
                </div>

                <p className="text-xs text-gray-600 line-clamp-2">{tour.about}</p>

                {/* Categories */}
                <div className="flex flex-wrap gap-2 mt-1">
                    {tour.categories.slice(0, 2).map((cate: string, idx: number) => (
                        <span
                            key={idx}
                            className="px-2 py-[2px] bg-blue-100 text-blue-600 rounded-md text-xs"
                        >
                            {cate}
                        </span>
                    ))}
                    {tour.categories.length > 2 && (
                        <span className="px-2 py-[2px] bg-gray-100 text-gray-600 rounded-md text-sm">
                            +{tour.categories.length - 2}
                        </span>
                    )}
                </div>

                {/* Rating & Actions */}
                <div className="flex items-center justify-between mt-auto text-sm">
                    <span className="text-gray-700">Rating: ⭐ {tour.avgRating.toFixed(1)}/5</span>
                    <div className="flex gap-2">
                        <button className="p-1 rounded hover:bg-gray-100">
                            <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-1 rounded bg-red-200 hover:bg-red-300">
                            <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TourCard;
