import { useState, useRef, useMemo, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import { Button, TextField, CircularProgress } from "@mui/material";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { GridReadyEvent } from "ag-grid-community";
import { useNavigate } from "react-router-dom";

import { useCafes, useDeleteCafe } from "../utils/api";

import DefaultLayout from "@/layouts/default";
import { title } from "@/components/primitives";

const Cafes = () => {
  const gridRef = useRef<AgGridReact>(null);
  const { data: cafes = [], isLoading, error } = useCafes();
  const [filterText, setFilterText] = useState("");
  const [gridApi, setGridApi] = useState<any>(null);
  const navigate = useNavigate();

  const deleteCafeMutation = useDeleteCafe();

  const handleDelete = (id: string) => {
    deleteCafeMutation.mutate(id, {
      onSuccess: () => {
        alert("Cafe deleted successfully");
        const updatedRows = cafes.filter((cafe) => cafe.id !== id);
        gridApi.setRowData(updatedRows);
      },
      onError: (err) => {
        console.error("Error deleting cafe:", err.message);
      },
    });
  };

  const handleEdit = (id: string) => {
    navigate(`/cafes/${id}`);
  };

  const handleAddNewCafe = () => {
    navigate("/cafes/new");
  };

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
                onClick={() => handleEdit(params.data.id)}
              >
                Edit
              </Button>
              <Button
                className="my-5"
                color="error"
                variant="contained"
                onClick={() => handleDelete(params.data.id)}
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
        Error fetching cafes: {error.message}
      </div>
    );

  return (
    <DefaultLayout>
      <div className="text-center pt-8">
        <h1 className={`${title()} mb-8`}>Cafés</h1>
        <div className="my-5">
          <TextField
            fullWidth
            className="my-5"
            id="filter-text-box"
            label="Filter by cafe location"
            value={filterText}
            variant="outlined"
            onChange={(e) => {
              setFilterText(e.target.value);
            }}
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
            defaultColDef={{ flex: 1, resizable: true }}
            pagination={true}
            paginationPageSize={10}
            rowData={cafes}
            onGridReady={onGridReady}
          />
        </div>
        <Button
          className="my-5"
          color="info"
          variant="contained"
          onClick={handleAddNewCafe}
        >
          Add New Cafe
        </Button>
      </div>
    </DefaultLayout>
  );
};

export default Cafes;
