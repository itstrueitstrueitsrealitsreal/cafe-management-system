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

    // If a cafe is provided, ensure that the employee is not already assigned to another cafe
    if (cafeId) {
      const employeeWithCafe = await Employee.findOne({
        id,
        cafe: { $ne: cafeId },
      });
      if (employeeWithCafe) {
        res
          .status(400)
          .json({ message: "Employee is already assigned to another cafe" });
        return;
      }
    }

    // Create the new employee
    const newEmployee = new Employee({
      id,
      name,
      email_address,
      phone_number,
      gender,
      cafe: cafeId ? new mongoose.Types.ObjectId(cafeId) : null, // Assign cafe's ObjectId if provided
      start_date,
    });

    const employee = await newEmployee.save();
    const { _id, __v, ...employeeWithoutIdAndVersion } = employee.toObject();

    res.status(201).json(employeeWithoutIdAndVersion);
    return;
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
    return;
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
    const { cafeId, ...updateData } = req.body;

    // Find the employee by ID
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      res.status(404).json({ message: "Employee not found" });
    }

    // Ensure 'id' field is not modified
    if (updateData.id) {
      res.status(400).json({ message: "Employee ID cannot be updated" });
    }

    // If a cafe is provided, ensure that the employee is not already assigned to another cafe
    if (cafeId) {
      const cafe = await Cafe.findById(cafeId);
      if (!cafe) {
        res.status(404).json({ message: "Cafe not found" });
      }

      // Ensure the employee is not already assigned to another cafe
      const employeeInAnotherCafe = employee
        ? await Employee.findOne({
            cafe: cafeId,
            _id: { $ne: employee._id },
          })
        : null;
      if (employeeInAnotherCafe) {
        res.status(400).json({
          message: "This employee is already assigned to another cafe",
        });
      }

      // Update cafe association
      if (employee && cafe) {
        employee.cafe = cafe._id as mongoose.Types.ObjectId;
      }
    }

    // Update the rest of the fields (excluding 'id')
    if (employee) {
      Object.assign(employee, updateData);
    }

    if (employee) {
      await employee.save();
    }
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Delete an employee
export const deleteEmployee = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) {
      res.status(404).json({ message: "Employee not found" });
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
        cafe: cafeName || "", // Return the cafe name or empty string
      };
    });

    // Sort employees by days worked in descending order
    employeesWithDaysWorked.sort((a, b) => b.days_worked - a.days_worked);

    res.json(employeesWithDaysWorked);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};
