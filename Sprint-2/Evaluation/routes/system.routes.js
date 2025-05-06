const express = require("express");
const fs = require("fs");
const os = require("os");
const dns = require("dns");
const primeLimitChecker = require("../middlewares/primeLimitChecker.middleware");
const getRandomPrime = require("../utils/random.prime");
const router = express.Router();
router.get("/randomPrime/:num", primeLimitChecker, (req, res) => {
  let num = Number(req.params.num);
  let prime = getRandomPrime(num);
  res.json({ prime });
});
router.get("/getIpDetails", (req, res) => {
  const website = req.query.website;
  if (!website) {
    return res.status(400).json({ message: "website query param missing" });
  }
  dns.lookup(website, (err, address) => {
    if (err) {
      console.log(err.message);
      return res.status(500).json({ message: err.message });
    }
    res.json({ website, ip: address });
  });
});

router.get("/getSystemInfo", (req, res) => {
  const info = {
    platform: os.platform(),
    architecture: os.arch(),
    uptime: os.uptime(),
    totalmem: os.totalmem(),
    freemem: os.freemem(),
    hostname: os.hostname(),
  };
  res.json(info);
});
module.exports = router;
