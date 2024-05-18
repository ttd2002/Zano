const express = require("express");
const router = express.Router();
require("dotenv").config();
const { register, login, login2 } = require("../controllers/authController");
const { uploadAvatarMiddleware } = require("../middlewares/uploadAvatar.js");
const { handleFileSizeError } = require("../middlewares/uploadImages.js");

router.post("/register", uploadAvatarMiddleware.single("avatar"), handleFileSizeError, register);
router.post("/login", login);
router.post("/login2", login2);

module.exports = router;