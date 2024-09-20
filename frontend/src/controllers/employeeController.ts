import { Request, Response } from "express";
import Employee from "../models/employee";

export const getAllEmployees = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createEmployee = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const newEmployee = new Employee(_req.body);
    await newEmployee.save();
    res.json(newEmployee);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
