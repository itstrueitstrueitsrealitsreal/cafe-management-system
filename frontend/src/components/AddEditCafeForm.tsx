import React, { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Grid,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom"; // Ensure you're using react-router
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

interface CafeFormProps {
  initialValues?: any;
  onSubmit: (values: any) => void;
}

const AddEditCafeForm: React.FC<CafeFormProps> = ({
  initialValues,
  onSubmit,
}) => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State for form values
  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
    location: "",
    logo: null,
  });

  // State for handling file uploads
  const [fileList, setFileList] = useState<File | null>(null);

  useEffect(() => {
    if (initialValues) {
      setFormValues(initialValues);
    }
  }, [initialValues]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileList(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Attach fileList (if any) to the form submission values
    const finalValues = { ...formValues, logo: fileList };

    onSubmit(finalValues);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography gutterBottom variant="h5">
        {id ? "Edit Cafe" : "Add New Cafe"}
      </Typography>

      {/* Cafe Name */}
      <TextField
        fullWidth
        required
        helperText="Name must be between 6 and 10 characters"
        inputProps={{ minLength: 6, maxLength: 10 }}
        label="Cafe Name"
        margin="normal"
        name="name"
        value={formValues.name}
        onChange={handleInputChange}
      />

      {/* Description */}
      <TextField
        fullWidth
        multiline
        required
        helperText="Description cannot be longer than 256 characters"
        inputProps={{ maxLength: 256 }}
        label="Description"
        margin="normal"
        name="description"
        rows={4}
        value={formValues.description}
        onChange={handleInputChange}
      />

      {/* Location */}
      <TextField
        fullWidth
        required
        label="Location"
        margin="normal"
        name="location"
        value={formValues.location}
        onChange={handleInputChange}
      />

      {/* Upload Logo */}
      <FormControl fullWidth margin="normal">
        <InputLabel htmlFor="logo-upload">Logo</InputLabel>
        <input
          accept="image/*"
          id="logo-upload"
          style={{ display: "none" }}
          type="file"
          onChange={handleFileChange}
        />
        <label htmlFor="logo-upload">
          <Button
            color="primary"
            component="span"
            startIcon={<CloudUploadIcon />}
            variant="outlined"
          >
            Upload Logo
          </Button>
          {fileList && (
            <Typography
              style={{ display: "block", marginTop: "8px" }}
              variant="caption"
            >
              {fileList.name}
            </Typography>
          )}
        </label>
      </FormControl>

      {/* Buttons */}
      <Grid container spacing={2} style={{ marginTop: "16px" }}>
        <Grid item>
          <Button color="primary" type="submit" variant="contained">
            {id ? "Update Cafe" : "Add Cafe"}
          </Button>
        </Grid>
        <Grid item>
          <Button
            color="secondary"
            variant="outlined"
            onClick={() => navigate("/cafes")}
          >
            Cancel
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default AddEditCafeForm;
