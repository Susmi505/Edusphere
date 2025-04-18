import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Select,
  MenuItem,
  FormControl,
  helperText
} from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useDropzone } from "react-dropzone";
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';

function UpdateCourse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null); // Reference for file input
  const API_BASE = process.env.REACT_APP_API_URL;
  const [errors, setErrors] = useState({});

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    heading: "",
    longDescription: "",
    categoryID: "",
    duration: "2 weeks",
    price: "",
    existingImage: "",
    courseImage: null,
    existingVideos: [],
    videos: [],
  });

  // Video progress tracking state
  const [uploadProgress, setUploadProgress] = useState([]);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);

  // Delete confirmation dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [videoToDeleteIndex, setVideoToDeleteIndex] = useState(null);
  const [isExistingVideo, setIsExistingVideo] = useState(false);
  const validateForm = () => {
    const newErrors = {};
  
    if (!formData.title.trim()) newErrors.title = "Title is required.";
    if (!formData.shortDescription.trim()) newErrors.shortDescription = "Short description is required.";
    if (!formData.heading.trim()) newErrors.heading = "Heading is required.";
    if (!formData.longDescription.trim()) newErrors.longDescription = "Long description is required.";
    if (!formData.categoryID) newErrors.categoryID = "Please select a category.";
    if (formData.price === null || formData.price === undefined || formData.price === '') {
      newErrors.price = "Price is required.";
    } else if (isNaN(formData.price)) {
      newErrors.price = "Price must be a number.";
    } else if (Number(formData.price) < 0) {
      newErrors.price = "Price cannot be negative.";
    }
    setErrors(newErrors);
  
    return Object.keys(newErrors).length === 0;
  };
  const handleDeleteIconClick = (e, index, isExisting = false) => {
    e.stopPropagation(); // prevent file input popup
    setVideoToDeleteIndex(index);
    setIsExistingVideo(isExisting);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setVideoToDeleteIndex(null);
    setIsExistingVideo(false);
  };

  const handleDelete = () => {
    if (videoToDeleteIndex !== null) {
      if (isExistingVideo) {
        // Delete from existing videos
        const updatedExistingVideos = formData.existingVideos.filter((_, index) => index !== videoToDeleteIndex);
        setFormData({ ...formData, existingVideos: updatedExistingVideos });
      } else {
        // Delete from new videos
        const updatedVideos = formData.videos.filter((_, index) => index !== videoToDeleteIndex);
        setFormData({ ...formData, videos: updatedVideos });

        const updatedProgress = uploadProgress.filter((_, index) => index !== videoToDeleteIndex);
        setUploadProgress(updatedProgress);
      }
    }

    setOpenDialog(false);
    setVideoToDeleteIndex(null);
    setIsExistingVideo(false);
  };

  // Fetch course details
  useEffect(() => {
    axios
      .get(`${API_BASE}/getCourseById/${id}`)
      .then((response) => {
        const course = response.data;
        if (course) {
          setFormData({
            title: course.title || "",
            shortDescription: course.shortDescription || "",
            heading: course.heading || "",
            longDescription: course.longDescription || "",
            categoryID: course.categoryID?._id || course.categoryID || "",
            duration: course.duration || "2 weeks",
            price: course.price || "",
            existingImage: course.courseImage
              ? course.courseImage
              : "",
            courseImage: null,
            existingVideos: course.videos
              ? course.videos
              : [],
            videos: [],
          });
        }
      })
      .catch((error) => console.error("Error fetching course:", error));
  }, [id]);

  // Fetch categories
  useEffect(() => {
    axios.post(`${API_BASE}/getCategory`)
      .then(response => {
        setCategories(response.data.categories);
      })
      .catch(error => console.error("Error fetching categories:", error));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditorChange = (value, field) => {
    setFormData({ ...formData, [field]: value });
  };

  // File input handler
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setFormData({ ...formData, courseImage: file });
      } else if (file.type.startsWith("video/")) {
        setFormData((prevData) => ({
          ...prevData,
          videos: [...prevData.videos, file], // Append videos for multiple files
        }));
      }
    }
  };

  // Dropzone for drag-and-drop file uploads
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png']
    },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFormData({ ...formData, courseImage: acceptedFiles[0] });
      }
    },
  });

  // Handle video upload
  const { getRootProps: getVideoRootProps, getInputProps: getVideoInputProps } = useDropzone({
    accept: {
      'video/*': []
    },
    multiple: true, // Allow multiple video selection
    onDrop: (acceptedFiles) => {
      setFormData((prevData) => ({
        ...prevData,
        videos: [...prevData.videos || [], ...acceptedFiles], // Append new videos
      }));

      // Initialize progress for new videos
      setUploadProgress(prev => {
        const newProgress = [...prev];
        for (let i = 0; i < acceptedFiles.length; i++) {
          newProgress.push(0);
        }
        return newProgress;
      });
    },
  });



  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // Handle image upload if a new one is provided
      let imageUrl = formData.existingImage;
      if (formData.courseImage && formData.courseImage !== formData.existingImage) {
        const uploadData = new FormData();
        uploadData.append("file", formData.courseImage);
        uploadData.append("upload_preset", "eduSphere");

        const cloudinaryResponse = await axios.post(
          "https://api.cloudinary.com/v1_1/dnmqu8v7b/image/upload",
          uploadData,
          {
            onUploadProgress: (progressEvent) => {
              const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setImageUploadProgress(percent);
            },
          }
        );
        imageUrl = cloudinaryResponse.data.secure_url;
      }

      // Start with existing videos
      const videoUrls = [...formData.existingVideos];

      // Upload new videos if provided
      if (formData.videos && formData.videos.length > 0) {
        for (let i = 0; i < formData.videos.length; i++) {
          const video = formData.videos[i];
          const uploadData = new FormData();
          uploadData.append("file", video);
          uploadData.append("upload_preset", "eduSphere");

          const cloudinaryVideoResponse = await axios.post(
            "https://api.cloudinary.com/v1_1/dnmqu8v7b/video/upload",
            uploadData,
            {
              onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setUploadProgress(prev => {
                  const updated = [...prev];
                  updated[i] = percentCompleted;
                  return updated;
                });
              },
            }
          );
          videoUrls.push(cloudinaryVideoResponse.data.secure_url);
        }
      }

      const courseData = {
        title: formData.title,
        shortDescription: formData.shortDescription,
        heading: formData.heading,
        longDescription: formData.longDescription,
        categoryID: formData.categoryID,
        duration: formData.duration,
        price: formData.price,
        courseImage: imageUrl,
        videos: videoUrls,
      };

      await axios.post(`${API_BASE}/updateCourse/${id}`, courseData);
      navigate("/admin/courses");
    } catch (error) {
      console.error("Error updating course:", error);
    }
  }; // This closing bracket was missing

  return (
    <main className="main-container">
      <Paper elevation={3} sx={{ padding: 3, margin: "auto" }}>
        <div className="list-category">
          <h3>Update Course</h3>
        </div>
        <form onSubmit={handleSubmit}>
          <Box marginBottom={2}>
            <Typography variant="body1" sx={{ color: "#0F3460", fontSize: "18px" }}>
              Course Title:
            </Typography>
            <TextField
              sx={{ width: "50%" }}
              variant="outlined"
              size="small"
              name="title"
              value={formData.title}
              onChange={handleChange}
              error={!!errors.title}
              helperText={errors.title}
            />
          </Box>

          <Typography variant="body1" sx={{ color: "#0F3460", fontSize: "18px" }}>
            Short Description:
          </Typography>
          <TextField
            sx={{ width: "50%" }}
            variant="outlined"
            size="small"
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
            multiline
            rows={4}
            error={!!errors.shortDescription}
            helperText={errors.shortDescription}
          />

          <Box marginBottom={2}>
            <Typography variant="body1" sx={{ color: "#0F3460", fontSize: "18px" }}>
              Heading:
            </Typography>
            <TextField
              sx={{ width: "50%" }}
              variant="outlined"
              size="small"
              name="heading"
              value={formData.heading}
              onChange={handleChange}
            />
          </Box>

          <Typography variant="body1" sx={{ color: "#0F3460", fontSize: "18px" }}>
            Long Description:
          </Typography>
          <ReactQuill
            value={formData.longDescription}
            onChange={(value) => handleEditorChange(value, 'longDescription')}
            theme="snow"
            style={{ height: "200px", marginBottom: "35px" }}
          />

          <Box marginBottom={2}>
            <FormControl fullWidth variant="outlined" size="small"  error={!!errors.categoryID}>
              <Typography variant="body1" sx={{ color: "#0F3460", fontSize: "18px", marginTop: "25px" }}>
                Select Category:
              </Typography>
              <Select
                name="categoryID"
                value={formData.categoryID || ""} // Ensures existing category is shown
                onChange={handleChange}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.categoryName}
                  </MenuItem>
                ))}
              </Select>
              {errors.categoryID && <Typography variant="caption" color="error">{errors.categoryID}</Typography>}
            </FormControl>
          </Box>

          <Box marginBottom={2}>
            <Typography variant="body1" sx={{ color: "#0F3460", fontSize: "18px" }}>
              Duration:
            </Typography>
            <Select
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              sx={{ width: "50%" }}
            >
              <MenuItem value="2 weeks">2 Weeks</MenuItem>
              <MenuItem value="1 month">1 Month</MenuItem>
              <MenuItem value="3 months">3 Months</MenuItem>
              <MenuItem value="6 months">6 Months</MenuItem>
            </Select>
          </Box>

          <Box marginBottom={2}>
            <Typography variant="body1" sx={{ color: "#0F3460", fontSize: "18px" }}>
              Price:
            </Typography>
            <TextField
              sx={{ width: "50%" }}
              variant="outlined"
              size="small"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              error={!!errors.price}
              helperText={errors.price}
            />
          </Box>

          <Typography variant="body1" sx={{ color: "#0F3460", fontSize: "18px" }}>
            Course Image:
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
            <input {...getInputProps()} />
            <Typography variant="body1" sx={{ color: "#0F3460", fontSize: "18px" }}>
              Drag & drop an image here, or click to upload
            </Typography>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />

            {/* Display new image with progress bar to the right */}
            {formData.courseImage && (
              <Box sx={{
                marginTop: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}>
                <Box>
                  <Typography variant="body2" sx={{ color: "green", mb: 1, textAlign: "left" }}>
                    {formData.courseImage.name}
                  </Typography>
                  <img
                    src={URL.createObjectURL(formData.courseImage)}
                    alt="Preview"
                    style={{
                      maxWidth: "100px",
                      maxHeight: "100px",
                    }}
                  />
                </Box>

                {/* Progress bar to the right */}
                {imageUploadProgress > 0 && (
                  <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "50%",
                    ml: 2
                  }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Box sx={{ flexGrow: 1 }}>
                        <Box
                          sx={{
                            height: 10,
                            backgroundColor: "#ccc",
                            borderRadius: 5,
                            overflow: "hidden",
                          }}
                        >
                          <Box
                            sx={{
                              height: "100%",
                              width: `${imageUploadProgress || 0}%`,
                              backgroundColor: "#0F3460",
                            }}
                          />
                        </Box>
                      </Box>
                      <Typography variant="caption">{imageUploadProgress || 0}%</Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            )}

            {/* Display existing image */}
            {formData.existingImage && !formData.courseImage && (
              <Box sx={{ marginTop: 1, textAlign: "left" }}>
                <Typography variant="body2" sx={{ color: "green", mb: 1 }}>
                  Current Image
                </Typography>
                <img
                  src={formData.existingImage}
                  alt="Existing"
                  style={{
                    maxWidth: "100px",
                    maxHeight: "100px",
                  }}
                />
              </Box>
            )}
          </Box>

          {/* Course Video Upload */}
          <Typography variant="body1" sx={{ color: "#0F3460", marginBottom: "8px", fontSize: "18px" }}>
            Course Video:
          </Typography>
          <Box
            {...getVideoRootProps()}
            sx={{
              border: "2px dashed #0F3460",
              padding: "20px",
              textAlign: "center",
              cursor: "pointer",
              borderRadius: "8px",
              backgroundColor: "#f9f9f9",
              width: "50%"
            }}
            marginBottom={2}
          >
            <input {...getVideoInputProps()} />
            <Typography variant="body1" sx={{ color: "#0F3460", fontSize: "18px" }}>
              Drag & drop videos here, or click to upload
            </Typography>

            {/* Display existing videos with thumbnails */}
            {formData.existingVideos && formData.existingVideos.length > 0 && (
              <Box sx={{ marginTop: 1 }}>
                <Typography variant="body2" sx={{ color: "green", mb: 1, textAlign: "left" }}>
                  Existing Videos:
                </Typography>

                {formData.existingVideos.map((videoUrl, index) => (
                  <Box
                    key={`existing-${index}`}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 2,
                      mb: 2,
                      border: "1px solid #eee",
                      p: 1,
                      borderRadius: 1,
                    }}
                  >
                    {/* Video Thumbnail */}
                    <Box sx={{ width: "120px", height: "80px", overflow: "hidden", position: "relative" }}>
                      <video
                        src={videoUrl}
                        alt={`Video ${index + 1}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        muted
                        playsInline
                        loop
                        autoPlay
                      />
                    </Box>

                    {/* Delete Icon */}
                    <DeleteIcon
                      sx={{ color: "#D32F2F", cursor: "pointer" }}
                      onClick={(e) => handleDeleteIconClick(e, index, true)}
                    />
                  </Box>
                ))}
              </Box>
            )}

            {/* Display selected new videos */}
            {formData.videos && formData.videos.length > 0 && (
              <Box sx={{ marginTop: 1 }}>
                <Typography variant="body2" sx={{ color: "green", mb: 1, textAlign: "left" }}>
                  New Videos:
                </Typography>

                {formData.videos.map((video, index) => (
                  <Box
                    key={`new-${index}`}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 1,
                    }}
                  >
                    {/* Video Name */}
                    <Typography
                      variant="body2"
                      sx={{ color: "#0F3460", minWidth: "150px", wordBreak: "break-word", textAlign: "left" }}
                    >
                      {video.name}
                    </Typography>

                    {/* Progress Bar */}
                    <Box sx={{ flexGrow: 1 }}>
                      <Box sx={{ height: 10, backgroundColor: "#ccc", borderRadius: 5 }}>
                        <Box
                          sx={{
                            height: "100%",
                            width: `${uploadProgress[index] || 0}%`,
                            backgroundColor: "#0F3460",
                            borderRadius: 5,
                          }}
                        />
                      </Box>
                    </Box>

                    {/* Percentage */}
                    <Typography variant="caption" sx={{ minWidth: "35px" }}>
                      {uploadProgress[index] || 0}%
                    </Typography>

                    {/* Delete Icon */}
                    <DeleteIcon
                      sx={{ color: "#D32F2F", cursor: "pointer" }}
                      onClick={(e) => handleDeleteIconClick(e, index, false)}
                    />
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          <Box display="flex" gap={2} marginTop={2}>
            <Button type="submit" variant="contained" sx={{ backgroundColor: "#0F3460" }}>
              Update Course
            </Button>
            <Button
              variant="outlined"
              sx={{ border: "1px solid #0F3460", color: "#0F3460" }}
              onClick={() => navigate("/admin/courses")} // Replace "/courses" with your actual route
            >
              Cancel
            </Button>
          </Box>

        </form>

        {/* Confirmation Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleDialogClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this video?
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="primary">Cancel</Button>
            <Button onClick={handleDelete} color="warning" autoFocus>Confirm</Button>
          </DialogActions>
        </Dialog>

      </Paper>
    </main>
  );
}

export default UpdateCourse;