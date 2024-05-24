const Conversation = require("../models/conversation");
const crypto = require("crypto");
const bcrypt = require('bcrypt');
require("dotenv").config();

const { secretKey, jwt } = require("../utils/generateToken");
const generateToken = require("../utils/generateToken");
const { response } = require("express");
const User = require("../models/user");



const createGroupApp = async (req, res) => {
    try {
        const { admin, nameGroup, members, groupAvatar } = req.body;
        console.log(members);
        console.log(admin);
        var linkAvatar = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaxqz2kLpZuKUG11CKTbhoWe4JEH5NBB1UD6qTxhSwbg&s';

        if (req.file) {
            linkAvatar = req.file.path;
        }
        const newGroup = new Conversation({
            participants: members,
            listAdmins: [admin],
            leader: admin,
            isGroupChat: true,
            name: nameGroup,
            avatar: linkAvatar,
        });

        const savedGroup = await newGroup.save();

        // Trả về thông tin của nhóm vừa tạo thành công
        res.status(201).json({ message: "Group created successfully", group: savedGroup });
    } catch (error) {
        console.log("Error creating group", error);
        res.status(500).json({ message: "Group creation failed" });
    }
};
const changeNameAvatar = async (req, res) => {
    try {
        const { conversationId, nameGroup, groupAvatar } = req.body;

        // Tìm và cập nhật thông tin nhóm trong cơ sở dữ liệu
        const updatedConversation = await Conversation.findByIdAndUpdate(conversationId, { name: nameGroup, avatar: req.file.path }, { new: true });

        if (!updatedConversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }

        res.status(200).json({ message: "Group name and avatar updated successfully", group: updatedConversation });
    } catch (error) {
        console.log("Error updating group name and avatar", error);
        res.status(500).json({ message: "Failed to update group name and avatar" });
    }
};
const removeMember = async (req, res) => {
    try {
        const { memberId, conversationId } = req.body;
        console.log('memberId', memberId);
        console.log('conversationId', conversationId);
        // Tìm cuộc trò chuyện tương ứng
        const conversation = await Conversation.findById(conversationId);

        // Nếu không tìm thấy cuộc trò chuyện
        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }

        // Loại bỏ thành viên khỏi mảng participants
        conversation.participants = conversation.participants.filter(participant => participant._id.toString() !== memberId);
        conversation.listAdmins = conversation.listAdmins.filter(participant => participant._id.toString() !== memberId);
        // Lưu lại cuộc trò chuyện đã cập nhật
        const updatedConversation = await conversation.save();

        // Trả về phản hồi thành công
        res.status(200).json({ message: "Member removed successfully", conversation: updatedConversation });
    } catch (error) {
        console.log("Error removing member:", error);
        res.status(500).json({ message: "Failed to remove member" });
    }
};
const changeLeaderApp = async (req, res) => {
    try {
        const { memberId, conversationId } = req.body;
        console.log('memberId', memberId);
        console.log('conversationId', conversationId);
        // Tìm cuộc trò chuyện tương ứng
        const conversation = await Conversation.findById(conversationId);

        // Nếu không tìm thấy cuộc trò chuyện
        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }

        // Loại bỏ thành viên khỏi mảng participants
        // conversation.participants = conversation.participants.filter(participant => participant._id.toString() !== memberId);
        const member = await User.findById(memberId);
        conversation.leader = member;

        if (!conversation.listAdmins.includes(member)) {
            conversation.listAdmins.push(member);
        }

        const updatedConversation = await conversation.save();

        // Trả về phản hồi thành công
        res.status(200).json({ message: "Change leader successfully", conversation: updatedConversation });
    } catch (error) {
        // console.log("Error removing member:", error);
        res.status(500).json({ message: "Failed to change leader" });
    }
};
const updateMember = async (req, res) => {
    try {
        const { members, admins, conversationId } = req.body;
        console.log('conversationId', conversationId);
        console.log('admins', admins);
        console.log('members', members);

        // Tìm cuộc trò chuyện tương ứng
        const conversation = await Conversation.findById(conversationId);

        // Nếu không tìm thấy cuộc trò chuyện
        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }

        if (members) {
            // Lọc ra những member chưa có trong participants
            const newMembers = members.filter(memberId =>
                !conversation.participants.some(participant => participant._id.toString() === memberId)
            );
            const memberObjects = await Promise.all(newMembers.map(async memberId => {
                const member = await User.findById(memberId); // Thay Member bằng tên model của thành viên
                return member;
            }));
            conversation.participants = [...conversation.participants, ...memberObjects];
        }

        if (admins) {
            // Lọc ra những admin chưa có trong listAdmins
            const adminObjects = await Promise.all(admins.map(async adminId => {
                const admin = await User.findById(adminId); // Thay Member bằng tên model của thành viên
                return admin;
            }));
            conversation.listAdmins = adminObjects
        }

        // Lưu lại cuộc trò chuyện đã cập nhật
        const updatedConversation = await conversation.save();
        console.log('updatedConversation', updatedConversation);

        // Trả về phản hồi thành công
        res.status(200).json({ message: "Members updated successfully", conversation: updatedConversation });
    } catch (error) {
        console.log("Error updating members:", error);
        res.status(500).json({ message: "Failed to update members" });
    }
};


const removeGroupApp = async (req, res) => {
    try {
        const { conversationId } = req.body;
        console.log('conversationId', conversationId);

        // Thực hiện xóa cuộc trò chuyện hoặc nhóm dựa trên conversationId
        const deletedGroup = await Conversation.findOneAndDelete({ _id: conversationId });

        // Kiểm tra nếu không tìm thấy cuộc trò chuyện hoặc nhóm để xóa
        if (!deletedGroup) {
            return res.status(404).json({ message: "Group not found" });
        }

        // Trả về phản hồi thành công
        res.status(200).json({ message: "Group removed successfully", result: true });
    } catch (error) {
        console.log("Error removing group", error);
        res.status(500).json({ message: "Group removal failed", result: false });
    }
};
const leaveGroupApp = async (req, res) => {
    try {
        const { conversationId, senderId } = req.body;
        console.log('conversationId', conversationId);
        console.log('senderId', senderId);

        const conversation = await Conversation.findById(conversationId);

        // Kiểm tra nếu không tìm thấy cuộc trò chuyện hoặc nhóm để xóa
        if (!conversation) {
            return res.status(404).json({ message: "Group not found" });
        }
        console.log(conversation.participants);
        conversation.participants = conversation.participants.filter(memberId => memberId._id.toString() !== senderId);
        conversation.listAdmins = conversation.listAdmins.filter(memberId => memberId._id.toString() !== senderId);
        await conversation.save();

        // Trả về phản hồi thành công
        res.status(200).json({ message: "Leave group successfully", result: true });
    } catch (error) {
        console.log("Error removing group", error);
        res.status(500).json({ message: "Leave group failed", result: false });
    }
};
//web
const getGroupMessaged = async (req, res) => {
    try {
        const userId = req.user.id; // Lấy id của người dùng đang đăng nhập từ middleware auth (giả sử đã được định nghĩa)

        // Tìm các cuộc trò chuyện mà người dùng có trong participants và isGroupChat là true
        const conversations = await Conversation.find({
            participants: userId,
            isGroupChat: true,
        }).populate("participants", "name avatar"); // Populate thông tin của group
        // console.log("groups", conversations);
        res.json(conversations);
    } catch (error) {
        console.error("Error getting conversations:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const updateMemberWeb = async (req, res) => {
    try {
        const { members, admins, conversationId, } = req.body;
        console.log('conversationId', conversationId);
        console.log('admins', admins);
        console.log('members', members);
        // Tìm cuộc trò chuyện tương ứng
        const conversation = await Conversation.findById(conversationId);
        if (members) {
            const memberObjects = await Promise.all(members.map(async memberId => {
                const member = await User.findById(memberId); // Thay Member bằng tên model của thành viên
                return member;
            }));
            conversation.participants = memberObjects
        }
        if (admins) {
            const adminObjects = await Promise.all(admins.map(async adminId => {
                const admin = await User.findById(adminId); // Thay Member bằng tên model của thành viên
                return admin;
            }));
            conversation.listAdmins = adminObjects
        }

        // Nếu không tìm thấy cuộc trò chuyện
        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }
        // Gán mảng memberIdArray vào mảng participants của conversation


        // Lưu lại cuộc trò chuyện đã cập nhật
        const updatedConversation = await conversation.save();
        console.log('updatedConversation', updatedConversation);
        // Trả về phản hồi thành công
        res.status(200).json({ message: "Members updated successfully", conversation: updatedConversation });
    } catch (error) {
        console.log("Error updating members:", error);
        res.status(500).json({ message: "Failed to update members" });
    }
};

const getMembersOfGroup = async (req, res) => {
    const { conversationId } = req.params;
  
    try {
      const conversation = await Conversation.findById(conversationId).populate('participants', "name phone avatar");
  
      if (!conversation) {
        return res.status(404).json({ message: 'Conversation not found' });
      }
  
      return res.status(200).json({ members: conversation.participants });
    } catch (error) {
      console.error('Error fetching members:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }


module.exports = {
    createGroupApp, changeNameAvatar, removeMember, updateMember, removeGroupApp, getGroupMessaged, leaveGroupApp, changeLeaderApp, updateMemberWeb,getMembersOfGroup
};