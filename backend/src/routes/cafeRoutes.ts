import { Router } from "express";
import {
  createCafe,
  getCafesByLocation,
  updateCafe,
  deleteCafe,
  getCafeById,
} from "../controllers/cafeController";

const router: Router = Router();

router.post("/", createCafe);
router.get("/", getCafesByLocation);
router.get("/:id", getCafeById);
router.put("/:id", updateCafe);
router.delete("/:id", deleteCafe);

export default router;
