import { Employee } from "./Employee"; // Assuming you have an Employee interface

export interface Cafe {
  id?: string; // Optional for new cafes
  name: string;
  description: string;
  location: string;
  employees?: Employee[]; // Optional field for employees associated with the cafe
}
