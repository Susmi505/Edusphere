const bcrypt = require("bcrypt");
const user = require("../models/users");
const Role = require("../models/role")
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { SECRET_KEY } = require("../middleware/authMiddleware"); // Import the shared secret key

//login api
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userDetails = await user.findOne({ email: email }).populate("roleID");

        if (!userDetails) {
            return res.status(404).json({ message: "Invalid username or password" });
        }

        const isMatch = await bcrypt.compare(password, userDetails.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const token = jwt.sign(
            { userId: userDetails._id, email: userDetails.email, role: userDetails.roleID?.role },
            process.env.JWT_SECRET, // Use the static secret key here
            { expiresIn: "7d" }
        );

        res.json({
            message: "Success",
            token: token,
            user: {
                id: userDetails._id,
                firstName: userDetails.firstName,
                lastName: userDetails.lastName,
                email: userDetails.email,
                role: userDetails.roleID?.role || "Unknown",
            }
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


// registration api
exports.register = async (req,res)=>{
    try {
        const { firstName, lastName, email, password } = req.body;
    
        // Validate required fields
        if (!firstName || !lastName || !email || !password) {
          return res.status(400).json({ message: "All fields are required" });
        }

        // Find the "Student" role ID
        const studentRole = await Role.findOne({ role: "Student" });
        if (!studentRole) {
            return res.status(400).json({ message: "Student role not found" });
        }
        // Check if user already exists
        const existingUser = await user.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: "User already exists. Please login!" });
        }
    
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
    
        // Create a new user
        const newUser = await user.create({
          firstName,
          lastName,
          email,
          password: hashedPassword,
          roleID: studentRole._id
        });
    
        res.status(201).json({ message: "Account created successfully", user: newUser });
      } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }


// get email api
exports.getEmail = async (req,res) =>{
    const { email } = req.body;

    try {
        const result = await user.findOne({ email: email });

        if (result) {
            res.json("Success");
        } else {
            res.json("Email not found. Create an account!");
        }
    } catch (error) {
        console.error("Error fetching email:", error);
        res.status(500).json("Something went wrong. Please try again later.");
    }
}


// reset password api
exports.resetPassword = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await user.findOneAndUpdate(
            { email: email },
            { password: hashedPassword },
            { new: true }
        );

        if (result) {
            res.status(200).json({ message: "Password updated successfully" });
        } else {
            res.status(404).json("Email not found. Please check the email and try again.");
        }
    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json("Something went wrong. Please try again later.");
    }
};

exports.getUserByTokenAndEmail = async (req, res) => {
    try {
        const { email } = req.body; // Get email from request body
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        // Find user based on the decoded user ID and provided email
        const users = await user.findOne({ email }).select("-password");
        if (!users) {
            return res.status(404).json({ message: "User not found or unauthorized" });
        }
        res.json(users);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const { firstName, lastName, phone, address, dob, password,image } = req.body;
        // Prepare the update data object
        const updateData = { firstName, lastName, phone, address, dob,image };
        // If a new password is provided, hash and add it to the update data
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword;
        }
        // Update the user in the database
        const updatedUser = await user.findByIdAndUpdate(
            userId,
            updateData,
            { new: true }  // Return the updated user
        );
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        // Return the updated user data
        res.json(updatedUser);
    } catch (error) {
        // Log the error to the console for debugging
        console.error('Error updating profile:', error);

        // Return a 500 error with a more descriptive message
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

