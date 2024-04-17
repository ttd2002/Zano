const express = require("express");
const router = express.Router();
require("dotenv").config();
const protectRoute= require("../middlewares/auth.js");
const { uploadAvatarMiddleware } = require("../middlewares/uploadAvatar.js");
const { handleFileSizeError } = require("../middlewares/uploadImages.js");
const { createGroupApp } = require("../controllers/groupController.js");


router.post("/createGroupApp",uploadAvatarMiddleware.single("groupAvatar"),handleFileSizeError, createGroupApp);


module.exports = router;