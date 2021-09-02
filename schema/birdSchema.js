const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const birdSchema = new Schema(
  {
    name: String,
  },
  { versionKey: false }
);

// export model bird
module.exports = model("bird", birdSchema);
