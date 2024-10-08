import { Employee } from "./Employee";

export interface Cafe {
  id?: string;
  name: string;
  description: string;
  location: string;
  employees?: Employee[];
}
