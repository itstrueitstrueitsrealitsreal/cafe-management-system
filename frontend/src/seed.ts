import mongoose from "mongoose";
import dotenv from "dotenv";
import Employee from "./models/employee";
import Cafe, { ICafe } from "./models/cafe";

dotenv.config();

// Sample cafe data
const cafesData = [
  {
    id: "cafe_001",
    name: "Downtown Cafe",
    description: "A cozy cafe in the city center",
    location: "123 Main St, Cityville",
    logo: "logo1.png",
  },
  {
    id: "cafe_002",
    name: "Uptown Cafe",
    description: "A modern cafe with great ambiance",
    location: "456 High St, Cityville",
    logo: "logo2.png",
  },
];

// Sample employee data
const employeesData: {
  id: string;
  name: string;
  email_address: string;
  phone_number: string;
  gender: string;
  cafe: mongoose.Types.ObjectId | null;
  start_date: Date;
}[] = [
  {
    id: "UI000001",
    name: "John Doe",
    email_address: "johndoe@example.com",
    phone_number: "91234567",
    gender: "Male",
    cafe: null,
    start_date: new Date("2023-01-01"),
  },
  {
    id: "UI000002",
    name: "Jane Smith",
    email_address: "janesmith@example.com",
    phone_number: "81234567",
    gender: "Female",
    cafe: null,
    start_date: new Date("2023-05-15"),
  },
];

// Seed function to populate the database
const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);

    await Cafe.deleteMany({});
    await Employee.deleteMany({});

    const cafes = (await Cafe.insertMany(cafesData)) as (ICafe & {
      _id: mongoose.Types.ObjectId;
    })[];

    employeesData[0].cafe = cafes[0]._id;
    employeesData[1].cafe = cafes[1]._id;

    await Employee.insertMany(employeesData);

    console.log("Database seeded successfully!");
    mongoose.connection.close();
  } catch (err) {
    console.error("Error seeding the database:", err);
    mongoose.connection.close();
  }
};

// Run the seed function
seedDatabase();
