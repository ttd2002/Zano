require("dotenv").config();

const Chat = require("../models/conversation");

const messages= async (req, res) => {
    try {
        const { senderId, receiverId } = req.query;
        const messages = await Chat.find({
            $or: [
                { senderId: senderId, receiverId: receiverId },
                { senderId: receiverId, receiverId: senderId },
            ],
            deletedBy: { $ne: senderId }
        }).populate("senderId", "_id name");


        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: "Error in getting messages", error });
    }
};

const deleteMessage= async (req, res) => {
    try {
        const { currentUserId, receiverId, timestamp, messageId } = req.body;
        
        const message = await Chat.findOneAndUpdate(
            { 
                _id: messageId,
                // senderId: currentUserId, 
                // receiverId: receiverId, 
                // timestamp: timestamp 
            },
            { $push: { deletedBy: currentUserId } },
        );

        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }

        return res.sendStatus(200);
    } catch (error) {
        return res.status(500).json({ message: "Error deleting message", error });
    }
};


const recallMessage= async (req, res) => {
    try {
        const { currentUserId, receiverId, timestamp, messageId } = req.body;
        
        const message = await Chat.findOneAndUpdate(
            { 
                _id: messageId,
                // senderId: currentUserId, 
                // receiverId: receiverId, 
                // timestamp: timestamp 
            },
            { 
                $set: { 
                    message: "Tin nhắn đã thu hồi",
                    type: "text",
                } 
            },
        );

        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }
        return res.sendStatus(200);
    } catch (error) {
        return res.status(500).json({ message: "Error deleting message", error });
    }
};

module.exports = {
    messages,deleteMessage,recallMessage
};