import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  useEmployee,
  useAddEmployee,
  useUpdateEmployee,
  useCafes,
} from "../utils/api"; // Use React Query hooks
import { Employee } from "../types/Employee";

export default function AddEditEmployee() {
  const { id } = useParams(); // Get employee ID from URL params
  const navigate = useNavigate(); // Hook for navigating programmatically

  const { data: employeeData, isLoading: isLoadingEmployee } = useEmployee(id!); // Fetch specific employee if ID exists
  const { data: cafes, isLoading: isLoadingCafes } = useCafes(); // Fetch cafes for dropdown

  // Initialize employee state with correct types
  const [employee, setEmployee] = useState<Employee>({
    name: "",
    email_address: "",
    phone_number: "",
    gender: "", // Ensure this field is present if the API expects it
    cafeId: "",
  });

  const addEmployeeMutation = useAddEmployee(); // Hook for adding employee
  const updateEmployeeMutation = useUpdateEmployee(); // Hook for updating employee

  // Populate the employee form if editing
  useEffect(() => {
    if (employeeData) {
      setEmployee({
        id: employeeData.id, // Include id if it's available
        name: employeeData.name,
        email_address: employeeData.email_address, // Align with API field names
        phone_number: employeeData.phone_number, // Align with API field names
        gender: employeeData.gender, // Align with API expectations
        cafeId: employeeData.cafeId,
      });
    }
  }, [employeeData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (id) {
      // For update, pass the id separately and include the employee data
      updateEmployeeMutation.mutate(
        { id, employee },
        {
          onSuccess: () => navigate("/employees"),
          onError: (error) => console.error("Error updating employee", error),
        }
      );
    } else {
      // For adding, just pass the employee data (without the id)
      addEmployeeMutation.mutate(employee, {
        onSuccess: () => navigate("/employees"),
        onError: (error) => console.error("Error adding employee", error),
      });
    }
  };

  if (isLoadingEmployee || isLoadingCafes) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit}>
      <input
        required
        placeholder="Employee Name"
        type="text"
        value={employee.name}
        onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
      />
      <input
        required
        placeholder="Email"
        type="email"
        value={employee.email_address}
        onChange={(e) =>
          setEmployee({ ...employee, email_address: e.target.value })
        }
      />
      <input
        required
        placeholder="Phone"
        type="text"
        value={employee.phone_number}
        onChange={(e) =>
          setEmployee({ ...employee, phone_number: e.target.value })
        }
      />
      <input
        required
        placeholder="Gender"
        type="text"
        value={employee.gender}
        onChange={(e) => setEmployee({ ...employee, gender: e.target.value })}
      />
      <select
        required
        value={employee.cafeId}
        onChange={(e) => setEmployee({ ...employee, cafeId: e.target.value })}
      >
        <option value="">Select a Cafe</option>
        {cafes?.map((cafe) => (
          <option key={cafe.id} value={cafe.id}>
            {cafe.name}
          </option>
        ))}
      </select>
      <button type="submit">{id ? "Update Employee" : "Add Employee"}</button>
    </form>
  );
}
