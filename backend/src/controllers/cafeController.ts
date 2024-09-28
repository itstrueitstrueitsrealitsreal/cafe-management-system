import { Request, Response } from "express";
import Cafe from "../models/cafe";
import Employee from "../models/employee";

// Create a new cafe
export const createCafe = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id, name, description, location, logo } = req.body;
    const newCafe = new Cafe({
      id,
      name,
      description,
      location,
      logo,
    });

    const cafe = await newCafe.save();
    res.status(201).json(cafe);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Get all cafes
export const getCafes = async (req: Request, res: Response): Promise<void> => {
  try {
    const cafes = await Cafe.find();
    res.json(cafes);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Get a cafe by ID
export const getCafeById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const cafe = await Cafe.findById(req.params.id);
    if (!cafe) {
      res.status(404).json({ message: "Cafe not found" });
    } else {
      res.json(cafe);
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Update a cafe
export const updateCafe = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const updatedCafe = await Cafe.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updatedCafe) {
      res.status(404).json({ message: "Cafe not found" });
      return;
    }

    // Destructure to remove the __v field and rename _id to uuid
    const { __v, _id, ...cafeWithoutVersion } = updatedCafe.toObject();
    const response = { uuid: _id, ...cafeWithoutVersion };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Delete a cafe by 'id' field and remove all employees associated with it
export const deleteCafe = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const cafe = await Cafe.findById(req.params.id);

    if (!cafe) {
      res.status(404).json({ message: "Cafe not found" });
      return;
    }

    await Employee.deleteMany({ cafe: cafe._id });

    await Cafe.findByIdAndDelete(req.params.id);

    res
      .status(200)
      .json({ message: "Cafe and its employees deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// GET /cafes?location=<location>
export const getCafesByLocation = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const location = req.query.location as string | undefined;

    let cafes;

    if (location) {
      // Filter cafes by location if provided
      cafes = await Cafe.find({ location });
    } else {
      // Get all cafes if no location is provided
      cafes = await Cafe.find({});
    }

    // Calculate the number of employees for each cafe
    const cafesWithEmployeeCount = await Promise.all(
      cafes.map(async (cafe) => {
        const employeeCount = await Employee.countDocuments({ cafe: cafe._id });
        return {
          name: cafe.name,
          description: cafe.description,
          employees: employeeCount,
          logo: cafe.logo,
          location: cafe.location,
          uuid: cafe._id,
        };
      })
    );

    // Sort by the number of employees in descending order
    cafesWithEmployeeCount.sort((a, b) => b.employees - a.employees);

    res.json(cafesWithEmployeeCount);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};
