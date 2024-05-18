const express = require("express");
const router = express.Router();
require("dotenv").config();
const protectRoute = require("../middlewares/auth.js");
const { uploadAvatarMiddleware } = require("../middlewares/uploadAvatar.js");
const { handleFileSizeError } = require("../middlewares/uploadImages.js");
const {
  leaveGroupApp,
  changeLeaderApp,
  createGroupApp,
  changeNameAvatar,
  removeMember,
  updateMember,
  removeGroupApp,
  getGroupMessaged,
} = require("../controllers/groupController.js");

router.post(
  "/createGroupApp",
  uploadAvatarMiddleware.single("groupAvatar"),
  handleFileSizeError,
  createGroupApp
);
router.put(
  "/changeNameAvatarApp",
  uploadAvatarMiddleware.single("groupAvatar"),
  handleFileSizeError,
  changeNameAvatar
);
router.put("/conversation/removeMember", removeMember);
router.put("/conversation/updateMember", updateMember);
router.put("/conversation/removeConversation", removeGroupApp);

router.get("/getGroupMessaged", protectRoute, getGroupMessaged);
router.put("/conversation/changeLeader", changeLeaderApp);
router.put("/conversation/leave", leaveGroupApp);

module.exports = router;
