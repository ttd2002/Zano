const User = require("../models/user");
const crypto = require("crypto");
const bcrypt = require('bcrypt');
require("dotenv").config();

const { secretKey, jwt } = require("../utils/generateToken");
const generateToken = require("../utils/generateToken");
const { response } = require("express");


const login = async (req, res) => {
    try {
        const { phone, password } = req.body;

        //check if the user exists already
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(401).json({ message: "Invalid phone or password" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = generateToken(user._id,res)
        res.status(200).json({ token,user});
    } catch (error) {
        res.status(500).json({ message: "login failed" });
    }
};

const register= async (req, res) => {
    try {
        const { name, phone, password, gender, birthDate } = req.body;

        const existingUser = await User.findOne({ phone });
        if (existingUser) {
            console.log("Phone already registered");
            return res.status(400).json({ message: "Phone already registered" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        let avatar = ''; 
        const boyAvatar = `https://avatar.iran.liara.run/public/boy?phone=${phone}`;
        const girlAvatar = `https://avatar.iran.liara.run/public/girl?phone=${phone}`;

        if (!req.file) {
            avatar = gender === "male" ? boyAvatar : girlAvatar; // Use default avatar based on gender if no file is uploaded
        } else {
            avatar = req.file.path;

        }
        const newUser = new User({
            name,
            phone,
            password: hashedPassword,
            gender,
            birthDate,
            avatar,
        });
        generateToken(newUser._id,res)
        await newUser.save();
        res
            .status(200)
            .json({ message: "User registered successfully", userId: newUser._id });
    } catch (error) {
        console.log("Error registering user", error);
        res.status(500).json({ message: "Registration failed" });
    }
};
const login2 = async (req, res) => {
    try {
        const { phone, password } = req.body;

        //check if the user exists already
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(401).json({ message: "Invalid phone or password" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = generateToken(user._id,res);
        // const userLogged = {
        //     _id: user._id,
        //     name: user.name,
        //     phone: user.phone,
        //     gender: user.gender,
        //     birthDate: user.birthDate,
        //     avatar: user.avatar,
        
        // }
        
        res.status(200).json({   
            _id: user._id,
            name: user.name,
            phone: user.phone,
            gender: user.gender,
            birthDate: user.birthDate,
            avatar: user.avatar,
            token,});

            
    } catch (error) {
        res.status(500).json({ message: "login failed" });
    }
}; 
const changePassword = async (req, res) => {
    try {
        const { userId, oldPassword, newPassword } = req.body;

        // Tìm người dùng trong cơ sở dữ liệu
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Kiểm tra mật khẩu cũ
        const passwordMatch = await bcrypt.compare(oldPassword, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Sai mật khẩu" });
        }

        // Mã hóa mật khẩu mới
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Cập nhật mật khẩu mới của người dùng
        user.password = hashedNewPassword;
        await user.save();

        res.status(200).json({ message: "Đổi mật khẩu thành công" });
    } catch (error) {
        console.log("Error changing password:", error);
        res.status(500).json({ message: "Failed to change password" });
    }
};
const changePasswordByPhone = async (req, res) => {
    try {
        const { phone, newPassword } = req.body;

        // Tìm người dùng trong cơ sở dữ liệu bằng số điện thoại
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Mã hóa mật khẩu mới
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Cập nhật mật khẩu mới của người dùng
        user.password = hashedNewPassword;
        await user.save();

        res.status(200).json({ message: "Đổi mật khẩu thành công" });
    } catch (error) {
        console.log("Error changing password by phone:", error);
        res.status(500).json({ message: "Failed to change password" });
    }
};
const checkPhoneExistApp = async (req, res) => {
    try {
        const { phone } = req.body;

        // Validate input
        if (!phone) {
            return res.status(400).json({ exists: false, message: "Phone number is required" });
        }

        // Find the user in the database by phone number
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(404).json({ exists: false, message: "User not found" });
        }

        res.status(200).json({ exists: true, message: "User exists" });
    } catch (error) {
        console.error("Error checking phone existence:", error);
        res.status(500).json({ exists: false, message: "Failed to check phone existence" });
    }
};
module.exports = {
    register, login, login2, changePassword,changePasswordByPhone, checkPhoneExistApp
};

