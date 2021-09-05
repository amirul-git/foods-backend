const express = require("express");
const router = express.Router();

const foodbankModel = require("../schema/foodbankSchema");

router.get("/", (req, res) => {
  res.json({ status: "get all foodbank okay" });
});

router.get("/:foodbankID", (req, res) => {
  res.json({ status: "get foodbank detail okay" });
});

router.post("/", async (req, res) => {
  const { name, phone, link, alamat } = req.body;
  const foodbank = new foodbankModel({
    name,
    phone,
    alamat,
    link: {
      lokasi: link,
    },
  });
  await foodbank.save();
  res.json(foodbank);
});

module.exports = router;
