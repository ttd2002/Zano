require("dotenv").config();
const Chat = require("../models/conversation");

const messaged = async (req, res) => {
    try {
        // const userId = JSON.stringify(req.params.id);
        // console.log("u",userId);
        // console.log(req.params);
        const conversations = await Chat.find({
            participants: {$in:req.params.id},
        }).populate("participants", "_id name avatar");
        console.log("con",conversations);
        res.status(200).json(conversations);
    } catch (error) {
        res.status(500).json({ message: "Error in getting messaged", error });
    }
};
const messages = async (req, res) => {
    try {
        console.log("afg",JSON.stringify(req.params.id));
        const conversations = await Chat.find({
            _id:req.params.id
        });
        console.log("con",conversations);
        res.status(200).json(conversations[0].messages);
    } catch (error) {
        res.status(500).json({ message: "Error in getting messaged", error });
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
    messaged,deleteMessage,recallMessage,messages
};