const express = require("express");
const router = express.Router();

const foodbankModel = require("../schema/foodbankSchema");

router.get("/", async (req, res) => {
  try {
    const foodbanks = await foodbankModel.find({});
    res.json(foodbanks);
  } catch (error) {
    res.send(error);
  }
});

router.get("/:foodbankID", async (req, res) => {
  const foodbankID = req.params.foodbankID;
  try {
    const foodbank = await foodbankModel.findById(foodbankID);
    res.json(foodbank);
  } catch (error) {
    res.send(error);
  }
});

router.post("/", async (req, res) => {
  const { name, phone, link, alamat } = req.body;
  try {
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
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
