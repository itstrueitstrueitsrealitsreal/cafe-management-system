import { Request, Response } from "express";
import Employee from "../models/employee";
import Cafe, { ICafe } from "../models/cafe";
import mongoose from "mongoose";

// Create a new employee and ensure no employee can work in two cafes
export const createEmployee = async (
  req: Request,
  res: Response<any>
): Promise<void> => {
  try {
    const {
      id,
      name,
      email_address,
      phone_number,
      gender,
      cafeId,
      start_date,
    } = req.body;

    // Check if an employee with this ID already exists
    const existingEmployee = await Employee.findOne({ id });
    if (existingEmployee) {
      res.status(400).json({ message: "Employee with this ID already exists" });
      return;
    }

    // Create the new employee
    const newEmployee = new Employee({
      id,
      name,
      email_address,
      phone_number,
      gender,
      cafe: cafeId ? new mongoose.Types.ObjectId(cafeId) : null,
      start_date,
    });

    const employee = await newEmployee.save();
    const { _id, __v, ...employeeWithoutIdAndVersion } = employee.toObject();

    res.status(201).json(employeeWithoutIdAndVersion);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Get all employees
export const getAllEmployees = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const employees = await Employee.find().populate("cafe");
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Get a single employee by ID
export const getEmployeeById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const employee = await Employee.findOne({ id: req.params.id }).populate(
      "cafe"
    );

    if (!employee) {
      res.status(404).json({ message: "Employee not found" });
      return;
    }

    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Update an employee and handle the relationship with cafe
export const updateEmployee = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cafeId }: { cafeId: string | null } = req.body;
    const updateData = req.body;

    // Find the employee by custom 'id' field (not MongoDB '_id')
    const employee = await Employee.findOne({ id: req.params.id });
    if (!employee) {
      res.status(404).json({ message: "Employee not found" });
      return;
    }

    // Ensure 'id' field is not modified
    if (updateData.id) {
      res.status(400).json({ message: "Employee ID cannot be updated" });
      return;
    }

    // Handle cafe reassignment or unassignment
    if (cafeId === null) {
      res.status(400).json({
        message:
          "To remove the employee from the current cafe, please assign a new cafe or use the DELETE endpoint to delete the employee from the database.",
      });
      return;
    } else if (typeof cafeId === "string") {
      // Check if the provided cafe exists
      const cafe = await Cafe.findById(cafeId);
      if (!cafe) {
        res.status(404).json({ message: "Cafe not found" });
        return;
      }

      // If the cafe exists, reassign the employee
      if (!employee.cafe || !employee.cafe.equals(cafe._id)) {
        employee.cafe = cafe._id as mongoose.Types.ObjectId;
        employee.start_date = new Date(); // Reset start date when reassigning to a new cafe
      }
    } else {
      res.status(400).json({ message: "Invalid cafeId" });
      return;
    }

    // Update the rest of the fields (excluding 'id')
    Object.assign(employee, updateData);

    await employee.save();
    const { _id, __v, ...employeeWithoutIdAndVersion } = employee.toObject();
    res.status(200).json(employeeWithoutIdAndVersion);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Delete an employee
// Delete an employee by custom 'id' field (not MongoDB '_id')
export const deleteEmployee = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Find the employee by custom 'id' field and delete it
    const deletedEmployee = await Employee.findOneAndDelete({
      id: req.params.id,
    });

    if (!deletedEmployee) {
      res.status(404).json({ message: "Employee not found" });
      return;
    }

    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// GET /employees?cafe=<cafe> - Get all employees for a given cafe or all employees
export const getEmployeesByCafe = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const cafeId = req.query.cafe as string | undefined;
    let employees;

    if (cafeId) {
      const cafe = await Cafe.findById(cafeId);
      if (!cafe) {
        res.status(404).json({ message: "Cafe not found" });
      }

      employees = await Employee.find({ cafe: cafe?._id }).populate("cafe");
    } else {
      employees = await Employee.find({}).populate("cafe");
    }

    // Calculate the number of days worked for each employee
    const currentDate = new Date();
    const employeesWithDaysWorked = employees.map((employee) => {
      const daysWorked = Math.floor(
        (currentDate.getTime() - employee.start_date.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      const cafeName =
        employee.cafe &&
        typeof employee.cafe === "object" &&
        "name" in employee.cafe
          ? (employee.cafe as unknown as ICafe).name
          : "";

      return {
        id: employee.id,
        name: employee.name,
        email_address: employee.email_address,
        phone_number: employee.phone_number,
        days_worked: daysWorked,
        cafe: cafeName || "",
      };
    });

    // Sort employees by days worked in descending order
    employeesWithDaysWorked.sort((a, b) => b.days_worked - a.days_worked);

    res.json(employeesWithDaysWorked);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};
