const mongoose = require("mongoose");
const ChaterSchema = require("../schemas/chaterSchema");


// Friend Schema
const FriendsSchema = new mongoose.Schema(
  {
    inviter: { type: ChaterSchema },
    friend: { type: ChaterSchema },
    state: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "NOT_YET"],
      default: "PENDING",
    },
    block: { type: Boolean, default: false },
    friend_at: { type: Date, default: Date.now },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  }
);

// Friend Model
const FriendModel = mongoose.model("Friends", FriendsSchema);

module.exports = FriendModel;
