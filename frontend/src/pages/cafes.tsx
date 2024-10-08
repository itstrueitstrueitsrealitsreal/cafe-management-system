import { useState, useRef, useMemo, useCallback } from "react";
import { AgGridReact } from "ag-grid-react"; // Ag-Grid for table
import { Button, TextField, CircularProgress } from "@mui/material"; // Material UI components
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css"; // Use any theme you prefer
import { GridReadyEvent } from "ag-grid-community";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook

import { useCafes, useDeleteCafe } from "../utils/api";

import DefaultLayout from "@/layouts/default";
import { title } from "@/components/primitives";

const Cafes = () => {
  const gridRef = useRef<AgGridReact>(null); // Ref for the grid component
  const { data: cafes = [], isLoading, error } = useCafes(); // Fetch cafes data
  const [filterText, setFilterText] = useState("");
  const [gridApi, setGridApi] = useState<any>(null); // Store grid API
  const navigate = useNavigate(); // Initialize the navigate hook

  // Handle deleting cafes
  const deleteCafeMutation = useDeleteCafe();

  const handleDelete = (id: string) => {
    deleteCafeMutation.mutate(id, {
      onSuccess: () => {
        alert("Cafe deleted successfully");
        const updatedRows = cafes.filter((cafe) => cafe.id !== id); // Filter out deleted row

        gridApi.setRowData(updatedRows); // Update grid with remaining rows
      },
      onError: (err) => {
        console.error("Error deleting cafe:", err.message);
      },
    });
  };

  // Handle navigating to the edit cafe page
  const handleEdit = (id: string) => {
    navigate(`/cafes/${id}`); // Navigate to the edit page for the selected cafe
  };

  // Handle navigating to the add new cafe page
  const handleAddNewCafe = () => {
    navigate("/cafes/new"); // Navigate to the add new cafe page
  };

  // Define columns for ag-Grid
  const columns = useMemo(
    () => [
      { headerName: "Name", field: "name" },
      { headerName: "Description", field: "description" },
      {
        headerName: "Employees",
        field: "employees",
        cellRenderer: (params: any) => {
          return (
            <Button
              color="primary"
              onClick={() => navigate(`/employees?cafe=${params.data.id}`)}
            >
              {params.data.employees}
            </Button>
          );
        },
      },
      { headerName: "Location", field: "location" },
      {
        headerName: "Actions",
        field: "actions",
        cellRenderer: (params: any) => {
          return (
            <div className="flex gap-2">
              <Button
                className="my-5"
                color="primary"
                variant="contained"
                onClick={() => handleEdit(params.data.id)} // Navigate to edit page
              >
                Edit
              </Button>
              <Button
                className="my-5"
                color="error"
                variant="contained"
                onClick={() => handleDelete(params.data.id)} // Handle Delete
              >
                Delete
              </Button>
            </div>
          );
        },
      },
    ],
    [cafes, gridApi]
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
        <h1 className={`${title()} mb-8`}>Cafés</h1>

        {/* Search Input Box - Below the Title */}
        <div className="my-5">
          <TextField
            fullWidth
            className="my-5"
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
            defaultColDef={{ flex: 1, resizable: true }}
            pagination={true}
            paginationPageSize={10}
            rowData={cafes}
            onGridReady={onGridReady} // Initialize grid API
          />
        </div>

        <Button
          className="my-5"
          color="info"
          variant="contained"
          onClick={handleAddNewCafe} // Navigate to the add new cafe page
        >
          Add New Cafe
        </Button>
      </div>
    </DefaultLayout>
  );
};

export default Cafes;
