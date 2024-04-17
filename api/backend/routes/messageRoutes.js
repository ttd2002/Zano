const express = require("express");
const router = express.Router();
require("dotenv").config();

const { messaged,deleteMessage,recallMessage, messages } = require("../controllers/messageController");

router.get("/:id/messaged", messaged);
router.get("/messages/:id", messages);
router.post("/deleteMessage", deleteMessage);
router.post("/recallMessage", recallMessage);


module.exports = router;