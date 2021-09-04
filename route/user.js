const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const jwtsecret = "hayolo apa lo passwordnya";

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

router.get("/login", async (req, res) => {
  const { phone, password } = req.body;
  try {
    const user = await userModel.findOne({ phone, password });
    if (user) {
      const token = jwt.sign({ id: user._id }, jwtsecret);
      res.json({
        token,
        _id: user._id,
        name: user.name,
        phone: user.phone,
        alamat: user.alamat,
      });
    } else {
      res.status(403).json({ status: "phone or password is wrong" });
    }
  } catch (error) {
    res.send(error);
  }
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
