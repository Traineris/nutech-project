const express = require("express");
const router = express.Router();
const topupsController = require("../controllers/topupsController");

router.post("/", topupsController.createTopUp);

module.exports = router;