const express = require("express");
router = express.Router();
const CategoryModel = require("../models/category");
const Joi = require("joi");

router.get("/", async (req, res) => {
  const itemPerPage = 10;
  const pageNo = req.query.page;
  const skip = (pageNo - 1) * itemPerPage;
  const item = await CategoryModel.find().limit(itemPerPage).skip(skip);
  res.send(item);
});

// count

router.get("/total", async (req, res) => {
  const item = await CategoryModel.find().count();
  console.log(item);
  res.json(item);
});

router.post("/", async (req, res) => {
  try {
    // handling the err for the joi

    const { error } = validatecategory(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // constructor function to create new

    const categories = new CategoryModel({
      categoryname: req.body.categoryname,
      price: req.body.price,
    });
    const result = await categories.save();
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
    const user = await CategoryModel.findById(id).select("-_id -__v  -otp");
    if (!user) return res.status(404).send(" the given ID was not found.");
    res.send(user);
  } catch (err) {
    console.log(err.message);
  }
});

router.put("/:id", async (req, res) => {
  try {
    // handling the err for the joi
    const { error } = validatecategory(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const id = req.params.id;

    const updateP = await CategoryModel.findByIdAndUpdate(
      id,
      {
        categoryname: req.body.categoryname,
        price: req.body.price,
      },

      { new: true }
    );
    console.log(updateP);

    // In case dosen't match to it will be handle the error
    if (!updateP)
      return res
        .status(404)
        .send("The category with the given ID was not found.");
    res.send("Updated Successfully");
  } catch (err) {
    console.log(err.message);
  }
});

// delete the data

router.delete("/:id", async (req, res) => {
  // In case dosen't match to it will be handle the error
  try {
    const item = await CategoryModel.findByIdAndDelete(req.params.id);
    // In case dosen't match to it will be handle the error
    if (!item)
      return res.status(404).send("The user with the given ID was not found.");
    res.send(" Deleted successfully!");
  } catch (err) {
    console.log(err);
  }
});

function validatecategory(category) {
  const Schema = Joi.object({
    categoryname: Joi.string().required(),
    price: Joi.number().required(),
  });
  result = Schema.validate(category);

  return result;
}
module.exports = router;
