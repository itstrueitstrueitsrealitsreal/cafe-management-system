import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from "@mui/material";

import { useAddCafe, useUpdateCafe, useCafe } from "../utils/api"; // Import React Query hooks
import { Cafe } from "../types/Cafe"; // Import the correct type

import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

export default function AddEditCafe() {
  const { id } = useParams(); // Get cafe ID from URL params
  const navigate = useNavigate(); // Hook for navigating programmatically

  // Check if we are in edit mode or add mode
  const isEditMode = id && id !== "new"; // true if id exists and is not "new"

  // Fetch cafe data only if we are in edit mode
  const { data: cafeData, isLoading, error } = useCafe(isEditMode ? id : "");

  const addCafeMutation = useAddCafe(); // Hook for adding a cafe
  const updateCafeMutation = useUpdateCafe(); // Hook for updating a cafe

  const [cafe, setCafe] = useState<Cafe>({
    name: "",
    description: "",
    location: "",
  });

  // Log the fetched cafeData for debugging
  useEffect(() => {
    console.log("Fetched cafe data:", cafeData);
  }, [cafeData]);

  // Populate the form with data if we are in edit mode and data is available
  useEffect(() => {
    if (isEditMode && cafeData) {
      setCafe({
        name: cafeData.name,
        description: cafeData.description,
        location: cafeData.location,
      });
    }
  }, [isEditMode, cafeData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cafeData = {
      name: cafe.name,
      description: cafe.description,
      location: cafe.location,
    };

    if (isEditMode) {
      // Update the cafe if we are in edit mode
      updateCafeMutation.mutate(
        { id: id!, cafe: cafeData }, // Pass the JSON data to the mutation
        {
          onSuccess: () => navigate("/cafes"), // Redirect on success
          onError: (error) => console.error("Error updating cafe:", error),
        }
      );
    } else {
      // Add a new cafe
      addCafeMutation.mutate(cafeData, {
        onSuccess: () => navigate("/cafes"), // Redirect on success
        onError: (error) => console.error("Error adding cafe:", error),
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center mt-5">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-5 text-red-600">
        <Typography variant="h6">Error fetching cafe data</Typography>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <DefaultLayout>
      <div className="text-center pt-8">
        <h1 className={`${title()} mb-8`}>
          {isEditMode ? "Edit Cafe" : "Add New Cafe"}
        </h1>
        <div className="my-5">
          <Card className="w-full max-w-2xl shadow-lg mx-auto">
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Cafe Name */}
                <TextField
                  fullWidth
                  required
                  label="Cafe Name"
                  value={cafe.name}
                  variant="outlined"
                  onChange={(e) => setCafe({ ...cafe, name: e.target.value })}
                />
                {/* Description */}
                <TextField
                  fullWidth
                  multiline
                  required
                  label="Description"
                  rows={3}
                  value={cafe.description}
                  variant="outlined"
                  onChange={(e) =>
                    setCafe({ ...cafe, description: e.target.value })
                  }
                />
                {/* Location */}
                <TextField
                  fullWidth
                  required
                  label="Location"
                  value={cafe.location}
                  variant="outlined"
                  onChange={(e) =>
                    setCafe({ ...cafe, location: e.target.value })
                  }
                />

                {/* Submit Button */}
                <div className="flex justify-center mt-5">
                  <Button
                    className="w-full max-w-md"
                    color="primary"
                    type="submit"
                    variant="contained"
                  >
                    {isEditMode ? "Update Cafe" : "Add Cafe"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </DefaultLayout>
  );
}
