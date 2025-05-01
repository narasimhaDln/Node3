const fs = require("fs");
const os = require("os");
const dns = require("dns");
const readContent = require("./read");
const express = require("express");
const app = express();
app.use(express.json());
app.get("/test", (req, res) => {
  res.send("testing route working fine..!");
});
app.get("/readFile", (req, res) => {
  const content = readContent();
  res.send(content);
});
app.get("/systemDetails", (req, res) => {
  const totalMem = (os.totalmem() / 1024 ** 3).toFixed(2) + "GB";
  const freeMem = (os.freemem() / 1024 ** 3).toFixed(2) + "GB";
  const cpus = os.cpus();
  res.json({
    platform: os.platform,
    totalMemory: totalMem,
    freMemory: freeMem,
    spuModel: cpus[0].model,
  });
});
app.get("/getip", (req, res) => {
  dns.lookup("masaischool.com", (err, address) => {
    if (err) {
      res.status(500).send("Unable to resolve hostname");
    } else {
      res.json({ hostname: "masaischool.com", ipAddress: address });
    }
  });
});
app.listen(8090, () => {
  console.log("server running at 8090");
});
