import { Request, Response } from "express";
import Cafe from "../models/cafe";
import Employee from "../models/employee";
import cafe from "../models/cafe";
import { v4 as uuidv4 } from "uuid";

export const createCafe = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    let { id, name, description, location } = req.body;

    if (!id) {
      id = uuidv4();
    }

    const newCafe = new Cafe({
      id,
      name,
      description,
      location,
    });

    const cafe = await newCafe.save();

    const { _id, __v, ...cafeData } = cafe.toObject();
    const response = { ...cafeData, uuid: _id };

    res.status(201).json(response);
  } catch (error) {
    if ((error as any).code === 11000) {
      const duplicateKey = Object.keys((error as any).keyValue)[0];
      const duplicateValue = (error as any).keyValue[duplicateKey];
      res.status(400).json({
        message: `A cafe with this ${duplicateKey} (${duplicateValue}) already exists. Please use a different unique identifier.`,
      });
    } else {
      res.status(500).json({ error: (error as Error).message });
    }
  }
};

export const updateCafe = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const updatedCafe = await Cafe.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );

    if (!updatedCafe) {
      res.status(404).json({ message: "Cafe not found" });
      return;
    }

    const { _id, __v, ...cafeWithoutVersion } = updatedCafe.toObject();

    res.status(200).json(cafeWithoutVersion);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const deleteCafe = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const cafe = await Cafe.findOne({ id: req.params.id });

    if (!cafe) {
      res.status(404).json({ message: "Cafe not found" });
      return;
    }

    await Employee.deleteMany({ cafe: cafe.id });
    await Cafe.findOneAndDelete({ id: req.params.id });

    res
      .status(200)
      .json({ message: "Cafe and its employees deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getCafeById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const cafe = await Cafe.findOne({ id: req.params.id as string }).lean();

    if (!cafe) {
      res.status(404).json({ message: "Cafe not found" });
      return;
    }

    const employeesCount = await Employee.countDocuments({ cafe: cafe.id });

    const cafeWithEmployees = {
      ...cafe,
      employees: employeesCount,
    };

    res.json(cafeWithEmployees);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getCafesByLocation = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const location = req.query.location as string | undefined;

    let cafes;
    if (location) {
      cafes = await Cafe.find({ location });
      if (!cafes) {
        res.status(200).json([]);
        return;
      }
    } else {
      cafes = await Cafe.find({});
    }

    const cafesWithEmployeeCount = await Promise.all(
      cafes.map(async (cafe) => {
        const employeeCount = await Employee.countDocuments({ cafe: cafe.id });
        return {
          name: cafe.name,
          description: cafe.description,
          employees: employeeCount,
          location: cafe.location,
          id: cafe.id,
        };
      })
    );

    cafesWithEmployeeCount.sort((a, b) => b.employees - a.employees);
    res.json(cafesWithEmployeeCount);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};
