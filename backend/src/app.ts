import express, { Application, Request, Response, NextFunction } from "express";
import connectDB from "./config/db";
import employeeRoutes from "./routes/employeeRoutes";
import defaultRoutes from "./routes/defaultRoutes";
import cafeRoutes from "./routes/cafeRoutes";
import * as dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app: Application = express();

connectDB();

const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(
  cors({
    origin: allowedOrigin,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/", defaultRoutes);
app.use("/employees", employeeRoutes);
app.use("/cafes", cafeRoutes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

export default app;
