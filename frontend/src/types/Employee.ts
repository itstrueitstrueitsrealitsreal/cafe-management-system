// employee.ts
export interface Employee {
  id?: string; // Optional for new employees
  name: string;
  email_address: string; // Align with the API field
  phone_number: string; // Align with the API field
  gender: string;
  cafeId: string; // The ID of the cafe the employee is associated with
}
