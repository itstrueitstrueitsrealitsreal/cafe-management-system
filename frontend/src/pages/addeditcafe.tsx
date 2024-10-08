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

import { useAddCafe, useUpdateCafe, useCafe } from "../utils/api";
import { Cafe } from "../types/Cafe";

import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

export default function AddEditCafe() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEditMode = id && id !== "new";

  const { data: cafeData, isLoading, error } = useCafe(isEditMode ? id : "");

  const addCafeMutation = useAddCafe();
  const updateCafeMutation = useUpdateCafe();
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
        e.returnValue = "";
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
      updateCafeMutation.mutate(
        { id: id!, cafe: cafeData },
        {
          onSuccess: () => {
            setHasChanges(false);
            navigate("/cafes");
          },
          onError: (error) => console.error("Error updating cafe:", error),
        }
      );
    } else {
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
                <TextField
                  fullWidth
                  required
                  label="Location"
                  name="location"
                  value={cafe.location}
                  variant="outlined"
                  onChange={handleInputChange}
                />

                <div className="flex justify-between mt-5">
                  <Button
                    className="mr-2"
                    color="error"
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
