const mongoose = require("mongoose");
const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const categories = require("./routes/categories");
const products = require("./routes/products");
const login = require("./routes/login");
const forgetpsswd = require("./routes/forgetpsswd");

mongoose
  .connect("mongodb://localhost:27017/7eagle")
  .then(() => {
    console.log("Mongodb connetced");
  })
  .catch((err) => {
    console.log(err);
  });

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// routes

app.use("/categories", categories);
app.use("/products", products);
app.use("/login", login);
app.use("/forgetpassword", forgetpsswd);

// connecting mongodb

// const PORT = process.env.PORT || 4000;
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`server listening the port ${PORT}`);
});
