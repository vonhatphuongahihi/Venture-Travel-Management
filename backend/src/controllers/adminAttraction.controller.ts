import { Request, Response } from "express";
import { AdminAttractionService } from "../services/adminAttraction.service";

export class AdminAttractionController {
  // 🟦 GET LIST
  static async getAttractions(req: Request, res: Response) {
    try {
      const data = await AdminAttractionService.getAttractions(req.query);
      return res.json({ success: true, message: "OK", data });
    } catch (err: any) {
      return res.status(400).json({ success: false, message: err.message });
    }
  }

  // 🟦 GET PROVINCES inside attraction module
  static async getProvinces(req: Request, res: Response) {
    try {
      const data = await AdminAttractionService.getProvinces();
      return res.json({ success: true, message: "OK", data });
    } catch (err: any) {
      return res.status(400).json({ success: false, message: err.message });
    }
  }

  // 🟩 GET DETAIL
  static async getAttractionById(req: Request, res: Response) {
    try {
      const data = await AdminAttractionService.getAttractionById(
        req.params.id
      );
      return res.json({ success: true, message: "OK", data });
    } catch (err: any) {
      return res.status(404).json({ success: false, message: err.message });
    }
  }

  // 🟧 CREATE
static async createAttraction(req: Request, res: Response) {
  try {
    const data = await AdminAttractionService.createAttraction(req); // ✔️ GỬI FULL REQ
    return res.json({
      success: true,
      message: "Attraction created",
      data,
    });
  } catch (err: any) {
    return res.status(400).json({ success: false, message: err.message });
  }
}


  // 🟨 UPDATE
  static async updateAttraction(req: Request, res: Response) {
    try {
      const data = await AdminAttractionService.updateAttraction(
        req.params.id,
        req.body
      );
      return res.json({
        success: true,
        message: "Attraction updated",
        data,
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, message: err.message });
    }
  }

  // 🟥 DELETE
  static async deleteAttraction(req: Request, res: Response) {
    try {
      await AdminAttractionService.deleteAttraction(req.params.id);
      return res.json({
        success: true,
        message: "Attraction deleted",
        data: null,
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, message: err.message });
    }
  }
}
