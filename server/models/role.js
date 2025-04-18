const mongoose = require("mongoose");

const RoleModel = new mongoose.Schema({
    role: { type: String, required: true}
});

module.exports = mongoose.model("role", RoleModel);