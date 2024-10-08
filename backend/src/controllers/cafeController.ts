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
    // Destructure and check if id is provided
    let { id, name, description, location, logo } = req.body;

    // If no id is provided by the user, generate a UUID
    if (!id) {
      id = uuidv4();
    }

    // Attempt to create a new cafe
    const newCafe = new Cafe({
      id, // Use either the user-provided id or the generated UUID
      name,
      description,
      location,
      logo,
    });

    const cafe = await newCafe.save();

    // Destructure to remove __v and rename _id to uuid (optional based on your DB structure)
    const { _id, __v, ...cafeData } = cafe.toObject();
    const response = { ...cafeData, uuid: _id };

    // Respond with the newly created cafe
    res.status(201).json(response);
  } catch (error) {
    if ((error as any).code === 11000) {
      // Handle duplicate key error (E11000) more explicitly
      const duplicateKey = Object.keys((error as any).keyValue)[0];
      const duplicateValue = (error as any).keyValue[duplicateKey];
      res.status(400).json({
        message: `A cafe with this ${duplicateKey} (${duplicateValue}) already exists. Please use a different unique identifier.`,
      });
    } else {
      // Handle other types of errors
      res.status(500).json({ error: (error as Error).message });
    }
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
    const cafe = await Cafe.findOne({ id: req.params.id });
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
    // Find the cafe by the custom 'id' field, not '_id'
    const updatedCafe = await Cafe.findOneAndUpdate(
      { id: req.params.id }, // Use 'id' for lookup
      req.body,
      { new: true } // Return the updated document
    );

    if (!updatedCafe) {
      res.status(404).json({ message: "Cafe not found" });
      return;
    }

    // Destructure to remove '_id' and '__v' fields
    const { _id, __v, ...cafeWithoutVersion } = updatedCafe.toObject();

    res.status(200).json(cafeWithoutVersion);
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
    const cafe = await Cafe.findOne({ id: req.params.id }); // Find by custom UUID

    if (!cafe) {
      res.status(404).json({ message: "Cafe not found" });
      return;
    }

    await Employee.deleteMany({ cafe: cafe._id }); // Remove all employees associated with this cafe
    await Cafe.findOneAndDelete({ id: req.params.id }); // Delete the cafe by UUID

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
      cafes = await Cafe.find({ location });
    } else {
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
          id: cafe.id, // Use the custom UUID instead of MongoDB's default _id
        };
      })
    );

    cafesWithEmployeeCount.sort((a, b) => b.employees - a.employees);
    res.json(cafesWithEmployeeCount);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};
