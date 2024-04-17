const Conversation = require("../models/conversation");
const crypto = require("crypto");
const bcrypt = require('bcrypt');
require("dotenv").config();

const { secretKey, jwt } = require("../utils/generateToken");
const generateToken = require("../utils/generateToken");
const { response } = require("express");



const createGroupApp = async (req, res) => {
    try {
        const { admin, nameGroup, members, groupAvatar } = req.body;
        console.log(members);
        console.log(admin);
        var linkGroupAvatar = '';
        
        if (req.file) {
            linkGroupAvatar = req.file.path;
            console.log(linkGroupAvatar);
        } else{
            linkGroupAvatar = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaxqz2kLpZuKUG11CKTbhoWe4JEH5NBB1UD6qTxhSwbg&s'
        }
        const newGroup = new Conversation({
            participants: members, 
            listAdmins: [admin], 
            isGroupChat: true, 
            name: nameGroup, 
            avatar: linkGroupAvatar, 
        });

        const savedGroup = await newGroup.save();

        // Trả về thông tin của nhóm vừa tạo thành công
        res.status(201).json({ message: "Group created successfully", group: savedGroup });
    } catch (error) {
        console.log("Error creating group", error);
        res.status(500).json({ message: "Group creation failed" });
    }
};

module.exports = {
    createGroupApp
};