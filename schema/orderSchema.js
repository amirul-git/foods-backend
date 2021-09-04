const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const order = new Schema(
  {
    buyer: {
      user: {
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
      },
    },
    menu: {
      _id: String,
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
  },
  {
    versionKey: false,
  }
);

module.exports = model("order", order);
