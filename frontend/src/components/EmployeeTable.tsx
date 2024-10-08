import React, { useMemo } from "react";
import { AgGridReact } from "ag-grid-react"; // Ag-Grid for table
import { Button } from "@mui/material"; // Material UI components
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css"; // Use any theme you prefer

interface EmployeeTableProps {
  employees: any[];
  onDelete: (id: string) => void;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  onDelete,
}) => {
  // Define columns for the employee table
  const columns = useMemo(
    () => [
      { headerName: "Employee ID", field: "id", sortable: true, filter: true },
      { headerName: "Name", field: "name", sortable: true, filter: true },
      {
        headerName: "Email",
        field: "email_address",
        sortable: true,
        filter: true,
      },
      {
        headerName: "Phone",
        field: "phone_number",
        sortable: true,
        filter: true,
      },
      {
        headerName: "Days Worked",
        field: "days_worked",
        sortable: true,
        filter: true,
      },
      { headerName: "Café Name", field: "cafe", sortable: true, filter: true },
      {
        headerName: "Actions",
        field: "actions",
        cellRendererFramework: (params: any) => (
          <div className="flex gap-2">
            <Button
              color="primary"
              variant="contained"
              onClick={() => console.log("Edit employee", params.data.id)}
            >
              Edit
            </Button>
            <Button
              color="error"
              variant="contained"
              onClick={() => onDelete(params.data.id)}
            >
              Delete
            </Button>
          </div>
        ),
      },
    ],
    [onDelete]
  );

  return (
    <div className="ag-theme-alpine" style={{ height: "400px", width: "100%" }}>
      <AgGridReact
        columnDefs={columns}
        defaultColDef={{ flex: 1, resizable: true }}
        pagination={true}
        paginationPageSize={10}
        rowData={employees}
      />
    </div>
  );
};

export default EmployeeTable;
