import { Router } from "express";
import {
  getAllEmployees,
  createEmployee,
} from "../controllers/employeeController";

const router: Router = Router();

router.get("/", getAllEmployees);
router.post("/", createEmployee);

export default router;
