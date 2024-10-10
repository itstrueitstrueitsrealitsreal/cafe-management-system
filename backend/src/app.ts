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

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [
  "http://localhost:5173",
  "https://cafe-management-system-nine.vercel.app",
];
const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};
app.use(cors(corsOptions));

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
