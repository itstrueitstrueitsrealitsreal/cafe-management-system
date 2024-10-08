import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { Button, CircularProgress, TextField } from "@mui/material";
import { GridReadyEvent, ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useNavigate, useLocation } from "react-router-dom";

import { useEmployees, useDeleteEmployee, useCafe } from "../utils/api";

import DefaultLayout from "@/layouts/default";
import { title } from "@/components/primitives";

export default function Employees() {
  const gridRef = useRef<AgGridReact>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState("");
  const [gridApi, setGridApi] = useState<any>(null);
  const [cafeName, setCafeName] = useState<string | null>(null);

  const queryParams = new URLSearchParams(location.search);
  const cafeId = queryParams.get("cafe");

  const { data: employees = [], isLoading, error } = useEmployees(cafeId ?? "");
  const { data: cafeData } = useCafe(cafeId ?? "");

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

  const handleEdit = (id: string) => {
    navigate(`/employees/${id}`);
  };

  useEffect(() => {
    if (cafeData) {
      setCafeName(cafeData.name);
    }
  }, [cafeData]);

  const columns: ColDef[] = useMemo(
    () => [
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

  const onGridReady = useCallback((params: GridReadyEvent) => {
    setGridApi(params.api);
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
        Error fetching employees: {error.message}
      </div>
    );

  return (
    <DefaultLayout>
      <div className="text-center pt-8">
        <h1 className={`${title()} mb-8`}>
          {cafeId ? `Employees of ${cafeName || "Café"}` : "All Employees"}
        </h1>
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
        <div
          className="ag-theme-alpine my-8"
          style={{ height: "400px", width: "100%" }}
        >
          <AgGridReact
            ref={gridRef}
            columnDefs={columns}
            defaultColDef={{ flex: 1, editable: false }}
            pagination={true}
            paginationPageSize={10}
            rowData={employees}
            onGridReady={onGridReady}
          />
        </div>
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
