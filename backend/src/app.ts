import express, { Application } from "express";
import connectDB from "./config/db";
import employeeRoutes from "./routes/employeeRoutes";
import defaultRoutes from "./routes/defaultRoutes";
import cafeRoutes from "./routes/cafeRoutes";
import * as dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app: Application = express();

connectDB();

app.use(cors({ origin: "*" }));

app.use(express.json());

app.use("/", defaultRoutes);
app.use("/employees", employeeRoutes);
app.use("/cafes", cafeRoutes);

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
  }
);

export default app;
