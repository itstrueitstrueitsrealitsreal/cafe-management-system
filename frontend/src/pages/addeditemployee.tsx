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

import {
  useAddEmployee,
  useUpdateEmployee,
  useEmployee,
  useCafes,
} from "../utils/api";
import { Employee } from "../types/Employee";

import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

export default function AddEditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEditMode = id && id !== "new";

  const {
    data: employeeData,
    isLoading: isEmployeeLoading,
    error: employeeError,
  } = useEmployee(isEditMode ? id : "");

  const addEmployeeMutation = useAddEmployee();
  const updateEmployeeMutation = useUpdateEmployee();
  const { data: cafesData, isLoading: isCafesLoading } = useCafes();

  const [hasChanges, setHasChanges] = useState(false);
  const [employee, setEmployee] = useState<Employee>({
    name: "",
    email_address: "",
    phone_number: "",
    gender: "Male",
    cafeId: "",
  });

  useEffect(() => {
    if (isEditMode && employeeData) {
      setEmployee({
        name: employeeData.name || "",
        email_address: employeeData.email_address || "",
        phone_number: employeeData.phone_number || "",
        gender: employeeData.gender || "Male",
        cafeId: employeeData.cafe?.id || "",
      });
    }
  }, [isEditMode, employeeData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setEmployee({ ...employee, [name]: value });
    setHasChanges(true);
  };

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
    navigate("/employees");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const employeeData = {
      name: employee.name,
      email_address: employee.email_address,
      phone_number: employee.phone_number,
      gender: employee.gender,
      cafeId: employee.cafeId || undefined,
    };

    if (isEditMode) {
      updateEmployeeMutation.mutate(
        { id: id!, employee: employeeData },
        {
          onSuccess: () => {
            setHasChanges(false);
            navigate("/employees");
          },
          onError: (error) => console.error("Error updating employee:", error),
        }
      );
    } else {
      addEmployeeMutation.mutate(employeeData, {
        onSuccess: () => {
          setHasChanges(false);
          navigate("/employees");
        },
        onError: (error) => console.error("Error adding employee:", error),
      });
    }
  };

  if (isEmployeeLoading || isCafesLoading) {
    return (
      <div className="flex justify-center mt-5">
        <CircularProgress />
      </div>
    );
  }

  if (employeeError) {
    return (
      <div className="text-center mt-5 text-red-600">
        <Typography variant="h6">Error fetching employee data</Typography>
        <p>{employeeError.message}</p>
      </div>
    );
  }

  return (
    <DefaultLayout>
      <div className="text-center pt-8">
        <h1 className={`${title()} mb-8`}>
          {isEditMode ? "Edit Employee" : "Add New Employee"}
        </h1>
        <div className="my-5">
          <Card className="w-full max-w-2xl shadow-lg mx-auto">
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  required
                  label="Employee Name"
                  name="name"
                  value={employee.name || ""}
                  variant="outlined"
                  onChange={handleInputChange}
                />
                <TextField
                  fullWidth
                  required
                  label="Email Address"
                  name="email_address"
                  type="email"
                  value={employee.email_address || ""}
                  variant="outlined"
                  onChange={handleInputChange}
                />
                <TextField
                  fullWidth
                  required
                  label="Phone Number"
                  name="phone_number"
                  value={employee.phone_number || ""}
                  variant="outlined"
                  onChange={handleInputChange}
                />
                <TextField
                  fullWidth
                  required
                  select
                  SelectProps={{ native: true }}
                  label="Assigned Cafe"
                  name="cafeId"
                  value={employee.cafeId}
                  variant="outlined"
                  onChange={handleInputChange}
                >
                  <option value="">{employeeData?.cafe?.name || ""}</option>
                  {cafesData?.map((cafe) => (
                    <option key={cafe.id} value={cafe.id}>
                      {cafe.name}
                    </option>
                  ))}
                </TextField>
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
                    {isEditMode ? "Update Employee" : "Add Employee"}
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
