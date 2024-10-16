import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Cafe } from "../types/Cafe";
import { Employee } from "../types/Employee";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export const useCafes = (location: string = "") => {
  return useQuery<Cafe[]>({
    queryKey: ["cafes", location],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/cafes?location=${location}`);

      if (!res.ok) {
        throw new Error(`Failed to fetch cafes: ${res.status}`);
      }

      return res.json();
    },
  });
};

// Fetch Employees
export const useEmployees = (cafeId?: string) => {
  return useQuery({
    queryKey: cafeId ? ["employees", cafeId] : ["employees"], // Unique query key based on cafeId
    queryFn: async () => {
      const url = cafeId
        ? `${API_URL}/employees?cafe=${cafeId}`
        : `${API_URL}/employees`; // Conditionally build the API URL
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`Failed to fetch employees: ${res.status}`);
      }

      return res.json();
    },
  });
};

// Fetch a specific Cafe by ID
export const useCafe = (id: string) => {
  return useQuery<Cafe>({
    queryKey: ["cafe", id],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/cafes/${id}`);

      if (!res.ok) {
        throw new Error(`Failed to fetch cafe with ID ${id}: ${res.status}`);
      }

      return res.json();
    },
  });
};

// Fetch a specific Employee by ID
export const useEmployee = (id: string) => {
  return useQuery<Employee>({
    queryKey: ["employee", id],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/employees/${id}`);

      if (!res.ok) {
        throw new Error(
          `Failed to fetch employee with ID ${id}: ${res.status}`
        );
      }

      return res.json();
    },
  });
};

// Add a Cafe
export const useAddCafe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cafe: {
      name: string;
      description: string;
      location: string;
    }) => {
      try {
        const res = await fetch(`${API_URL}/cafes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Ensure the correct header is set
          },
          body: JSON.stringify(cafe), // Stringify the cafe object
        });

        if (!res.ok) {
          // Log the response body text for debugging
          const errorMessage = await res.text();

          throw new Error(
            `Failed to add cafe: ${res.status} - ${errorMessage}`
          );
        }

        const jsonResponse = await res.json();

        return jsonResponse;
      } catch (error) {
        // Log the error in case of failure
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cafes"] });
    },
    onError: (error: Error) => {
      console.error("Error adding cafe:", error.message);
    },
  });
};
// Add an Employee
export const useAddEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (employee: Employee) => {
      const res = await fetch(`${API_URL}/employees`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employee),
      });

      if (!res.ok) {
        throw new Error(`Failed to add employee: ${res.status}`);
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
    onError: (error: Error) => {
      console.error("Error adding employee:", error.message);
    },
  });
};

// Update a Cafe
export const useUpdateCafe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      cafe,
    }: {
      id: string;
      cafe: {
        name: string;
        description: string;
        location: string;
      };
    }) => {
      const options: RequestInit = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cafe),
      };

      const res = await fetch(`${API_URL}/cafes/${id}`, options);

      if (!res.ok) {
        throw new Error(`Failed to update cafe with ID ${id}: ${res.status}`);
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cafes"] });
    },
    onError: (error: Error) => {
      console.error("Error updating cafe:", error.message);
    },
  });
};

// Update an Employee
export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      employee,
    }: {
      id: string;
      employee: Employee;
    }) => {
      const res = await fetch(`${API_URL}/employees/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employee),
      });

      if (!res.ok) {
        throw new Error(
          `Failed to update employee with ID ${id}: ${res.status}`
        );
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
    onError: (error: Error) => {
      console.error("Error updating employee:", error.message);
    },
  });
};

// Delete a Cafe
export const useDeleteCafe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${API_URL}/cafes/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error(`Failed to delete cafe with ID ${id}: ${res.status}`);
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cafes"] });
    },
    onError: (error: Error) => {
      console.error("Error deleting cafe:", error.message);
    },
  });
};

// Delete an Employee
export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${API_URL}/employees/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error(
          `Failed to delete employee with ID ${id}: ${res.status}`
        );
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
    onError: (error: Error) => {
      console.error("Error deleting employee:", error.message);
    },
  });
};
