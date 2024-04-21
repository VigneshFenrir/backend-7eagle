const mongoose = require("mongoose");
const { categorySchema } = require("./category");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: categorySchema,
    required: true,
  },
});

const ProductModel = mongoose.model("product", productSchema);

module.exports = ProductModel;
module.exports.productSchema = productSchema;
