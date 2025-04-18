import React, { useState ,useEffect} from "react";
import { TextField, Button, Box, Typography, Paper, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const AddUser = () => {
    const navigate = useNavigate();
    const location = useLocation(); 
    const [roles, setRoles] = useState([]);
    const API_BASE = process.env.REACT_APP_API_URL;

    const [userData, setUserData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        roleID: "", 
      });

      const [errors, setErrors] = useState({});

      const handleChange = (event) => {
        const { name, value } = event.target;
        setUserData({ ...userData, [name]: value });
      };
    
      const validate = () => {
        let tempErrors = {};
        tempErrors.firstName = userData.firstName ? "" : "First name is required";
        tempErrors.lastName = userData.lastName ? "" : "Last name is required";
        tempErrors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email) ? "" : "Invalid email format";
        tempErrors.password = userData.password.length >= 6 ? "" : "Password must be at least 6 characters";
        tempErrors.roleID = userData.roleID ? "" : "Role is required";
        setErrors(tempErrors);
        return Object.values(tempErrors).every((x) => x === "");
      }

    const handleCancel = () => {
        navigate("/admin/Users");
    };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validate()) {
      try {
        const emailCheck = await axios.post(`${API_BASE}/getEmail`, { email: userData.email });
        // const hashedPassword = await bcrypt.hash(userData.password, 10);
        
        // const userDataWithHashedPassword = { ...userData, password: hashedPassword };
        if (emailCheck.data == "Success") {
          setErrors((prevErrors) => ({
            ...prevErrors,
            email: "Email already exists",
          }));
      } else {
        await axios.post(`${API_BASE}/addUser`, userData);
        navigate("/admin/Users");
      }
    } catch (error) {
        console.error("Error adding user:", error);
      }
    }
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

    fetchRoles();
  }, []);

  return (
     <main className="main-container">
          <Paper elevation={3} sx={{ padding: 3, margin: "auto" }}>
            <div className="list-category">
              <h3>Add new user</h3>
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
                  size="large"
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
                  size="large"
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
                  size="large"
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
                  size="large"
                  value={userData.password} 
                  onChange={handleChange} 
                  error={!!errors.password}
                  helperText={errors.password}
                />
            </Box>
            <Box marginBottom={2}>
                <FormControl fullWidth  sx={{ width: "50%" }}
 variant="outlined" size="small">
                <Typography variant="body1" sx={{ color: "#0F3460", marginBottom: "8px", marginTop:"20px", fontSize: "18px" }}>
                    Select Role:
                </Typography>
                <Select
                    name="roleID" // match the schema field name
                    value={userData.roleID}
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
                  <Typography variant="body2" color="error">
                {errors.roleID}
              </Typography>
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

export default AddUser