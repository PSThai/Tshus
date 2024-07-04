const mongoose = require("mongoose");
const MessagesModel = require("./messagesModel");

// Conversations Schema
const ConversationsSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["ROOMS", "CHATS"],
      require: true,
    },
    pins: { type: [MessagesModel.schema], default: [] },
    last_message: { type: String, default: "Không có tin nhắn nào" },
    last_send: { type: Date, default: Date.now() },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
);

// Conversations Model
const Conversation = mongoose.model("Conversations", ConversationsSchema);

module.exports = Conversation;
