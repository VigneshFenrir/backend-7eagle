const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  categoryname: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const CategoryModel = mongoose.model("category", categorySchema);

module.exports = CategoryModel;
module.exports.categorySchema = categorySchema;
