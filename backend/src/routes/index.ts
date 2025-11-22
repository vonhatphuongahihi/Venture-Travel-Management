
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


router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
  });
});

export default router;
