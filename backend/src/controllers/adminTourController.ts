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
}
