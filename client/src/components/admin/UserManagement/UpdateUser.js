import React, { useState ,useEffect} from "react";
import { TextField, Button, Box, Typography, Paper, Select, MenuItem, InputLabel, FormControl ,FormHelperText} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const UpdateUser = () => {
    const navigate = useNavigate();
    const location = useLocation(); 
    const [roles, setRoles] = useState([]);

    const [userData, setUserData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        roleID: "", 
        });
        
 const [errors, setErrors] = useState({});
        
 const API_BASE = process.env.REACT_APP_API_URL;

const userId = location.state?.id; // Access the id passed via state

  // Handle input change
  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserData({ ...userData, [name]: value });
};
  const handleCancel = () => {
      navigate("/admin/Users");
  };

// Fetch roles from the API
useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get(`${API_BASE}/roles`); // Adjust the URL to match your backend
        setRoles(response.data); 
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    const fetchUserData = async () => {
      try {
        const response = await axios.post(`${API_BASE}/getUserById/${userId}`);
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (userId) {
      fetchUserData(); // Fetch the user data when the page loads
    }

    fetchRoles();
  }, [userId]);
  const validateForm = () => {
    const newErrors = {};

    if (!userData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!userData.lastName.trim()) newErrors.lastName = "Last name is required";

    if (!userData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!userData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (userData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!userData.roleID) {
      newErrors.roleID = "Role is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) return;

        try {
          if (!userId) {
            console.error("User ID not found");
            return;
          }
          const response = await axios.post(`${API_BASE}/updateUser/${userId}`, userData);
      
          // Redirect or show success message
          navigate("/admin/Users");
        } catch (error) {
          console.error("Failed to update user:", error.response?.data || error.message);
        }
      };
  return (
    <main className="main-container">
    <Paper elevation={3} sx={{ padding: 3, margin: "auto" }}>
      <div className="list-category">
        <h3>Update Existing user</h3>
      </div>
      <form onSubmit={handleSubmit}>
        <Box marginBottom={2}>
          <Typography variant="body1" sx={{ color: "#0F3460", marginBottom: "8px", fontSize: "18px" }}>
            First Name:
          </Typography>
          <TextField
            name="firstName"
            sx={{ width: "50%" }}
            variant="outlined"
            size="medium"
            value={userData.firstName} 
            onChange={handleChange} 
            error={!!errors.firstName}
            helperText={errors.firstName}
          />
        </Box>
        <Box marginBottom={2}>
          <Typography variant="body1" sx={{ color: "#0F3460", marginBottom: "8px", fontSize: "18px" }}>
            Last Name:
          </Typography>
          <TextField
            name="lastName"
            sx={{ width: "50%" }}
            variant="outlined"
            size="medium"
            value={userData.lastName} 
            onChange={handleChange} 
            error={!!errors.lastName}
            helperText={errors.lastName}
          />
        </Box>
        <Box marginBottom={2}>
          <Typography variant="body1" sx={{ color: "#0F3460", marginBottom: "8px", fontSize: "18px" }}>
            Email:
          </Typography>
          <TextField
             name="email"
            sx={{ width: "50%" }}
            variant="outlined"
            size="medium"
            value={userData.email} 
            onChange={handleChange} 
            error={!!errors.email}
            helperText={errors.email}
          />
        </Box>
        <Box marginBottom={2}>
          <Typography variant="body1" sx={{ color: "#0F3460", marginBottom: "8px", fontSize: "18px" }}>
            Password:
          </Typography>
          <TextField
          name="password"
            sx={{ width: "50%" }}
            variant="outlined"
            size="medium"
            value={userData.password} 
            onChange={handleChange} 
            error={!!errors.password}
              helperText={errors.password}
          />
      </Box>
      <Box marginBottom={2}>
          <FormControl fullWidth sx={{ width: "50%" }} variant="outlined" size="small" error={!!errors.roleID}
          >
          <Typography variant="body1" sx={{ color: "#0F3460", marginBottom: "8px", marginTop:"20px", fontSize: "18px" }}>
              Select Role:
          </Typography>
          <Select
            name="roleID"
            value={userData.roleID?._id || userData.roleID || ""}
            onChange={handleChange}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {roles.map((role) => (
              <MenuItem key={role._id} value={role._id}>
                {role.role}
              </MenuItem>
            ))}
          </Select>
          {errors.roleID && <FormHelperText>{errors.roleID}</FormHelperText>}
          </FormControl>
      </Box>
      <Box display="flex" gap={2} marginTop={2}>
          <Button type="submit" variant="contained">Save</Button>
          <Button variant="outlined" sx={{ border: "1px solid #0F3460", color: "#0F3460" }} onClick={handleCancel}>
            Cancel
          </Button>
      </Box>
      </form>
    </Paper>
  </main>
  )
}

export default UpdateUser