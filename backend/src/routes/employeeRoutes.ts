import { Router } from "express";
import {
  createEmployee,
  getAllEmployees, // Corrected import name
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getEmployeesByCafe, // Import the function that filters by cafe
} from "../controllers/employeeController";

const router: Router = Router();

// Define routes for employees
router.post("/", createEmployee); // Create a new employee
router.get("/", getEmployeesByCafe); // Get all employees or filter by cafe
router.get("/all", getAllEmployees); // Get all employees (without filter)
router.get("/:id", getEmployeeById); // Get a specific employee by ID
router.put("/:id", updateEmployee); // Update a specific employee by ID
router.delete("/:id", deleteEmployee); // Delete a specific employee by ID

export default router;
