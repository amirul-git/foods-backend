const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const heroModel = require("../schema/heroSchema");

const jwtsecret = "hayolo apa lo passwordnya";

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

module.exports = router;
