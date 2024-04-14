const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    // required: true,
  },
  gender: {
    type: String,
  },
  birthDate: {
    type: String,
    // type: Date,
  },
  avatar: {
    type: String,
  },
  // verificationToken: String,
  finded: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  messaged: [                       //để tạm thời, sau sẽ chuyển sang conversation
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  listFriend: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  friendRequestsSent: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  friendRequestsReceived: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
});


const User = mongoose.model("User", userSchema);

module.exports = User