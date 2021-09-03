const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const port = 3000;

// route
const hero = require("./route/hero");

// middleware
app.use(express.json());
app.use("/photos", express.static(path.join(__dirname, "photos")));
app.use("/hero", hero);
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
