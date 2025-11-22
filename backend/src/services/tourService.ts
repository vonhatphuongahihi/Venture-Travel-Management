import {
    CreatePriceCategoryRequest,
    CreateTicketTypeRequest,
    CreateTourRequest,
    CreateTourStopRequest,
    PointCoordinates,
} from "@/types/tour";
import { PrismaClient } from "@prisma/client";
import axios from "axios";

interface MapboxIsochroneResponse {
    type: string;
    features: Array<{
        type: string;
        geometry: {
            type: string;
            coordinates: number[][][]; // Array of polygons
        };
        properties: any;
    }>;
}

export class TourService {
    private mapboxAccessToken: string;
    constructor(private prisma: PrismaClient, mapboxAccessToken?: string) {
        this.mapboxAccessToken = mapboxAccessToken || process.env.MAPBOX_ACCESS_TOKEN || "";
    }

    async createTour(data: CreateTourRequest, userId: string) {
        try {
            await this.validateTourData(data);

            const tour = await this.prisma.$transaction(async (tx) => {
                const pickupPointId = await this.findOrCreatePoint(tx, data.pickupPointCoordinates);

                const pickupAreaPolygonId = await this.createPickupAreaPolygon(
                    tx,
                    data.pickupPointCoordinates,
                    data.pickupAreaRadius
                );

                let endPointId: string | undefined;
                if (data.endPointCoordinates) {
                    endPointId = await this.findOrCreatePoint(tx, data.endPointCoordinates);
                }
                const newTour = await tx.tour.create({
                    data: {
                        name: data.name,
                        images: data.images,
                        about: data.about,
                        ageRange: data.ageRange,
                        maxGroupSize: data.maxGroupSize,
                        duration: data.duration,
                        languages: data.languages,
                        categories: data.categories,
                        highlights: data.highlights || [],
                        inclusions: data.inclusions,
                        exclusions: data.exclusions,
                        expectations: data.expectations,
                        pickupPoint: data.pickupPoint,
                        pickupPointGeom: pickupPointId,
                        pickupDetails: data.pickupDetails,
                        pickupAreaGeom: pickupAreaPolygonId,
                        endPoint: data.endPoint,
                        endPointGeom: endPointId,
                        additionalInformation: data.additionalInformation,
                        cancellationPolicy: data.cancellationPolicy,
                        startDate: data.startDate,
                        endDate: data.endDate,
                        isActive: true,
                    },
                });

                if (data.tourStops && data.tourStops.length > 0) {
                    await this.createTourStops(tx, newTour.tourId, data.tourStops);
                }

                // 3. Tạo các loại vé và giá vé
                if (data.ticketTypes && data.ticketTypes.length > 0) {
                    await this.createTicketTypes(tx, newTour.tourId, data.ticketTypes);
                }

                return newTour;
            });

            // Lấy thông tin tour đầy đủ sau khi tạo
            return await this.getTourById(tour.tourId);
        } catch (error) {
            throw this.handleError(error);
        }
    }

    private async findOrCreatePoint(tx: any, coordinates: PointCoordinates): Promise<string> {
        const { latitude, longitude } = coordinates;

        const existingPoint = await tx.point.findFirst({
            where: {
                latitude: latitude,
                longitude: longitude,
            },
        });

        if (existingPoint) {
            return existingPoint.pointId;
        }

        // Nếu chưa tồn tại, tạo mới
        const newPoint = await tx.point.create({
            data: {
                latitude,
                longitude,
            },
        });

        return newPoint.pointId;
    }

    private async createPickupAreaPolygon(
        tx: any,
        pickupCoordinates: PointCoordinates,
        radius: number
    ): Promise<string> {
        try {
            const { latitude, longitude } = pickupCoordinates;

            // Gọi Mapbox Isochrone API
            const isochroneData = await this.fetchMapboxIsochrone(longitude, latitude, radius);

            if (!isochroneData || !isochroneData.features || isochroneData.features.length === 0) {
                throw new Error("Không thể tạo vùng đón khách từ Mapbox");
            }

            const polygonCoordinates = isochroneData.features[0].geometry.coordinates[0];

            const polygon = await tx.polygon.create({
                data: {},
            });

            const polygonPointsData = [];
            for (const coord of polygonCoordinates) {
                const [lng, lat] = coord;

                const pointId = await this.findOrCreatePoint(tx, {
                    latitude: lat,
                    longitude: lng,
                });

                polygonPointsData.push({
                    polygonId: polygon.polygonId,
                    pointId: pointId,
                });
            }

            // Tạo tất cả polygon points
            await tx.polygonPoint.createMany({
                data: polygonPointsData,
            });

            return polygon.polygonId;
        } catch (error) {
            console.error("Error creating pickup area polygon:", error);
            throw new Error(
                "Không thể tạo vùng đón khách: " +
                    (error instanceof Error ? error.message : "Unknown error")
            );
        }
    }

    private async fetchMapboxIsochrone(
        longitude: number,
        latitude: number,
        radius: number
    ): Promise<MapboxIsochroneResponse> {
        if (!this.mapboxAccessToken) {
            throw new Error("Mapbox access token chưa được cấu hình");
        }

        const mode = "driving-traffic";

        const url = `https://api.mapbox.com/isochrone/v1/mapbox/${mode}/${longitude},${latitude}`;

        const params = {
            contours_meters: radius,
            polygons: true,
            access_token: this.mapboxAccessToken,
        };

        try {
            const response = await axios.get<MapboxIsochroneResponse>(url, { params });
            return response.data;
        } catch (error) {
            console.error("Mapbox Isochrone API error:", error);
            throw new Error("Lỗi khi gọi Mapbox Isochrone API");
        }
    }

    private async createTourStops(tx: any, tourId: string, tourStops: CreateTourStopRequest[]) {
        const tourStopData = tourStops.map((stop, index) => ({
            tourId,
            attractionId: stop.attractionId,
            stopOrder: index + 1,
            notes: stop.notes,
            details: stop.details,
        }));

        await tx.tourStop.createMany({
            data: tourStopData,
        });
    }

    private async createTicketTypes(
        tx: any,
        tourId: string,
        ticketTypes: CreateTicketTypeRequest[]
    ) {
        for (const ticketType of ticketTypes) {
            // Tạo ticket type
            const newTicketType = await tx.ticketType.create({
                data: {
                    tourId,
                    name: ticketType.name,
                    quantity: ticketType.quantity,
                    notes: ticketType.notes,
                },
            });

            // Tạo các mức giá cho ticket type
            if (ticketType.prices && ticketType.prices.length > 0) {
                await this.createTicketPrices(tx, newTicketType.ticketTypeId, ticketType.prices);
            }
        }
    }

    /**
     * Tạo các mức giá cho loại vé
     */
    private async createTicketPrices(
        tx: any,
        ticketTypeId: string,
        prices: CreatePriceCategoryRequest[]
    ) {
        const priceData = prices.map((price) => ({
            ticketTypeId,
            categoryId: price.categoryId,
            price: price.price,
            quantity: price.quantity,
            notes: price.description,
        }));

        await tx.ticketPrice.createMany({
            data: priceData,
        });
    }

    /**
     * Validate dữ liệu tour
     */
    private async validateTourData(data: CreateTourRequest) {
        // Kiểm tra các attraction tồn tại
        if (data.tourStops && data.tourStops.length > 0) {
            const attractionIds = data.tourStops.map((stop) => stop.attractionId);
            const attractions = await this.prisma.attraction.findMany({
                where: { attractionId: { in: attractionIds } },
            });

            if (attractions.length !== attractionIds.length) {
                throw new Error("Một hoặc nhiều attraction không tồn tại");
            }
        }

        // Kiểm tra price categories tồn tại
        if (data.ticketTypes && data.ticketTypes.length > 0) {
            const categoryIds = data.ticketTypes.flatMap((ticket) =>
                ticket.prices.map((p) => p.categoryId)
            );

            const uniqueCategoryIds = [...new Set(categoryIds)];
            const categories = await this.prisma.priceCategory.findMany({
                where: { categoryId: { in: uniqueCategoryIds } },
            });

            if (categories.length !== uniqueCategoryIds.length) {
                throw new Error("Một hoặc nhiều price category không tồn tại");
            }
        }

        // Validate dates
        if (data.startDate >= data.endDate) {
            throw new Error("Ngày bắt đầu phải trước ngày kết thúc");
        }
    }

    /**
     * Lấy thông tin tour theo ID với đầy đủ relations
     */
    async getTourById(tourId: string) {
        const tour = await this.prisma.tour.findUnique({
            where: { tourId },
            include: {
                province: true,
                tourStops: {
                    include: {
                        attraction: true,
                    },
                    orderBy: {
                        stopOrder: "asc",
                    },
                },
                ticketTypes: {
                    include: {
                        ticketPrices: {
                            include: {
                                priceCategory: true,
                            },
                        },
                    },
                },
            },
        });

        if (!tour) {
            throw new Error("Tour không tồn tại");
        }

        return tour;
    }

    private handleError(error: any): Error {
        if (error instanceof Error) {
            return error;
        }
        return new Error("Đã xảy ra lỗi khi xử lý tour");
    }
}
