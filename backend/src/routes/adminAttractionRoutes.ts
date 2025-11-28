import { Router } from "express";
import { AdminAttractionController } from "../controllers/adminAttraction.controller";
import { uploadMultiple } from "@/middleware/upload";

const router = Router();

// GET LIST
router.get("/", AdminAttractionController.getAttractions);

// GET PROVINCES inside attraction module
router.get("/provinces", AdminAttractionController.getProvinces);

// GET DETAIL
router.get("/:id", AdminAttractionController.getAttractionById);

// CREATE
router.post("/",uploadMultiple("images", 10), AdminAttractionController.createAttraction);

// UPDATE
router.put("/:id", AdminAttractionController.updateAttraction);

// DELETE
router.delete("/:id", AdminAttractionController.deleteAttraction);

export default router;
