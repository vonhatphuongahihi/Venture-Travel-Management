import { Request, Response } from "express";
import { TourService } from "@/services/tourService";
import { PrismaClient } from "@prisma/client";
import { CreateTourRequest } from "@/types/tour";

const prisma = new PrismaClient();
const tourService = new TourService(prisma, process.env.MAPBOX_ACCESS_TOKEN);

export class TourController {
    async createTour(req: Request, res: Response) {
        try {
            const tourData: CreateTourRequest = req.body;

            // Validate required fields
            if (!tourData.name) {
                return res.status(400).json({
                    success: false,
                    message: "Thiếu thông tin bắt buộc",
                });
            }

            const tour = await tourService.createTour(tourData);

            console.log("Tạo tour thành công");

            return res.status(201).json({
                success: true,
                message: "Tạo tour thành công",
                data: tour,
            });
        } catch (error) {
            console.error("Error creating tour:", error);
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Lỗi tạo tour",
            });
        }
    }

    async getTourFormMetadata(req: Request, res: Response) {
        try {
            const { provinceId } = req.query;

            const metadata = await tourService.getTourFormMetadata(provinceId as string);

            return res.status(200).json({
                success: true,
                data: metadata,
            });
        } catch (error) {
            console.error("Error getting tour form metadata:", error);
            return res.status(500).json({
                success: false,
                message: "Lỗi khi lấy metadata",
            });
        }
    }

    async getTours(req: Request, res: Response) {
        try {
            const { categories, search } = req.query;

            let categoriesArray: string[] = [];
            if (categories) {
                if (typeof categories === "string") {
                    try {
                        // Thử parse JSON array
                        if (categories.startsWith("[") && categories.endsWith("]")) {
                            categoriesArray = JSON.parse(categories);
                        } else {
                            // Hoặc xử lý comma-separated string
                            categoriesArray = categories
                                .split(",")
                                .map((item) => item.trim())
                                .filter((item) => item.length > 0);
                        }
                    } catch (error) {
                        console.warn("Failed to parse categories:", error);
                        categoriesArray = [];
                    }
                } else if (Array.isArray(categories)) {
                    categoriesArray = categories.filter((item) => typeof item === "string");
                }
            }
            const result = await tourService.getTours({
                categories: categoriesArray,
                search: search as string,
            });
            return res.json({
                success: true,
                data: result,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: "Lỗi khi lấy tour",
            });
        }
    }
}
