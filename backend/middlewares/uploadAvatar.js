
const cloudinary = require("../config/cloudinaryConfig.js")
const multer = require("multer")
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    allowedFormats: ['jpeg', 'jpg', 'png'],
    params: {
        folder: 'avatar',
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