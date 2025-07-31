const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const upload = require("../config/uploadImage");

router.get("/", profileController.getProfile);
router.put("/update", profileController.updateProfile);
router.put("/image", upload.single("file"), profileController.updateImage);

module.exports = router;
