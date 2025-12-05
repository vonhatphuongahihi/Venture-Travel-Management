import { Request, Response } from "express";
import { ResponseUtils } from "@/utils";
import { AttractionService } from "@/services/attractionService";

export class AttractionController {
  // Get all attractions with optional filters
  static async getAttractions(req: Request, res: Response): Promise<void> {
    try {
      const {
        page = "1",
        limit = "10",
        provinceId,
        category,
        sortBy = "createdAt",
        order = "desc",
      } = req.query;

      const result = await AttractionService.getAttractions({
        page: Number(page),
        limit: Number(limit),
        provinceId: provinceId as string,
        category: category as string,
        sortBy: sortBy as string,
        order: order as "asc" | "desc",
      });

      res
        .status(200)
        .json(
          ResponseUtils.success("Lấy danh sách điểm đến thành công", result)
        );
    } catch (error) {
      console.error("🔴 [AttractionController] Get attractions error:", error);
      res
        .status(500)
        .json(
          ResponseUtils.error(
            "Không thể lấy danh sách điểm đến",
            error instanceof Error ? error.message : "Lỗi không xác định"
          )
        );
    }
  }

  // Get top destinations (attractions with most tours)
  static async getTopDestinations(req: Request, res: Response): Promise<void> {
    try {
      const { limit = "5" } = req.query;
      const limitNum = Number(limit);

      const destinations = await AttractionService.getTopDestinations(limitNum);

      res.status(200).json(
        ResponseUtils.success("Lấy top điểm đến thành công", {
          destinations,
        })
      );
    } catch (error) {
      console.error(
        "🔴 [AttractionController] Get top destinations error:",
        error
      );
      res
        .status(500)
        .json(
          ResponseUtils.error(
            "Không thể lấy top điểm đến",
            error instanceof Error ? error.message : "Lỗi không xác định"
          )
        );
    }
  }

  // Get attraction by ID
  static async getAttractionById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      console.log("Attraction ID:", id);

      const attraction = await AttractionService.getAttractionById(
        id.toUpperCase()
      );

      if (!attraction) {
        res.status(404).json(ResponseUtils.error("Không tìm thấy điểm đến"));
        return;
      }

      res
        .status(200)
        .json(
          ResponseUtils.success("Lấy thông tin điểm đến thành công", attraction)
        );
    } catch (error) {
      console.error(
        "🔴 [AttractionController] Get attraction by ID error:",
        error
      );
      res
        .status(500)
        .json(
          ResponseUtils.error(
            "Không thể lấy thông tin điểm đến",
            error instanceof Error ? error.message : "Lỗi không xác định"
          )
        );
    }
  }
}
