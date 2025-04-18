const mongoose = require("mongoose");


const UserModel = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    roleID: { type: mongoose.Schema.Types.ObjectId, ref: "role", default: null },
    image: { type: String, default: "" }, // URL to the user profile image
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    dob: { type: Date, default: null },
  },
  { timestamps: true }
);


module.exports = mongoose.model("user", UserModel);
