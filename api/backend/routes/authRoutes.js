const express = require("express");
const router = express.Router();
require("dotenv").config();
const { register, login, login2} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/login2", login2);

module.exports = router;