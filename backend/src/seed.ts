import mongoose from "mongoose";
import dotenv from "dotenv";
import Employee from "./models/employee";
import Cafe, { ICafe } from "./models/cafe";

dotenv.config();

const cafesData = [
  {
    id: "cafe_001",
    name: "Downtown Cafe",
    description: "A cozy cafe in the city center",
    location: "123 Main St, Cityville",
  },
  {
    id: "cafe_002",
    name: "Uptown Cafe",
    description: "A modern cafe with great ambiance",
    location: "456 High St, Cityville",
  },
];

const employeesData: {
  id: string;
  name: string;
  email_address: string;
  phone_number: string;
  gender: string;
  cafe: string;
  start_date: Date;
}[] = [
  {
    id: "UI0000001",
    name: "John Doe",
    email_address: "johndoe@example.com",
    phone_number: "91234567",
    gender: "Male",
    cafe: "cafe_001",
    start_date: new Date("2023-01-01"),
  },
  {
    id: "UI0000002",
    name: "Jane Smith",
    email_address: "janesmith@example.com",
    phone_number: "81234567",
    gender: "Female",
    cafe: "cafe_002",
    start_date: new Date("2023-05-15"),
  },
];

const resetDatabase = async () => {
  try {
    console.log("Resetting database...");
    await mongoose.connect(process.env.MONGO_URI as string);

    if (mongoose.connection.readyState === 1 && mongoose.connection.db) {
      await mongoose.connection.db.dropCollection("employees");
      await mongoose.connection.db.dropCollection("cafes");
    } else {
      throw new Error("Database connection is not ready");
    }

    console.log("Database reset successfully!");
  } catch (err) {
    console.error("Error resetting the database:", err);
  } finally {
    await mongoose.disconnect();
  }
};

const seedDatabase = async () => {
  try {
    console.log("Seeding database...");
    await mongoose.connect(process.env.MONGO_URI as string);

    await Cafe.deleteMany({});
    await Employee.deleteMany({});

    const cafes = (await Cafe.insertMany(cafesData)) as (ICafe & {
      _id: mongoose.Types.ObjectId;
    })[];

    employeesData[0].cafe = cafes[0].id;
    employeesData[1].cafe = cafes[1].id;

    await Employee.insertMany(employeesData);

    console.log("Database seeded successfully!");
  } catch (err) {
    console.error("Error seeding the database:", err);
  } finally {
    await mongoose.disconnect();
  }
};

const main = async () => {
  await resetDatabase();
  await seedDatabase();
};

main();
