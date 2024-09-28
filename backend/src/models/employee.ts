import mongoose, { Document, Schema } from "mongoose";

// Define the Employee interface extending the Mongoose Document
export interface IEmployee extends Document {
  id: string;
  name: string;
  email_address: string;
  phone_number: string;
  gender: "Male" | "Female";
  cafe: mongoose.Types.ObjectId | null;
  start_date: Date;
  __v?: number;
}

const EmployeeSchema: Schema<IEmployee> = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    match: /^UI\d{7}$/,
  },
  name: {
    type: String,
    required: true,
  },
  email_address: {
    type: String,
    required: true,
    match: /.+\@.+\..+/,
  },
  phone_number: {
    type: String,
    required: true,
    match: /^[89]\d{7}$/,
  },
  gender: {
    type: String,
    enum: ["Male", "Female"],
    required: true,
  },
  cafe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cafe",
    default: null,
  },
  start_date: { type: Date, required: true },
});

export default mongoose.model<IEmployee>("Employee", EmployeeSchema);
