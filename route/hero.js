const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const multer = require("multer");

const heroModel = require("../schema/heroSchema");
const menuModel = require("../schema/menuSchema");
const jwtsecret = "hayolo apa lo passwordnya";

// multer implementation
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "photos");
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

function fileFilter(req, file, cb) {
  const isMimeTypeCorrect = ["image/png", "image/jpeg"].includes(file.mimetype);
  if (isMimeTypeCorrect) {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

const upload = multer({ storage, fileFilter });

async function ensureHeroNotExist(req, res, next) {
  const phone = req.body.phone;
  try {
    const hero = await heroModel.findOne({ phone: `${phone}` });
    hero ? res.status(409).json({ status: "hero already exist" }) : next();
  } catch (error) {
    res.send(error);
  }
}

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

router.get("/login", async (req, res) => {
  const { phone, password } = req.body;
  try {
    const hero = await heroModel.findOne({ phone, password });
    if (hero) {
      // create and send jwt with hero profile
      const token = jwt.sign({ id: hero._id }, jwtsecret);
      res.json({
        token,
        id: hero._id,
        name: hero.name,
        phone: hero.phone,
        alamat: {
          rt: hero.alamat.rt,
          rw: hero.alamat.rw,
          jalan: hero.alamat.jalan,
          kelurahan: hero.alamat.kelurahan,
          kecamatan: hero.alamat.kecamatan,
          kota: hero.alamat.kota,
          provinsi: hero.alamat.provinsi,
        },
        transaksi: {
          penjualan: hero.transaksi.penjualan,
          impact: hero.transaksi.impact,
        },
      });
    } else {
      res.status(403).json({ status: "phone or password is wrong" });
    }
  } catch (error) {}
});

router.post("/register", ensureHeroNotExist, async (req, res) => {
  const reqBody = req.body;
  const hero = new heroModel({
    ...reqBody,
  });
  // save data to mongoDB and send response because it's a new one
  try {
    await hero.save();
    res.json({
      id: hero._id,
      name: hero.name,
      phone: hero.phone,
      alamat: {
        rt: hero.alamat.rt,
        rw: hero.alamat.rw,
        jalan: hero.alamat.jalan,
        kelurahan: hero.alamat.kelurahan,
        kecamatan: hero.alamat.kecamatan,
        kota: hero.alamat.kota,
        provinsi: hero.alamat.provinsi,
      },
      transaksi: {
        penjualan: hero.transaksi.penjualan,
        impact: hero.transaksi.impact,
      },
    });
  } catch (error) {}
});

router.get("/secret", verifyJWT, (req, res) => {
  res.json({ id: res.locals.id });
});

router.get("/:heroID", verifyJWT, async (req, res) => {
  const heroIDParam = req.params.heroID;
  const heroIDJWT = res.locals.id;

  if (heroIDParam !== heroIDJWT) {
    res.status(403).json({ status: "Forbidden" });
  } else {
    try {
      const hero = await heroModel.findById(heroIDJWT);
      res.json({
        id: hero._id,
        name: hero.name,
        phone: hero.phone,
        alamat: {
          rt: hero.alamat.rt,
          rw: hero.alamat.rw,
          jalan: hero.alamat.jalan,
          kelurahan: hero.alamat.kelurahan,
          kecamatan: hero.alamat.kecamatan,
          kota: hero.alamat.kota,
          provinsi: hero.alamat.provinsi,
        },
        transaksi: {
          penjualan: hero.transaksi.penjualan,
          impact: hero.transaksi.impact,
        },
      });
    } catch (error) {
      res.status(404).json({ status: "Not found" });
    }
  }
});

router.put("/:heroId", verifyJWT, async (req, res) => {
  const { token, ...newHeroProfileData } = req.body;
  const heroIDJWT = res.locals.id;
  const heroIDParam = newHeroProfileData.id;
  if (heroIDParam !== heroIDJWT) {
    res.status(403).json({ status: "Forbidden" });
  } else {
    const hero = await heroModel.findById(heroIDJWT);

    // update data based on newHeroProfileData
    const { name, alamat } = newHeroProfileData;
    hero.name = name;
    hero.alamat = alamat;

    await hero.save();
    res.json({
      id: hero._id,
      name: hero.name,
      phone: hero.phone,
      alamat: {
        rt: hero.alamat.rt,
        rw: hero.alamat.rw,
        jalan: hero.alamat.jalan,
        kelurahan: hero.alamat.kelurahan,
        kecamatan: hero.alamat.kecamatan,
        kota: hero.alamat.kota,
        provinsi: hero.alamat.provinsi,
      },
      transaksi: {
        penjualan: hero.transaksi.penjualan,
        impact: hero.transaksi.impact,
      },
    });
  }
});

router.get("/:heroID/transactions", verifyJWT, async (req, res) => {
  const heroIDParam = req.params.heroID;
  const heroIDJWT = res.locals.id;
  if (heroIDParam !== heroIDJWT) {
    res.status(403).json({ status: "Forbidden" });
  } else {
    try {
      const { transaksi, ...hero } = await heroModel.findById(heroIDJWT);
      res.json({ transaksi });
    } catch (error) {}
  }
});

router.post("/:heroID/menus", upload.single("photo"), async (req, res) => {
  // besok delete id dari dokumentasi openAPI dan tambahin _id
  const heroID = req.params.heroID;
  const { path } = req.file;
  const { token, name, isfree, price } = req.body;
  try {
    const hero = await heroModel.findById(heroID);
    const menuStructure = {
      name,
      photo: path,
      hero: {
        _id: hero._id,
        name: hero.name,
        phone: hero.phone,
        alamat: hero.alamat,
        transaksi: hero.transaksi,
      },
      isfree: JSON.parse(isfree),
      price,
    };
    const menu = new menuModel({ ...menuStructure });
    await menu.save();
    res.json({
      id: menu.id,
      name: menu.name,
      photo: menu.photo,
      hero: menu.hero,
      isfree: menu.isfree,
      price: menu.price,
    });
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
