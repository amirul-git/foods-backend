const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ status: "get all foodbank okay" });
});

router.get("/:foodbankID", (req, res) => {
  res.json({ status: "get foodbank detail okay" });
});

router.post("/", (req, res) => {
  res.json({ status: "post new foodbank okay" });
});

module.exports = router;
