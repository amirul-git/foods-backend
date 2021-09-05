const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const foodbank = new Schema(
  {
    name: String,
    phone: String,
    alamat: {
      rt: Number,
      rw: Number,
      jalan: String,
      kelurahan: String,
      kecamatan: String,
      kota: String,
      provinsi: String,
    },
    link: {
      lokasi: String,
    },
  },
  { versionKey: false }
);

module.exports = model("foodbank", foodbank);
