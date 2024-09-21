import { Request, Response } from "express";
import Employee from "../models/employee";
import Cafe, { ICafe } from "../models/cafe";
import mongoose, { PopulatedDoc } from "mongoose";

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

// GET /employees?cafe=<cafe>
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
        return;
      }

      employees = await Employee.find({ cafe: cafe._id }).populate("cafe");
    } else {
      employees = await Employee.find({}).populate("cafe");
    }

    const currentDate = new Date();
    const employeesWithDaysWorked = employees.map((employee) => {
      const daysWorked = Math.floor(
        (currentDate.getTime() - employee.start_date.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      let cafeName = "";
      if (
        employee.cafe &&
        typeof employee.cafe === "object" &&
        "name" in employee.cafe
      ) {
        const populatedCafe = employee.cafe as unknown as ICafe &
          mongoose.Document;
        cafeName = populatedCafe.name; // Access name safely
      }

      return {
        id: employee.id,
        name: employee.name,
        email_address: employee.email_address,
        phone_number: employee.phone_number,
        days_worked: daysWorked,
        cafe: cafeName || "", // Return the cafe name or empty string
      };
    });

    employeesWithDaysWorked.sort((a, b) => b.days_worked - a.days_worked);

    res.json(employeesWithDaysWorked);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};
