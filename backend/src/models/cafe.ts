import mongoose, { Schema, Document } from "mongoose";

// Define the Cafe interface extending the Mongoose Document
export interface ICafe extends Document {
  id: string;
  name: string;
  description: string;
  location: string;
  logo?: string;
}

const CafeSchema: Schema<ICafe> = new Schema({
  id: { type: String, required: true, unique: true }, // Custom UUID provided by the user
  name: { type: String, required: true },
  description: { type: String, required: true, maxlength: 256 },
  location: { type: String, required: true },
  logo: { type: String },
});

export default mongoose.model<ICafe>("Cafe", CafeSchema);
