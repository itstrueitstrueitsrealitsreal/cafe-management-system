import React from "react";
import { AgGridReact } from "ag-grid-react"; // Ag-Grid
import { Button } from "@mui/material"; // Material-UI Button
import { useNavigate } from "react-router-dom"; // React Router
import { ColDef } from "ag-grid-community"; // Ag-Grid column definitions
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import { Cafe } from "@/types/Cafe";
interface CafeTableProps {
  cafes: Cafe[];
  onDelete: (id: string) => void;
}

const CafeTable: React.FC<CafeTableProps> = ({ cafes, onDelete }) => {
  const navigate = useNavigate();

  // Define the columns for Ag-Grid with correct typing
  const columns: ColDef<Cafe>[] = [
    {
      headerName: "Logo",
      field: "logo",
      cellRenderer: "imageRenderer", // Use the custom ImageRenderer for the logo
    },
    { headerName: "Name", field: "name" },
    { headerName: "Description", field: "description" },
    { headerName: "Employees", field: "employees" },
    { headerName: "Location", field: "location" },
    {
      headerName: "Actions",
      cellRenderer: (params: any) => (
        <>
          <Button
            color="primary"
            style={{ marginRight: "10px" }}
            variant="contained"
            onClick={() => navigate(`/cafes/${params.data.uuid}`)}
          >
            Edit
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => onDelete(params.data.uuid)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="ag-theme-alpine" style={{ height: "400px", width: "100%" }}>
      <AgGridReact columnDefs={columns} rowData={cafes} />
    </div>
  );
};

export default CafeTable;
