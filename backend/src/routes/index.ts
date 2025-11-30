
import { Router } from "express";
import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";
import contactRoutes from "./contactRoutes";
import adminRoutes from './adminRoutes';
import provinceRoutes from "./provinceRoutes";
import reviewRoutes from "./reviewRoutes";
import tourRoutes from "./tourRoutes";
import attractionRoutes from "./attractionRoutes";
import uploadRoutes from "./uploadRoutes";
import adminAttractionRoutes from "./adminAttractionRoutes";
import adminTourRoutes from "./adminTourRoutes"
import bookingRoutes from "./bookingRoutes";

import routeRoutes from "./routeRoutes";


const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/contact", contactRoutes);
router.use('/admin', adminRoutes);
router.use('/provinces', provinceRoutes);
router.use('/reviews', reviewRoutes);
router.use('/tours', tourRoutes);
router.use('/attractions', attractionRoutes);
router.use('/upload', uploadRoutes);
router.use('/admin/attractions', adminAttractionRoutes);
router.use('/admin/tours', adminTourRoutes)
router.use("/bookings", bookingRoutes);

router.use('/routes', routeRoutes);



router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
  });
});

export default router;
