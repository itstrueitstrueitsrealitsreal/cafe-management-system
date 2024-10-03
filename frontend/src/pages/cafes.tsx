import React, { useState, useRef, useMemo, useCallback } from "react";
import { AgGridReact } from "ag-grid-react"; // Ag-Grid for table
import { Button, TextField, CircularProgress } from "@mui/material"; // Material UI components
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css"; // Use any theme you prefer
import { GridReadyEvent } from "ag-grid-community";

import { useCafes, useDeleteCafe } from "../utils/api";

import DefaultLayout from "@/layouts/default";
import { title } from "@/components/primitives";

const Cafes = () => {
  const gridRef = useRef<AgGridReact>(null); // Ref for the grid component
  const { data: cafes = [], isLoading, error } = useCafes(); // Fetch cafes data

  // State to store filter input value
  const [filterText, setFilterText] = useState("");
  const [gridApi, setGridApi] = useState<any>(null); // Store grid API
  const [newRows, setNewRows] = useState<any[]>([]); // Store new rows to add

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

  // Handle filtering based on the search input
  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current!.api.setGridOption(
      "quickFilterText",
      (document.getElementById("filter-text-box") as HTMLInputElement).value
    );
  }, []);

  // Bind grid API on grid ready
  const onGridReady = useCallback((params: GridReadyEvent) => {
    setGridApi(params.api); // Store grid API when ready
  }, []);

  // Handle adding a new row to the grid
  const handleAddNewCafe = () => {
    const newCafe = {
      logo: "newLogo.png",
      name: "New Cafe",
      description: "New cafe description",
      employees: 10,
      location: "789 New Location",
    };

    // Use the grid API to update the grid with the new row
    gridApi.updateRowData({ add: [newCafe] });
  };

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
            id="filter-text-box"
            label="Filter by cafe location"
            value={filterText}
            variant="outlined"
            onChange={(e) => {
              setFilterText(e.target.value); // Update the filter input state
            }}
            onKeyUp={onFilterTextBoxChanged} // Trigger filtering based on input
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
            onGridReady={onGridReady} // Initialize grid API
          />
        </div>

        <Button
          className="my-5"
          color="info"
          variant="contained"
          onClick={handleAddNewCafe} // Add new row on button click
        >
          Add New Cafe
        </Button>
      </div>
    </DefaultLayout>
  );
};

export default Cafes;
