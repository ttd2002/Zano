const express = require("express");
const router = express.Router();
require("dotenv").config();
const { register, login, login2,changePassword, changePasswordByPhone} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/login2", login2);
router.post("/changePassword", changePassword);
router.post("/changePasswordByPhone", changePasswordByPhone);
module.exports = router;