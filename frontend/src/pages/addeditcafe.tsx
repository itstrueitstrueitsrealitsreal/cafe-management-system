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
  const [hasChanges, setHasChanges] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setCafe({ ...cafe, [name]: value });
    setHasChanges(true);
  };

  const [cafe, setCafe] = useState<Cafe>({
    name: "",
    description: "",
    location: "",
  });

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
  useEffect(() => {
    const warnUserBeforeLeaving = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = ""; // This is needed for older browsers.
      }
    };

    window.addEventListener("beforeunload", warnUserBeforeLeaving);

    return () =>
      window.removeEventListener("beforeunload", warnUserBeforeLeaving);
  }, [hasChanges]);

  const handleCancel = () => {
    if (
      hasChanges &&
      !window.confirm("You have unsaved changes, do you really want to leave?")
    ) {
      return;
    }
    navigate("/cafes");
  };

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
          onSuccess: () => {
            setHasChanges(false);
            navigate("/cafes");
          },
          onError: (error) => console.error("Error updating cafe:", error),
        }
      );
    } else {
      // Add a new cafe
      addCafeMutation.mutate(cafeData, {
        onSuccess: () => {
          setHasChanges(false);
          navigate("/cafes");
        },
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
                  helperText="Must be between 6 and 10 characters"
                  inputProps={{ minLength: 6, maxLength: 10 }}
                  label="Cafe Name"
                  name="name"
                  value={cafe.name}
                  variant="outlined"
                  onChange={handleInputChange}
                />
                {/* Description */}
                <TextField
                  fullWidth
                  multiline
                  required
                  helperText="Max 256 characters"
                  inputProps={{ maxLength: 256 }}
                  label="Description"
                  name="description"
                  rows={3}
                  value={cafe.description}
                  variant="outlined"
                  onChange={handleInputChange}
                />
                {/* Location */}
                <TextField
                  fullWidth
                  required
                  label="Location"
                  name="location"
                  value={cafe.location}
                  variant="outlined"
                  onChange={handleInputChange}
                />

                {/* Submit and Cancel Buttons */}
                <div className="flex justify-between mt-5">
                  <Button
                    className="mr-2"
                    color="error" // Set the Cancel button to red
                    variant="outlined"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="ml-2"
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
