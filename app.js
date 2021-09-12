const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const port = 3000;

// route
const user = require("./route/user");
const hero = require("./route/hero");
const foodbank = require("./route/foodbank");

// middleware
app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/photos", express.static(path.join(__dirname, "photos")));
app.use("/user", user);
app.use("/hero", hero);
app.use("/foodbank", foodbank);
app.use((req, res) => {
  res.status(404).send("Not Found");
});

mongoose
  .connect(
    "mongodb+srv://wh04m1:AdRQiujjrcX5PQA@cluster.9p65h.mongodb.net/foods?retryWrites=true&w=majority"
  )
  .then(
    app.listen(port, function () {
      console.log("server running");
    })
  )
  .catch((err) => {
    console.log(err);
  });
