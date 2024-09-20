import { Request, Response } from "express";
import Cafe from "../models/cafe";

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
    } else {
      res.json(updatedCafe);
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Delete a cafe
export const deleteCafe = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deletedCafe = await Cafe.findByIdAndDelete(req.params.id);
    if (!deletedCafe) {
      res.status(404).json({ message: "Cafe not found" });
    } else {
      res.status(200).json({ message: "Cafe deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
