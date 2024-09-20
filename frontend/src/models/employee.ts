import mongoose, { Document, Schema } from "mongoose";

// Define the Employee interface that extends Document (from Mongoose)
export interface IEmployee extends Document {
  id: string;
  name: string;
  email_address: string;
  phone_number: string;
  gender: "Male" | "Female"; // Strict gender type
  cafe: mongoose.Types.ObjectId | null; // ObjectId of the Cafe the employee works in, or null
  start_date: Date;
}

// Define the Employee schema
const EmployeeSchema: Schema<IEmployee> = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email_address: { type: String, required: true, match: /.+\@.+\..+/ }, // Email validation
  phone_number: { type: String, required: true, match: /^[89]\d{7}$/ }, // Singapore phone validation (starts with 8 or 9)
  gender: { type: String, enum: ["Male", "Female"], required: true },
  cafe: { type: mongoose.Schema.Types.ObjectId, ref: "Cafe", default: null }, // Reference to a Cafe
  start_date: { type: Date, required: true },
});

// Export the Employee model
export default mongoose.model<IEmployee>("Employee", EmployeeSchema);
