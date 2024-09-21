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
router.post("/", createCafe); // Create a new cafe
router.get("/", getCafesByLocation); // Get all cafes or filter by location if provided
router.get("/:id", getCafeById); // Get a specific cafe by ID
router.put("/:id", updateCafe); // Update a specific cafe by ID
router.delete("/:id", deleteCafe); // Delete a specific cafe by ID

export default router;
