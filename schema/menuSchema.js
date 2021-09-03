const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const menu = new Schema(
  {
    name: String,
    photo: String,
    hero: {
      _id: String,
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
      transaksi: {
        penjualan: Number,
        impact: Number,
      },
    },
    isfree: Boolean,
    price: String,
  },
  { versionKey: false }
);

module.exports = model("menu", menu);
