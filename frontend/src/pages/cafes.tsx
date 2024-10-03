import { useState, useRef, useMemo, useCallback } from "react";
import { AgGridReact } from "ag-grid-react"; // Ag-Grid for table
import { Button, TextField, CircularProgress } from "@mui/material"; // Material UI components
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css"; // Use any theme you prefer

import { useCafes, useDeleteCafe } from "../utils/api"; // Hooks for fetching/deleting cafes

import DefaultLayout from "@/layouts/default";
import { title } from "@/components/primitives";

const Cafes = () => {
  const gridRef = useRef<AgGridReact>(null); // Ref for the grid component
  const [location, setLocation] = useState(""); // State for the location filter
  const { data: cafes = [], isLoading, error } = useCafes(); // Fetch cafes data

  // Store the grid API locally
  const [gridApi, setGridApi] = useState<any>(null);

  // Handle deleting cafes
  const deleteCafeMutation = useDeleteCafe();

  const handleDelete = (id: string) => {
    deleteCafeMutation.mutate(id, {
      onSuccess: () => {
        alert("Cafe deleted successfully");
      },
      onError: (err) => {
        console.error("Error deleting cafe:", err.message);
      },
    });
  };

  // Define columns for ag-Grid
  const columns = useMemo(
    () => [
      { headerName: "Logo", field: "logo" },
      { headerName: "Name", field: "name" },
      { headerName: "Description", field: "description" },
      { headerName: "Employees", field: "employees" },
      { headerName: "Location", field: "location" },
      {
        headerName: "Actions",
        field: "actions",
        cellRendererFramework: (params: any) => (
          <>
            <Button
              className="mr-2"
              color="primary"
              variant="contained"
              onClick={() => console.log("Edit cafe", params.data.id)}
            >
              Edit
            </Button>
            <Button
              color="error"
              variant="contained"
              onClick={() => handleDelete(params.data.id)}
            >
              Delete
            </Button>
          </>
        ),
      },
    ],
    []
  );

  // Handle filtering based on the location input
  const onFilterLocation = useCallback(() => {
    if (gridApi) {
      gridApi.setQuickFilter(location); // Correct usage of setQuickFilter on the grid API
    }
  }, [location, gridApi]);

  if (isLoading)
    return (
      <div className="flex justify-center mt-5">
        <CircularProgress />
      </div>
    );

  if (error)
    return (
      <div className="text-red-600 text-center mt-5">
        Error fetching cafes: {error.message}
      </div>
    );

  return (
    <DefaultLayout>
      <div className="text-center pt-8">
        {/* Title */}
        <h1 className={`${title()} mb-8`}>Cafes</h1>

        {/* Search Input Box - Below the Title */}
        <div className="my-5">
          <TextField
            fullWidth
            label="Filter by location"
            value={location}
            variant="outlined"
            onChange={(e) => setLocation(e.target.value)} // Update location state on input change
            onInput={onFilterLocation} // Trigger filtering on input change
          />
        </div>

        {/* Cafe Table */}
        <div
          className="ag-theme-alpine my-8"
          style={{ height: "400px", width: "100%" }}
        >
          <AgGridReact
            ref={gridRef} // Attach the gridRef for accessing grid API
            columnDefs={columns}
            defaultColDef={{ flex: 1, editable: true }}
            rowData={cafes}
            onGridReady={(params) => {
              setGridApi(params.api); // Store the grid API when grid is ready
            }}
          />
        </div>

        {/* Add New Cafe Button */}
        <Button
          className="my-5"
          color="primary"
          variant="contained"
          onClick={() => console.log("Navigate to add cafe page")}
        >
          Add New Cafe
        </Button>
      </div>
    </DefaultLayout>
  );
};

export default Cafes;
