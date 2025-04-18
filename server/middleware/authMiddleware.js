const jwt = require("jsonwebtoken");
const crypto = require("crypto");
require('dotenv').config();

// Generate a secure random secret key
const SECRET_KEY = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }

        try {
            const decoded = jwt.verify(token, SECRET_KEY);
            req.user = decoded; // Store decoded user info in request object
            next(); // Proceed to the next middleware or controller
        } catch (error) {
            res.status(400).json({ message: "Invalid token." });
        }
    };

    module.exports = { authMiddleware, SECRET_KEY };
