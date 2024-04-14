const express = require("express");
const router = express.Router();
require("dotenv").config();

const { messages,deleteMessage,recallMessage } = require("../controllers/messageController");

router.get("/messages", messages);
router.post("/deleteMessage", deleteMessage);
router.post("/recallMessage", recallMessage);

module.exports = router;