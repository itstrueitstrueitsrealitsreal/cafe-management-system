import { Request, Response } from "express";
import Employee from "../models/employee";

// Create a new employee
export const createEmployee = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id, name, email_address, phone_number, gender, cafe, start_date } =
      req.body;
    const newEmployee = new Employee({
      id,
      name,
      email_address,
      phone_number,
      gender,
      cafe,
      start_date,
    });

    const employee = await newEmployee.save();
    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Get all employees
export const getEmployees = async (
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
    const employee = await Employee.findById(req.params.id).populate("cafe");
    if (!employee) {
      res.status(404).json({ message: "Employee not found" });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Update an employee
export const updateEmployee = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedEmployee) {
      res.status(404).json({ message: "Employee not found" });
    }
    res.json(updatedEmployee);
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
