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
            coordinates: number[][][];
        };
        properties: any;
    }>;
}

interface MapboxDirectionsResponse {
    code: string;
    routes: Array<{
        geometry: {
            coordinates: number[][]; // Array of [lng, lat] points
            type: string;
        };
        legs: any[];
        weight_name: string;
        weight: number;
        duration: number;
        distance: number;
    }>;
    waypoints: any[];
}

export class TourService {
    private mapboxAccessToken: string;
    constructor(private prisma: PrismaClient, mapboxAccessToken?: string) {
        this.mapboxAccessToken = mapboxAccessToken || process.env.MAPBOX_ACCESS_TOKEN || "";
    }

    async createTour(data: CreateTourRequest) {
        try {
            await this.validateTourData(data);

            let pickupAreaPolygonData: any;
            if (data.pickupAreaRadius) {
                pickupAreaPolygonData = await this.preparePickupAreaData(
                    data.pickupPointCoordinates,
                    data.pickupAreaRadius
                );
            }

            // 1.2. Chuẩn bị routes data
            let routesData: Array<{
                startCoordinates: PointCoordinates;
                endCoordinates: PointCoordinates;
                routeCoordinates: number[][];
            }> = [];

            if (data.tourStops && data.tourStops.length > 0) {
                // Lấy attractions trước
                const attractionIds = data.tourStops.map((stop) => stop.attractionId);
                const attractions = await this.prisma.attraction.findMany({
                    where: { attractionId: { in: attractionIds } },
                    include: { point: true },
                });

                const attractionMap = new Map(attractions.map((attr) => [attr.attractionId, attr]));

                // Chuẩn bị routes data
                routesData = await this.prepareRoutesData(
                    data.pickupPointCoordinates,
                    data.tourStops,
                    attractionMap,
                    "driving"
                );
            }

            const tour = await this.prisma.$transaction(
                async (tx) => {
                    const pickupPointId = await this.findOrCreatePoint(
                        tx,
                        data.pickupPointCoordinates
                    );

                    // 2.2. Tạo pickup area polygon (nếu có data)
                    let pickupAreaPolygonId: string;
                    pickupAreaPolygonId = await this.createPolygonFromData(
                        tx,
                        pickupAreaPolygonData
                    );

                    // 2.3. Tìm hoặc tạo end point (nếu có)
                    let endPointId: string | undefined;
                    if (data.endPointCoordinates) {
                        endPointId = await this.findOrCreatePoint(tx, data.endPointCoordinates);
                    }

                    // 2.4. Tạo routes từ data đã chuẩn bị
                    if (routesData.length > 0) {
                        await this.createRoutesFromData(tx, routesData);
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
                },
                {
                    timeout: 45000,
                    maxWait: 25000,
                }
            );

            return tour;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    private async findOrCreateNode(tx: any, pointId: string): Promise<string> {
        // Tìm node đã tồn tại
        const existingNode = await tx.node.findUnique({
            where: { pointId },
        });

        if (existingNode) {
            return existingNode.nodeId;
        }

        // Tạo node mới
        const newNode = await tx.node.create({
            data: {
                pointId,
            },
        });

        return newNode.nodeId;
    }

    /**
     * Gọi Mapbox Directions API
     */
    private async fetchMapboxDirections(
        startCoordinates: PointCoordinates,
        endCoordinates: PointCoordinates,
        mode: "driving" | "walking" | "cycling"
    ): Promise<MapboxDirectionsResponse> {
        if (!this.mapboxAccessToken) {
            throw new Error("Mapbox access token chưa được cấu hình");
        }

        // Format: lng,lat;lng,lat
        const coordinates = `${startCoordinates.longitude},${startCoordinates.latitude};${endCoordinates.longitude},${endCoordinates.latitude}`;

        const url = `https://api.mapbox.com/directions/v5/mapbox/${mode}/${coordinates}`;

        const params = {
            geometries: "geojson", // Trả về geometry dạng GeoJSON
            overview: "full", // Trả về toàn bộ route
            steps: false, // Không cần turn-by-turn directions
            access_token: this.mapboxAccessToken,
        };

        try {
            const response = await axios.get<MapboxDirectionsResponse>(url, { params });

            if (response.data.code !== "Ok") {
                throw new Error(`Mapbox Directions API error: ${response.data.code}`);
            }

            return response.data;
        } catch (error) {
            console.error("Mapbox Directions API error:", error);
            throw new Error("Lỗi khi gọi Mapbox Directions API");
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

        const newPoint = await tx.point.create({
            data: {
                latitude,
                longitude,
            },
        });

        return newPoint.pointId;
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

    private async preparePickupAreaData(
        pickupCoordinates: PointCoordinates,
        radius: number
    ): Promise<number[][]> {
        try {
            const { latitude, longitude } = pickupCoordinates;

            const isochroneData = await this.fetchMapboxIsochrone(longitude, latitude, radius);

            if (!isochroneData || !isochroneData.features || isochroneData.features.length === 0) {
                throw new Error("Không thể tạo vùng đón khách từ Mapbox");
            }

            console.log("prepare pickup area data");

            return isochroneData.features[0].geometry.coordinates[0];
        } catch (error) {
            console.error("Error preparing pickup area data:", error);
            throw error;
        }
    }

    /**
     * Tạo polygon từ data đã chuẩn bị TRONG transaction
     */
    private async createPolygonFromData(tx: any, polygonCoordinates: number[][]): Promise<string> {
        // Tạo Polygon
        const polygon = await tx.polygon.create({
            data: {},
        });

        // Tạo các PolygonPoints
        const polygonPointsData = [];
        for (let i = 0; i < polygonCoordinates.length; i++) {
            const [lng, lat] = polygonCoordinates[i];

            const point = await tx.point.create({
                data: {
                    latitude: lat,
                    longitude: lng,
                },
            });

            polygonPointsData.push({
                polygonId: polygon.polygonId,
                pointId: point.pointId,
                sequence: i,
            });
        }

        await tx.polygonPoint.createMany({
            data: polygonPointsData,
        });

        return polygon.polygonId;
    }

    /**
     * Chuẩn bị dữ liệu routes NGOÀI transaction
     */
    private async prepareRoutesData(
        pickupCoordinates: PointCoordinates,
        tourStops: CreateTourStopRequest[],
        attractionMap: Map<string, any>,
        mode: "driving" | "walking" | "cycling"
    ): Promise<
        Array<{
            startCoordinates: PointCoordinates;
            endCoordinates: PointCoordinates;
            routeCoordinates: number[][];
        }>
    > {
        const routesData = [];
        let currentCoordinates = pickupCoordinates;

        for (const stop of tourStops) {
            const attraction = attractionMap.get(stop.attractionId);

            if (!attraction || !attraction.point) {
                console.warn(`Attraction ${stop.attractionId} không có tọa độ, bỏ qua route`);
                continue;
            }

            const nextCoordinates: PointCoordinates = {
                latitude: attraction.point.latitude,
                longitude: attraction.point.longitude,
            };

            // Gọi Mapbox Directions API
            try {
                const routeData = await this.fetchMapboxDirections(
                    currentCoordinates,
                    nextCoordinates,
                    mode
                );

                if (routeData && routeData.routes && routeData.routes.length > 0) {
                    routesData.push({
                        startCoordinates: currentCoordinates,
                        endCoordinates: nextCoordinates,
                        routeCoordinates: routeData.routes[0].geometry.coordinates,
                    });
                }

                console.log("prepare route data");
            } catch (error) {
                console.error(`Error fetching route data:`, error);
                // Continue với routes khác nếu 1 route fail
            }

            currentCoordinates = nextCoordinates;
        }

        return routesData;
    }

    /**
     * Tạo routes từ data đã chuẩn bị TRONG transaction
     */
    private async createRoutesFromData(
        tx: any,
        routesData: Array<{
            startCoordinates: PointCoordinates;
            endCoordinates: PointCoordinates;
            routeCoordinates: number[][];
        }>
    ): Promise<void> {
        for (const route of routesData) {
            try {
                // Tìm hoặc tạo start/end points
                const startPointId = await this.findOrCreatePoint(tx, route.startCoordinates);
                const endPointId = await this.findOrCreatePoint(tx, route.endCoordinates);

                // Tìm hoặc tạo nodes
                const startNodeId = await this.findOrCreateNode(tx, startPointId);
                const endNodeId = await this.findOrCreateNode(tx, endPointId);

                // Kiểm tra arc đã tồn tại
                const existingArc = await tx.arc.findFirst({
                    where: {
                        startNodeId,
                        endNodeId,
                    },
                    include: {
                        arcPoints: true,
                    },
                });

                if (existingArc && existingArc.arcPoints.length > 0) {
                    console.log(`Route already exists: ${startNodeId} -> ${endNodeId}`);
                    continue;
                }

                // Tạo Arc
                let arc = existingArc;
                if (!arc) {
                    arc = await tx.arc.create({
                        data: {
                            startNodeId,
                            endNodeId,
                        },
                    });
                }

                // Tạo ArcPoints
                const arcPointsData = [];
                for (let i = 0; i < route.routeCoordinates.length; i++) {
                    const [lng, lat] = route.routeCoordinates[i];

                    const point = await tx.point.create({
                        data: {
                            latitude: lat,
                            longitude: lng,
                        },
                    });

                    arcPointsData.push({
                        arcId: arc.arcId,
                        pointId: point.pointId,
                        sequence: i,
                    });
                }

                await tx.arcPoint.createMany({
                    data: arcPointsData,
                    skipDuplicates: true,
                });

                console.log(
                    `Created route: ${startNodeId} -> ${endNodeId} with ${arcPointsData.length} points`
                );
            } catch (error) {
                console.error("Error creating route from data:", error);
            }
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
                    quantity: Number(ticketType.quantity),
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

    async getAllAttractions(filters?: { provinceId?: string; category?: string; search?: string }) {
        const where: any = {};

        if (filters?.provinceId) {
            where.provinceId = filters.provinceId;
        }

        if (filters?.category) {
            where.category = filters.category;
        }

        if (filters?.search) {
            where.OR = [
                { name: { contains: filters.search, mode: "insensitive" } },
                { address: { contains: filters.search, mode: "insensitive" } },
                { description: { contains: filters.search, mode: "insensitive" } },
            ];
        }

        const attractions = await this.prisma.attraction.findMany({
            where,
            select: {
                attractionId: true,
                name: true,
                address: true,
                description: true,

                province: {
                    select: {
                        provinceId: true,
                        name: true,
                    },
                },

                point: {
                    select: {
                        pointId: true,
                        latitude: true,
                        longitude: true,
                    },
                },
            },
            orderBy: {
                name: "asc",
            },
        });

        return attractions;
    }

    /**
     * Lấy tất cả price categories
     */
    async getAllPriceCategories() {
        const categories = await this.prisma.priceCategory.findMany({
            orderBy: {
                name: "asc",
            },
        });

        return categories;
    }

    /**
     * Lấy metadata cho form tạo tour
     * Bao gồm: attractions, price categories, provinces
     */
    async getTourFormMetadata(provinceId?: string) {
        const [attractions, priceCategories] = await Promise.all([
            this.getAllAttractions(provinceId ? { provinceId } : undefined),
            this.getAllPriceCategories(),
        ]);

        return {
            attractions,
            priceCategories,
        };
    }

    private handleError(error: any): Error {
        if (error instanceof Error) {
            return error;
        }
        return new Error("Đã xảy ra lỗi khi xử lý tour");
    }

    async getTours(params: { categories?: string[]; search?: string }) {
        const { categories, search } = params;

        // Build where clause
        const where: any = {};

        if (categories && categories.length > 0) {
            where.OR = categories.map((category) => ({
                categories: {
                    has: category,
                },
            }));
        }

        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { about: { contains: search, mode: "insensitive" } },
            ];
        }

        const total = await this.prisma.tour.count({ where });

        let tours = await this.prisma.tour.findMany({
            where,
            select: {
                tourId: true,
                name: true,
                images: true,
                about: true,
                createdAt: true,
                isActive: true,
                categories: true,
                _count: {
                    select: {
                        tourReviews: true,
                    },
                },
                ticketTypes: {
                    select: {
                        _count: {
                            select: {
                                bookings: true,
                            },
                        },
                        ticketPrices: {
                            orderBy: {
                                price: "asc",
                            },
                            take: 1,
                        },
                    },
                },
                tourReviews: {
                    select: {
                        rate: true,
                    },
                },
            },
        });

        const processedTours = tours.map((tour) => {
            // Tính tổng số booking
            const totalBookings = tour.ticketTypes.reduce((sum, tt) => sum + tt._count.bookings, 0);

            // Tính điểm trung bình
            const avgRating =
                tour.tourReviews.length > 0
                    ? tour.tourReviews.reduce((sum, r) => sum + r.rate, 0) / tour.tourReviews.length
                    : 0;

            // Lấy giá thấp nhất hiện tại
            const currentPrices = tour.ticketTypes
                .flatMap((t) => t.ticketPrices)
                .map((p) => p?.price || 0)
                .filter((p) => p > 0);

            const minPrice = currentPrices.length > 0 ? Math.min(...currentPrices) : 0;

            return {
                tourId: tour.tourId,
                name: tour.name,
                images: tour.images,
                about: tour.about,
                categories: tour.categories,
                createdAt: tour.createdAt,
                isActive: tour.isActive,
                avgRating,
                totalBookings,
                minPrice,
                reviewCount: tour._count.tourReviews,
            };
        });

        return {
            tours: processedTours,
            total,
        };
    }
}
