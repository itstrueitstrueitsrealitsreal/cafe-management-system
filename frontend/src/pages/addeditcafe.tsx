import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Updated to use useNavigate

import { useAddCafe, useUpdateCafe, useCafe } from "../utils/api"; // Import React Query hooks
import { Cafe } from "../types/Cafe"; // Import the correct type

export default function AddEditCafe() {
  const { id } = useParams(); // Get cafe ID from URL params
  const navigate = useNavigate(); // Hook for navigating programmatically

  // Fetch cafe if ID is present (edit mode)
  const { data: cafeData, isLoading } = useCafe(id!);

  const addCafeMutation = useAddCafe(); // Hook for adding a cafe
  const updateCafeMutation = useUpdateCafe(); // Hook for updating a cafe

  const [cafe, setCafe] = useState<Cafe>({
    name: "",
    description: "",
    location: "",
    logo: "", // Initially empty, could be string or File later
  });

  useEffect(() => {
    if (cafeData) {
      setCafe({
        name: cafeData.name,
        description: cafeData.description,
        location: cafeData.location,
        logo: cafeData.logo, // Logo from the API (likely a string URL)
      });
    }
  }, [cafeData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Handle FormData for file upload if the logo needs to be sent as a file
    const formData = new FormData();

    formData.append("name", cafe.name);
    formData.append("description", cafe.description);
    formData.append("location", cafe.location);

    if (typeof cafe.logo !== "string" && cafe.logo !== undefined) {
      formData.append("logo", cafe.logo); // Append logo only if it's a file
    }

    if (id) {
      // Update cafe
      updateCafeMutation.mutate(
        { id, cafe: formData }, // Pass FormData to the mutation
        {
          onSuccess: () => navigate("/cafes"),
          onError: (error) => console.error("Error updating cafe:", error),
        }
      );
    } else {
      // Add new cafe
      addCafeMutation.mutate(formData, {
        onSuccess: () => navigate("/cafes"),
        onError: (error) => console.error("Error adding cafe:", error),
      });
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit}>
      <input
        required
        placeholder="Cafe Name"
        type="text"
        value={cafe.name}
        onChange={(e) => setCafe({ ...cafe, name: e.target.value })}
      />
      <textarea
        required
        placeholder="Description"
        value={cafe.description}
        onChange={(e) => setCafe({ ...cafe, description: e.target.value })}
      />
      <input
        required
        placeholder="Location"
        type="text"
        value={cafe.location}
        onChange={(e) => setCafe({ ...cafe, location: e.target.value })}
      />
      <input
        type="file"
        onChange={(e) =>
          setCafe({
            ...cafe,
            logo: e.target.files ? e.target.files[0] : cafe.logo, // Handle file input properly
          })
        }
      />
      <button type="submit">{id ? "Update Cafe" : "Add Cafe"}</button>
    </form>
  );
}
