const express = require("express");
const router = express.Router();
require("dotenv").config();
const protectRoute= require("../middlewares/auth.js");
const { getUser, getFinded, getMessaged, addMessaged, addFinded, editProfile, editAvatar, changePassword, getFriendsByUser, getProfile, updateUser } = require("../controllers/userController");
const { uploadAvatarMiddleware } = require("../middlewares/uploadAvatar.js");
const { handleFileSizeError } = require("../middlewares/uploadImages.js");

router.get("/getUser", getUser);
router.get("/:userId/finded", getFinded);
router.get("/:userId/messaged", getMessaged);
router.post("/add-messaged", addMessaged);
router.post("/add-finded", addFinded);
router.put("/:userId/editProfile", editProfile);
router.put("/:userId/editAvatar", editAvatar);
router.put("/changePassword", changePassword);
router.get("/:userId/friends", getFriendsByUser);

//web
router.get("/getProfile",protectRoute, getProfile);
router.put("/updateUser/:id",protectRoute,uploadAvatarMiddleware.single("avatar"),handleFileSizeError,updateUser)

module.exports = router;