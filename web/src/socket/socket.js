import socketIO from "socket.io";
import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js"; // Đảm bảo rằng bạn đã định nghĩa JWT_SECRET trong tệp cấu hình của mình

let io;

export const initializeSocket = (server) => {
    io = new Server(server);

    io.use((socket, next) => {
        if (socket.handshake.auth && socket.handshake.auth.token) {
            jwt.verify(socket.handshake.auth.token, JWT_SECRET, (err, decoded) => {
                if (err) return next(new Error("Authentication error"));
                socket.decoded = decoded;
                next();
            });
        } else {
            next(new Error("Authentication error"));
        }
    });

    io.on("connection", (socket) => {
        console.log("User connected: ", socket.decoded._id);

        // Lắng nghe sự kiện gửi tin nhắn mới
        socket.on("sendNewMessage", (data) => {
            // Xử lý tin nhắn và phát lại cho người nhận
            const { receiverId, message } = data;
            socket.to(receiverId).emit("receiveNewMessage", message);
        });

        // Lắng nghe sự kiện thu hồi tin nhắn
        socket.on("recallMessage", (messageId) => {
            // Xử lý và phát lại cho người nhận
            socket.broadcast.emit("messageRecalled", messageId);
        });

        socket.on("disconnect", () => {
            console.log("User disconnected: ", socket.decoded._id);
        });
    });
};

export const getReceiverSoketId = (receiverId) => {
    const clients = io.sockets.sockets;
    for (const [socketId, socket] of Object.entries(clients)) {
        if (socket.decoded._id.toString() === receiverId.toString()) {
            return socketId;
        }
    }
    return null;
};

export { io };
