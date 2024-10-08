import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { AgGridReact } from "ag-grid-react"; // Ag-Grid for table
import { Button, CircularProgress, TextField } from "@mui/material"; // Material UI components
import { GridReadyEvent, ColDef } from "ag-grid-community"; // Ag-Grid types
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useNavigate, useLocation } from "react-router-dom"; // For navigating and extracting query params

import { useEmployees, useDeleteEmployee, useCafe } from "../utils/api"; // API hooks
import DefaultLayout from "@/layouts/default"; // Your default layout component
import { title } from "@/components/primitives"; // Your custom styles

export default function Employees() {
  const gridRef = useRef<AgGridReact>(null); // Ref for the grid component
  const navigate = useNavigate(); // Hook to navigate
  const location = useLocation(); // Hook to get location, including query params

  // State for search/filter
  const [searchTerm, setSearchTerm] = useState("");
  const [gridApi, setGridApi] = useState<any>(null); // Store grid API
  const [cafeName, setCafeName] = useState<string | null>(null); // Store café name (if applicable)

  // Extract cafeId from the query string
  const queryParams = new URLSearchParams(location.search);
  const cafeId = queryParams.get("cafe");

  // Fetch employees, optionally filtered by cafeId
  const { data: employees = [], isLoading, error } = useEmployees(cafeId ?? "");

  // Fetch café details if cafeId is provided to get the name
  const { data: cafeData } = useCafe(cafeId ?? "");

  // Handle delete employee
  const deleteEmployeeMutation = useDeleteEmployee();

  const handleDelete = (id: string) => {
    deleteEmployeeMutation.mutate(id, {
      onSuccess: () => {
        alert("Employee deleted successfully");
        gridApi.applyTransaction({
          remove: employees.filter((e: { id: string }) => e.id === id),
        });
      },
      onError: (err) => {
        console.error("Error deleting employee:", err.message);
      },
    });
  };

  // Handle edit employee
  const handleEdit = (id: string) => {
    navigate(`/employees/edit/${id}`);
  };

  // Set the café name when `cafeData` is fetched
  useEffect(() => {
    if (cafeData) {
      setCafeName(cafeData.name);
    }
  }, [cafeData]);

  // Define the columns for the grid
  const columns: ColDef[] = useMemo(
    () => [
      { headerName: "Employee ID", field: "id" },
      { headerName: "Name", field: "name" },
      { headerName: "Email Address", field: "email_address" },
      { headerName: "Phone Number", field: "phone_number" },
      { headerName: "Days Worked", field: "days_worked" },
      { headerName: "Café Name", field: "cafe" },
      {
        headerName: "Actions",
        cellRenderer: (params: any) => (
          <div className="flex gap-2">
            <Button
              color="primary"
              variant="contained"
              onClick={() => handleEdit(params.data.id)}
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
          </div>
        ),
      },
    ],
    [employees, gridApi, navigate]
  );

  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current!.api.setGridOption(
      "quickFilterText",
      (document.getElementById("filter-text-box") as HTMLInputElement).value
    );
  }, []);

  // Bind grid API when ready
  const onGridReady = useCallback((params: GridReadyEvent) => {
    setGridApi(params.api);
  }, []);

  // Handle loading and error states
  if (isLoading)
    return (
      <div className="flex justify-center mt-5">
        <CircularProgress />
      </div>
    );
  if (error)
    return (
      <div className="text-red-600 text-center mt-5">
        Error fetching employees: {error.message}
      </div>
    );

  return (
    <DefaultLayout>
      <div className="text-center pt-8">
        {/* Dynamic Title */}
        <h1 className={`${title()} mb-8`}>
          {cafeId ? `Employees of ${cafeName || "Café"}` : "All Employees"}
        </h1>

        {/* Search/Filter Input */}
        <div className="my-5">
          <TextField
            fullWidth
            id="filter-text-box"
            label="Search employees by name"
            value={searchTerm}
            variant="outlined"
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyUp={onFilterTextBoxChanged}
          />
        </div>

        {/* Employees Grid */}
        <div
          className="ag-theme-alpine my-8"
          style={{ height: "400px", width: "100%" }}
        >
          <AgGridReact
            ref={gridRef} // Attach the gridRef for accessing grid API
            columnDefs={columns}
            defaultColDef={{ flex: 1, editable: false }} // Default column settings
            pagination={true}
            paginationPageSize={10}
            rowData={employees} // Bind employees data
            onGridReady={onGridReady} // Initialize grid API
          />
        </div>

        {/* Button to Add New Employee */}
        <Button
          className="my-5"
          color="primary"
          variant="contained"
          onClick={() => navigate("/employees/new")}
        >
          Add New Employee
        </Button>
      </div>
    </DefaultLayout>
  );
}
