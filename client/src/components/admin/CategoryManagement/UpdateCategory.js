import React, { useState ,useEffect} from "react";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import { useDropzone } from "react-dropzone";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const UpdateCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); 
  const [existingImage, setExistingImage] = useState("");
  const [errors, setErrors] = useState({ categoryName: "", categoryImage: "" });
  const API_BASE = process.env.REACT_APP_API_URL;


  useEffect(() => {
    const categoryId = location.state?.id; 
    if (categoryId) {
      // If categoryId is passed, fetch category data for editing
      axios.post(`${API_BASE}/getCategoryById/${categoryId}`)
        .then((response) => {
          const { categoryName, categoryImage } = response.data;
          setCategoryName(categoryName);
          setExistingImage(categoryImage); // Replacing backslash with forward slash
        })
        .catch((error) => {
          console.error("Error fetching category:", error);
        });
    }
  }, [location.state]);

  const handleImageChange = (e) => {
    setCategoryImage(e.target.files[0]);
  };
  const validateForm = () => {
    let valid = true;
    const newErrors = { categoryName: "", categoryImage: "" };

    if (!categoryName.trim()) {
      newErrors.categoryName = "Category name is required.";
      valid = false;
    } else if (categoryName.length < 3) {
      newErrors.categoryName = "Category name must be at least 3 characters.";
      valid = false;
    }

    if (!existingImage && !categoryImage) {
      newErrors.categoryImage = "Category image is required.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    if (!categoryName || (!categoryImage && !existingImage )) {
      return;
    }
    let imageUrl = existingImage; // Default to existing image
  // If a new image is selected, upload it to Cloudinary
  if (categoryImage) {
    const formData = new FormData();
    formData.append("file", categoryImage);
    formData.append("upload_preset", "eduSphere"); // Cloudinary upload preset

    try {
      const cloudinaryResponse = await axios.post(
        "https://api.cloudinary.com/v1_1/dnmqu8v7b/image/upload",
        formData
      );
      imageUrl = cloudinaryResponse.data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      return;
    }
  }

  // Prepare the category data to send to the backend
  const categoryData = {
    categoryName,
    categoryImage: imageUrl,
  };
    try {
      const response = await axios.post(
        `${API_BASE}/updateCategory/${location.state.id}`,
        categoryData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      navigate("/admin/Category");
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setCategoryImage(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  const handleCancel = () => {
    setCategoryName("");
    setCategoryImage(null);
    navigate("/admin/Category");

  };

  return (
    <main className="main-container">
      <Paper elevation={3} sx={{ padding: 3, margin: "auto" }}>
        <div className="list-category">
          <h3>Update Category</h3>
        </div>
        <form onSubmit={handleSubmit}>
          <Box marginBottom={2}>
            <Typography variant="body1" sx={{ color: "#0F3460", marginBottom: "8px", fontSize: "18px" }}>
              Category Name:
            </Typography>
            <TextField
              sx={{ width: "50%" }}
              variant="outlined"
              size="small"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              error={!!errors.categoryName}
              helperText={errors.categoryName}
            />
          </Box>

          {/* Drag and Drop File Upload */}
          <Typography variant="body1" sx={{ color: "#0F3460", marginBottom: "8px", fontSize: "18px" }}>
            Category Image:
          </Typography>
          <Box
            {...getRootProps()}
            sx={{
              border: "2px dashed #0F3460",
              padding: "20px",
              textAlign: "center",
              cursor: "pointer",
              borderRadius: "8px",
              backgroundColor: "#f9f9f9",
              width: "50%",
            }}
            marginBottom={2}
          >
            <input {...getInputProps()} onChange={handleImageChange} />
            <Typography variant="body1" sx={{ color: "#0F3460", fontSize: "18px" }}>
              Drag & drop an image here, or click to upload
            </Typography>
             {/* Show Existing or New Image */}
             {categoryImage && (
              <div>
                <img
                  src={URL.createObjectURL(categoryImage)}
                  alt="New Category"
                  style={{ margin: "10px auto", width: "50%" }}
                />
                <p>New Image Selected</p>
              </div>
            )}

            {existingImage && !categoryImage && (
              <div>
                <img
                  src={existingImage}
                  alt="Existing Category"
                  style={{ margin: "10px auto", width: "50%" }}
                />
              </div>
            )}
             {errors.categoryImage && (
            <Typography variant="body2" sx={{ color: "red", marginBottom: 2 }}>
              {errors.categoryImage}
            </Typography>
          )}
          </Box>
          <Box display="flex" gap={2} marginTop={2}>
          <Button type="submit" variant="contained" sx={{ backgroundColor: "#0F3460" }}>
              Update
            </Button>
            <Button variant="outlined" sx={{ border: "1px solid #0F3460", color: "#0F3460" }} onClick={handleCancel}>
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </main>
  );
};

export default UpdateCategory;
