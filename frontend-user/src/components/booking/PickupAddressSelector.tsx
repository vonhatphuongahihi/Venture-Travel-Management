import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PickUpAreaMap from '@/components/detail/PickUpAreaMap';
import { useToast } from '@/contexts/ToastContext';
import { MapPin, X } from 'lucide-react';

interface PickupAddressSelectorProps {
    pickupAreaGeom: [number, number][];
    pickupPointGeom: [number, number];
    value: string;
    onChange: (address: string) => void;
}

interface GeocodingResult {
    place_name: string;
    center: [number, number];
    geometry: {
        coordinates: [number, number];
    };
}

function isPointInPolygon(point: [number, number], polygon: [number, number][]): boolean {
    const [x, y] = point;
    let inside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const [xi, yi] = polygon[i];
        const [xj, yj] = polygon[j];

        const intersect =
            ((yi > y) !== (yj > y)) &&
            (x < (xj - xi) * (y - yi) / (yj - yi) + xi);

        if (intersect) inside = !inside;
    }

    return inside;
}

export default function PickupAddressSelector({
    pickupAreaGeom,
    pickupPointGeom,
    value,
    onChange,
}: PickupAddressSelectorProps) {
    const [searchQuery, setSearchQuery] = useState(value || '');
    const [suggestions, setSuggestions] = useState<GeocodingResult[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedCoordinates, setSelectedCoordinates] = useState<[number, number] | null>(null);
    const [defaultSuggestions, setDefaultSuggestions] = useState<GeocodingResult[]>([]);
    const [hasLoadedDefault, setHasLoadedDefault] = useState(false);
    const [isAddressSelected, setIsAddressSelected] = useState(false);
    const { showToast } = useToast();
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);

    const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

    const calculateBounds = (polygon: [number, number][]): [number, number, number, number] => {
        let minLng = polygon[0][0], maxLng = polygon[0][0];
        let minLat = polygon[0][1], maxLat = polygon[0][1];

        polygon.forEach(([lng, lat]) => {
            if (lng < minLng) minLng = lng;
            if (lng > maxLng) maxLng = lng;
            if (lat < minLat) minLat = lat;
            if (lat > maxLat) maxLat = lat;
        });

        return [minLng, minLat, maxLng, maxLat];
    };

    useEffect(() => {
        if (!pickupAreaGeom || pickupAreaGeom.length === 0 || hasLoadedDefault) return;

        const loadDefaultSuggestions = async () => {
            try {
                const [minLng, minLat, maxLng, maxLat] = calculateBounds(pickupAreaGeom);
                const centerLng = (minLng + maxLng) / 2;
                const centerLat = (minLat + maxLat) / 2;

                const response = await fetch(
                    `https://api.mapbox.com/geocoding/v5/mapbox.places/${centerLng},${centerLat}.json?` +
                    `access_token=${MAPBOX_TOKEN}&` +
                    `bbox=${minLng},${minLat},${maxLng},${maxLat}&` +
                    `limit=50&` +
                    `language=vi&` +
                    `types=address,poi`
                );

                if (!response.ok) {
                    throw new Error('Failed to load default suggestions');
                }

                const data = await response.json();
                const allResults = data.features || [];

                const filteredResults = allResults.filter((feature: GeocodingResult) => {
                    const coordinates: [number, number] = feature.center || feature.geometry.coordinates;
                    return isPointInPolygon(coordinates, pickupAreaGeom);
                });

                const limitedResults = filteredResults.slice(0, 15);
                setDefaultSuggestions(limitedResults);
                setHasLoadedDefault(true);
            } catch (error) {
                console.error('Error loading default suggestions:', error);
            }
        };

        loadDefaultSuggestions();
    }, [pickupAreaGeom, MAPBOX_TOKEN, hasLoadedDefault]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                suggestionsRef.current &&
                !suggestionsRef.current.contains(event.target as Node)
            ) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        if (isAddressSelected) {
            return;
        }

        if (!searchQuery.trim() || searchQuery.length < 3) {
            setSuggestions([]);
            setShowSuggestions(false);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);
        searchTimeoutRef.current = setTimeout(async () => {
            try {
                const response = await fetch(
                    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
                        searchQuery
                    )}.json?access_token=${MAPBOX_TOKEN}&country=VN&limit=20&language=vi`
                );

                if (!response.ok) {
                    throw new Error('Geocoding request failed');
                }

                const data = await response.json();
                const allResults = data.features || [];

                let filteredResults: GeocodingResult[] = [];

                if (pickupAreaGeom && pickupAreaGeom.length > 0) {
                    filteredResults = allResults.filter((feature: GeocodingResult) => {
                        const coordinates: [number, number] =
                            feature.center || feature.geometry.coordinates;
                        return isPointInPolygon(coordinates, pickupAreaGeom);
                    });
                } else {
                    filteredResults = allResults;
                }

                const limitedResults = filteredResults.slice(0, 10);

                setSuggestions(limitedResults);
                setShowSuggestions(true);

                if (pickupAreaGeom && pickupAreaGeom.length > 0 && limitedResults.length === 0 && allResults.length > 0) {
                    showToast(
                        'Không tìm thấy địa chỉ nào trong khu vực đón miễn phí. Vui lòng thử tìm kiếm khác.',
                        'info'
                    );
                }
            } catch (error) {
                console.error('Error fetching geocoding results:', error);
                showToast('Không thể tìm kiếm địa chỉ. Vui lòng thử lại.', 'error');
                setSuggestions([]);
            } finally {
                setIsSearching(false);
            }
        }, 300);

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [searchQuery, MAPBOX_TOKEN, showToast, pickupAreaGeom, isAddressSelected]);

    const handleSelectAddress = (suggestion: GeocodingResult) => {
        const coordinates: [number, number] = suggestion.center || suggestion.geometry.coordinates;


        const address = suggestion.place_name;
        setIsAddressSelected(true);
        setSearchQuery(address);
        setSelectedCoordinates(coordinates);
        onChange(address);
        setShowSuggestions(false);
        showToast('Đã chọn địa chỉ đón khách', 'success');
    };

    const handleClear = () => {
        setSearchQuery('');
        setSelectedCoordinates(null);
        setIsAddressSelected(false);
        onChange('');
        setShowSuggestions(false);
    };

    return (
        <div className="space-y-4">
            <Label>
                Chọn điểm đón <span className="text-red-500">*</span>
            </Label>

            <div className="relative">
                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                        required
                        type="text"
                        placeholder="Nhập địa chỉ để tìm kiếm..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setIsAddressSelected(false);
                        }}
                        onFocus={() => {
                            if (!searchQuery.trim() && defaultSuggestions.length > 0) {
                                setSuggestions(defaultSuggestions);
                                setShowSuggestions(true);
                            } else if (suggestions.length > 0) {
                                setShowSuggestions(true);
                            }
                        }}
                        className="pl-10 pr-10"
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {showSuggestions && (
                    <div
                        ref={suggestionsRef}
                        className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                    >
                        {suggestions.length > 0 ? (
                            <>
                                {!searchQuery.trim() && (
                                    <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                                        <p className="text-xs text-gray-600 font-medium">
                                            Địa chỉ phổ biến trong khu vực đón miễn phí
                                        </p>
                                    </div>
                                )}
                                {suggestions.map((suggestion, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => handleSelectAddress(suggestion)}
                                        className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                                    >
                                        <div className="flex items-start gap-2">
                                            <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {suggestion.place_name}
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </>
                        ) : (
                            <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                {!searchQuery.trim()
                                    ? 'Đang tải địa chỉ...'
                                    : 'Không tìm thấy địa chỉ nào trong khu vực đón miễn phí'
                                }
                            </div>
                        )}
                    </div>
                )}

                {isSearching && (
                    <p className="text-xs text-gray-500 mt-1">Đang tìm kiếm địa chỉ trong khu vực đón miễn phí...</p>
                )}
            </div>

            {value && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-green-900">
                                Địa chỉ đã chọn:
                            </p>
                            <p className="text-sm text-green-700">{value}</p>
                        </div>
                    </div>
                </div>
            )}

            {pickupAreaGeom && pickupAreaGeom.length > 0 && (
                <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                        Khu vực đón miễn phí
                    </p>
                    <PickUpAreaMap
                        pickupPoint={pickupPointGeom}
                        pickupAreaCoordinates={pickupAreaGeom}
                        selectedAddress={selectedCoordinates}
                        selectedAddressName={value}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                        Vui lòng chọn địa chỉ nằm trong khu vực màu xanh trên bản đồ
                    </p>
                </div>
            )}
        </div>
    );
}

