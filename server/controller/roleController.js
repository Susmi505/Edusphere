const bcrypt = require("bcrypt");
const user = require("../models/users");
const Role = require("../models/role")
const jwt = require("jsonwebtoken");


// GET API to fetch all roles
exports.getRoles = async (req, res) => {
    try {
        const roles = await Role.find();
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch roles", error });
    }
};