import React, { useEffect, useState } from "react";
import { Controller, type UseFormGetValues, type UseFormSetValue } from "react-hook-form";
import type { Attraction } from "@/types/tour";
import { Search, X } from "lucide-react";

type Option<T = any> = {
    label: string;
    value: string | number;
    data?: T; // dữ liệu gốc
};

interface AttractionSelectProps {
    control: any;
    name: string;
    error?: any;
    index: number;
    getValues: UseFormGetValues<any>
    attractions: Attraction[] | undefined;
}

// Hàm map option
const mapAttractionToOption = (attraction: Attraction): Option<Attraction> => ({
    value: attraction.attractionId,
    label: `${attraction.name} - ${attraction.address}`,
    data: attraction,
});

// Custom render option
const renderAttractionOption = (option: Option<Attraction>) => (
    <div className="py-2">
        <div className="font-medium text-gray-900">{option.data?.name}</div>
        <div className="text-sm text-gray-500">{option.data?.address}</div>
        <div className="text-xs text-gray-400">{option.data?.province.name}</div>
    </div>
);

export const AttractionSelect = ({
    control,
    name,
    error,
    index,
    getValues,
    attractions,
}: AttractionSelectProps) => {
    const [query, setQuery] = useState("");
    const [options, setOptions] = useState<Option<Attraction>[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedOption, setSelectedOption] = useState<Option<Attraction> | null>(null);

    useEffect(() => {
        if (selectedOption) return;

        if (!query) {
            setOptions([]);
            setLoading(false);
            return;
        }
        setLoading(true);
        const timeout = setTimeout(() => {
            if (!query.trim()) {
                return [];
            }

            const lowerCaseQuery = query.toLowerCase().trim();

            if (attractions) {
                const suggestedAttractions = attractions
                    .filter(
                        (attraction) =>
                            attraction.name.toLowerCase().includes(lowerCaseQuery) ||
                            attraction.address.toLowerCase().includes(lowerCaseQuery)
                    )
                    .slice(0, 5);

                setOptions(suggestedAttractions.map(mapAttractionToOption));
                setLoading(false);
            }
        }, 200); // debounce 600ms
        return () => clearTimeout(timeout);
    }, [query, selectedOption]);

    const handleSelect = (option: Option<Attraction>) => {
        setSelectedOption(option);
        setQuery(option.label);
        setOptions([]);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        // Clear selection khi user bắt đầu gõ lại
        if (selectedOption) {
            setSelectedOption(null);
        }
    };

    useEffect(() => {
        const currentValue = getValues(name);

        if (currentValue && attractions) {
            const attraction = attractions.find((a) => a.attractionId === currentValue);

            if (attraction) {
                const option = mapAttractionToOption(attraction);
                setSelectedOption(option);
                setQuery(option.label);
            }
        }
    }, [name, attractions, getValues]);

    return (
        <Controller
            control={control}
            name={name}
            rules={{ required: "Điểm đến là bắt buộc" }}
            render={({ field }) => {
                return (
                    <div>
                        <div className="relative w-full ">
                            <div className="flex items-center border border-gray-300 rounded">
                                <button className="px-2">
                                    <Search className="text-gray-500 w-[16px]" />
                                </button>
                                <input
                                    type="text"
                                    className={`flex-1 border-none rounded py-2 pr-2 placeholder:text-gray-500  ${
                                        error ? "border-red-500" : "border-gray-300"
                                    }`}
                                    placeholder={"Tìm kiếm địa điểm"}
                                    value={selectedOption ? selectedOption.label : query}
                                    onChange={handleInputChange}
                                />
                                {selectedOption && (
                                    <button
                                        className="px-2"
                                        onClick={() => {
                                            setSelectedOption(null);
                                            setQuery("");
                                        }}
                                    >
                                        <X className="text-gray-500 w-[16px]" />
                                    </button>
                                )}
                            </div>
                            {loading && (
                                <div className="absolute z-10 w-full bg-white border mt-1 rounded shadow">
                                    <div className="text-gray-400 px-3 py-2">Đang tìm...</div>
                                </div>
                            )}

                            {options.length > 0 && !selectedOption && (
                                <ul className="absolute z-10 w-full bg-white border mt-1 rounded shadow">
                                    {options.map((opt) => (
                                        <li
                                            key={opt.value}
                                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                            onClick={() => {
                                                handleSelect(opt);
                                                field.onChange(opt.value);
                                            }}
                                        >
                                            {renderAttractionOption
                                                ? renderAttractionOption(opt)
                                                : opt.label}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                );
            }}
        />
    );
};
