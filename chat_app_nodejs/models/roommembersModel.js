const mongoose = require("mongoose");


// RoomMembers Schema
const RoomMembersSchema = new mongoose.Schema(
  {
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Rooms" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    nickname: { type: String, required: true, maxlength: 255, index: 'text'},
    role: { type: String, enum: ["MANAGER", "MEMBER"], default: "MEMBER" },
    block: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  }
);

// RoomMembers Model
const RoomMembersModel = mongoose.model("RoomMembers", RoomMembersSchema);

module.exports = RoomMembersModel;
