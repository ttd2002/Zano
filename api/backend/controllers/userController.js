const User = require("../models/user");
// const { secretKey, jwt } = require("../utils/generateToken");
require("dotenv").config();
const Chat = require("../models/conversation");

const getUser = async (req, res) => {
    try {

        const user = await User.find();
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: "failed" });
    }
};
const getFinded = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const userFinded = user.finded;

        const finded = await User.find({ _id: { $in: userFinded } });

        res.status(200).json({ finded });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving the messaged", error });
    }
};
const getMessaged = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const messages = user.messaged;

        const messaged = await User.find({ _id: { $in: messages } });

        res.status(200).json({ messaged });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving the messaged", error });
    }
};
const addMessaged = async (req, res) => {
    try {
        const { currentUserId, receiverId } = req.body;
        await User.findByIdAndUpdate(currentUserId, {
            $push: { messaged: receiverId },
        });
        await User.findByIdAndUpdate(receiverId, {
            $push: { messaged: currentUserId },
        });
        res.sendStatus(200);
    } catch (error) {
        res.status(500).json({ message: "Error add messaged", error });
    }
};
const addFinded = async (req, res) => {
    try {
        const { currentUserId, receiverId } = req.body;
        await User.findByIdAndUpdate(currentUserId, {
            $push: { finded: receiverId },
        });

        res.sendStatus(200);
    } catch (error) {
        res.status(500).json({ message: "Error add finded", error });
    }
};
const editProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const { name, gender, birthDate } = req.body;

        const user = await User.findByIdAndUpdate(
            userId,
            { $set: { name: name, gender: gender, birthDate: birthDate } }
        );


        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const user2 = await User.findById(userId);
        const token = generateToken(user2._id, res);

        return res
            .status(200)
            .json({ message: "updated succesfully", user });
    } catch (error) {
        res.status(500).json({ message: "Error edit" });
    }
};

const editAvatar = async (req, res) => {
    try {
        const { userId } = req.params;
        const { avatar } = req.body;
        // const base64Avatar = Buffer.from(avatar).toString("base64");

        const user = await User.findByIdAndUpdate(
            userId,
            { $set: { avatar: avatar } }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res
            .status(200)
            .json({ message: "updated succesfully", user });
    } catch (error) {
        res.status(500).json({ message: "Error edit" });
    }
};

const changePassword = async (req, res) => {
    try {
        const { phoneNum, newPassword } = req.body;
        const user = await User.findOne({ phone: phoneNum });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.password = newPassword;
        await user.save();


        return res.status(200).json({ message: "Password updated successfully", user });
    } catch (error) {
        console.error("Error changing password", error);
        res.status(500).json({ message: "Error changing password" });
    }
};
const getFriendsByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).populate("listFriend", ["name", "phone","avatar"]);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        console.log(userId);
        res.status(200).json({ friends: user.listFriend });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving user's friends", error });
    }
};
const getFriendRequestsByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).populate("friendRequests", ["name", "phone","avatar"]);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        console.log(userId);
        res.status(200).json({ friendRequests: user.friendRequests });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving user's friends", error });
    }
};
const sendFriendRequestApp = async (req, res) => {
    try {
        // const senderId = req.user._id;
        // const receiverId = req.params.id;
        const { senderId, receiverId } = req.body;
        console.log(senderId);
        // Kiểm tra xem người nhận yêu cầu kết bạn có tồn tại không
        const receiver = await User.findById(receiverId);
        if (!receiver) {
            return res.status(404).json({ error: "Receiver not found" });
        }

        // Kiểm tra xem đã là bạn bè hay chưa
        if (receiver.listFriend.includes(senderId)) {
            return res.status(400).json({ error: "You are already friends with this user" });
        }

        // Kiểm tra xem đã gửi yêu cầu kết bạn chưa
        if (receiver.friendRequests.includes(senderId)) {
            return res.status(400).json({ error: "Friend request already sent to this user" });
        }

        // Thêm yêu cầu kết bạn vào danh sách yêu cầu kết bạn của người nhận
        receiver.friendRequests.push(senderId);
        await receiver.save();
        res.status(200).json({ message: "Friend request sent successfully" });
    } catch (error) {
        console.log("Error in sendFriendRequest controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}
const getListFriendRequestIdsSendApp = async (req, res) => {
    try {
        const userId = req.params.id;
        console.log(userId);
        // Tìm người dùng trong cơ sở dữ liệu
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Tìm danh sách yêu cầu kết bạn của người dùng
        const friendRequests = await User.find({ friendRequests: { $in: [userId] } }).select('_id name avatar');
        // const friendRequestIds = friendRequests.map(user => user._id.toString());
        res.status(200).json(friendRequests);

    } catch (error) {
        console.log("Error in getListFriendRequest controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}
const respondToFriendRequestApp = async (req, res) => {
    try {
        // const responderId = req.user._id; // Người nhận yêu cầu kết bạn
        // const requestId = req.params.id; // Người gửi yêu cầu kết bạn
        const { responderId, requestId, response } = req.body; // 1: Chấp nhận, 0: Từ chối
        console.log(responderId, requestId, response);

        // Kiểm tra xem yêu cầu kết bạn có tồn tại không
        const requester = await User.findById(requestId);
        if (!requester) {
            return res.status(404).json({ error: "Requester not found" });
        }

        // Kiểm tra xem người nhận yêu cầu kết bạn có tồn tại không
        const responder = await User.findById(responderId);
        if (!responder) {
            return res.status(404).json({ error: "Responder not found" });
        }

        // Kiểm tra xem yêu cầu kết bạn có tồn tại trong danh sách yêu cầu kết bạn của người nhận không
        if (!responder.friendRequests.includes(requestId)) {
            return res.status(400).json({ error: "Friend request not found" });
        }

        if (response === 1) {
            // Nếu responder chấp nhận yêu cầu kết bạn
            // Thêm người gửi yêu cầu vào danh sách bạn bè của người nhận
            responder.listFriend.push(requestId);

            // Thêm người nhận vào danh sách bạn bè của người gửi yêu cầu
            requester.listFriend.push(responderId);

            // Xóa yêu cầu kết bạn khỏi danh sách yêu cầu kết bạn của người nhận
            responder.friendRequests = responder.friendRequests.filter(id => id.toString() !== requestId.toString());

            await responder.save();
            await requester.save();

            return res.status(200).json({ message: `You and ${requester.name} are now friends` });
        } else if (response === 0) {
            // Nếu responder từ chối yêu cầu kết bạn
            // Xóa yêu cầu kết bạn khỏi danh sách yêu cầu kết bạn của người nhận
            responder.friendRequests = responder.friendRequests.filter(id => id.toString() !== requestId.toString());

            await responder.save();

            return res.status(200).json({ message: `You have rejected the friend request from ${requester.name}` });
        } else {
            // Trường hợp response không hợp lệ
            return res.status(400).json({ error: "Invalid response value" });
        }

    } catch (error) {
        console.log("Error in respondToFriendRequest controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
const recallFriendRequestSended = async (req, res) => {
    try {
        const { responderId, requestId } = req.body; 

        // Kiểm tra xem yêu cầu kết bạn có tồn tại không
        const responder = await User.findById(responderId);
        
        // Lọc ra yêu cầu kết bạn tương ứng và loại bỏ nó khỏi danh sách
        responder.friendRequests = responder.friendRequests.filter(id => id.toString() !== requestId.toString());

        // Lưu thay đổi vào cơ sở dữ liệu
        await responder.save();

        // Trả về thông báo thành công
        return res.status(200).json({ message: `You have successfully recalled the friend request` });

    } catch (error) {
        console.log("Error in recallFriendRequestSended controller: ", error.message);
        // Trả về thông báo lỗi nếu có lỗi xảy ra
        res.status(500).json({ error: "Internal server error" });
    }
};

const unfriendUserApp = async (req, res) => {
    try {
        const { userId, friendId } = req.body;
        console.log('userId',userId);
        console.log('friendId',friendId);
        // Validate input
        if (!userId || !friendId) {
            return res.status(400).json({ error: "User ID and Friend ID are required" });
        }

        // Find the user in the database by userId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Find the friend in the database by friendId
        const friend = await User.findById(friendId);
        if (!friend) {
            return res.status(404).json({ error: "Friend not found" });
        }

        // Remove friendId from user's friend list
        user.listFriend = user.listFriend.filter(id => id.toString() !== friendId.toString());

        // Remove userId from friend's friend list
        friend.listFriend = friend.listFriend.filter(id => id.toString() !== userId.toString());

        // Save the updated user and friend documents
        await user.save();
        await friend.save();
        console.log('userId',userId);
        console.log('friendId',friendId);
        res.status(200).json({ message: `You have unfriended ${friend.name}` });
    } catch (error) {
        // console.log("Error in unfriendUser controller:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

//Web
const updateUser = async (req, res) => {
    const { name, gender, birthDate, avatar } = req.body;
    const id = req.params.id;
    try {
        const user = req.user; // Lấy thông tin người dùng từ middleware đã đăng nhập thành công
        // Kiểm tra xem người dùng đã đăng nhập hay chưa
        if (!user) {
            return res.status(401).json({ error: "Unauthorized - Please login first" });
        }
        // Chỉ cho phép người dùng cập nhật thông tin cá nhân của chính họ
        if (user._id.toString() !== id) {
            return res.status(403).json({ error: "Forbidden - You are not allowed to update other user's profile" });
        }
        // console.log(req.file.path);
        if (req.file) {
            user.avatar = req.file.path;
        }
        // Cập nhật thông tin cá nhân của người dùng
        user.name = name || user.name;
        user.gender = gender || user.gender;
        user.birthDate = birthDate || user.birthDate;

        // Lưu thay đổi vào cơ sở dữ liệu
        const updatedUser = await user.save();

        // Tạo object phản hồi
        const responseObject = {
            _id: updatedUser._id,
            name: updatedUser.name,
            phone: updatedUser.phone,
            gender: updatedUser.gender,
            birthDate: updatedUser.birthDate,
            avatar: updatedUser.avatar,
        };
        // Trả về phản hồi thành công
        res.status(200).json(responseObject);
    } catch (error) {
        console.log("Error in updateUser controller", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getProfile = async (req, res) => {
    try {
        const user = req.user;

        res.status(200).json(user);

    } catch (error) {
        console.log("Error in getProfile controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
const getAllUsers = async (req, res) => {
    try {
        // Lấy thông tin người dùng đang đăng nhập từ request
        const currentUser = req.user;

        // Lấy tất cả người dùng, loại bỏ trường password
        const users = await User.find({ _id: { $ne: currentUser._id } }).select("-password");

        res.status(200).json(users);
    } catch (error) {
        console.log("Error in getAllUsers controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
const getListUsers = async (req, res) => {
    try {
        const loggedUserId = req.user._id;
        const listConversations = await Chat.find({
            participants: { $in: loggedUserId.toString() },
        })
            .populate("participants", "_id name avatar phone")
            .sort({ updatedAt: -1 }); // Sắp xếp theo updatedAt giảm dần để lấy thời gian mới nhất đầu tiên

        res.status(200).json(listConversations);
    } catch (error) {
        console.log("Error in getListUsers controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
const getListFriendRequestSend = async (req, res) => {
    try {
        const userId = req.params.id;
        console.log(userId);
        // Tìm người dùng trong cơ sở dữ liệu
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Tìm danh sách yêu cầu kết bạn đã gửi của người dùng
        const friendRequests = await User.find({ friendRequests: { $in: [userId] } }).select("-password");
        res.status(200).json(friendRequests);

    } catch (error) {
        console.log("Error in getListFriendRequest controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

// Hàm hủy yêu cầu kết bạn
const cancelFriendsRequest = async (req, res) => {
    try {
        const { senderId, receiverId } = req.body;

        // Tìm người nhận yêu cầu kết bạn trong CSDL
        const receiver = await User.findById(receiverId);

        if (!receiver) {
            return res.status(404).json({ error: "Receiver not found" });
        }

        // Xóa yêu cầu kết bạn từ người gửi trong danh sách friendRequests của người nhận
        receiver.friendRequests.pull(senderId);
        await receiver.save();

        return res.status(200).json({ message: "Friend request canceled successfully" });
    } catch (error) {
        console.log("Error in cancelFriendsRequest controller:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getListFriendRequestReceived = async (req, res) => {
    try {
        const userId = req.params.userId;
        // Tìm user theo id và lấy danh sách yêu cầu kết bạn
        const user = await User.findById(userId).populate("friendRequests", "name phone avatar");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user.friendRequests); // Trả về danh sách yêu cầu kết bạn
    } catch (error) {
        console.log("Error fetching friend requests received:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

//lấy user không phải là bạn bè
const listUserNotFriend = async (req, res) => {
    try {
        const userId = req.params.userId;
        // Tìm user theo id và lấy danh sách bạn bè
        const user = await User.findById(userId).populate("listFriend", "name phone avatar");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Lấy danh sách tất cả người dùng
        const allUsers = await User.find({ _id: { $ne: userId } }, "name phone avatar");
        // Loại bỏ những người trong danh sách bạn bè của user
        const usersExceptFriends = allUsers.filter(u => !user.listFriend.some(friend => friend._id.equals(u._id)));
        res.status(200).json(usersExceptFriends); // Trả về danh sách người dùng ngoại trừ danh sách bạn bè
    } catch (error) {
        console.log("Error fetching users except friends:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
const unfriend = async (req, res) => {
    try {
        const { senderId, friendId } = req.body;

        // Tìm user và friend theo id
        const user = await User.findById(senderId);
        const friend = await User.findById(friendId);

        if (!user || !friend) {
            return res.status(404).json({ message: "User or friend not found" });
        }

        // Xóa friendId khỏi danh sách bạn bè của user
        user.listFriend.pull(friendId);
        await user.save();

        // Xóa userId khỏi danh sách bạn bè của friend
        friend.listFriend.pull(senderId);
        await friend.save();

        res.status(200).json({ message: "Unfriended successfully" });
    } catch (error) {
        console.log("Error unfriending:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
const getOtherUserById = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId).select("name phone avatar");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.log("Error getting other user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
const getPasswordById = async (req, res) => {
    try {
        const { userId } = req.params;
        // Tìm user trong cơ sở dữ liệu bằng id
        const user = await User.findById(userId);

        // Kiểm tra nếu user không tồn tại
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Trích xuất password đã được mã hóa từ user object
        const hashedPassword = user.password;

        // Giải mã password đã được mã hóa
        const password = bcrypt.compare(hashedPassword, 10);

        // Trả về password đã được giải mã
        return res.status(200).json({ password });
    } catch (error) {
        // Xử lý lỗi nếu có
        console.error("Error getting password by id:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
const changePasswordWeb = async (req, res) => {
    try {
        const { id, newPassword, currentPassword } = req.body;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // So sánh currentPassword với password đã được mã hóa của user
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        console.log("old pass", currentPassword)
        console.log("new pass", newPassword)
        console.log("isMatch", isMatch)
        if (!isMatch) {
            return res.status(400).json({ message: "Current password is incorrect" });
        }
        if (newPassword === currentPassword) {
            return res.status(401).json({ message: "New password must be different from current password" });
        }
        // Mã hóa newPassword và lưu vào password của user
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();

        return res.status(200).json({ message: "Password updated successfully", user });
    } catch (error) {
        console.error("Error changing password", error);
        res.status(500).json({ message: "Error changing password" });
    }
};
module.exports = {
    getUser,
    getFinded,
    getMessaged,
    addMessaged,
    addFinded,
    editProfile,
    editAvatar,
    changePassword,
    getFriendsByUser,
    getProfile,
    updateUser,
    sendFriendRequestApp,
    getListFriendRequestIdsSendApp,
    respondToFriendRequestApp,
    getListUsers,
    getAllUsers,
    getFriendRequestsByUser,
    recallFriendRequestSended,
    unfriendUserApp,
    getListFriendRequestSend,
    cancelFriendsRequest,
    getListFriendRequestReceived,
    listUserNotFriend,
    unfriend,
    getOtherUserById,
    getPasswordById,
    changePasswordWeb
};