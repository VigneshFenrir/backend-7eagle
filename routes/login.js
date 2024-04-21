const express = require("express");
router = express.Router();
const UserModel = require("../models/user");
const Joi = require("joi");

// to get the data

router.get("/signin", async (req, res) => {
  const itemPerPage = 10;
  const pageNo = req.query.page;
  const skip = (pageNo - 1) * itemPerPage;
  const users = await UserModel.find().limit(itemPerPage).skip(skip);
  res.send(users);
});

// count

router.get("/total", async (req, res) => {
  const item = await UserModel.find().count();
  console.log(item);
  res.json(item);
});

// to request & response to the api and database /  signin

router.post("/signin", async (req, res) => {
  try {
    const { error } = validateSignIn(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const { password, confirm_password } = req.body;
    if (password !== confirm_password) {
      return res.status(400).json("Passwords Doesn't Match");
    }
    const poster = new UserModel(req.body);
    const result = await poster.save();
    console.log(result);
    res.send("created successfully");
  } catch (error) {
    console.log(error);
  }
});

//   update the data to database

router.get("/signin/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const user = await UserModel.findById(id).select("-_id -__v  -otp");
    if (!user)
      return res
        .status(404)
        .send("The course with the given ID was not found.");
    res.send(user);
  } catch (err) {
    console.log(err.message);
  }
});

router.put("/signin/:id", async (req, res) => {
  try {
    // handling the err for the joi
    const { error } = validateSignIn(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const id = req.params.id;
    const { password, confirm_password } = req.body;
    if (password !== confirm_password) {
      return res.status(400).json("Passwords Doesn't Match");
    }

    const user = await UserModel.findByIdAndUpdate(
      id,
      {
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mobile,
        password: req.body.password,
      },

      { new: true }
    );
    console.log(user);

    // In case dosen't match to it will be handle the error
    if (!user)
      return res.status(404).send("The user with the given ID was not found.");
    res.send("Updated Successfully");
  } catch (err) {
    console.log(err.message);
  }
});

// delete the data

router.delete("/signin/:id", async (req, res) => {
  try {
    const item = await UserModel.findByIdAndDelete(req.params.id);
    // In case dosen't match to it will be handle the error
    if (!item)
      return res.status(404).send("The user with the given ID was not found.");
    res.send(" Deleted successfully!");
  } catch (err) {
    console.log(err);
  }
});

// to request & response to the api and database /  login

router.post("/", async (req, res) => {
  try {
    // handling the err for the joi
    const { error } = validateLogin(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const { email, password } = req.body;
    const Logining = await UserModel.findOne({ email, password });
    console.log(Logining);
    // In case dosen't match to it will be handle the error
    if (!Logining) {
      return res.status(400).send("Invalid Email Id & password");
    }
    res.send("Logining Successfully");
  } catch (err) {
    console.log(err.message);
  }
});

// joi and validation function

function validateSignIn(signUp) {
  const Schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    mobile: Joi.string().required(),
    password: Joi.string().required(),
    confirm_password: Joi.string(),
  });
  const result = Schema.validate(signUp);
  return result;
}
function validateLogin(Login) {
  const Schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  });
  const result = Schema.validate(Login);
  return result;
}
module.exports = router;
