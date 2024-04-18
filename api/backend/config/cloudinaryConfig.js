const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: 'dbtgez7ua',
    api_key: '966132724833854',
    api_secret: 'mYzMyo-X7E8IIF9bXoaDAh1c6h0'
});

// const uploadPreset = 'DemoZanoo';
const uploadVideo = async (videoFilePath) => {
    try {
        // Sử dụng cloudinary để tải lên video
        const result = await cloudinary.uploader.upload(videoFilePath, {
            resource_type: "video",
            upload_preset: "DemoZanoo" // Đổi thành upload_preset của bạn
        });

        // Trả về URL của video đã tải lên
        return result.secure_url;
    } catch (error) {
        console.error("Error uploading video to Cloudinary:", error);
        throw error;
    }
};
module.exports = { uploadVideo };
module.exports = { cloudinary };


