const mongoose = require("mongoose");

const CategoryModel = new mongoose.Schema({
    categoryName: { type: String, required: true},
    categoryImage: { type: String, required: true }
});

module.exports = mongoose.model("categories", CategoryModel);