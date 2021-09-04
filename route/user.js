const express = require("express");
const router = express.Router();

// mongoose model
const userModel = require("../schema/userSchema");

async function ensureUserNotExist(req, res, next) {
  const phone = req.body.phone;
  try {
    const iUserExist = await userModel.findOne({ phone: `${phone}` });
    iUserExist
      ? res.status(409).json({ status: "user already exist" })
      : next();
  } catch (error) {
    res.send(error);
  }
}

router.get("/login", (req, res) => {
  res.json({ status: "user route success" });
});

router.post("/register", ensureUserNotExist, async (req, res) => {
  const userProfile = req.body;
  try {
    const user = new userModel({ ...userProfile });
    await user.save();
    res.json(user);
  } catch (error) {}
});

module.exports = router;
