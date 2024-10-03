import React, { useEffect } from "react";
import {
  Button,
  TextField,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Select,
  InputLabel,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { SelectChangeEvent } from "@mui/material"; // Import this for Select events

interface EmployeeFormProps {
  initialValues?: any;
  onSubmit: (values: any) => void;
  cafes: any[];
}

const AddEditEmployeeForm: React.FC<EmployeeFormProps> = ({
  initialValues,
  onSubmit,
  cafes,
}) => {
  const { id } = useParams(); // Fetch ID from the route params
  const navigate = useNavigate(); // For navigating back to employees list
  const [formValues, setFormValues] = React.useState(
    initialValues || {
      name: "",
      email_address: "",
      phone_number: "",
      gender: "",
      cafeId: "",
    }
  );

  useEffect(() => {
    if (initialValues) {
      setFormValues(initialValues);
    }
  }, [initialValues]);

  // Separate handler for TextField and RadioGroup inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  // Separate handler for Select input (cafe selection)
  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;

    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formValues);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Employee Name */}
      <TextField
        fullWidth
        required
        helperText="Name must be between 6 and 10 characters"
        inputProps={{ minLength: 6, maxLength: 10 }}
        label="Employee Name"
        margin="normal"
        name="name"
        value={formValues.name}
        onChange={handleInputChange}
      />

      {/* Email Address */}
      <TextField
        fullWidth
        required
        helperText="Please enter a valid email"
        label="Email Address"
        margin="normal"
        name="email_address"
        type="email"
        value={formValues.email_address}
        onChange={handleInputChange}
      />

      {/* Phone Number */}
      <TextField
        fullWidth
        required
        helperText="Phone number must start with 8 or 9 and be 8 digits"
        inputProps={{ pattern: "^[89]\\d{7}$" }}
        label="Phone Number"
        margin="normal"
        name="phone_number"
        value={formValues.phone_number}
        onChange={handleInputChange}
      />

      {/* Gender */}
      <FormControl component="fieldset" margin="normal">
        <FormLabel component="legend">Gender</FormLabel>
        <RadioGroup
          row
          name="gender"
          value={formValues.gender}
          onChange={handleInputChange}
        >
          <FormControlLabel control={<Radio />} label="Male" value="Male" />
          <FormControlLabel control={<Radio />} label="Female" value="Female" />
        </RadioGroup>
      </FormControl>

      {/* Assigned Cafe */}
      <FormControl fullWidth margin="normal">
        <InputLabel id="cafe-select-label">Assigned Cafe</InputLabel>
        <Select
          required
          label="Assigned Cafe"
          labelId="cafe-select-label"
          name="cafeId"
          value={formValues.cafeId}
          onChange={handleSelectChange} // Use the correct handler for SelectChangeEvent
        >
          {cafes.map((cafe) => (
            <MenuItem key={cafe.uuid} value={cafe.uuid}>
              {cafe.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Buttons */}
      <div style={{ marginTop: "16px" }}>
        <Button color="primary" type="submit" variant="contained">
          {id ? "Update Employee" : "Add Employee"}
        </Button>
        <Button
          color="secondary"
          style={{ marginLeft: "10px" }}
          variant="outlined"
          onClick={() => navigate("/employees")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default AddEditEmployeeForm;
