import { UserController } from "@/controllers/userController";
import { authenticateToken } from "@/middleware/auth";
import { uploadSingle } from "@/middleware/upload";
import {
  getUsersQuerySchema,
  updateProfileSchema,
  updateUserStatusSchema,
  toggleFavoriteTourSchema,
  changePasswordSchema,
  validateQuery,
  validateRequest,
} from "@/middleware/validation";
import { Router } from "express";

const router = Router();

router.get("/", validateQuery(getUsersQuerySchema), UserController.getUsers);
router.get("/statistics", UserController.getUserStatistics);
router.get("/profile", authenticateToken, UserController.getProfile);
router.put(
  "/profile",
  authenticateToken,
  validateRequest(updateProfileSchema),
  UserController.updateProfile
);
router.put(
  "/avatar",
  authenticateToken,
  uploadSingle("avatar"),
  UserController.updateAvatar
);
router.post(
  "/favorites/toggle",
  authenticateToken,
  validateRequest(toggleFavoriteTourSchema),
  UserController.toggleFavoriteTour
);
router.get("/favorites", authenticateToken, UserController.getFavoriteTours);
router.put(
  "/password",
  authenticateToken,
  validateRequest(changePasswordSchema),
  UserController.changePassword
);

router.patch(
  "/:id/status",
  validateRequest(updateUserStatusSchema),
  UserController.updateUserStatus
);
router.delete("/:id", authenticateToken, UserController.deleteUser);

export default router;
