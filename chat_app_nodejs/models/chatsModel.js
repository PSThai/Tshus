const mongoose = require("mongoose");
const ChaterSchema = require("../schemas/chaterSchema");

// Chats Schema
const ChatsSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversations",
    },
    inviter: { type: ChaterSchema },
    friend: { type: ChaterSchema },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  }
);

// Chats Model
const ChatsModel = mongoose.model("Chats", ChatsSchema);

module.exports = ChatsModel;
