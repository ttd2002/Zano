
const cloudinary = require("../config/cloudinaryConfig.js")
const multer = require("multer")
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    allowedFormats: ['jpeg', 'jpg', 'png','docx','pdf','xlsx','pptx','doc','ppt','xls'],
    params: {
        folder: 'images',
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // Giới hạn kích thước 5MB
});

// Middleware để xử lý lỗi khi file vượt quá kích thước
const handleFileSizeError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // Kiểm tra nếu lỗi là do file quá lớn
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({ error: "File size exceeds the limit of 5MB" });
        }
    }
    // Chuyển lỗi cho middleware error tiếp theo xử lý (nếu có)
    next(err);
};

module.exports = {
    upload, handleFileSizeError
};