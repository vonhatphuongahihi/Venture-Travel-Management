import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class RouteController {
    static async getRoute(req: Request, res: Response): Promise<void> {
        try {
            const { tourId } = req.params;

            if (!tourId) {
                res.status(400).json({
                    success: false,
                    message: 'Tour ID is required'
                });
                return;
            }

            const tour = await prisma.tour.findUnique({
                where: { tourId },
                include: {
                    tourStops: {
                        include: {
                            attraction: {
                                include: {
                                    point: true
                                }
                            }
                        },
                        orderBy: {
                            stopOrder: 'asc'
                        }
                    },
                    pickup: true,
                    end: true
                }
            });

            if (!tour) {
                res.status(404).json({
                    success: false,
                    message: 'Tour not found'
                });
                return;
            }

            const routePoints: any[] = [];

            if (tour.pickup) {
                routePoints.push({
                    pointId: tour.pickup.pointId,
                    latitude: tour.pickup.latitude,
                    longitude: tour.pickup.longitude,
                    type: 'pickup'
                });
            }

            tour.tourStops.forEach(stop => {
                if (stop.attraction?.point) {
                    routePoints.push({
                        pointId: stop.attraction.point.pointId,
                        latitude: stop.attraction.point.latitude,
                        longitude: stop.attraction.point.longitude,
                        type: 'stop',
                        stopOrder: stop.stopOrder,
                        attractionName: stop.attraction.name
                    });
                }
            });

            if (tour.end) {
                routePoints.push({
                    pointId: tour.end.pointId,
                    latitude: tour.end.latitude,
                    longitude: tour.end.longitude,
                    type: 'end'
                });
            }

            const routeSegments: any[] = [];

            for (let i = 0; i < routePoints.length - 1; i++) {
                const startPoint = routePoints[i];
                const endPoint = routePoints[i + 1];

                const [startNode, endNode] = await Promise.all([
                    prisma.node.findUnique({
                        where: { pointId: startPoint.pointId }
                    }),
                    prisma.node.findUnique({
                        where: { pointId: endPoint.pointId }
                    })
                ]);

                if (startNode && endNode) {
                    const arc = await prisma.arc.findFirst({
                        where: {
                            startNodeId: startNode.nodeId,
                            endNodeId: endNode.nodeId
                        },
                        include: {
                            arcPoints: {
                                include: {
                                    point: true
                                },
                                orderBy: {
                                    sequence: 'asc'
                                }
                            }
                        }
                    });

                    if (arc && arc.arcPoints.length > 0) {
                        const segmentCoordinates = [
                            { longitude: startPoint.longitude, latitude: startPoint.latitude },
                            ...arc.arcPoints.map(ap => ({
                                longitude: ap.point.longitude,
                                latitude: ap.point.latitude
                            })),
                            { longitude: endPoint.longitude, latitude: endPoint.latitude }
                        ];

                        routeSegments.push({
                            from: startPoint,
                            to: endPoint,
                            coordinates: segmentCoordinates,
                            hasDetailedRoute: true
                        });
                    }
                }
            }

            const fullRoute: any[] = [];
            routeSegments.forEach((segment, index) => {
                if (index === 0) {
                    fullRoute.push(...segment.coordinates);
                } else {
                    fullRoute.push(...segment.coordinates.slice(1));
                }
            });

            res.status(200).json({
                success: true,
                data: {
                    tourId: tour.tourId,
                    tourName: tour.name,
                    routePoints,
                    routeSegments,
                    fullRoute,
                    totalPoints: fullRoute.length
                }
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to get route'
            });
        }
    }

    static async getRouteBetweenPoints(req: Request, res: Response): Promise<void> {
        try {
            const { startPointId, endPointId } = req.query;

            if (!startPointId || !endPointId) {
                res.status(400).json({
                    success: false,
                    message: 'Start and end point IDs are required'
                });
                return;
            }

            const [startNode, endNode] = await Promise.all([
                prisma.node.findUnique({
                    where: { pointId: startPointId as string },
                    include: { point: true }
                }),
                prisma.node.findUnique({
                    where: { pointId: endPointId as string },
                    include: { point: true }
                })
            ]);

            if (!startNode || !endNode) {
                res.status(404).json({
                    success: false,
                    message: 'Nodes not found for given points'
                });
                return;
            }

            const arc = await prisma.arc.findFirst({
                where: {
                    startNodeId: startNode.nodeId,
                    endNodeId: endNode.nodeId
                },
                include: {
                    arcPoints: {
                        include: {
                            point: true
                        },
                        orderBy: {
                            sequence: 'asc'
                        }
                    }
                }
            });

            if (!arc) {
                res.status(200).json({
                    success: true,
                    data: {
                        hasDetailedRoute: false,
                        coordinates: [
                            { longitude: startNode.point.longitude, latitude: startNode.point.latitude },
                            { longitude: endNode.point.longitude, latitude: endNode.point.latitude }
                        ]
                    }
                });
                return;
            }

            const coordinates = arc.arcPoints.map(ap => ({
                longitude: ap.point.longitude,
                latitude: ap.point.latitude
            }));

            res.status(200).json({
                success: true,
                data: {
                    arcId: arc.arcId,
                    hasDetailedRoute: true,
                    coordinates,
                    totalPoints: coordinates.length
                }
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to get route'
            });
        }
    }
}

