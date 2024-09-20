import { Router } from "express";
import {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employeeController";

const router: Router = Router();

// Define routes for employees
router.post("/", createEmployee); // Create a new employee
router.get("/", getEmployees); // Get all employees
router.get("/:id", getEmployeeById); // Get a specific employee by ID
router.put("/:id", updateEmployee); // Update a specific employee by ID
router.delete("/:id", deleteEmployee); // Delete a specific employee by ID

export default router;
