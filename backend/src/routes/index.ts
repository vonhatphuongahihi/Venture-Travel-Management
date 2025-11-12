
import { Router } from "express";
import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";
import contactRoutes from "./contactRoutes";
import adminRoutes from './adminRoutes';

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/contact", contactRoutes);
router.use('/admin', adminRoutes);


router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
  });
});

export default router;
