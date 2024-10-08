import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Cafe } from "../types/Cafe";
import { Employee } from "../types/Employee";

export const useCafes = (location: string = "") => {
  return useQuery<Cafe[]>({
    queryKey: ["cafes", location],
    queryFn: async () => {
      const res = await fetch(`/api/cafes?location=${location}`);

      if (!res.ok) {
        throw new Error(`Failed to fetch cafes: ${res.status}`);
      }

      return res.json();
    },
  });
};

export const useEmployees = (cafeId?: string) => {
  return useQuery({
    queryKey: cafeId ? ["employees", cafeId] : ["employees"],
    queryFn: async () => {
      const url = cafeId ? `/api/employees?cafe=${cafeId}` : `/api/employees`;
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`Failed to fetch employees: ${res.status}`);
      }

      return res.json();
    },
  });
};

export const useCafe = (id: string) => {
  return useQuery<Cafe>({
    queryKey: ["cafe", id],
    queryFn: async () => {
      const res = await fetch(`/api/cafes?id=${id}`);

      if (!res.ok) {
        throw new Error(`Failed to fetch cafe with ID ${id}: ${res.status}`);
      }

      return res.json();
    },
  });
};

export const useEmployee = (id: string) => {
  return useQuery<Employee>({
    queryKey: ["employee", id],
    queryFn: async () => {
      const res = await fetch(`/api/employees/${id}`);

      if (!res.ok) {
        throw new Error(
          `Failed to fetch employee with ID ${id}: ${res.status}`
        );
      }

      return res.json();
    },
  });
};

export const useAddCafe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cafe: {
      name: string;
      description: string;
      location: string;
    }) => {
      const res = await fetch(`/api/cafes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cafe),
      });

      if (!res.ok) {
        const errorMessage = await res.text();

        throw new Error(`Failed to add cafe: ${res.status} - ${errorMessage}`);
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cafes"] });
    },
    onError: (error: Error) => {
      console.error("Error adding cafe:", error.message);
    },
  });
};

export const useAddEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (employee: Employee) => {
      const res = await fetch(`/api/employees`, {
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

export const useUpdateCafe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      cafe,
    }: {
      id: string;
      cafe: { name: string; description: string; location: string };
    }) => {
      const res = await fetch(`/api/cafes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cafe),
      });

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
      const res = await fetch(`/api/employees/${id}`, {
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

export const useDeleteCafe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/cafes/${id}`, {
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

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/employees/${id}`, {
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
