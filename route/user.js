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

function verifyJWT(req, res, next) {
  const token = req.body.token;
  jwt.verify(token, jwtsecret, (err, decoded) => {
    if (err) {
      res.status(401).json({ status: "Unauthorized" });
    } else {
      // save decoded hero id to res.locals and go to next middleware
      res.locals.id = decoded.id;
      next();
    }
  });
}

router.get("/:userID", verifyJWT, async (req, res) => {
  const userID = req.params.userID;
  const userIDJWT = res.locals.id;
  if (userID !== userIDJWT) {
    res.status(403).json({ status: "Forbidden" });
  } else {
    try {
      const user = await userModel.findById(userIDJWT);
      res.json({
        _id: user._id,
        nama: user.name,
        phone: user.phone,
        alamat: user.alamat,
      });
    } catch (error) {
      res.send(error);
    }
  }
});

router.put("/:userID", verifyJWT, async (req, res) => {
  const userID = req.params.userID;
  const userIDJWT = res.locals.id;
  const { token, ...newUserProfile } = req.body;

  if (userID !== userIDJWT) {
    res.status(403).json({ status: "Forbidden" });
  } else {
    try {
      const user = await userModel.findById(userIDJWT);
      user.name = newUserProfile.name;
      user.alamat = newUserProfile.alamat;
      await user.save();
      res.json(user);
    } catch (error) {
      res.send(error);
    }
  }
});
module.exports = router;
