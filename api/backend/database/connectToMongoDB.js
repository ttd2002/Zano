const mongoose = require("mongoose");

const connectToMongoDB = async () => {
    await mongoose
        .connect("mongodb+srv://thanhdai912:dai110912@cluster0.4qjeg0k.mongodb.net/")
        .then(() => {
            console.log("Connected to MongoDB");
        })
        .catch((error) => {
            console.log("Error connecting to MongoDB", error.message);
        });
}

module.exports = {
    connectToMongoDB
};