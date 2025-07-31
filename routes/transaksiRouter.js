const express = require("express");
const router = express.Router();
const transaksiController = require("../controllers/transaksiController.js");

router.post("/", transaksiController.createTransaksi);
router.get("/history", transaksiController.getTransaksiHistory);

module.exports = router;
