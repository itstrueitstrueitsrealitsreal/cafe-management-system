import { Router } from "express";
import {
  createCafe,
  getCafesByLocation, // Replace getCafes with getCafesByLocation
  getCafeById,
  updateCafe,
  deleteCafe,
} from "../controllers/cafeController";

const router: Router = Router();

// Define routes for cafes
router.post("/", createCafe);
router.get("/", getCafesByLocation);
router.get("/:id", getCafeById);
router.put("/:id", updateCafe);
router.delete("/:id", deleteCafe);

export default router;
