import express from "express";
import { TourController } from "@/controllers/adminTourController";
import { uploadMultiple } from "@/middleware/upload";
import { UploadController } from "@/controllers/uploadController";

const router = express.Router();
const tourController = new TourController();

router
    .post("/", tourController.createTour.bind(tourController))
    .get("/", tourController.getTours.bind(tourController));
router.get("/metadata", tourController.getTourFormMetadata.bind(tourController));
router.post("/images", uploadMultiple("images", 10), UploadController.uploadTourImages);
export default router;
