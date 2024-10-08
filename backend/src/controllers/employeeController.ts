import { Request, Response } from "express";
import Employee from "../models/employee";
import Cafe from "../models/cafe";
import mongoose from "mongoose";

const generateNewEmployeeId = async (): Promise<string> => {
  const lastEmployee = await Employee.findOne().sort({ id: -1 }).lean();
  if (!lastEmployee) {
    return "UI0000001";
  }
  const lastIdNumber = parseInt(lastEmployee.id.slice(2), 10);
  const newIdNumber = lastIdNumber + 1;
  const newId = `UI${newIdNumber.toString().padStart(7, "0")}`;
  return newId;
};

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
    const newId = await generateNewEmployeeId();
    const newEmployee = new Employee({
      id: newId,
      name,
      email_address,
      phone_number,
      gender,
      cafe: cafe.id,
      start_date: new Date(),
    });
    const employee = await newEmployee.save();
    const { _id, __v, ...employeeWithoutIdAndVersion } = employee.toObject();
    res.status(201).json(employeeWithoutIdAndVersion);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

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

export const getEmployeeById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const employee = await Employee.findOne({ id: req.params.id }).lean();
    if (!employee) {
      res.status(404).json({ message: "Employee not found" });
      return;
    }
    const cafe = await Cafe.findOne({ id: employee.cafe }).lean();
    if (!cafe) {
      res.status(404).json({ message: "Associated cafe not found" });
      return;
    }
    const employeeWithCafe = {
      ...employee,
      cafe,
    };
    res.json(employeeWithCafe);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

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
    if (updateData.id) {
      res.status(400).json({ message: "Employee ID cannot be updated" });
      return;
    }
    if (cafeId) {
      const cafe = await Cafe.findOne({ id: cafeId }).lean();
      if (!cafe) {
        res.status(404).json({ message: "Cafe not found" });
        return;
      }
      employee.cafe = cafe.id;
      employee.start_date = new Date();
    }
    Object.assign(employee, updateData);
    await employee.save();
    const { _id, __v, ...employeeWithoutIdAndVersion } = employee.toObject();
    res.status(200).json(employeeWithoutIdAndVersion);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

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

export const getEmployeesByCafe = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const cafeId = req.query.cafe as string;
    let employees;
    let cafeMap: { [key: string]: string } = {};
    if (cafeId) {
      employees = await Employee.find({ cafe: cafeId }).lean();
      if (!employees.length) {
        res.status(404).json({ message: "No employees found for the cafe" });
        return;
      }
      const cafe = await Cafe.findOne({ id: cafeId }).lean();
      if (!cafe) {
        res.status(404).json({ message: "Cafe not found" });
        return;
      }
      cafeMap[cafeId] = cafe.name;
    } else {
      employees = await Employee.find({}).lean();
      const cafeIds = employees.map((employee) => employee.cafe);
      const cafes = await Cafe.find({ id: { $in: cafeIds } }).lean();
      cafes.forEach((cafe) => {
        cafeMap[cafe.id] = cafe.name;
      });
    }
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
        cafe: cafeMap[employee.cafe],
      };
    });
    employeesWithDaysWorked.sort((a, b) => b.days_worked - a.days_worked);
    res.json(employeesWithDaysWorked);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};
