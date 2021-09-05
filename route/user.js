const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const jwtsecret = "hayolo apa lo passwordnya";

// mongoose model
const userModel = require("../schema/userSchema");
const menuModel = require("../schema/menuSchema");
const orderModel = require("../schema/orderSchema");

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

router.get("/:userID/menus", verifyJWT, async (req, res) => {
  const { rt, rw, jalan, kelurahan, kota } = req.query;
  const userID = req.params.userID;
  const userIDJWT = res.locals.id;

  if (userID !== userIDJWT) {
    res.status(403).json({ status: "Forbidden" });
  } else {
    try {
      const menus = await menuModel.find({
        "hero.alamat.rt": parseInt(rt),
        "hero.alamat.rw": parseInt(rw),
        "hero.alamat.jalan": jalan,
        "hero.alamat.kelurahan": kelurahan,
        "hero.alamat.kota": kota,
      });
      // if menu exist near user location
      if (menus.length > 0) {
        res.json(menus);
      } else {
        res.status(404).json({ status: "no menus near your location" });
      }
    } catch (error) {
      res.send(error);
    }
  }
});

router.post("/:userID/menus/:menuID", verifyJWT, async (req, res) => {
  const userID = req.params.userID;
  const menuID = req.params.menuID;
  const userIDJWT = res.locals.id;

  if (userID !== userIDJWT) {
    res.status(403).json({ status: "Forbidden" });
  } else {
    try {
      const user = await userModel.findById(userID);
      const menu = await menuModel.findById(menuID);
      const orderStructure = {
        buyer: {
          user: {
            _id: user._id,
            name: user.name,
            phone: user.phone,
            alamat: user.alamat,
          },
        },
        menu: {
          _id: menu._id,
          name: menu.name,
          photo: menu.photo,
          hero: menu.hero,
          isfree: menu.isfree,
          price: menu.price,
        },
      };
      const order = new orderModel({ ...orderStructure });
      await order.save();
      res.json({ status: "order success" });
    } catch (error) {
      res.send(error);
    }
  }
});

module.exports = router;
