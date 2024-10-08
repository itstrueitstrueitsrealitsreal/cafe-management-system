import { Router, Request, Response } from "express";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to the Café Management System API!" });
});

router.get("/health", (req: Request, res: Response) => {
  res.json({ status: "Healthy", uptime: process.uptime() });
});

export default router;
