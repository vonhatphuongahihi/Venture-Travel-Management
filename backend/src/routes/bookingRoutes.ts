import express from "express";
import * as bookingController from "../controllers/bookingController";
import { authenticateToken } from "@/middleware/auth";

const router = express.Router();

router.get("/", bookingController.getBookings);
router.get("/user/bookings", authenticateToken, bookingController.getUserBookings);
router.get("/:id", bookingController.getBooking);
router.post("/", bookingController.createBooking);
router.patch("/:id", bookingController.updateBooking);
router.patch("/:id/cancel", authenticateToken, bookingController.cancelBooking);
router.delete("/:id", bookingController.deleteBooking);
router.get("/tours", bookingController.getTours);

export default router;
