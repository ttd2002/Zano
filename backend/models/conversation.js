const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  listAdmins: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  isGroupChat: {
    type: Boolean,
    default: false
  },
  name: {
    type: String,
    require: function () {
      return this.isGroupChat == true
    }
  },
  avatar: {
    type: String,
  },
  messages: [
    {
      senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      receiverIds: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      message: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        enum: ["text", "image", "video", "audio"], // or any other types you want to support
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
      deletedBy: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
  ],
  updatedAt: {            //cap nhat moi khi co thay doi, dung de sap xep thu tu tin nhan
    type: Date,
    default: Date.now,
  },
});

conversationSchema.pre("save", function(next) {
  this.updatedAt = new Date();
  next();
});

const Chat = mongoose.model("Conversation", conversationSchema);

module.exports = Chat;
