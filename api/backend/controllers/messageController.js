require("dotenv").config();
const Chat = require("../models/conversation");
const Conversation = require("../models/conversation");

const messaged = async (req, res) => {
    try {
        const conversations = await Chat.find({
            participants: { $in: req.params.id },
        }).populate("participants", "_id name avatar");

        const filteredConversations = conversations.filter(conversation => {
            return !(conversation.isGroupChat === false && conversation.messages.length === 0);
        });

        for (let i = 0; i < filteredConversations.length; i++) {
            if (filteredConversations[i].isGroupChat === true) {
                continue
            }
            for (let j = 0; j < filteredConversations[i].participants.length; j++) {
                const participant = filteredConversations[i].participants[j];
                if (participant._id.toString() !== req.params.id) {
                    filteredConversations[i].name = participant.name;
                    filteredConversations[i].avatar = participant.avatar;
                }
            }
        }

        // Sắp xếp mảng filteredConversations dựa vào trường updatedAt
        filteredConversations.sort((a, b) => {
            return new Date(b.updatedAt) - new Date(a.updatedAt);
        });

        res.status(200).json(filteredConversations);
    } catch (error) {
        res.status(500).json({ message: "Error in getting messaged", error });
    }
};
const getOneConversationApp = async (req, res) => {
    try {
        const { conversationId } = req.query;
        // console.log("conversationId", conversationId);
        const conversation = await Chat.findById(conversationId).populate("participants", "_id name avatar");
        if (conversation.isGroupChat === false) {
            for (let j = 0; j < conversation.participants.length; j++) {
                const participant = conversation.participants[j];
                if (participant._id.toString() !== req.params.id) {
                    conversation.name = participant.name;
                    conversation.avatar = participant.avatar;
                }
            }
        }

        res.status(200).json(conversation);
    } catch (error) {
        res.status(500).json({ message: "Error in getting conversation", error });
    }
};

const messages = async (req, res) => {
    try {
        const { conversationId, senderId } = req.query;
        console.log("conversationId", senderId);
        const conversations = await Chat.find({
            _id: conversationId,
        }).populate("messages.senderId", "_id name avatar");
        let data = conversations[0].messages.filter(message => !message.deletedBy.includes(senderId));
        for (let i = 0; i < data.length; i++) {
            if (data[i].recall) {
                data[i].message = 'Tin nhắn đã được thu hồi';
                data[i].type = 'text'
            }
        }

        
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: "Error in getting messages", error });
    }
};

const createConversationSingleChatApp = async (req, res) => {
    try {
        const { senderId, receiverId } = req.body;
        console.log("senderId", senderId);
        console.log("receiverId", receiverId);
        // Kiểm tra xem đã tồn tại cuộc trò chuyện giữa hai người này chưa
        const existingConversation = await Chat.findOne({
            participants: { $all: [senderId, receiverId], $size: 2 },
            isGroupChat: false
        });

        // Nếu đã tồn tại, trả về cuộc trò chuyện đó
        if (existingConversation) {
            return res.status(200).json({ message: "Conversation already exists", conversation: existingConversation });
        }

        // Nếu chưa tồn tại, tạo cuộc trò chuyện mới
        const newConversation = new Chat({
            participants: [senderId, receiverId],
            isGroupChat: false
        });

        // Lưu cuộc trò chuyện mới
        const savedConversation = await newConversation.save();

        console.log("savedConversation", savedConversation);
        // Trả về thông tin của cuộc trò chuyện vừa tạo thành công
        res.status(201).json({ message: "Conversation created successfully", conversation: savedConversation });
    } catch (error) {
        console.log("Error creating conversation", error);
        res.status(500).json({ message: "Conversation creation failed" });
    }
};
const deleteMessage = async (req, res) => {
    try {
        const { currentUserId, messageId, conversationId } = req.body;
        console.log("currentUserId", currentUserId);
        console.log("messageId", messageId);
        console.log("conversationId", conversationId);
        // Tìm cuộc trò chuyện dựa trên conversationId
        const conversation = await Chat.findById(conversationId);

        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }
        console.log("conversation", conversation.messages.map(message => message._id.toString()));
        // Tìm và cập nhật tin nhắn
        let messageIndex = -1;
        const updatedMessages = conversation.messages.map((message, index) => {
            if (message._id.equals(messageId)) {
                messageIndex = index;
                // Kiểm tra xem tin nhắn đã được xóa bởi người dùng hiện tại chưa
                if (!message.deletedBy.includes(currentUserId)) {
                    message.deletedBy.push(currentUserId);
                }
            }
            return message;
        });

        console.log("updateMas", updatedMessages);

        if (messageIndex === -1) {
            return res.status(404).json({ message: "Message not found" });
        }
        // Cập nhật thông tin cuộc trò chuyện
        conversation.messages = updatedMessages;
        const updatedConversation = await conversation.save();

        return res.status(200).json({ message: "Message deleted successfully", conversation: updatedConversation });
    } catch (error) {
        return res.status(500).json({ message: "Error deleting message", error });
    }
};




const recallMessage = async (req, res) => {
    try {
        const {
            currentUserId,
            // receiverId,
            // timestamp,
            messageId,
            conversationId } = req.body;

        const conversation = await Chat.findById(conversationId);

        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }


        let messageIndex = -1;
        const updatedMessages = conversation.messages.map((message, index) => {
            if (message._id.equals(messageId)) {
                messageIndex = index;
                // Kiểm tra xem tin nhắn đã được xóa bởi người dùng hiện tại chưa
                message.recall = true;
            }
            return message;
        });

        conversation.messages = updatedMessages;
        const updatedConversation = await conversation.save();
        return res.sendStatus(200);
    } catch (error) {
        return res.status(500).json({ message: "Error deleting message", error });
    }
};
const uploadImageApp = async (req, res) => {
    try {
        const { imageChat } = req.body;
        // console.log(abc);
        var imageLink = '';
        console.log("req", req.file);
        if (req.file) {
            imageLink = req.file.path;

        } else {
            imageLink = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpKKVwj0K0pO7tkJERpFvOpCcb9kLjYzynm9SoZlvn6Q&s'
        }

        console.log("imageLink", imageLink);

        res.status(201).json({ link: imageLink });
    } catch (error) {
        console.log("Error creating group", error);
        res.status(500).json({ message: "Group creation failed" });
    }
};

const getMessages = async (req, res) => {
    try {
        const { conversationId, senderId } = req.query;
        console.log("conversationId", senderId);
        const conversations = await Chat.find({
            _id: conversationId,
        }).populate("participants", "_id name avatar");
        let data = conversations[0].messages.filter(message => !message.deletedBy.includes(senderId));
        for (let i = 0; i < data.length; i++) {
            if (data[i].recall) {
                data[i].message = 'This message has been recalled';
                data[i].type = 'text'
            }
        }


        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: "Error in getting messages", error });
    }
}

module.exports = {
    messaged, deleteMessage, recallMessage, messages, createConversationSingleChatApp, uploadImageApp, getOneConversationApp,getMessages
};