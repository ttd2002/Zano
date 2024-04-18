const express = require("express");
const router = express.Router();
require("dotenv").config();
const { upload } = require("../middlewares/uploadImages.js");
const { uploadAvatarMiddleware } = require("../middlewares/uploadAvatar.js");
const { messaged,deleteMessage,recallMessage, messages,createConversationSingleChatApp, uploadImageApp } = require("../controllers/messageController");
const { handleFileSizeError } = require("../middlewares/uploadImages.js");
router.get("/:id/messaged", messaged);
router.get("/messages/:id", messages);
router.post("/deleteMessage", deleteMessage);
router.post("/recallMessage", recallMessage);
router.post("/createConversationApp", createConversationSingleChatApp);

router.post("/uploadImageApp",uploadAvatarMiddleware.single("imageChat"),handleFileSizeError, uploadImageApp);
module.exports = router;