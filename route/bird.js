const express = require("express");
const router = express.Router();
const bird = require("../schema/birdSchema");

// define the home page route
router.get("/", async function (req, res) {
  // res.send("Birds home page");

  const kolibri = new bird({
    name: "baru",
  });
  try {
    await kolibri.save();
    res.json(kolibri);
  } catch (error) {
    res.send(error);
  }
});

router.get("/:nama", async function (req, res) {
  const param = req.params.nama;
  const kolibri = new bird({
    name: `${param}`,
  });
  try {
    await kolibri.save();
    res.json(kolibri);
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
