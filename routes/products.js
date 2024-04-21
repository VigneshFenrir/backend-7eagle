const express = require("express");
router = express.Router();
const Joi = require("joi");
const ProductModel = require("../models/product");
const CategoryModel = require("../models/category");

router.get("/", async (req, res) => {
  try {
    itemPerPage = 10;
    const pageNo = req.query.page;
    const skip = (pageNo - 1) * itemPerPage;
    const item = await ProductModel.find().limit(itemPerPage).skip(skip);
    res.send(item);
  } catch (err) {
    console.log(err);
    res.status(404).send(err.message);
  }
});

// count

router.get("/total", async (req, res) => {
  const item = await ProductModel.find().count();
  console.log(item);
  res.json(item);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const item = await ProductModel.findById(id);
    if (!item)
      return res
        .status(404)
        .send("The products with the given ID was not found.");
    res.send(item);
  } catch (err) {
    console.log(err.message);
  }
});

router.post("/", async (req, res) => {
  try {
    // handling the err for the joi
    const { error } = validateProduct(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const category = await CategoryModel.findById(req.body.category);
    // In case dosen't match to it will be handle the error

    console.log("spidey", category);

    if (!category) return res.status(400).send("invalid category");
    // constructor function to create new

    const product = new ProductModel({
      name: req.body.name,
      category: {
        _id: category._id,
        categoryname: category.categoryname,
        price: category.price,
      },
    });
    const result = await product.save();
    console.log(result);
    res.send("Created Successfully");
  } catch (err) {
    console.log(err);
    res.status(404).send(err.message);
  }
});

//   update the data to database

router.get("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const prod = await ProductModel.findById(id).select("-_id -__v  -otp");
    if (!prod)
      return res
        .status(404)
        .send("The course with the given ID was not found.");
    res.send(prod);
  } catch (err) {
    console.log(err.message);
  }
});

router.put("/:id", async (req, res) => {
  // handling the err for the joi

  const { error } = validateProduct(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const category = await CategoryModel.findById(req.body.category);

  // In case dosen't match to it will be handle the error

  if (!category) return res.status(400).send("invalid category");

  const product = await ProductModel.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      category: {
        _id: category._id,
        categoryname: category.categoryname,
        price: category.price,
      },
    },
    { new: true }
  );
  if (!product)
    // In case dosen't match to it will be handle the error

    return res.status(404).send("The product with the given ID was not found.");
  res.send("Updated Successfully");
});

// delete the data

router.delete("/:id", async (req, res) => {
  try {
    const product = await ProductModel.findByIdAndDelete(req.params.id);
    // In case dosen't match to it will be handle the error

    if (!product)
      return res
        .status(404)
        .send("The product with the given ID was not found.");
    res.send(" Deleted successfully!");
  } catch (err) {
    console.log(err);
  }
});

function validateProduct(product) {
  const Schema = Joi.object({
    name: Joi.string().required(),
    category: Joi.string().required(),
  });
  result = Schema.validate(product);
  return result;
}

module.exports = router;
