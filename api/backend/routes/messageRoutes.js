const express = require("express");
const router = express.Router();
require("dotenv").config();

const protectRoute = require("../middlewares/auth");
const { uploadAvatarMiddleware } = require("../middlewares/uploadAvatar.js");
const { messaged, deleteMessage, recallMessage, messages, createConversationSingleChatApp, uploadImageApp, getOneConversationApp, getMessages } = require("../controllers/messageController");
const { handleFileSizeError, upload } = require("../middlewares/uploadImages.js");
router.get("/:id/messaged", messaged);
router.get("/getOneConversationApp", getOneConversationApp);
router.get("/messages/:id", messages);
router.post("/deleteMessage", deleteMessage);
router.post("/recallMessage", recallMessage);
router.post("/createConversationApp", createConversationSingleChatApp);

router.post("/uploadImageApp", uploadAvatarMiddleware.single("imageChat"), handleFileSizeError, uploadImageApp);
// router.get("/get/:id", protectRoute, getMessages);
router.get("/get/:conversationId", getMessages);
module.exports = router;