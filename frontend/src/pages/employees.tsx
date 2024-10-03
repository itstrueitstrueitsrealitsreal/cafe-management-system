import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useEmployees, useDeleteEmployee } from "../utils/api";
import EmployeeTable from "../components/EmployeeTable";

import { title } from "@/components/primitives"; // Assuming you use this for titles
import DefaultLayout from "@/layouts/default"; // Import the default layout

export default function Employees() {
  const [searchTerm, setSearchTerm] = useState(""); // For filtering employees by name, if needed
  const navigate = useNavigate();

  // Use the hook for fetching employees
  const { data: employees = [], isLoading, error } = useEmployees();
  const deleteEmployeeMutation = useDeleteEmployee();

  // Define the onDelete handler
  const handleDelete = (id: string) => {
    deleteEmployeeMutation.mutate(id);
  };

  // Handle loading and error states
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching employees: {error.message}</div>;

  return (
    <DefaultLayout>
      <h1 className={title()}>Employees</h1>

      {/* Search/Filter Input (Optional) */}
      <input
        type="text"
        placeholder="Search employees by name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Employee Table */}
      <EmployeeTable employees={employees} onDelete={handleDelete} />

      {/* Button to Add New Employee */}
      <button onClick={() => navigate("/employees/new")}>
        Add New Employee
      </button>
    </DefaultLayout>
  );
}
