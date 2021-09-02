const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const hero = new Schema(
  {
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
    transaksi: {
      penjualan: Number,
      impact: Number,
    },
  },
  { versionKey: false }
);
module.exports = model("hero", hero);
