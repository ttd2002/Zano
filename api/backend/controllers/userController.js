const User = require("../models/user");
// const { secretKey, jwt } = require("../utils/generateToken");
require("dotenv").config();


const getUser = async (req, res) => {
    try {

        const user = await User.find();
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: "failed" });
    }
};
const getFinded= async (req, res) => {
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
const getMessaged= async (req, res) => {
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
const addMessaged= async (req, res) => {
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
const addFinded= async (req, res) => {
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
const editProfile= async (req, res) => {
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
        const token = generateToken(user2._id,res);

        return res
            .status(200)
            .json({ message: "updated succesfully", user});
    } catch (error) {
        res.status(500).json({ message: "Error edit" });
    }
};

const editAvatar= async (req, res) => {
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

const changePassword= async (req, res) => {
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
const getFriendsByUser= async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId).populate("listFriend", ["name","phone"]);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({ friends: user.listFriend });
    } catch (error) {
      res.status(500).json({ message: "Error retrieving user's friends", error });
    }
  };


//Web
const updateUser = async (req, res) => {
    const { name, gender, birthDate, avatar } = req.body;
    const id = req.params.id;
    console.log(avatar);
    console.log(name);
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
        console.log("Error in updateUser controller", error.message);
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

module.exports = {
    getUser, getFinded, getMessaged, addMessaged, addFinded, editProfile, editAvatar, changePassword, getFriendsByUser,getProfile,updateUser
};