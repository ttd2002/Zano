const User = require("../models/user");
const crypto = require("crypto");
const bcrypt = require('bcrypt');
require("dotenv").config();

const { secretKey, jwt } = require("../utils/generateToken");
const generateToken = require("../utils/generateToken");
const { response } = require("express");


// const register= async (req, res) => {
//     try {
//         const { name, phone, password } = req.body;

//         const existingUser = await User.findOne({ phone });
//         if (existingUser) {
//             console.log("Phone already registered");
//             return res.status(400).json({ message: "Phone already registered" });
//         }
//         const hashedPassword = await bcrypt.hash(password, 10);

//         const newUser = new User({
//             name,
//             phone,
//             password: hashedPassword,
//             avatar:''
//         });
//         generateToken(newUser._id,res)
//         await newUser.save();
//         res
//             .status(200)
//             .json({ message: "User registered successfully", userId: newUser._id });
//     } catch (error) {
//         console.log("Error registering user", error);
//         res.status(500).json({ message: "Registration failed" });
//     }
// };

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
module.exports = {
    register, login, login2
};