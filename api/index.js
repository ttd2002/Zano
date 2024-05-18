const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const port = 3000;
const cors = require("cors");
require("dotenv").config();

const http = require('http').createServer(app);
const io = require("socket.io")(http)
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const Chat = require("./backend/models/conversation");
const userRoutes = require("./backend/routes/userRoutes");
const messageRoutes = require("./backend/routes/messageRoutes");
const authRoutes = require("./backend/routes/authRoutes");
const groupRoutes = require("./backend/routes/groupRoutes");
const { connectToMongoDB } = require("./backend/database/connectToMongoDB");


app.listen(port, () => {
    connectToMongoDB();
    console.log(`Server is running on ${port}`);
});

io.on("connection", (socket) => {
    socket.on("joinRoom", (conversationId) => {
        socket.join(conversationId)
        console.log(`User joined room ${conversationId}`);

    })
    socket.on("requestRender", () => {
        io.emit("Render")
    })
    
    socket.on("sendMessage", async (data) => {
        try {
            const { senderId, conversationId, message, type } = data;
            console.log("data", data);
            var receiverIds = [];

            // await newMessage.save();
            const conversation = await Chat.findOne({
                _id: conversationId,
            })
            console.log(conversation);
            receiverIds = conversation.participants.filter(participantId => participantId._id.toString() !== senderId)
            console.log("recei", receiverIds);
            const newMessage = { senderId, receiverIds, message, type };

            conversation.messages.push(newMessage);


            await conversation.save();
            const conversation2 = await Chat.findOne({
                _id: conversationId,
            })
            const messageId = conversation2.messages[conversation.messages.length - 1]._id;
            console.log("messageId", JSON.stringify(messageId));
            newMessage._id = messageId;
            newMessage.timestamp = conversation2.messages[conversation.messages.length - 1].timestamp;
            //emit the message to the receiver
            socket.to(conversationId).emit("receiveMessage", newMessage);
        } catch (error) {
            console.log("Error handling the messages:", error); // In ra lỗi nếu có
        }
    });

    socket.on("disconnet", () => {
        console.log("user disconnected");
    });

});

http.listen(8000, () => {
    console.log("Socket.IO server is running on port 8000")
})

app.use("/users", userRoutes);
app.use("/mes", messageRoutes);
app.use("/auth", authRoutes);
app.use("/group", groupRoutes);