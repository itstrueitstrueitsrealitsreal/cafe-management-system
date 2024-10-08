import { Request, Response } from "express";
import Employee from "../models/employee";
import Cafe, { ICafe } from "../models/cafe";
import mongoose from "mongoose";

// Helper function to generate a new employee ID
const generateNewEmployeeId = async (): Promise<string> => {
  const lastEmployee = await Employee.findOne().sort({ id: -1 }).lean();

  if (!lastEmployee) {
    // If no employees exist, start from 'UI0000001'
    return "UI0000001";
  }

  // Extract the numeric part of the last employee's ID
  const lastIdNumber = parseInt(lastEmployee.id.slice(2), 10);

  // Increment the ID number
  const newIdNumber = lastIdNumber + 1;

  // Pad the new number with leading zeros to maintain the format 'UIXXXXXXX'
  const newId = `UI${newIdNumber.toString().padStart(7, "0")}`;

  return newId;
};

// Create a new employee
export const createEmployee = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email_address, phone_number, gender, cafeId } = req.body;
    const cafe = await Cafe.findOne({ id: cafeId });
    if (!cafe) {
      throw new Error("Cafe not found");
    }

    // Generate a new employee ID (auto-increment)
    const newId = await generateNewEmployeeId();

    // Create new employee
    const newEmployee = new Employee({
      id: newId, // Use the generated ID
      name,
      email_address,
      phone_number,
      gender,
      cafe: cafe.id,
      start_date: new Date(), // Use today's date
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

// Get a single employee by custom ID
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

// Update an employee by custom ID
export const updateEmployee = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cafeId }: { cafeId: string | null } = req.body;
    const updateData = req.body;

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

    // Handle cafe reassignment
    if (cafeId) {
      const cafe = await Cafe.findOne({ id: cafeId }).lean();
      if (!cafe) {
        res.status(404).json({ message: "Cafe not found" });
        return;
      }
      employee.cafe = cafe.id;
      employee.start_date = new Date();
    }

    // Update the rest of the fields
    Object.assign(employee, updateData);

    await employee.save();
    const { _id, __v, ...employeeWithoutIdAndVersion } = employee.toObject();
    res.status(200).json(employeeWithoutIdAndVersion);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Delete an employee by custom ID
export const deleteEmployee = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
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

// GET /employees?cafe=<cafeId>
export const getEmployeesByCafe = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const cafeId = req.query.cafe as string;
    let employees;
    let cafeMap: { [key: string]: string } = {}; // Map to store cafeId and cafeName

    if (cafeId) {
      // Find employees for the specific cafe using the custom cafe id
      employees = await Employee.find({ cafe: cafeId }).lean();
      if (!employees.length) {
        res.status(404).json({ message: "No employees found for the cafe" });
        return;
      }

      // Find the cafe by custom id to get its name
      const cafe = await Cafe.findOne({ id: cafeId }).lean();
      if (!cafe) {
        res.status(404).json({ message: "Cafe not found" });
        return;
      }
      // Add the cafe name to the map
      cafeMap[cafeId] = cafe.name;
    } else {
      // Get all employees if no cafeId is provided
      employees = await Employee.find({}).lean();

      // Find all unique cafes from employees
      const cafeIds = employees.map((employee) => employee.cafe);
      const cafes = await Cafe.find({ id: { $in: cafeIds } }).lean();

      // Create a map of cafeId to cafeName
      cafes.forEach((cafe) => {
        cafeMap[cafe.id] = cafe.name;
      });
    }

    // Calculate the number of days worked for each employee and attach cafe name
    const currentDate = new Date();
    const employeesWithDaysWorked = employees.map((employee) => {
      const daysWorked = Math.floor(
        (currentDate.getTime() - new Date(employee.start_date).getTime()) /
          (1000 * 60 * 60 * 24)
      );

      return {
        id: employee.id,
        name: employee.name,
        email_address: employee.email_address,
        phone_number: employee.phone_number,
        days_worked: daysWorked,
        cafe: cafeMap[employee.cafe], // Return cafe name
      };
    });

    // Sort employees by days worked in descending order
    employeesWithDaysWorked.sort((a, b) => b.days_worked - a.days_worked);

    res.json(employeesWithDaysWorked);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};
