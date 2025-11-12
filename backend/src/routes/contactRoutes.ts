import ContactController from "@/controllers/contactController";
import { contactMessageSchema, validateRequest } from "@/middleware/validation";
import { Router } from "express";

const router = Router();

router.post(
  "/",
  validateRequest(contactMessageSchema),
  ContactController.sendMessage
);

export default router;
