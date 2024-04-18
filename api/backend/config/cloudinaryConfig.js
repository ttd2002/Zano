const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: 'dbtgez7ua',
    api_key: '966132724833854',
    api_secret: 'mYzMyo-X7E8IIF9bXoaDAh1c6h0'
});

// const uploadPreset = 'DemoZanoo';

module.exports = { cloudinary };


