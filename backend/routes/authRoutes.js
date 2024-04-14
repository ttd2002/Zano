const express = require("express");
const router = express.Router();
require("dotenv").config();
const { register, login } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);

module.exports = router;