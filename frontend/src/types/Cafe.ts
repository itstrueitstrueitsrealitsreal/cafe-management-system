import { Employee } from "./Employee"; // Assuming you have an Employee interface

export interface Cafe {
  id?: string; // Optional for new cafes
  name: string;
  description: string;
  location: string;
  logo?: string | File; // Either a string (URL or path) or File for upload
  employees?: Employee[]; // Optional field for employees associated with the cafe
}
