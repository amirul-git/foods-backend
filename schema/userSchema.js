const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const user = new Schema({
  name: String,
  phone: String,
  password: String,
  alamat: {
    rt: Number,
    rw: Number,
    jalan: String,
    kelurahan: String,
    kecamatan: String,
    kota: String,
    provinsi: String,
  },
});

module.exports = model("user", user);
