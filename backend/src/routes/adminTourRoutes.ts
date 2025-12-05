import express from "express"
import { TourController } from "@/controllers/adminTourController";

const router = express.Router()
const tourController = new TourController();

router.post('/', tourController.createTour.bind(tourController));
router.get('/metadata', tourController.getTourFormMetadata.bind(tourController)); 

export default router;