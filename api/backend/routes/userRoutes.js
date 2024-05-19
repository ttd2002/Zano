const express = require("express");
const router = express.Router();
require("dotenv").config();
const protectRoute = require("../middlewares/auth.js");
const { getUser, getFinded, getMessaged, addMessaged, addFinded, editProfile, editAvatar, changePassword, getFriendsByUser, getProfile, updateUser, sendFriendRequestApp, getListFriendRequestIdsSendApp, respondToFriendRequestApp, getAllUsers, getListUsers, getFriendRequestsByUser, recallFriendRequestSended,unfriendUserApp,cancelFriendsRequest,getListFriendRequestSend,
    getListFriendRequestReceived,
    listUserNotFriend,
    unfriend,
    getOtherUserById,
    getPasswordById,
    changePasswordWeb, } = require("../controllers/userController");
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
router.get("/:userId/friendRequests", getFriendRequestsByUser);
router.post("/app/sendFriendRequest", sendFriendRequestApp);
router.get("/app/getFriendRequestIdsSend/:id", getListFriendRequestIdsSendApp);
router.post("/app/respondToFriendRequest", respondToFriendRequestApp);
router.post("/app/recallFriendRequestSended", recallFriendRequestSended);
router.post("/app/unfriendUserApp", unfriendUserApp);
//web
router.get("/getProfile", protectRoute, getProfile);
router.put("/updateUser/:id", protectRoute, uploadAvatarMiddleware.single("avatar"), handleFileSizeError, updateUser)
router.get("/getAllUsers", protectRoute, getAllUsers);
router.get("/getListUsers",protectRoute, getListUsers);
router.get("/getListFriendRequestSend/:id", getListFriendRequestSend);
router.post("/cancelFriendsRequest", cancelFriendsRequest);
router.get("/getListFriendRequestReceived/:userId", getListFriendRequestReceived);
router.get("/listUserNotFriend/:userId", listUserNotFriend);
router.post("/unfriend", unfriend);
router.get("/getOtherUserById/:userId", getOtherUserById);
// router.get("/getPasswordById/:userId", getPasswordById);
router.put("/changePasswordWeb", changePasswordWeb);
module.exports = router;