
import { Router } from "express";
import adminAttractionRoutes from "./adminAttractionRoutes";
import adminDashboardRoutes from "./adminDashboardRoutes";
import adminReportRoutes from './adminReportRoutes';
import adminRoutes from './adminRoutes';
import attractionRoutes from "./attractionRoutes";
import authRoutes from "./authRoutes";
import contactRoutes from "./contactRoutes";
import provinceRoutes from "./provinceRoutes";
import reviewRoutes from "./reviewRoutes";
import routeRoutes from "./routeRoutes";
import tourRoutes from "./tourRoutes";
import uploadRoutes from "./uploadRoutes";
import userRoutes from "./userRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/contact", contactRoutes);
router.use('/admin', adminRoutes);
router.use('/admin/dashboard', adminDashboardRoutes);
router.use('/provinces', provinceRoutes);
router.use('/reviews', reviewRoutes);
router.use('/tours', tourRoutes);
router.use('/attractions', attractionRoutes);
router.use('/upload', uploadRoutes);
router.use('/admin/attractions', adminAttractionRoutes);
router.use('/admin/reports', adminReportRoutes);
router.use('/routes', routeRoutes);


router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
  });
});

export default router;
