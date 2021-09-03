const express = require("express");
const router = express.Router();

router.get("/login", (req, res) => {
  res.json({ status: "user route success" });
});

router.post("/register", (req, res) => {
  res.json({ status: "register route success" });
});

module.exports = router;
