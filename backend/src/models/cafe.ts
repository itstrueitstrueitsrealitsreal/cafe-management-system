import mongoose, { Schema, Document } from "mongoose";

// Define the Cafe interface extending the Mongoose Document
export interface ICafe extends Document {
  id: string;
  name: string;
  description: string;
  location: string;
  __v?: number;
}

const CafeSchema: Schema<ICafe> = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true, maxlength: 256 },
  location: { type: String, required: true },
});

export default mongoose.model<ICafe>("Cafe", CafeSchema);
