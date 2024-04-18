const express = require("express");
const router = express.Router();
require("dotenv").config();
const protectRoute= require("../middlewares/auth.js");
const { uploadAvatarMiddleware } = require("../middlewares/uploadAvatar.js");
const { handleFileSizeError } = require("../middlewares/uploadImages.js");
const { createGroupApp, changeNameAvatar,removeMember, updateMember,removeGroupApp } = require("../controllers/groupController.js");


router.post("/createGroupApp",uploadAvatarMiddleware.single("groupAvatar"),handleFileSizeError, createGroupApp);
router.put("/changeNameAvatarApp",uploadAvatarMiddleware.single("groupAvatar"),handleFileSizeError, changeNameAvatar);
router.put("/conversation/removeMember",removeMember);
router.put("/conversation/updateMember",updateMember);
router.put("/conversation/removeConversation",removeGroupApp);
module.exports = router;