
const {cloudinary,uploadPreset} = require("../config/cloudinaryConfig.js")
const multer = require("multer")
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    allowedFormats: ['jpeg', 'jpg', 'png', 'mp4'],
    params: {
        folder: 'avatar',
        upload_preset: 'DemoZanoo',
        // secure: true,
    },

});

const uploadAvatarMiddleware = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter: (req, file, cb) => {
        // Add file filter logic here if needed
        cb(null, true);
    },
});

module.exports = {
    uploadAvatarMiddleware
};