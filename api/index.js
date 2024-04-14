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
const { connectToMongoDB } = require("./backend/database/connectToMongoDB");


app.listen(port, () => {
    connectToMongoDB();
    console.log(`Server is running on ${port}`);
});

var users = [];
io.on("connection", (socket) => {
    socket.on("connected", (userID) => {
        users[userID] = socket.id;

    })
    socket.on("requestRender", () => {
        io.emit("Render")
    })
    socket.on("sendMessage", async (data) => {
        try {
            const { senderId, receiverId, message, type } = data;
            console.log("data", data);
            console.log("data", data);
            /* if (type === "image") {
                const imagePath = path.resolve(message.replace('file://', ''));
                const imageContent = fs.readFileSync(imagePath);
                console.log("test: ", imageContent)
                const filePath = `${senderId}_${Date.now().toString()}.jpg`;
                const params = {
                    Bucket: bucketName,
                    Key: filePath,
                    Body: imageContent,
                    ACL: 'public-read'
                };
                const uploadedImage = await s3.upload(params).promise();
                contentMessage = uploadedImage.Location;
            } */
            const newMessage = new Chat({ senderId, receiverId, message, type });
            await newMessage.save();
            //emit the message to the receiver
            io.to(users[receiverId]).emit("receiveMessage", newMessage);
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
