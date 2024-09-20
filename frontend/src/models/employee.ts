import mongoose, { Document, Schema } from "mongoose";

export interface IEmployee extends Document {
  id: string;
  name: string;
  email_address: string;
  phone_number: string;
  gender: "Male" | "Female";
}

const employeeSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email_address: { type: String, required: true, match: /.+\@.+\..+/ },
  phone_number: { type: String, required: true },
  gender: { type: String, required: true, enum: ["Male", "Female"] },
});

export default mongoose.model<IEmployee>("Employee", employeeSchema);
