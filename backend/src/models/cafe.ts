import mongoose, { Schema, Document } from "mongoose";

export interface ICafe extends Document {
  id: string; // UUID
  name: string; // Cafe's name
  description: string; // Description of the cafe
  location: string; // Location of the cafe
  logo?: string; // (Optional) Logo image path
}

const CafeSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true, maxlength: 256 },
  location: { type: String, required: true },
  logo: { type: String }, // Optional field for the cafe's logo
});

export default mongoose.model<ICafe>("Cafe", CafeSchema);
