import { Router } from "express";
import {
  createEmployee,
  getAllEmployees, // Get all employees (without filter)
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getEmployeesByCafe, // Get employees filtered by cafe
} from "../controllers/employeeController";

const router: Router = Router();

// POST - Create a new employee
router.post("/", createEmployee);

// GET - Get all employees filtered by cafe (with ?cafe=<cafeId> query param)
router.get("/", getEmployeesByCafe); // If `cafeId` is present, it filters by café; otherwise, it returns all employees

// GET - Get all employees without any filter
router.get("/", getAllEmployees);

// GET - Get a specific employee by ID
router.get("/:id", getEmployeeById);

// PUT - Update a specific employee by ID
router.put("/:id", updateEmployee);

// DELETE - Delete a specific employee by ID
router.delete("/:id", deleteEmployee);

export default router;
