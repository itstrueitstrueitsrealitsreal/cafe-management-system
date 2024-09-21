import express, { Application } from "express";
import connectDB from "./config/db";
import employeeRoutes from "./routes/employeeRoutes";
import defaultRoutes from "./routes/defaultRoutes";
import cafeRoutes from "./routes/cafeRoutes";
import * as dotenv from "dotenv";

dotenv.config();

const app: Application = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use("/", defaultRoutes);
app.use("/employees", employeeRoutes);
app.use("/cafes", cafeRoutes);

export default app;
