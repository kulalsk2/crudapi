const express = require("express");
const app = express();
const morgan = require("morgan");
const productRoute = require("./api/routes/products");
const orderRoute = require("./api/routes/orders");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://admin1:admin1@cluster0.mnpxd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);
app.use(morgan("dev"));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); //* means any website can have access to this api
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With, Content-Type,Accept,Authorisation"
  );
  if (req.method == "OPTIONS") {
    res.header("Access-Controll-Allow-Methods", "PUT,POST,PATCH,DELETE,GET");
    return res.status(200).json({});
  }
  next(); //if removed will result in blocking of the request
});
//routes
app.use("/products", productRoute);
app.use("/orders", orderRoute);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    message: error.message,
  });
});

module.exports = app;
