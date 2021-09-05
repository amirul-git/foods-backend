const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const foodbank = new Schema({
  name: String,
  phone: String,
  link: {
    lokasi: String,
  },
});

module.exports = model("foodbank", foodbank);
