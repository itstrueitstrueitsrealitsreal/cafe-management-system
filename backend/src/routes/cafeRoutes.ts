import { Router } from "express";
import {
  createCafe,
  getCafesByLocation,
  updateCafe,
  deleteCafe,
} from "../controllers/cafeController";

const router: Router = Router();

router.post("/", createCafe);
router.get("/", getCafesByLocation);
router.put("/:id", updateCafe);
router.delete("/:id", deleteCafe);

export default router;
